import { Injectable, Logger } from "@nestjs/common";
import { ResponseHandler } from "./helpers/response-handler";
import { UploadService } from "src/helpers/aws.service";
import { Request, Response } from "express";
import { messages } from "./helpers/message";
import * as path from "path";
import { InjectModel } from "@nestjs/mongoose";
import { USER_MODEL, UserDocument } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly responseHandler: ResponseHandler,
    private readonly uploadService: UploadService,
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>
  ) {}
  async upload(res: Response, file: Express.Multer.File, type: string, userId: mongoose.Types.ObjectId) {
    let value = type === "2" ? "logo" : type === "3" ? "document" : "profile";
    const keyName = `${userId}/${value}-${Date.now()}${path.extname(file.originalname)}`;
    const uploadedFile = await this.uploadService.uploadToCloud(file.buffer, keyName, file.mimetype);

    return this.responseHandler.successResponseWithData(res, messages.FILE_UPLOAD_SUCCESS, uploadedFile);
  }

  async deleteFile(res: Response, path: string) {
    try {
      const fileDeleted = await this.uploadService.deleteFromCloud(path);
      if (fileDeleted) {
        return this.responseHandler.successResponse(res, "File deleted successfully");
      } else {
        return this.responseHandler.errorResponse(res, "Failed to delete file from cloud");
      }
    } catch (error) {
      this.logger.error("Error while deleting file", error);
      return this.responseHandler.errorResponse(res, error.message);
    }
  }
}
