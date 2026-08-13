import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";
import { APIError } from "@/lib/errors";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY,
    secretAccessKey: env.R2_SECRET_KEY,
  },
});

/**
 * Generates a short-lived presigned URL allowing the client to upload a file directly to Cloudflare R2.
 */
export const getUploadPresignedUrl = async (key: string, contentType: string) => {
  try {
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });
    // URL expires in 15 minutes (900 seconds)
    return await getSignedUrl(S3, command, { expiresIn: 900 });
  } catch (error) {
    Sentry.captureException(error);
    console.error("[StorageService Error]", error);
    throw new APIError("Failed to generate upload URL", 500);
  }
};

/**
 * Deletes a file from Cloudflare R2 securely from the server.
 */
export const deleteFile = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
    });
    await S3.send(command);
  } catch (error) {
    Sentry.captureException(error);
    console.error("[StorageService Error]", error);
    throw new APIError("Failed to delete file", 500);
  }
};
