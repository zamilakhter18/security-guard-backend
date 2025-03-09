import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateCompanyDto } from './dto/create-company.dto';
import { COMPANY_MODEL, CompanyDocument } from 'src/schemas/company.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { userTypeEnum } from 'src/helpers/constants';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { SetDateOfBirthDto } from './dto/set-date-of-birth.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(COMPANY_MODEL)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly responseHandler: ResponseHandler,
  ) {}
  async companyInformation(
    req,
    res: Response,
    createCompanyDto: CreateCompanyDto,
  ) {
    try {
      const userId = req?.user?.sub;
      const { email, phone } = createCompanyDto;

      const user = await this.userModel.findById(userId);
      if (user.userType !== userTypeEnum.COMPANY) {
        return this.responseHandler.errorResponse(
          res,
          'User type is not company',
        );
      }

      console.log('-----------------', user.companyId);
      if (user.companyId) {
        return this.responseHandler.errorResponse(
          res,
          'User already has a company',
        );
      }

      const isCompanyEmailExist = await this.companyModel
        .findOne({ email })
        .lean();
      if (isCompanyEmailExist) {
        return this.responseHandler.errorResponse(
          res,
          'Company already exist with this email',
        );
      }

      const isCompanyPhoneExist = await this.companyModel
        .findOne({ phone })
        .lean();
      if (isCompanyPhoneExist) {
        return this.responseHandler.errorResponse(
          res,
          'Company already exist with this phone number',
        );
      }

      const createdCompany = await this.companyModel.create(createCompanyDto);
      if (!createdCompany) {
        return this.responseHandler.errorResponse(
          res,
          'Company creation failed',
        );
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          companyId: createdCompany._id,
          step: 4,
        },
        { new: true },
      );

      if (!updatedUser) {
        return this.responseHandler.errorResponse(
          res,
          "User's companyId updation failed",
        );
      }

      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        services: updatedUser.services,
        step: updatedUser.step,
        isProfileSetup: updatedUser.isProfileSetup,
        isVerified: updatedUser.isVerified,
        companyId: updatedUser.companyId,
      };
      return this.responseHandler.successResponseWithData(
        res,
        'Company created successfully',
        responseData,
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async dateOfBirth(req, res: Response, setDateOfBirthDto: SetDateOfBirthDto) {
    try {
      const userId = req?.user?.sub;

      const user = await this.userModel.findById(userId).lean();
      if (!user) {
        return this.responseHandler.errorResponse(res, 'User not found');
      }

      // Determine the step based on userType
      let step: number;
      if (user.userType === 'client') {
        step = 3;
      } else if (user.userType === 'individual') {
        step = 5;
      } else {
        // Handle unexpected userType if necessary
        return this.responseHandler.errorResponse(res, 'Invalid user type');
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, {
          dateOfBirth: setDateOfBirthDto.dateOfBirth,
          step,
        })
        .lean();
      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, 'User updation failed');
      }

      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        step: updatedUser.step,
        isProfileSetup: updatedUser.isProfileSetup,
        isVerified: updatedUser.isVerified,
      };

      return this.responseHandler.successResponseWithData(
        res,
        'Date of birth updated',
        responseData,
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async sendPhoneOtp(req, res: Response) {
    
  }

}
