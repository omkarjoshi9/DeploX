//Access Key - bab6422746fd4d56a9161dc1e57d113c
//Secret - 403c892208d58ccf584872fa47fde059ee0abf397e3ff5c7a431cfedbb79ca8f
//endpoint- https://726d35c45a73baff9771fb499d309432.r2.cloudflarestorage.com

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./upload";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();


const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy",async (req,res)=>{
    const repoUrl = req.body.repoUrl; //github url that the user will hit
    console.log(repoUrl);
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname,`output/${id}`));
    
    const files = getAllFiles(path.join(__dirname,`output/${id}`));

    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length+1),file);
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))
    publisher.lPush("build-queue", id); 
    publisher.hSet("status", id, "uploaded");

    res.json({
        id: id
    })

})

app.listen(3000);