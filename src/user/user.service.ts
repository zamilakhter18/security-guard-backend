import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { ServiceDto, UserTypeDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { SERVICE_MODEL, ServiceDocument } from 'src/schemas/service.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(SERVICE_MODEL) private readonly serviceModel: Model<ServiceDocument>,
    private readonly responseHandler: ResponseHandler,
  ) {}
  async setUserType(req: any, res: any, userTypeDto: UserTypeDto) {
    try {
      const id = req?.user?.sub;

      const user = await this.userModel.findById(id).lean();
      if (!user) {
        return this.responseHandler.errorResponse(res, 'User not found');
      }

      const updateData: any = { userType: userTypeDto.userType };
      if (user.step < 1) {
        updateData.step = 1;
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

  async setUserService(req: any, res: any, serviceDto: ServiceDto) {
    try {
      const userId = req?.user?.sub;
      const { service: serviceIds } = serviceDto;

      if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
        return this.responseHandler.errorResponse(
          res,
          'Service array is required and should not be empty',
        );
      }

      // Validate all ObjectIds
      if (!serviceIds.every(mongoose.Types.ObjectId.isValid)) {
        return this.responseHandler.errorResponse(
          res,
          'One or more service IDs are invalid',
        );
      }

      // Check if all service IDs exist
      const existingServices = await this.serviceModel.countDocuments({
        _id: { $in: serviceIds },
      });
      if (existingServices !== serviceIds.length) {
        return this.responseHandler.errorResponse(
          res,
          'One or more service IDs do not exist in the database',
        );
      }

      // Update user services and step in a single query
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          services: serviceIds,
          step: { $max: [2, '$step'] }, // Ensures step is at least 2
        },
        { new: true },
      );

      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, 'User not found');
      }

      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        step: updatedUser.step,
        isProfileSetup: updatedUser.isProfileSetup,
        services: updatedUser.services,
      };

      return this.responseHandler.successResponseWithData(
        res,
        responseData,
        'User service has been set successfully',
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }
}
