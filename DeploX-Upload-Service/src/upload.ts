import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3Client = new S3Client({
  region: "auto", 
  endpoint: "https://726d35c45a73baff9771fb499d309432.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "bab6422746fd4d56a9161dc1e57d113c",
    secretAccessKey: "403c892208d58ccf584872fa47fde059ee0abf397e3ff5c7a431cfedbb79ca8f"
  }
});

// fileName => output/12829/src/App.jsx
// localFilePath => /Users/"Omkar Joshi"/DeploX/Deplox-Upload-Service/dist/output/12829/src/App.jsx

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);

  const uploadParams = {
    Bucket: "deplox",
    Key: fileName,
    Body: fileContent
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    console.log("Upload successful", response);
  } catch (err) {
    console.error("Upload failed", err);
  }
};
