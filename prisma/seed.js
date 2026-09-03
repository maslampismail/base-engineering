const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Base Engineering database...');

  // 1. Admin Account
  const passwordHash = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@baseengineering.com' },
    update: {
      passwordHash,
      name: 'Engineering Admin',
    },
    create: {
      email: 'admin@baseengineering.com',
      passwordHash,
      name: 'Engineering Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin account ready:', admin.email);

  // 2. Company Information
  await prisma.company.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Base Engineering',
      tagline: 'Engineering Strength. Built to Perform.',
      aboutHeading: 'Built on Engineering. Driven by Reliability.',
      aboutDescription:
        'Base Engineering is an established industrial manufacturing and fabrication company specializing in high-load scaffolding components, precision shuttering systems, and robust structural construction support. Engineered to strict dimensional tolerances and safety compliance, our products deliver uncompromising structural integrity on construction and infrastructure project sites across the country.',
      aboutImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98765 43210',
      email: 'info@baseengineering.com',
      address: 'Plot No. 42, Heavy Industrial Estate, Engineering Corridor, India',
      website: 'https://baseengineering.com',
      socialLinks: JSON.stringify({
        linkedin: 'https://linkedin.com/company/base-engineering',
        youtube: 'https://youtube.com',
      }),
    },
  });
  console.log('Company information seeded.');

  // 3. Categories
  const categoriesData = [
    { name: 'Scaffolding', slug: 'scaffolding', description: 'Load-bearing access, shoring, and framework support products.', sortOrder: 1 },
    { name: 'Shuttering', slug: 'shuttering', description: 'Heavy-duty steel plates, formwork, and casting components.', sortOrder: 2 },
    { name: 'Support Systems', slug: 'support-systems', description: 'Telescopic props, spans, and vertical shoring assemblies.', sortOrder: 3 },
    { name: 'Accessories', slug: 'accessories', description: 'Couplers, clamps, tie rods, wing nuts, and rapid connectors.', sortOrder: 4 },
    { name: 'Fabricated Products', slug: 'fabricated-products', description: 'Custom engineered steel fabricated structures and assemblies.', sortOrder: 5 },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = record;
  }
  console.log('Categories seeded.');

  // 4. Products with Specifications and realistic industrial imagery
  const productsData = [
    {
      name: 'Scaffolding Jack',
      slug: 'scaffolding-jack',
      categoryId: categories['scaffolding'].id,
      shortDescription: 'Heavy-duty adjustable support component designed for stable scaffolding base load distribution.',
      description:
        'The Base Engineering Scaffolding Jack is manufactured from premium cold-drawn seamless steel pipe with precision-machined heavy Acme threads. It provides reliable vertical height adjustment and micro-leveling on uneven site terrain, ensuring standard scaffolding columns remain rigid and plumb under maximum load.',
      material: 'High Tensile Structural Grade Steel (IS 1161 / IS 1239)',
      specifications: JSON.stringify([
        { label: 'Base Plate Size', value: '150mm x 150mm x 6mm' },
        { label: 'Spindle Outer Diameter', value: '38mm / 34mm solid/hollow' },
        { label: 'Adjustment Length', value: '350mm to 650mm' },
        { label: 'Thread Type', value: 'Rolled Acme Trapezoidal Thread' },
        { label: 'Nut Type', value: 'Cast Ductile Iron Nut with twin handles' },
        { label: 'Surface Finish', value: 'Hot Dip Galvanized / Electroplated / Paint' },
      ]),
      applications: 'Base leveling for modular cuplock scaffolding, access towers, heavy falsework shoring systems.',
      featured: true,
      sortOrder: 1,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          alt: 'Scaffolding Jack Base Component',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'Span',
      slug: 'span',
      categoryId: categories['support-systems'].id,
      shortDescription: 'Strong and dependable telescopic scaffolding span designed for heavy slab formwork support.',
      description:
        'Engineered for maximum bending resistance without sagging, Base Engineering Telescopic Spans (Acrow Spans) feature an outer box channel and inner lattice girder. Designed for slab casting spans from 2.5 meters to 4.5 meters, they eliminate intermediary floor props, clearing ground space for equipment movement.',
      material: 'Pressed Steel Channels & High Strength Lattice Rods (IS 2062)',
      specifications: JSON.stringify([
        { label: 'Span Range', value: '2.5m – 4.2m (Standard) / 3.0m – 4.8m (Heavy)' },
        { label: 'Outer Body', value: 'Heavy pressed steel channel with bearing angles' },
        { label: 'Inner Body', value: 'Electrically welded steel truss lattice framework' },
        { label: 'Camber', value: 'Engineered upward camber to counter live load deflection' },
        { label: 'Safety Factor', value: '2.5:1 against maximum bending moment' },
      ]),
      applications: 'Horizontal soffit support for slab casting, bridge deck formwork, column-free floor casting.',
      featured: true,
      sortOrder: 2,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
          alt: 'Telescopic Steel Construction Span',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'Shutter',
      slug: 'shutter',
      categoryId: categories['shuttering'].id,
      shortDescription: 'Durable pressed-steel shuttering plates and formwork panels for clean concrete casting.',
      description:
        'Base Engineering Shuttering Plates are pressed from prime 12-gauge / 14-gauge mild steel sheet with reinforced angle iron borders and stiffeners. Engineered to withstand intense hydrostatic wet concrete pressure and high-frequency poker vibration without buckling, delivering smooth concrete finish.',
      material: 'Prime Structural Steel Sheet (12G / 14G) with Rolled Angle Frame',
      specifications: JSON.stringify([
        { label: 'Standard Dimensions', value: '900mm x 600mm / 1200mm x 600mm' },
        { label: 'Angle Border', value: '25mm x 25mm x 3mm / 35mm x 35mm x 4mm' },
        { label: 'Stiffeners', value: 'Cross-braced pressed steel center ribs' },
        { label: 'Keyhole Slots', value: 'Slotted edges for rapid wedge pin connection' },
        { label: 'Finish', value: 'Anti-corrosion primer coating' },
      ]),
      applications: 'Slab shuttering, retaining walls, box culverts, bridge piers, and columns.',
      featured: true,
      sortOrder: 3,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
          alt: 'Steel Shuttering Plates and Formwork',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'Adjustable Jack',
      slug: 'adjustable-jack',
      categoryId: categories['scaffolding'].id,
      shortDescription: 'Precision threaded leveling jack for fine elevation adjustment of scaffolding towers.',
      description:
        'Designed for millimeter-precise leveling of scaffolding assemblies and falsework systems. The precision thread ensures effortless rotation even when under heavy live load, while the ductile cast nut provides high impact resistance on harsh job sites.',
      material: 'Heavy-gauge Seamless Steel Tube & Ductile Cast Iron',
      specifications: JSON.stringify([
        { label: 'Thread Pitch', value: '6.35mm pitch self-cleaning Acme thread' },
        { label: 'Length Options', value: '450mm, 600mm, 750mm' },
        { label: 'Handle Style', value: 'Ergonomic dual-arm swivel handle' },
        { label: 'Load Capacity', value: 'Safe working load 50 kN' },
      ]),
      applications: 'Height alignment of shoring towers, modular formwork tables, mobile towers.',
      featured: false,
      sortOrder: 4,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          alt: 'Adjustable Scaffolding Screw Jack',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'U Jack',
      slug: 'u-jack',
      categoryId: categories['scaffolding'].id,
      shortDescription: 'Heavy-duty U-head jack designed for holding timber and steel primary floor runners.',
      description:
        'The U Jack (U-Head Stirrup Jack) fits into the top of scaffolding standards and vertical props. The formed U-channel securely locks secondary steel girders, H20 timber beams, and aluminum beams in place, preventing lateral displacement during concrete pouring.',
      material: 'Fabricated Structural Steel with Heavy U-Cradle',
      specifications: JSON.stringify([
        { label: 'U-Head Dimensions', value: '150mm x 150mm x 100mm depth' },
        { label: 'Plate Thickness', value: '6mm / 8mm heavy plate' },
        { label: 'Stem Diameter', value: '38mm threaded screw rod' },
        { label: 'Adjustment Range', value: '350mm to 600mm' },
        { label: 'Corrosion Protection', value: 'Electro-galvanized or painted' },
      ]),
      applications: 'Top beam support for slab shuttering, H20 timber beam clamping, bridge girder shoring.',
      featured: true,
      sortOrder: 5,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
          alt: 'Heavy Duty U-Head Jack Stirrup',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'Base Jack',
      slug: 'base-jack',
      categoryId: categories['scaffolding'].id,
      shortDescription: 'Solid and hollow threaded base jack providing rigid foundation stability for scaffolding.',
      description:
        'Base Jacks form the vital ground interface of any scaffolding setup. Base Engineering base jacks feature an oversized 150x150mm forged base plate welded with continuous robotic fillet welding to withstand eccentric ground forces and heavy structural loads.',
      material: 'Solid Steel Bar / Heavy Wall Steel Tube (Grade S275 / S355)',
      specifications: JSON.stringify([
        { label: 'Base Plate', value: '150mm x 150mm x 6mm with corner anchor holes' },
        { label: 'Stem Type', value: 'Solid 34mm or Hollow 38mm cold-rolled' },
        { label: 'Thread Height', value: '500mm / 650mm / 750mm' },
        { label: 'Weld Standard', value: 'Continuous MIG welding per AWS D1.1' },
      ]),
      applications: 'Foundation leveling for cuplock, ringlock, frame scaffolding, and heavy shoring.',
      featured: false,
      sortOrder: 6,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          alt: 'Solid Base Jack Support Component',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'Props',
      slug: 'props',
      categoryId: categories['support-systems'].id,
      shortDescription: 'Heavy-duty telescopic scaffolding props for vertical falsework and slab propping.',
      description:
        'Base Engineering Telescopic Steel Props (Acrow Props) provide rapid, reliable, and reusable vertical shoring for slab formwork, beams, and temporary wall bracing. Featuring forged high-tensile steel collar nuts, micro-leveling threads, and captive high-shear locking pins.',
      material: 'Cold-drawn High Strength ERW Steel Pipes (IS 1239 / IS 1161)',
      specifications: JSON.stringify([
        { label: 'Outer Tube Diameter', value: '60.3mm OD x 2.9mm wall thickness' },
        { label: 'Inner Tube Diameter', value: '48.3mm OD x 3.2mm wall thickness' },
        { label: 'Available Sizes', value: 'Size 0 (1.0m-1.8m), Size 1 (1.8m-3.2m), Size 2 (2.0m-3.6m), Size 3 (2.6m-4.0m)' },
        { label: 'Locking Pin', value: '14mm high-shear alloy steel pin with retaining chain' },
        { label: 'Working Load', value: 'Tested up to 35 kN per BS EN 1065' },
      ]),
      applications: 'Temporary slab propping, lintel support, wall stabilization, back-propping under cured slabs.',
      featured: true,
      sortOrder: 7,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80',
          alt: 'Telescopic Steel Acrow Props Shoring System',
          isPrimary: true,
        },
      ],
    },
    {
      name: 'Scaffolding Accessories',
      slug: 'scaffolding-accessories',
      categoryId: categories['accessories'].id,
      shortDescription: 'Couplers, drop-forged clamps, tie rods, wing nuts, and rapid shoring connectors.',
      description:
        'A comprehensive assortment of high-integrity scaffolding hardware and shuttering accessories. Including BS 1139 drop-forged swivel couplers, right-angle fixed clamps, high-tensile 16mm tie rods, ductile iron cast wing nuts, and water stoppers for watertight basement wall casting.',
      material: 'Drop Forged Carbon Steel, Ductile Cast Iron & High Tensile Alloy',
      specifications: JSON.stringify([
        { label: 'Clamp Standards', value: 'Conforms to BS 1139 / EN 74 Class A & B' },
        { label: 'Tie Rods', value: '16mm cold-rolled 100 kN tensile strength' },
        { label: 'Wing Nut Diameter', value: '100mm / 110mm plate with twin ears' },
        { label: 'Coupler Bolt', value: 'Grade 8.8 high-tensile T-bolt with 21mm nut' },
        { label: 'Plating', value: 'Electro-galvanized zinc for rust protection' },
      ]),
      applications: 'Tube and clamp scaffolding, formwork tie rod tie-backs, retaining wall tensioning.',
      featured: false,
      sortOrder: 8,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
          alt: 'Scaffolding Clamps and Construction Hardware Accessories',
          isPrimary: true,
        },
      ],
    },
  ];

  for (const item of productsData) {
    const { images, ...productData } = item;
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: productData,
      create: productData,
    });

    // Seed images
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i].url,
          alt: images[i].alt,
          isPrimary: images[i].isPrimary ?? i === 0,
          sortOrder: i,
        },
      });
    }
  }
  console.log('Products & images seeded.');

  // 5. Company Highlights (Editable from admin)
  const highlightsData = [
    { title: 'Years Experience', value: '10+', description: 'Proven manufacturing track record and engineering excellence.', icon: 'Clock', sortOrder: 1 },
    { title: 'Products', value: '25+', description: 'Standard and custom-engineered scaffolding solutions.', icon: 'Layers', sortOrder: 2 },
    { title: 'Projects', value: '100+', description: 'Supplied to premier infrastructure and industrial works.', icon: 'Building2', sortOrder: 3 },
    { title: 'Customers', value: '500+', description: 'Trusted by general contractors, builders, and engineers.', icon: 'Users', sortOrder: 4 },
  ];

  await prisma.companyHighlight.deleteMany({});
  for (const hl of highlightsData) {
    await prisma.companyHighlight.create({ data: hl });
  }
  console.log('Company highlights seeded.');

  // 6. Applications (Where products are used)
  const applicationsData = [
    {
      title: 'Building Construction',
      description: 'High-rise residential and multi-story commercial concrete structural frameworks and shear walls.',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      title: 'Commercial Projects',
      description: 'Expansive commercial complexes, shopping malls, IT parks, and transit hubs requiring column-free falsework.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      title: 'Infrastructure',
      description: 'Elevated metro corridors, highway flyovers, rail bridges, and massive concrete box culvert installations.',
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      title: 'Industrial Projects',
      description: 'Heavy manufacturing plants, thermal power stations, petrochemical refineries, and silo foundations.',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
    {
      title: 'Formwork & Shuttering',
      description: 'Engineered steel shuttering assemblies for rapid monolithic concrete pouring with flawless surface finishes.',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
    },
    {
      title: 'Scaffolding Systems',
      description: 'High-safety modular access scaffolding, cuplock towers, and heavy perimeter shoring installations.',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
    },
  ];

  await prisma.application.deleteMany({});
  for (const app of applicationsData) {
    await prisma.application.create({ data: app });
  }
  console.log('Applications seeded.');

  // 7. Homepage Section Content
  const heroSection = {
    sectionKey: 'hero',
    heading: 'Reliable Engineering Solutions for Modern Construction',
    subheading: 'ENGINEERED FOR CONSTRUCTION',
    description: 'Base Engineering delivers dependable scaffolding and construction support products designed for strength, durability and practical performance.',
    primaryCtaText: 'View Products',
    primaryCtaLink: '#products',
    secondaryCtaText: 'Get Enquiry',
    secondaryCtaLink: '#contact',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
    active: true,
  };

  await prisma.homepageSection.upsert({
    where: { sectionKey: 'hero' },
    update: heroSection,
    create: heroSection,
  });
  console.log('Homepage section seeded.');

  // 8. Initial Sample Enquiry
  const sampleProduct = await prisma.product.findFirst({ where: { slug: 'scaffolding-jack' } });
  await prisma.enquiry.create({
    data: {
      name: 'Rajesh Sharma',
      company: 'Apex Infra Projects Ltd.',
      phone: '+91 98234 56789',
      email: 'procurement@apexinfra.com',
      productId: sampleProduct ? sampleProduct.id : null,
      message: 'Looking for 400 units of heavy-duty Scaffolding Base Jacks (38mm OD, 650mm adjustment) for an upcoming metro viaduct project. Please share quotation and delivery timeline.',
      status: 'NEW',
    },
  });
  console.log('Sample enquiry seeded.');

  console.log('All Base Engineering initial data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
