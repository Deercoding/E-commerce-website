import path from "path";
import fs from "fs";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const REGION = "ap-southeast-1";
const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEY,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
  },
});

// upload object
export async function uploadObject(bucketName, imageFiles, REGION, toFolder) {
  const client = new S3Client({ region: REGION });
  const params = imageFiles.map((image) => {
    return {
      Bucket: bucketName,
      Key: image.filename,
      Body: fs.createReadStream(
        path.resolve(toFolder, "..//public//images//", image.filename) + ""
      ),
    };
  });
  try {
    let data = await Promise.all(
      params.map((uploadParam) =>
        client.send(new PutObjectCommand(uploadParam))
      )
    );
    console.log("Image uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Error uploading image", err);
  }
}

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const presignedUrl = async (REGION, BUCKET, KEY) => {
  try {
    const clientUrl = await createPresignedUrlWithClient({
      region: REGION,
      bucket: BUCKET,
      key: KEY,
    });
    return clientUrl;
  } catch (err) {
    console.error(err);
  }
};
