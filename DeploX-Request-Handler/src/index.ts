import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const app = express();

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path.startsWith("/") ? req.path.substring(1) : req.path;

  try {
    const data = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `dist/${id}/${filePath}`
    }));

    const type = filePath.endsWith(".html") ? "text/html" :
                 filePath.endsWith(".css") ? "text/css" :
                 filePath.endsWith(".js") ? "application/javascript" :
                 "application/octet-stream";

    res.set("Content-Type", type);

    const bodyStream = data.Body;
    if (bodyStream instanceof Readable) {
      bodyStream.pipe(res);
    } else {
      console.error("data.Body is not a Readable stream:", bodyStream);
      res.status(500).send("Internal server error");
    }
  } catch (err) {
    console.error(err);
    res.status(404).send("File not found");
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
