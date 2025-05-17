import express from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://726d35c45a73baff9771fb499d309432.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "bab6422746fd4d56a9161dc1e57d113c",
    secretAccessKey: "403c892208d58ccf584872fa47fde059ee0abf397e3ff5c7a431cfedbb79ca8f"
  }
});

const app = express();

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path.startsWith("/") ? req.path.substring(1) : req.path;

  try {
    const data = await s3Client.send(new GetObjectCommand({
      Bucket: "deplox",
      Key: `dist/${id}/${filePath}`
    }));

    const type = filePath.endsWith(".html") ? "text/html" :
                 filePath.endsWith(".css") ? "text/css" : 
                 filePath.endsWith(".js") ? "application/javascript" : 
                 "application/octet-stream";

    res.set("Content-Type", type);

    // TypeScript-safe stream handling
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
