import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { UserTypeDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly responseHandler: ResponseHandler,
  ) {}
  async setUserType(req: any, res: any, userTypeDto: UserTypeDto) {
    try {
      const id = req?.user?.sub;
      if (!id) {
        return this.responseHandler.unAuthorizeErrorResponse(
          res,
          'Unauthorized user',
        );
      }

      const user = await this.userModel.findById(id).lean();
      if (!user) {
        return this.responseHandler.errorResponse(res, 'User not found');
      }

      const updateData: any = { userType: userTypeDto.userType };
      if (user.step < 2) {
        updateData.step = 2;
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, 'User update failed');
      }

      // Filter only required fields
      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        step: updatedUser.step,
        isProfileSetup: updatedUser.isProfileSetup,
      };
      return this.responseHandler.successResponseWithData(
        res,
        responseData,
        'User created successfully',
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }
}
