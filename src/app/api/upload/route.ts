import { auth } from "@/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate (only admins can upload)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or content type" }, { status: 400 });
    }

    // 2. Generate a unique key
    const uniqueKey = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 3. Create Presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: uniqueKey,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueKey}`;

    return NextResponse.json({ signedUrl, publicUrl, key: uniqueKey });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
