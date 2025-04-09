import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Request } from "express";
import { userTypeEnum } from "../helpers/constants";
import { USER_MODEL, UserDocument } from "src/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest<Request>();
    const userId = request?.user?.id || request?.user?.sub;

    if (!request.user) {
      throw new ForbiddenException("Unauthorized access.");
    }

    const user = await this.userModel.findById(userId).lean();
    if (!user || user.userType !== userTypeEnum.CLIENT) {
      throw new ForbiddenException("Access allowed only for clients.");
    }

    return true;
  }
}
