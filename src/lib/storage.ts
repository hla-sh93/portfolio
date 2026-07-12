// ---------------------------------------------------------------------------
// R2 / S3-compatible pre-signed upload helpers
//
// The implementation uses the AWS SDK v3 S3 client, which is compatible with
// Cloudflare R2 by setting a custom endpoint.
//
// Required environment variables:
//   R2_ACCOUNT_ID          — Cloudflare account ID (used to build endpoint)
//   R2_ACCESS_KEY_ID       — R2 access key ID
//   R2_SECRET_ACCESS_KEY   — R2 secret access key
//   R2_BUCKET_NAME         — Target bucket name
//   NEXT_PUBLIC_R2_PUBLIC_URL — Public base URL for the bucket (CDN / r2.dev)
// ---------------------------------------------------------------------------

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ---------------------------------------------------------------------------
// Size constants
// ---------------------------------------------------------------------------

/** Maximum allowed image upload size: 10 MB. */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

/** Maximum allowed video upload size: 50 MB. */
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

// ---------------------------------------------------------------------------
// Allowed file type whitelists
// ---------------------------------------------------------------------------

/** MIME types accepted for image uploads. */
export const ALLOWED_IMAGE_TYPES: ReadonlyArray<string> = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

/** MIME types accepted for video uploads. */
export const ALLOWED_VIDEO_TYPES: ReadonlyArray<string> = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo", // .avi
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FileCategory = "image" | "video";

export interface ValidateFileTypeResult {
  valid: boolean;
  category: FileCategory | null;
  error?: string;
}

export interface SignedUploadUrlResult {
  /** The pre-signed PUT URL the client should upload to. */
  uploadUrl: string;
  /** The public URL the asset will be accessible at after upload. */
  publicUrl: string;
  /** The full object key used in the bucket. */
  key: string;
}

// ---------------------------------------------------------------------------
// S3 / R2 client (lazy singleton)
// ---------------------------------------------------------------------------

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing one or more R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY",
    );
  }

  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3Client;
}

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing R2_BUCKET_NAME environment variable.");
  }
  return bucket;
}

function getPublicBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_R2_PUBLIC_URL environment variable.");
  }
  return url;
}

// ---------------------------------------------------------------------------
// File type validation
// ---------------------------------------------------------------------------

/**
 * Validates that a MIME type is in the allowed whitelist.
 *
 * Checks both image and video categories. Returns the detected category
 * and an error message if the type is not allowed or the file is too large.
 *
 * @param contentType - The MIME type string (e.g. "image/webp").
 * @param size        - File size in bytes. Used to enforce per-category limits.
 * @returns A {@link ValidateFileTypeResult} object.
 */
export function validateFileType(
  contentType: string,
  size?: number,
): ValidateFileTypeResult {
  const normalized = contentType.toLowerCase().trim();

  if (ALLOWED_IMAGE_TYPES.includes(normalized)) {
    if (size !== undefined && size > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        category: "image",
        error: `Image exceeds the maximum allowed size of ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`,
      };
    }
    return { valid: true, category: "image" };
  }

  if (ALLOWED_VIDEO_TYPES.includes(normalized)) {
    if (size !== undefined && size > MAX_VIDEO_SIZE) {
      return {
        valid: false,
        category: "video",
        error: `Video exceeds the maximum allowed size of ${MAX_VIDEO_SIZE / 1024 / 1024} MB.`,
      };
    }
    return { valid: true, category: "video" };
  }

  return {
    valid: false,
    category: null,
    error: `File type "${contentType}" is not allowed. Accepted image types: ${ALLOWED_IMAGE_TYPES.join(", ")}. Accepted video types: ${ALLOWED_VIDEO_TYPES.join(", ")}.`,
  };
}

// ---------------------------------------------------------------------------
// Object key builder
// ---------------------------------------------------------------------------

/**
 * Generates a deterministic, safe object key for the R2 bucket.
 *
 * Format: `uploads/<category>/<YYYY>/<MM>/<timestamp>-<sanitisedFilename>`
 *
 * @param filename    - Original file name supplied by the client.
 * @param category    - "image" or "video".
 * @returns The full object key string.
 */
function buildObjectKey(filename: string, category: FileCategory): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const timestamp = now.getTime();

  // Sanitise the filename: keep alphanumerics, dots, and hyphens.
  const sanitised = filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 100); // cap length

  return `uploads/${category}/${year}/${month}/${timestamp}-${sanitised}`;
}

// ---------------------------------------------------------------------------
// Pre-signed URL generator
// ---------------------------------------------------------------------------

/**
 * Generates a pre-signed S3/R2 PUT URL that allows the browser to upload a
 * file directly to the bucket without routing it through the Next.js server.
 *
 * Workflow:
 * 1. Call this function from a server action or API route.
 * 2. Return `uploadUrl` and `publicUrl` to the client.
 * 3. The client performs `PUT <file> → uploadUrl` with the correct
 *    `Content-Type` header.
 * 4. The asset is then available at `publicUrl`.
 *
 * @param filename    - Original filename from the client (will be sanitised).
 * @param contentType - MIME type of the file (e.g. "image/webp").
 * @param size        - File size in bytes. Used for validation before signing.
 * @param expiresIn   - URL expiry in seconds (default: 300 = 5 minutes).
 * @returns A {@link SignedUploadUrlResult} with the upload and public URLs.
 * @throws  If the file type / size is invalid or environment variables are missing.
 */
export async function getSignedUploadUrl(
  filename: string,
  contentType: string,
  size: number,
  expiresIn = 300,
): Promise<SignedUploadUrlResult> {
  // 1. Validate file type and size.
  const validation = validateFileType(contentType, size);
  if (!validation.valid || !validation.category) {
    throw new Error(validation.error ?? "Invalid file type.");
  }

  // 2. Build object key.
  const key = buildObjectKey(filename, validation.category);

  // 3. Create the PutObject command.
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
    ContentLength: size,
    // Cache uploaded assets for 1 year at the CDN layer.
    CacheControl: "public, max-age=31536000, immutable",
  });

  // 4. Sign the command.
  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn,
  });

  // 5. Compute the public URL.
  const publicUrl = `${getPublicBaseUrl()}/${key}`;

  return { uploadUrl, publicUrl, key };
}

// ---------------------------------------------------------------------------
// Helper — build a public URL for an existing key
// ---------------------------------------------------------------------------

/**
 * Returns the public CDN URL for an already-uploaded object.
 *
 * @param key - The bucket object key (as returned by {@link getSignedUploadUrl}).
 * @returns Fully-qualified public URL string.
 */
export function getPublicUrl(key: string): string {
  return `${getPublicBaseUrl()}/${key}`;
}
