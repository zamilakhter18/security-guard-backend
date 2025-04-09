import { Controller, Delete, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { AuthGuard } from "./guard/auth.guard";
import { GetUserID } from "./decorators/get-user-id.decorator";
import { DeleteFileSwagger, UploadFileSwagger } from "./app.swagger";
import mongoose from "mongoose";

@Controller({ version: "1" })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Put("upload/:type")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @UploadFileSwagger()
  async upload(@Res() res: Response, @UploadedFile() file: Express.Multer.File, @Param("type") type: string, @GetUserID() userId: mongoose.Types.ObjectId) {
    if (!file) {
      return res.status(400).send({ message: "File is required" });
    }
    return await this.appService.upload(res, file, type, userId);
  }

  @Delete("delete")
  @UseGuards(AuthGuard)
  @DeleteFileSwagger()
  async delete(@Res() res: Response, @Query("path") path: string) {
    if (!path) {
      return res.status(400).send({ message: "Path is required" });
    }
    return this.appService.deleteFile(res, path);
  }
}
