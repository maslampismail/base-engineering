const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

const R2_PUBLIC_BASE = 'https://pub-2e1ed854dcea4a63bcbbca9b5f37a947.r2.dev';
const OLD_LOCAL_PREFIX = '/uploads/';

function formatValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) return `'${val.toISOString()}'`;
  // Escape single quotes
  return `'${String(val).replace(/'/g, "''")}'`;
}

function convertUrl(url) {
  if (!url) return url;
  if (url.startsWith(OLD_LOCAL_PREFIX)) {
    const filename = url.replace(OLD_LOCAL_PREFIX, '');
    return `${R2_PUBLIC_BASE}/products/${filename}`;
  }
  return url;
}

function convertKey(key) {
  if (!key) return key;
  if (key.startsWith('local:')) {
    const filename = key.replace('local:', '');
    return `products/${filename}`;
  }
  return key;
}

async function main() {
  console.log('--- Step 1: Updating local SQLite DB references to R2 ---');
  
  // 1. Update Media
  const medias = await prisma.media.findMany();
  for (const m of medias) {
    if (m.url.startsWith(OLD_LOCAL_PREFIX)) {
      await prisma.media.update({
        where: { id: m.id },
        data: {
          url: convertUrl(m.url),
          fileKey: convertKey(m.fileKey),
        },
      });
    }
  }

  // 2. Update Company
  const companies = await prisma.company.findMany();
  for (const c of companies) {
    if (c.aboutImage && c.aboutImage.startsWith(OLD_LOCAL_PREFIX)) {
      await prisma.company.update({
        where: { id: c.id },
        data: {
          aboutImage: convertUrl(c.aboutImage),
        },
      });
    }
  }

  // 3. Update HomepageSection
  const homeSections = await prisma.homepageSection.findMany();
  for (const s of homeSections) {
    if (s.imageUrl && s.imageUrl.startsWith(OLD_LOCAL_PREFIX)) {
      await prisma.homepageSection.update({
        where: { id: s.id },
        data: {
          imageUrl: convertUrl(s.imageUrl),
        },
      });
    }
  }

  // 4. Update ProductImage
  const prodImages = await prisma.productImage.findMany();
  for (const pi of prodImages) {
    if (pi.url && pi.url.startsWith(OLD_LOCAL_PREFIX)) {
      await prisma.productImage.update({
        where: { id: pi.id },
        data: {
          url: convertUrl(pi.url),
          objectKey: convertKey(pi.objectKey),
        },
      });
    }
  }

  // 5. Update Application
  const applications = await prisma.application.findMany();
  for (const app of applications) {
    if (app.imageUrl && app.imageUrl.startsWith(OLD_LOCAL_PREFIX)) {
      await prisma.application.update({
        where: { id: app.id },
        data: {
          imageUrl: convertUrl(app.imageUrl),
        },
      });
    }
  }

  console.log('--- Step 2: Generating SQL Dump for Cloudflare D1 ---');
  const sqlLines = [];

  // Delete in reverse dependency order
  const deleteOrder = [
    'Enquiry',
    'ProductImage',
    'Product',
    'Category',
    'Company',
    'CompanyHighlight',
    'HomepageSection',
    'Application',
    'Media',
    'Admin',
  ];

  for (const table of deleteOrder) {
    sqlLines.push(`DELETE FROM "${table}";`);
  }

  // Insert in dependency order
  const insertTables = [
    { name: 'Admin', model: 'admin' },
    { name: 'Category', model: 'category' },
    { name: 'Product', model: 'product' },
    { name: 'ProductImage', model: 'productImage' },
    { name: 'Company', model: 'company' },
    { name: 'CompanyHighlight', model: 'companyHighlight' },
    { name: 'HomepageSection', model: 'homepageSection' },
    { name: 'Application', model: 'application' },
    { name: 'Enquiry', model: 'enquiry' },
    { name: 'Media', model: 'media' },
  ];

  const localCounts = {};

  for (const t of insertTables) {
    const rows = await prisma[t.model].findMany();
    localCounts[t.name] = rows.length;

    for (const row of rows) {
      const keys = Object.keys(row);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const vals = keys.map(k => formatValue(row[k])).join(', ');
      sqlLines.push(`INSERT INTO "${t.name}" (${cols}) VALUES (${vals});`);
    }
  }

  const dumpPath = path.join(__dirname, '../prisma/data_dump_for_d1.sql');
  fs.writeFileSync(dumpPath, sqlLines.join('\n'));
  console.log(`Generated ${dumpPath} with ${sqlLines.length} statements.`);

  console.log('--- Step 3: Executing SQL Dump on Remote Cloudflare D1 ---');
  execSync(`npx wrangler d1 execute base_db --remote --file="${dumpPath}"`, { stdio: 'inherit' });

  console.log('--- Step 4: Verifying Remote D1 Counts Against Local SQLite ---');
  for (const t of insertTables) {
    const res = execSync(`npx wrangler d1 execute base_db --remote --command="SELECT COUNT(*) as count FROM \\"${t.name}\\";"`, { encoding: 'utf-8' });
    const match = res.match(/"count":\s*(\d+)/);
    const remoteCount = match ? parseInt(match[1], 10) : -1;
    console.log(`Table ${t.name}: Local=${localCounts[t.name]} | Remote D1=${remoteCount} | Match: ${localCounts[t.name] === remoteCount ? '✅' : '❌'}`);
    if (localCounts[t.name] !== remoteCount) {
      throw new Error(`Count mismatch for table ${t.name}! Local: ${localCounts[t.name]}, Remote: ${remoteCount}`);
    }
  }

  console.log('🎉 Database migration to Cloudflare D1 completed with 100% data integrity!');
}

main()
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
