import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'base-engineering-assets';
const publicUrl = process.env.R2_PUBLIC_URL;

// Returns true if R2 is configured with valid credentials
export function isR2Configured() {
  return Boolean(accountId && accessKeyId && secretAccessKey);
}

let s3Client = null;

function getS3Client() {
  if (!s3Client && isR2Configured()) {
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
 * Uploads a file buffer to Cloudflare R2 or local filesystem fallback.
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - Original filename
 * @param {string} mimeType - File MIME type
 * @returns {Promise<{ url: string, objectKey: string }>}
 */
export async function uploadFile(buffer, fileName, mimeType = 'image/jpeg') {
  const extension = path.extname(fileName) || '.jpg';
  const timestamp = Date.now();
  const sanitizedBase = path.basename(fileName, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
  const objectKey = `products/${timestamp}-${sanitizedBase}${extension}`;

  if (isR2Configured()) {
    const client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: mimeType,
    });

    await client.send(command);

    const fileUrl = publicUrl
      ? `${publicUrl.replace(/\/$/, '')}/${objectKey}`
      : `https://${bucketName}.r2.cloudflarestorage.com/${objectKey}`;

    return { url: fileUrl, objectKey };
  }

  // Local filesystem fallback for development when new R2 bucket/account is pending
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const localFilePath = path.join(uploadDir, `${timestamp}-${sanitizedBase}${extension}`);
  fs.writeFileSync(localFilePath, buffer);

  const localUrl = `/uploads/${timestamp}-${sanitizedBase}${extension}`;
  return { url: localUrl, objectKey: `local:${timestamp}-${sanitizedBase}${extension}` };
}

/**
 * Deletes a file from Cloudflare R2 or local storage.
 * @param {string} objectKey
 */
export async function deleteFile(objectKey) {
  if (!objectKey) return;

  if (objectKey.startsWith('local:')) {
    const fileName = objectKey.replace('local:', '');
    const localFilePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.warn('Failed to delete local upload file:', err.message);
      }
    }
    return;
  }

  if (isR2Configured()) {
    const client = getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    await client.send(command);
  }
}
