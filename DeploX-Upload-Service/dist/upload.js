"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const s3Client = new client_s3_1.S3Client({
    region: "auto",
    endpoint: "https://726d35c45a73baff9771fb499d309432.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: "bab6422746fd4d56a9161dc1e57d113c",
        secretAccessKey: "403c892208d58ccf584872fa47fde059ee0abf397e3ff5c7a431cfedbb79ca8f"
    }
});
// fileName => output/12829/src/App.jsx
// localFilePath => /Users/"Omkar Joshi"/DeploX/Deplox-Upload-Service/dist/output/12829/src/App.jsx
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const uploadParams = {
        Bucket: "deplox",
        Key: fileName,
        Body: fileContent
    };
    try {
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        const response = yield s3Client.send(command);
        console.log("Upload successful", response);
    }
    catch (err) {
        console.error("Upload failed", err);
    }
});
exports.uploadFile = uploadFile;
