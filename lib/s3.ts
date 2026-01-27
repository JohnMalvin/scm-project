import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const REGION = process.env.AWS_REGION as string;
const BUCKET = process.env.AWS_S3_BUCKET_NAME as string;

export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Upload a file
export async function S3_uploadFile(key: string, data: Buffer | Uint8Array, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: data,
    ContentType: contentType,
  });
  await s3.send(command);
}

// Download a file (returns Buffer)
export async function S3_getFile(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const response = await s3.send(command);
  const stream = response.Body as Readable;
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// List files in bucket (optionally under a prefix)
export async function S3_listFiles(prefix = ""): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });
  const response = await s3.send(command);
  return response.Contents?.map(item => item.Key!) || [];
}

// Delete a file
export async function S3_deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3.send(command);
}

// Generate presigned URL (GET or PUT)
export async function S3_getSignedUrl(key: string, expiresIn = 3600, method: "get" | "put" = "get") {
  let command;
  if (method === "get") {
    command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
  } else {
    command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
  }
  return awsGetSignedUrl(s3, command, { expiresIn });
}
