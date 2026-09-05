import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '0e0d0994c08a036a7afa09f4cf7fd0f2';
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'base-engineering-assets';
const publicUrl = process.env.R2_PUBLIC_URL || 'https://pub-2e1ed854dcea4a63bcbbca9b5f37a947.r2.dev';

// Returns true if R2 is configured (either via S3 credentials, Cloudflare API token, or native binding)
export function isR2Configured() {
  if (typeof process !== 'undefined' && process.env?.BASE_ENG_BUCKET) return true;
  if (Boolean(accessKeyId && secretAccessKey && accountId)) return true;
  if (Boolean(apiToken && accountId)) return true;
  return false;
}

let s3Client = null;

function getS3Client() {
  if (!s3Client && accessKeyId && secretAccessKey && accountId) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3Client;
}

/**
 * Uploads a file buffer directly to Cloudflare R2.
 * @param {Buffer|ArrayBuffer} buffer - File buffer
 * @param {string} fileName - Original filename
 * @param {string} mimeType - File MIME type
 * @returns {Promise<{ url: string, objectKey: string }>}
 */
export async function uploadFile(buffer, fileName, mimeType = 'image/jpeg') {
  const dotIndex = (fileName || '').lastIndexOf('.');
  const extension = dotIndex !== -1 ? fileName.slice(dotIndex) : '.jpg';
  const rawBase = dotIndex !== -1 ? fileName.slice(0, dotIndex) : (fileName || 'image');
  const timestamp = Date.now();
  const sanitizedBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_');
  const objectKey = `products/${timestamp}-${sanitizedBase}${extension}`;

  // 1. Native Cloudflare Pages / Worker R2 bucket binding
  if (typeof process !== 'undefined' && process.env?.BASE_ENG_BUCKET?.put) {
    await process.env.BASE_ENG_BUCKET.put(objectKey, buffer, {
      httpMetadata: { contentType: mimeType },
    });
    const fileUrl = `${publicUrl.replace(/\/$/, '')}/${objectKey}`;
    return { url: fileUrl, objectKey };
  }

  // 2. S3 Client via R2 access key / secret if configured
  if (accessKeyId && secretAccessKey) {
    const client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: mimeType,
    });
    await client.send(command);
    const fileUrl = `${publicUrl.replace(/\/$/, '')}/${objectKey}`;
    return { url: fileUrl, objectKey };
  }

  // 3. Cloudflare R2 REST API via CLOUDFLARE_API_TOKEN
  if (apiToken && accountId) {
    const r2Endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${objectKey}`;
    const res = await fetch(r2Endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': mimeType,
      },
      body: buffer,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to upload to Cloudflare R2 (${res.status}): ${errText}`);
    }

    const fileUrl = `${publicUrl.replace(/\/$/, '')}/${objectKey}`;
    return { url: fileUrl, objectKey };
  }

  throw new Error('Cloudflare R2 is not configured. Missing CLOUDFLARE_API_TOKEN or R2 credentials.');
}

/**
 * Deletes a file from Cloudflare R2.
 * @param {string} objectKey
 */
export async function deleteFile(objectKey) {
  if (!objectKey) return;

  // Clean local prefix if legacy
  const key = objectKey.startsWith('local:') ? objectKey.replace('local:', 'products/') : objectKey;

  // 1. Native binding
  if (typeof process !== 'undefined' && process.env?.BASE_ENG_BUCKET?.delete) {
    await process.env.BASE_ENG_BUCKET.delete(key);
    return;
  }

  // 2. S3 Client
  if (accessKeyId && secretAccessKey) {
    const client = getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await client.send(command);
    return;
  }

  // 3. Cloudflare R2 REST API
  if (apiToken && accountId) {
    const r2Endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${key}`;
    await fetch(r2Endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });
  }
}
