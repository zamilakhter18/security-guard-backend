import { Global, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
dotenv.config();
import { Readable } from "stream";
import { Response } from "express";

const region = process.env.REGION;
const s3 = new S3Client({
  region: region,
  endpoint: `https://s3.${region}.amazonaws.com`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});
@Global()
@Injectable()
export class UploadService {
  // Logger to log messages
  private logger = new Logger("UploadService - Helper");

  constructor() {}
  async uploadFile(file: any, path: string, fileName?: string, mimeType: string = "image/jpeg"): Promise<string> {
    // save the file to the local disk if the FILESYSTEM_DISK is set to local else save to the cloud
    const enbledDisk = process.env.FILESYSTEM_DISK;
    this.logger.log("Filesystem disk: " + enbledDisk);
    // check file is present
    if (!file) {
      this.logger.error("No file found", "UploadService");
      return "";
    }
    if (enbledDisk === "local") {
      // save the file to the local disk
      return this.uploadToLocalDisk(file, path, fileName);
    } else {
      // save the file to the cloud
      // return this.uploadToCloud(file, path, fileName, mineType);
    }
  }

  async uploadToLocalDisk(file: any, uploadPath: string = "uploads", fileName?: string): Promise<string> {
    // save the file to the local disk
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    // give permission to the file
    fs.chmodSync(uploadPath, 0o777);
    this.logger.log("Uploading to local disk");
    const filePath = uploadPath + "/" + fileName;
    this.logger.log("File path: " + filePath);
    // write the file to the disk
    fs.writeFileSync(filePath, file);
    this.logger.log("File uploaded successfully");
    // return the file path to the user
    const localFilePath = filePath;
    return localFilePath;
  }

  async uploadToCloud(file: any, keyName: string, mimeType: string): Promise<string> {
    this.logger.log("Uploading to cloud");

    //  creating the upload parameters
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: keyName,
      Body: file,
      ContentType: mimeType,
    };
    const command: any = new PutObjectCommand(uploadParams); // create a new PutObjectCommand

    try {
      // upload the file to the cloud storage
      await s3.send(command);
      this.logger.log("File uploaded successfully");
      return uploadParams.Key;
    } catch (err) {
      this.logger.error("Error while uploading file: " + err);
      throw new Error("Error while uploading file: " + err);
    }
  }

  async deleteFromCloud(keyName: string): Promise<boolean | NotFoundException> {
    this.logger.log(`Checking if file exists in cloud: ${keyName}`);

    const headParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: keyName,
    };

    try {
      // Check if the file exists before deleting
      await s3.send(new HeadObjectCommand(headParams));
      this.logger.log("File exists. Proceeding with deletion.");

      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: keyName,
      };

      await s3.send(new DeleteObjectCommand(deleteParams));
      this.logger.log("File deleted successfully");
      return true;
    } catch (err) {
      if (err.name === "NotFound") {
        this.logger.error("File does not exist in cloud storage");
        throw new NotFoundException("File does not exist in cloud storage");
      }

      this.logger.error("Error while deleting file: " + err);
      throw new Error("Error while deleting file: " + err);
    }
  }
}
