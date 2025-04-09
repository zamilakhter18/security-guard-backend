import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { ResponseHandler } from "src/helpers/response-handler";
import { ServiceDto, UserTypeDto } from "./dto/user.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { User, USER_MODEL, UserDocument } from "src/schemas/user.schema";
import { SERVICE_MODEL, ServiceDocument } from "src/schemas/service.schema";
import mongoose, { Model } from "mongoose";
import { messages } from "src/helpers/message";
import { CommonService } from "src/helpers/common.service";
import { userTypeEnum } from "src/helpers/constants";
import { UpdateBankAccountDto, UpdateUserDto } from "./dto/update-user.dto";
import { OTP_MODEL, OtpDocument } from "src/schemas/otp.schema";
import { MailService } from "src/helpers/mail.service";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { HashService } from "src/helpers/hash.service";
import { COMPANY_MODEL, CompanyDocument } from "src/schemas/company.schema";
import { Connection } from "mongoose";
import { COMPANY_GUARD_MODEL, CompanyGuardDocument } from "src/schemas/guard.schema";
import { BANK_INFORMATION_MODEL, BankInformationDocument } from "src/schemas/bank-information.schema";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(OTP_MODEL) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(SERVICE_MODEL) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(COMPANY_MODEL) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(COMPANY_GUARD_MODEL) private readonly companyGuardModel: Model<CompanyGuardDocument>,
    private readonly responseHandler: ResponseHandler,
    private readonly commonService: CommonService,
    private readonly mailService: MailService,
    private readonly hashService: HashService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(BANK_INFORMATION_MODEL) private readonly bankInformationModel: Model<BankInformationDocument>
  ) {}
  async setUserType(res: any, userTypeDto: UserTypeDto, userId: string) {
    try {
      this.logger.debug("A user is trying to set user type");
      const ExistedUser = await this.userModel.findById(userId).lean();
      if (ExistedUser) {
        if (userTypeDto.userType !== ExistedUser.userType) {
          if (ExistedUser.userType === userTypeEnum.COMPANY && ExistedUser.companyId) {
            const companyGuards = await this.companyGuardModel.find({
              companyId: ExistedUser.companyId,
            });
            console.log("-------companyGuards------", companyGuards);
            // Extract userIds from companyGuards
            const userIdsToDelete = companyGuards.map((guard) => guard.userId);

            // Bulk delete company guards
            await this.companyGuardModel.deleteMany({
              companyId: ExistedUser.companyId,
            });

            // Bulk delete users whose userId is in companyGuards
            if (userIdsToDelete.length > 0) {
              await this.userModel.deleteMany({
                _id: { $in: userIdsToDelete },
              });
            }

            // Delete the company itself
            await this.companyModel.findByIdAndDelete(ExistedUser.companyId);

            // Unset companyId for the user changing type
            await this.userModel.findByIdAndUpdate(userId, {
              $unset: { companyId: 1 },
            });
          }
        }
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          userType: userTypeDto.userType,
        },
        { new: true }
      );
      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, messages.USER_UPDATION_FAILED);
      }

      const step = await this.commonService.checkStep(userId);

      // Filter only required fields
      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        step: step.step,
        isProfileSetup: updatedUser.isProfileSetup,
      };
      this.logger.debug(messages.USER_TYPE_UPDATED);
      return this.responseHandler.successResponseWithData(res, messages.USER_TYPE_UPDATED, responseData);
    } catch (error) {
      this.logger.error("Error while setting a user type : ", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async setUserService(userId: string, res: any, serviceDto: ServiceDto) {
    try {
      this.logger.debug("A user is trying to set a service");
      const user = await this.userModel.findById(userId).lean();
      if (!user) {
        return this.responseHandler.errorResponse(res, messages.USER_NOT_FOUND);
      }

      let { service: serviceIds } = serviceDto;

      if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
        return this.responseHandler.errorResponse(res, messages.SERVICE_REQUIRED_AND_NOT_EMPTY);
      }

      if (!serviceIds.every(mongoose.Types.ObjectId.isValid)) {
        return this.responseHandler.errorResponse(res, messages.SERVICE_ID_INVALID);
      }
      let newServiceIds = serviceIds.map((id) => new mongoose.Types.ObjectId(id));

      // Check if all service IDs exist
      const existingServices = await this.serviceModel.countDocuments({
        _id: { $in: newServiceIds },
      });
      if (existingServices !== newServiceIds.length) {
        return this.responseHandler.errorResponse(res, messages.SERVICE_ID_NOT_EXIST);
      }

      // Update user services and step in a single query
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          services: newServiceIds,
        },
        { new: true }
      );

      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, messages.USER_NOT_FOUND);
      }

      const step = await this.commonService.checkStep(userId);

      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        step: step.step,
        isProfileSetup: updatedUser.isProfileSetup,
        services: updatedUser.services,
      };

      this.logger.debug(messages.SERVICE_SET_SUCCESS);
      return this.responseHandler.successResponseWithData(res, messages.SERVICE_SET_SUCCESS, responseData);
    } catch (error) {
      this.logger.error("Error while setting a user service : ", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async getUserService(userId: string, res: Response) {
    try {
      this.logger.debug("A request to get user service has been made");

      const services = await this.userModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "services",
            foreignField: "_id",
            as: "services",
          },
        },
        {
          $project: {
            services: 1,
            _id: 0,
          },
        },
      ]);

      this.logger.debug(messages.SERVICE_GET_SUCCESS);
      return this.responseHandler.successResponseWithData(res, messages.SERVICE_GET_SUCCESS, services.length > 0 ? services[0].services : []);
    } catch (error) {
      this.logger.error("Error while getting a user service : ", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async forgetPassword(res: Response, forgetPasswordDto: ForgetPasswordDto) {
    try {
      const { email } = forgetPasswordDto;
      this.logger.debug("A request to forget password has been made");
      const user = await this.userModel.findOne({
        email,
        isEmailVerified: true,
      });
      if (!user) {
        this.logger.error(messages.USER_NOT_FOUND);
        return this.responseHandler.errorResponse(res, messages.USER_NOT_FOUND);
      }

      const otp = this.commonService.generateOtp();
      const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

      const storedOtp = await this.otpModel.findOneAndUpdate(
        { email },
        {
          email,
          otp,
          otpExpiresAt,
        },
        { new: true, upsert: true }
      );
      if (!storedOtp) {
        this.logger.error(`Failed to store Otp for email: ${email}`);
        return this.responseHandler.errorResponse(res, messages.FAILED_TO_STORE_OTP);
      }

      const subject = "Your OTP Code";
      const html = `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 2 minutes.</p>`;
      try {
        await this.mailService.sendEmail(email, subject, html);
      } catch (error) {
        this.logger.error(`Failed to send OTP email to ${email}`, error);
        return this.responseHandler.errorResponse(res, messages.FAILED_TO_SEND_OTP);
      }

      this.logger.debug(`Otp ${otp} successfully sent to email: ${email}`);
      return this.responseHandler.successResponse(res, messages.OTP_SENT_SUCCESSFULLY);
    } catch (error) {
      this.logger.error("Error while forgetting a password", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async resetPassword(res: Response, resetPasswordDto: ResetPasswordDto) {
    try {
      let { password, email } = resetPasswordDto;
      const user = await this.userModel.findOne({ email: email });
      const isPasswordSame = await this.hashService.compare(password, user.password);
      if (isPasswordSame) {
        this.logger.error("Password cannot be the same as the previous one");
        return this.responseHandler.errorResponse(res, messages.PASSWORD_CANNOT_BE_SAME);
      }
      password = await this.hashService.hash(password);
      this.logger.debug("A request to reset password has been made");

      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id,
        {
          password,
        },
        { new: true }
      );
      if (!updatedUser) {
        this.logger.error(`Failed to update user with id: ${user._id}`);
        return this.responseHandler.errorResponse(res, messages.USER_UPDATION_FAILED);
      }
      this.logger.debug(`Password has been successfully reset for user: ${user._id}`);
      return this.responseHandler.successResponse(res, messages.PASSWORD_RESET_SUCCESSFULLY);
    } catch (error) {
      this.logger.error("Error while resetting the password", error.message);
      return this.responseHandler.catchErrorResponseWithMesage(res, error.message);
    }
  }

  async getUser(res: Response, user: UserDocument) {
    try {
      this.logger.debug("A request to get user has been made");
      const responseData = {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        phone: user.phone,
        countryCode: user.countryCode,
        isPhoneVerified: user.isPhoneVerified,
        dateOfBirth: user.dateOfBirth,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
        about: user.about,
      };
      const getCompanyDetails = await this.companyModel.findOne({ _id: user.companyId });
      if (getCompanyDetails) {
        responseData.profilePhoto = getCompanyDetails.companyLogo;
        responseData.phone = getCompanyDetails.phone;
        responseData.countryCode = getCompanyDetails.countryCode;
      }
      return this.responseHandler.successResponseWithData(res, messages.USER_FETCHED_SUCCESSFULLY, responseData);
    } catch (error) {
      this.logger.debug("Something went wrong while getting user", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async updateUser(res: Response, userId: string, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.userModel.findById(userId);
      if (!findUser) {
        return this.responseHandler.errorResponse(res, messages.USER_NOT_FOUND);
      }
      if (updateUserDto.email && findUser.email !== updateUserDto.email) {
        const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
        if (existingUser) {
          return this.responseHandler.errorResponse(res, messages.EMAIL_ALREADY_EXIST);
        }
      }
      if (updateUserDto.phone && findUser.phone !== updateUserDto.phone) {
        const existingUser = await this.userModel.findOne({ phone: updateUserDto.phone });
        if (existingUser) {
          return this.responseHandler.errorResponse(res, messages.PHONE_NUMBER_ALREADY_EXISTS);
        }
      }
      if (updateUserDto.services.length) {
        updateUserDto.services = updateUserDto.services.map((serviceId) => {
          return new mongoose.Types.ObjectId(serviceId);
        });
      }
      let payload: any = {};
      let payloadForUpdatingCompany: any = {};
      if (findUser.userType === userTypeEnum.CLIENT) {
        payload = {
          email: updateUserDto.email,
          phone: updateUserDto.phone,
          countryCode: updateUserDto.countryCode,
          firstName: updateUserDto.fullName.split(" ")[0].trim(),
          lastName: updateUserDto.fullName.split(" ")[1].trim(),
          dateOfBirth: updateUserDto.dateOfBirth,
          profilePhoto: updateUserDto.profilePhoto,
          about: updateUserDto.about,
          gender: updateUserDto.gender,
        };
        const updateUser = await this.userModel.findByIdAndUpdate(userId, payload, { new: true });
        if (!updateUser) {
          return this.responseHandler.errorResponse(res, messages.USER_UPDATION_FAILED);
        }
      } else if (findUser.userType === userTypeEnum.COMPANY) {
        payloadForUpdatingCompany = {
          email: updateUserDto.email,
          phone: updateUserDto.phone,
          countryCode: updateUserDto.countryCode,
          companyLogo: updateUserDto.profilePhoto,
          name: updateUserDto.fullName,
        };
        payload = {
          email: updateUserDto.email,
          firstName: updateUserDto.fullName.split(" ")[0].trim(),
          lastName: updateUserDto.fullName.split(" ")[1].trim(),
          services: updateUserDto.services,
          about: updateUserDto.about,
        };
        const updateCompany = await this.companyModel.findByIdAndUpdate(findUser.companyId, payloadForUpdatingCompany, { new: true });
        if (!updateCompany) {
          return this.responseHandler.errorResponse(res, messages.COMPANY_NOT_FOUND);
        }
        const updateUser = await this.userModel.findByIdAndUpdate(userId, payload, { new: true });
        if (!updateUser) {
          return this.responseHandler.errorResponse(res, messages.USER_UPDATION_FAILED);
        }
        const getUser: Array<User> = await this.userModel.aggregate([
          {
            $match: {
              _id: userId,
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "services",
              foreignField: "_id",
              as: "services",
            },
          },
        ]);
        const responseData: any = {
          email: getUser[0].email,
          phone: updateCompany.phone,
          countryCode: updateCompany.countryCode,
          firstName: getUser[0].firstName,
          lastName: getUser[0].lastName,
          dateOfBirth: getUser[0].dateOfBirth,
          profilePhoto: updateCompany.companyLogo,
          services: getUser[0].services,
          gender: getUser[0].gender,
          about: getUser[0].about,
        };
        return this.responseHandler.successResponseWithData(res, messages.USER_UPDATION_SUCCESS, responseData);
      } else if (findUser.userType === userTypeEnum.GUARD) {
        payload = {
          email: updateUserDto.email,
          phone: updateUserDto.phone,
          countryCode: updateUserDto.countryCode,
          firstName: updateUserDto.fullName.split(" ")[0].trim(),
          lastName: updateUserDto.fullName.split(" ")[1].trim(),
          dateOfBirth: updateUserDto.dateOfBirth,
          profilePhoto: updateUserDto.profilePhoto,
          gender: updateUserDto.gender,
          services: updateUserDto.services,
          about: updateUserDto.about,
        };
        const updateUser = await this.userModel.findByIdAndUpdate(userId, payload, { new: true });
        if (!updateUser) {
          return this.responseHandler.errorResponse(res, messages.USER_UPDATION_FAILED);
        }
      }
      const getUser = await this.userModel.aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "services",
            foreignField: "_id",
            as: "services",
          },
        },
      ]);
      const responseData = {
        email: getUser[0].email,
        phone: getUser[0].phone,
        countryCode: getUser[0].countryCode,
        firstName: getUser[0].firstName,
        lastName: getUser[0].lastName,
        dateOfBirth: getUser[0].dateOfBirth,
        profilePhoto: getUser[0].profilePhoto,
        services: getUser[0].services,
        gender: getUser[0].gender,
        about: getUser[0].about,
      };
      return this.responseHandler.successResponseWithData(res, messages.USER_UPDATION_SUCCESS, responseData);
    } catch (error) {
      this.logger.error("Error while updating the user", error);
      return this.responseHandler.catchErrorResponseWithMesage(res, error.message);
    }
  }

  async deleteUser(res: Response, user: UserDocument) {
    this.logger.debug("A request to delete user has been made");

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      if (user.userType === userTypeEnum.CLIENT) {
        this.logger.debug("Deleting a CLIENT user");

        const deletedUser = await this.userModel.findByIdAndDelete(user._id, {
          session,
        });
        if (!deletedUser) {
          this.logger.error(`Failed to delete CLIENT user with id: ${user._id}`);
          await session.abortTransaction();
          session.endSession();
          return this.responseHandler.errorResponse(res, "Failed to delete user");
        }

        this.logger.debug(`Client user deleted: ${user._id}`);
        await session.commitTransaction();
        session.endSession();
        return this.responseHandler.successResponse(res, messages.USER_DELETED_SUCCESSFULLY);
      }

      if (user.userType === userTypeEnum.COMPANY) {
        this.logger.debug("Deleting a COMPANY user");

        if (user.companyId) {
          this.logger.debug(`Company ID found: ${user.companyId}, proceeding with deletion`);

          // Find all guards associated with the company
          const companyGuards = await this.companyGuardModel.find({ companyId: user.companyId }).session(session);
          const userIdsToDelete = companyGuards.map((guard) => guard.userId);

          // Bulk delete company guards
          await this.companyGuardModel.deleteMany({ companyId: user.companyId }).session(session);

          // Bulk delete associated guard users (only if guards exist)
          if (userIdsToDelete.length > 0) {
            await this.userModel.deleteMany({ _id: { $in: userIdsToDelete } }).session(session);
          }

          // Delete the company itself (only if it exists)
          const deletedCompany = await this.companyModel.findByIdAndDelete(user.companyId, { session });
          if (deletedCompany) {
            this.logger.debug(`Deleted company: ${user.companyId}`);
          } else {
            this.logger.debug(`Company ${user.companyId} does not exist, skipping deletion`);
          }
        }

        // Delete the company user
        const deletedUser = await this.userModel.findByIdAndDelete(user._id, {
          session,
        });
        if (!deletedUser) {
          this.logger.error(`Failed to delete COMPANY user with id: ${user._id}`);
          await session.abortTransaction();
          session.endSession();
          return this.responseHandler.errorResponse(res, "Failed to delete user");
        }

        this.logger.debug(`Company user deleted: ${user._id}`);
        await session.commitTransaction();
        session.endSession();
        return this.responseHandler.successResponse(res, messages.USER_DELETED_SUCCESSFULLY);
      }

      if (user.userType === userTypeEnum.GUARD) {
        this.logger.debug("Deleting a GUARD user");
        const deletedUser = await this.userModel.findByIdAndDelete(user._id, {
          session,
        });
        if (!deletedUser) {
          this.logger.error(`Failed to delete GUARD user with id: ${user._id}`);
          await session.abortTransaction();
          session.endSession();
          return this.responseHandler.errorResponse(res, "Failed to delete user");
        }

        this.logger.debug(`Guard user deleted: ${user._id}`);
        await session.commitTransaction();
        session.endSession();
        return this.responseHandler.successResponse(res, messages.USER_DELETED_SUCCESSFULLY);
      }

      this.logger.error(`Unknown user type: ${user.userType}`);
      await session.abortTransaction();
      session.endSession();
      return this.responseHandler.errorResponse(res, "Invalid user type");
    } catch (error) {
      this.logger.error("Error while deleting the user", error);
      await session.abortTransaction();
      session.endSession();
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async getBankAccount(userId: string, res: Response) {
    try {
      const bankDetails = await this.bankInformationModel.find({ userId });
      if (!bankDetails) {
        return this.responseHandler.errorResponse(res, messages.NO_BANK_ACCOUNT_FOUND);
      }
      return this.responseHandler.successResponseWithData(res, messages.BANK_ACCOUNT_FETCHED_SUCCESS, bankDetails[0]);
    } catch (error) {
      this.logger.error("Error while getting the bank account", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async updateBankAccount(res: Response, userId: string, updateBankAccountDto: UpdateBankAccountDto) {
    try {
      const objectUserId = new mongoose.Types.ObjectId(userId)
      const checkUserBankInfoExists = await this.bankInformationModel.findOne({userId: objectUserId});
      if(!checkUserBankInfoExists){
        return this.responseHandler.errorResponse(res, messages.NO_BANK_ACCOUNT_FOUND);
      }
      const payload = {
        accountNumber: updateBankAccountDto.accountNumber,
        receiptName: updateBankAccountDto.receiptName,
        bankName: updateBankAccountDto.bankName,
        routingNumber: updateBankAccountDto.routingNumber,
        street:  updateBankAccountDto.street,
        city: updateBankAccountDto.city,
        state: updateBankAccountDto.state,
        zipcode: updateBankAccountDto.zipcode,
        country: updateBankAccountDto.country,
      }
      const updatedBankInfo = await this.bankInformationModel.findOneAndUpdate({userId: objectUserId}, payload, { new: true });
      if(!updatedBankInfo){
        return this.responseHandler.errorResponse(res, messages.BANK_ACCOUNT_UPDATE_FAILED);
      }
      return this.responseHandler.successResponseWithData(res, messages.BANK_ACCOUNT_UPDATED_SUCCESSFULLY, updatedBankInfo);
    } catch (error) {
      this.logger.error("Error while getting the bank account", error.message);
      return this.responseHandler.catchErrorResponseWithMesage(res, error.message);
    }
  }
}
