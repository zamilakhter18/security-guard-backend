import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { userTypeEnum } from "../helpers/constants";
import { USER_MODEL, UserDocument } from "src/schemas/user.schema";

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id || request?.user?.sub;

    if (!userId) {
      throw new ForbiddenException("Unauthorized access: User ID missing.");
    }

    const user = await this.userModel.findById(userId).lean();
    if (!user || user.userType !== userTypeEnum.COMPANY) {
      throw new ForbiddenException("Access allowed only for companies.");
    }

    return true;
  }
}
