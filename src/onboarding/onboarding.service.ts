import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Response } from "express";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { COMPANY_MODEL, CompanyDocument } from "src/schemas/company.schema";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ResponseHandler } from "src/helpers/response-handler";
import { USER_MODEL, UserDocument } from "src/schemas/user.schema";
import { SetDateOfBirthDto } from "./dto/set-date-of-birth.dto";
import { SendPhoneOtpDto } from "./dto/send-phone-otp.dto";
import { OTP_MODEL, OtpDocument } from "src/schemas/otp.schema";
import { CompanySizeDto } from "./dto/company-size.dto";
import * as twilioErrorsRaw from "../twillioerror.json";
const twilioErrors: any[] = Array.isArray(twilioErrorsRaw) ? twilioErrorsRaw : Array.from(twilioErrorsRaw);

import { COMPANY_GUARD_MODEL, CompanyGuardDocument } from "src/schemas/guard.schema";
import { UploadService } from "src/helpers/aws.service";
import { VerifyPhoneOtpDto } from "./dto/verify-phone-otp";
import { messages } from "src/helpers/message";
import { CompanyLogoDto } from "./dto/company-logo.dto";
import { DocumentDto } from "./dto/document.dto";
import { CommonService } from "src/helpers/common.service";
import { CreateBankDto } from "./dto/create-bank.dto";
import { BANK_INFORMATION_MODEL, BankInformationDocument } from "src/schemas/bank-information.schema";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { TwilioService } from "src/helpers/twilio.service";
import { VerifyNumberDto } from "./dto/verify-number.dto";
import { ConfigService } from "@nestjs/config";
import { SetProfilePhoto } from "./dto/set-profile-picture.dto";
import { SetGuardAndSecuritySizeDto } from "./dto/set-guard-and-security-size.dto";
import { userTypeEnum } from "src/helpers/constants";
import { BranchService } from "src/helpers/branch.service";
import { MailService } from "src/helpers/mail.service";
import { Types } from "mongoose";

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);
  private readonly twilioAccountSid: string;
  private readonly twilioAuthToken: string;
  private readonly twilioBaseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(COMPANY_MODEL) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(OTP_MODEL) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(BANK_INFORMATION_MODEL) private readonly bankInformationModel: Model<BankInformationDocument>,
    @InjectModel(COMPANY_GUARD_MODEL) private readonly companyGuardModel: Model<CompanyGuardDocument>,
    private readonly responseHandler: ResponseHandler,
    private readonly commonService: CommonService,
    private readonly twilioService: TwilioService,
    private readonly branchService: BranchService,
    private readonly mailService: MailService
  ) {
    this.twilioAccountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
    this.twilioAuthToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");
    this.twilioBaseUrl = "https://lookups.twilio.com/v1/PhoneNumbers/";
  }
  async createCompany(res: Response, userId: string, createCompanyDto: CreateCompanyDto) {
    this.logger.log("A user is creating a company");
    try {
      const { name, contactName, email, countryCode, countryShortName, phone, address } = createCompanyDto;

      const user = await this.userModel.findById(userId);
      // if (user.userType === userTypeEnum.COMPANY && user.step !== 3) {
      //   return this.responseHandler.errorResponse(
      //     res,
      //     "First you need to set your services"
      //   );
      // }

      // Convert coordinates to float
      const long = parseFloat(address.longitude);
      const lat = parseFloat(address.latitude);
      if (isNaN(long) || isNaN(lat)) {
        return this.responseHandler.errorResponse(res, "Invalid longitude or latitude");
      }

      if (user?.companyId) {
        this.logger.warn("User already has a company");
        const updatedCompany = await this.companyModel.findByIdAndUpdate(
          user.companyId,
          {
            name,
            email,
            contactName,
            countryCode,
            countryShortName,
            phone,
            address,
            location: {
              type: "Point",
              coordinates: [long, lat],
            },
          },
          { new: true, upsert: true }
        );
        if (!updatedCompany) {
          return this.responseHandler.errorResponse(res, "Company updation failed");
        }
        const step = await this.commonService.checkStep(userId);
        const responseData = {
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          services: user.services,
          step: step.step,
          isProfileSetup: user.isProfileSetup,
          companyId: user.companyId,
        };

        this.logger.log(`Company Updated successfully`);
        return this.responseHandler.successResponseWithData(res, "Company updated successfully", responseData);
      }

      const isCompanyEmailExist = await this.companyModel.findOne({ email }).lean();
      if (isCompanyEmailExist) {
        return this.responseHandler.errorResponse(res, "Company already exist with this email");
      }

      const isCompanyPhoneExist = await this.companyModel.findOne({ phone }).lean();
      // if (isCompanyPhoneExist) {
      //   return this.responseHandler.errorResponse(
      //     res,
      //     "Company already exist with this phone number"
      //   );
      // }

      const createdCompany = await this.companyModel.create({
        name,
        contactName,
        email,
        countryCode,
        countryShortName,
        phone,
        address,
        location: {
          type: "Point",
          coordinates: [long, lat],
        },
      });

      if (!createdCompany) {
        return this.responseHandler.errorResponse(res, "Company creation failed");
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          companyId: createdCompany._id,
        },
        { new: true }
      );

      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, "User's companyId updation failed");
      }

      const step = await this.commonService.checkStep(userId);
      const responseData = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        services: updatedUser.services,
        step: step.step,
        isProfileSetup: updatedUser.isProfileSetup,
        isVerified: updatedUser.isVerified,
        companyId: updatedUser.companyId,
      };

      this.logger.log(`Company created successfully`);
      return this.responseHandler.successResponseWithData(res, "Company created successfully", responseData);
    } catch (error) {
      this.logger.error("Error while creating a company", error.stack);
      // this.logger.error("Error while creating a company", error.message);
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async dateOfBirth(userId: string, res: Response, setDateOfBirthDto: SetDateOfBirthDto) {
    this.logger.debug("A request to set date of birth has been made");
    try {
      const user = await this.userModel.findById(userId).lean();
      if (!user) {
        return this.responseHandler.errorResponse(res, "User not found");
      }

      // Determine the step based on userType
      let step: number;
      if (user.userType === "client") {
        step = 3;
      } else {
        // Handle unexpected userType if necessary
        return this.responseHandler.errorResponse(res, "Invalid user type");
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, {
          dateOfBirth: setDateOfBirthDto.dateOfBirth,
          step,
        })
        .lean();
      if (!updatedUser) {
        return this.responseHandler.errorResponse(res, "User updation failed");
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

      this.logger.debug("Date of birth updated successfully");
      return this.responseHandler.successResponseWithData(res, "Date of birth updated successfully", responseData);
    } catch (error) {
      this.logger.error("Error updating date of birth", error.messages);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  // Verify Phone Number through twilio
  async verifyNumber(res: Response, verifyNumberDto: VerifyNumberDto) {
    try {
      const { phone, countryCode } = verifyNumberDto;

      const testNumber = ["7087570784", "7973417110", "7739088022", "9816508152", "7018087288", "3212300892", "4049759399", "6782946568"];
      if (!testNumber.includes(phone)) {
        const validation = await this.twilioService.verifyPhoneNumber(countryCode, phone);
        console.log("validation=>>", validation);

        // validation=>> {
        //   add_ons: null,
        //   caller_name: null,
        //   carrier: {
        //     error_code: 10002,
        //     mobile_country_code: null,
        //     mobile_network_code: null,
        //     name: null,
        //     type: null
        //   },
        //   country_code: 'IN',
        //   national_format: '083405 86958',
        //   phone_number: '+918340586958',
        //   url: 'https://lookups.twilio.com/v1/PhoneNumbers/+918340586958'
        // }

        if (!validation || validation.error) {
          return this.responseHandler.errorResponse(res, messages.INVALID_PHONE_NUMBER);
        } else if (validation.code) {
          const errorMessage = getTwilioErrorMessage(validation.code);
          console.log("errorMessage", errorMessage);
          return this.responseHandler.errorResponse(res, errorMessage || messages.INVALID_PHONE_NUMBER);
        } else if (validation?.carrier?.error_code) {
          const errorMessage = getTwilioErrorMessage(validation.carrier.error_code);
          console.log("errorMessage", errorMessage);
          return this.responseHandler.errorResponse(res, errorMessage || messages.INVALID_PHONE_NUMBER);
        }

        function getTwilioErrorMessage(errorCode: number): string | null {
          console.log("----errr ---", errorCode);
          // console.log("twilioErrors", twilioErrors);
          //
          const error = twilioErrors.find((err) => err.code == errorCode);
          console.log("=====twilioErrors==", error, error.message);
          return error ? error.message : null;
        }

        return this.responseHandler.successResponse(res, messages.VERIFICATION_SUCCESS);
      } else {
        return this.responseHandler.successResponse(res, messages.VERIFICATION_SUCCESS);
      }
    } catch (error) {
      this.logger.error(error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async sendPhoneOtp(res: Response, sendPhoneOtpDto: SendPhoneOtpDto) {
    try {
      const { phone, countryCode } = sendPhoneOtpDto;
      const testNumber = ["7087570784", "7973417110", "7739088022", "9816508152", "7018087288", "3212300892", "4049759399", "6782946568"];
      if (!testNumber.includes(phone)) {
        const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");
        const serviceSid = this.configService.get<string>("TWILIO_SERVICE_SID");
        const sendOtpUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;

        this.logger.debug(`Attempting to send OTP to phone: ${phone}`);

        // Check if the phone number already exists in the company database
        const company = await this.companyModel.findOne({ phone });
        if (company) {
          this.logger.warn(`Phone number already exists in a company`);
          return this.responseHandler.errorResponse(res, "Phone number already exists in a company");
        }

        // Preparing the OTP request payload
        const urlencoded = new URLSearchParams();
        urlencoded.append("To", `${countryCode}${phone}`);
        urlencoded.append("Channel", "sms");
        console.log("---", 1);
        // Sending OTP
        const sendOtp = await this.twilioService.sendOtpForPhoneNumber(sendOtpUrl, urlencoded);

        if (sendOtp?.status !== 400) {
          // await this.twilioService.addCheckOtp({ phone_number: phone });

          return this.responseHandler.successResponseWithData(res, "otp sent", sendOtp.response);
        } else {
          // Handle Twilio errors dynamically
          const twilioError = twilioErrors.find((err) => err.code === sendOtp.error?.code);

          if (twilioError) {
            console.log(twilioError, "----hgfhgf", twilioError.message);

            this.logger.error(`Twilio Error (${twilioError.code}): ${twilioError.message}`);
            return this.responseHandler.errorResponse(res, twilioError.message);
          }

          return this.responseHandler.errorResponse(res, "incorrect otp");
        }
      } else {
        const comapany = await this.companyModel.findOne({ phone });
        // if (comapany) {
        //   this.logger.warn(`Phone number already exists in a company`);
        //   return this.responseHandler.errorResponse(
        //     res,
        //     "Phone number already exists in a company"
        //   );
        // }

        const otp = 1234;
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        const storedOtp = await this.otpModel.findOneAndUpdate(
          { phone },
          {
            phone,
            otp,
            otpExpiresAt,
          },
          { new: true, upsert: true }
        );
        if (!storedOtp) {
          this.logger.error(`Failed to store Otp`);
          return this.responseHandler.errorResponse(res, "Failed to send Otp");
        }

        this.logger.debug(`Otp ${otp} successfully sent to phone: ${phone}`);
        return this.responseHandler.successResponse(res, "Otp sent successfully");
      }
    } catch (error) {
      this.logger.error(`Error in sendPhoneOtp: ${error.message}`);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async verifyPhoneOtp(res: Response, verifyPhoneOtpDto: VerifyPhoneOtpDto) {
    try {
      const { countryCode, phone, otp } = verifyPhoneOtpDto;
      this.logger.debug(`Verifying Otp : ${otp} for phone: ${phone}`);

      const testNumber = ["7087570784", "7973417110", "7739088022", "9816508152", "7018087288", "3212300892", "4049759399", "6782946568"];

      if (!testNumber.includes(phone)) {
        const phoneNumber = `${countryCode.replace(/\+/g, "")}${phone}`;
        const formattedPhoneNumber = `+${phoneNumber}`;

        const url = `https://verify.twilio.com/v2/Services/${process.env.TWILIO_SERVICE_SID}/VerificationCheck`;

        const urlencoded = new URLSearchParams();
        urlencoded.append("To", formattedPhoneNumber);
        urlencoded.append("Code", otp);

        // Call Twilio OTP verification service
        const verifyOtp = await this.twilioService.otpVerify(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, url, urlencoded);

        console.log("----verifyOtp------", verifyOtp);

        if (!verifyOtp?.response?.code) {
          if (verifyOtp?.response.status === "pending") {
            this.logger.error("Incorrect OTP");
            throw new HttpException("Incorrect OTP", HttpStatus.BAD_REQUEST);
          }

          this.logger.log("OTP verified successfully");
          return this.responseHandler.successResponse(res, "OTP verified successfully");
        } else {
          // Handle Twilio errors
          const twilioError = twilioErrors.find((error) => error.code === verifyOtp.response.code);

          if (twilioError) {
            this.logger.error(twilioError.message);
            throw new HttpException(twilioError.message, HttpStatus.BAD_REQUEST);
          }

          this.logger.error("Invalid phone number");
          throw new HttpException("Invalid phone number", HttpStatus.BAD_REQUEST);
        }
      } else {
        // ✅ Handle test numbers
        const isPhoneExist = await this.otpModel.findOne({ phone });

        if (!isPhoneExist) {
          return this.responseHandler.errorResponse(res, "Phone number does not exist");
        }

        const otpRecord = await this.otpModel.findOne({ phone, otp }).sort({ createdAt: -1 });

        if (!otpRecord) {
          return this.responseHandler.errorResponse(res, messages.OTP_INCORRECT);
        }

        //! Check if Otp has expired
        if (new Date() > otpRecord.otpExpiresAt) {
          return this.responseHandler.errorResponse(res, messages.OTP_EXPIRED);
        }

        await this.otpModel.deleteMany({ phone });

        this.logger.debug(`Otp : ${otp} successfully verified for phone: ${phone}`);
        return this.responseHandler.successResponse(res, messages.OTP_VERIFIED);
      }
    } catch (error) {
      this.logger.error("Error in verifyPhoneOtp", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async companySize(userId: string, res: Response, companySizeDto: CompanySizeDto) {
    this.logger.debug("A request to set company size has been made");
    try {
      const { companyMaxSize } = companySizeDto;

      const user = await this.userModel.findById(userId);
      // if (user.step !== 4) {
      //   return this.responseHandler.errorResponse(
      //     res,
      //     "First, you need to create your company"
      //   );
      // }

      const company = await this.companyModel.findById(user.companyId);
      if (!company) {
        return this.responseHandler.errorResponse(res, "Company not found");
      }

      const updatedComany = await this.companyModel.findByIdAndUpdate(
        company.id,
        {
          companyMaxSize,
        },
        { new: true }
      );
      if (!updatedComany) {
        return this.responseHandler.errorResponse(res, "Failed to update company size");
      }

      const step = await this.commonService.checkStep(userId);

      this.logger.debug("Company size updated successfully", step);
      return this.responseHandler.successResponseWithData(res, "Company size updated successfully", { step: step.step });
    } catch (error) {
      this.logger.error(`Error in set CompanySize: ${error.message}`);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async companyLogo(userId: string, res: Response, companyLogoDto: CompanyLogoDto) {
    this.logger.debug("A request to update company logo has been made");
    try {
      const { logo } = companyLogoDto;

      const user = await this.userModel.findById(userId);
      // if (user.step !== 6) {
      //   return this.responseHandler.errorResponse(
      //     res,
      //     "First, you need to create guards for your company"
      //   );
      // }
      // ! check whether it is valid logo
      const updatedCompany = await this.companyModel.findByIdAndUpdate(user.companyId, { companyLogo: logo }, { new: true });

      if (!updatedCompany) {
        return this.responseHandler.errorResponse(res, "Company not found");
      }

      const step = await this.commonService.checkStep(userId);
      this.logger.debug("Logo updated successfully");
      return this.responseHandler.successResponseWithData(res, "Logo set successfully", { step: step.step });
    } catch (error) {
      this.logger.error(`Error while setting company logo: ${error.message}`);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async document(res: Response, userId: string, documentDto: DocumentDto) {
    this.logger.debug("A request to upload document has been made");
    try {
      const { document } = documentDto;

      const user = await this.userModel.findByIdAndUpdate(userId, { document }, { new: true });
      if (!user) {
        return this.responseHandler.errorResponse(res, "Failed to upload document");
      }

      const step = await this.commonService.checkStep(userId);
      this.logger.debug("Document uploaded successfully");
      return this.responseHandler.successResponseWithData(res, "Document uploaded successfully", { step: step.step });
    } catch (error) {
      this.logger.error(`Error while uploading document: ${error.message}`);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async createBank(res: Response, createBankDto: CreateBankDto, userId: string) {
    this.logger.debug(`Processing bank entry for user: ${userId}`);

    // Convert userId to ObjectId
    const objectUserId = new Types.ObjectId(userId);

    try {
      // Check if the user already has a bank account
      const existingUserBank = await this.bankInformationModel.findOne({
        userId: objectUserId,
      });
      if (existingUserBank) {
        const updatedBank = await this.bankInformationModel.findOneAndUpdate({ userId: objectUserId }, { ...createBankDto }, { new: true });
        if (!updatedBank) {
          return this.responseHandler.errorResponse(res, "Failed to update bank account.");
        }

        const step = await this.commonService.checkStep(objectUserId.toString());
        this.logger.debug("Bank updated successfully");
        return this.responseHandler.successResponseWithData(res, "Bank updated successfully", { updatedBank, step: step.step });
      }

      const createdBank = await this.bankInformationModel.create({
        userId: objectUserId, // Store userId as ObjectId
        ...createBankDto,
      });

      const step = await this.commonService.checkStep(objectUserId.toString());
      this.logger.debug("Bank created successfully");
      return this.responseHandler.successResponseWithData(res, "Bank created successfully", { createdBank, step: step.step });
    } catch (error) {
      this.logger.error(error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async updateCompany(res: Response, userId: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return this.responseHandler.errorResponse(res, "User not found");
      }

      // Convert coordinates to float
      const updatedDto = await this.commonService.setLocation(updateCompanyDto);
      console.log("updatedDto-----------", updatedDto);

      if (user.companyId) {
        const company = await this.companyModel.findById(user.companyId);
        // if (!company.companyMaxSize && updatedDto.logo) {
        //   return this.responseHandler.errorResponse(
        //     res,
        //     "First You need to set the company size"
        //   );
        // }

        let option: any = { new: true };
        console.log("---------updatedto------", updateCompanyDto);
        const updatedCompany = await this.companyModel.findByIdAndUpdate(user.companyId, updatedDto, option);
      } else {
        if (updatedDto.logo) {
          return this.responseHandler.errorResponse(res, "First, you need to create your company");
        } else if (!updatedDto.name || !updatedDto.contactName || !updatedDto.email || !updatedDto.countryCode || !updatedDto.countryShortName || !updatedDto.phone || !updatedDto.address) {
          return this.responseHandler.errorResponse(res, "First, you need to create your company");
        }

        console.log("---------updatedDto------", updatedDto);
        const createdCompany = await this.companyModel.create(updatedDto);
        console.log("---------createdCompany------", createdCompany);
        const user = await this.userModel.findByIdAndUpdate(userId, { companyId: createdCompany._id }, { new: true });
      }

      // console.log("---------updatedCompany------", updatedCompany);

      // if (!updatedCompany) {
      //   return this.responseHandler.errorResponse(
      //     res,
      //     "Failed to update company information"
      //   );
      // }

      const step = await this.commonService.checkStep(userId);
      return this.responseHandler.successResponseWithData(res, "Company updated successfully", { step: step.step });
    } catch (error) {
      this.logger.error("Error while updating company", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async nonDisclosure(res: Response, userId: string) {
    try {
      const guards = await this.userModel.aggregate([
        {
          $lookup: {
            from: "companyguards",
            localField: "companyId",
            foreignField: "companyId",
            as: "guards",
          },
        },
        { $unwind: "$guards" },
        {
          $lookup: {
            from: "users",
            localField: "guards.userId",
            foreignField: "_id",
            as: "guardDetails",
          },
        },
        { $unwind: "$guardDetails" },

        {
          $match: { _id: new mongoose.Types.ObjectId(userId) },
        },

        {
          $addFields: {
            serviceId: {
              $arrayElemAt: ["$guardDetails.services", 0],
            },
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyDetails",
          },
        },
        { $unwind: "$companyDetails" },
        {
          $project: {
            _id: "$guardDetails._id",
            firstName: "$guardDetails.firstName",
            lastName: "$guardDetails.lastName",
            email: "$guardDetails.email",
            userType: "$guardDetails.userType",
            // serviceId: {
            //   $arrayElemAt: ["$guardDetails.services", 0],
            // },
            // dateOfBirth: "$guardDetails.dateOfBirth",
            companyId: "$companyId",
            companyName: "$companyDetails.name",
            // serviceName: {
            //   $arrayElemAt: ["$result.name", 0],
            // },
          },
        },
      ]);

      console.log("----guards-----", guards);

      // Generate tokens and links in parallel
      const promises = guards.map(async (guard) => {
        const email = guard?.email;
        const tokenData = {
          userId: guard?._id,
          firstName: guard?.firstName,
          lastName: guard?.lastName,
          email: guard?.email,
          userType: guard?.userType,
          companyId: guard?.companyId,
          companyName: guard?.companyName,
        };

        console.log("----tokenData-----", tokenData);
        const link = await this.branchService.generateDeepLink(tokenData);

        const subject = "Your Invitation Link";
        const html = `<p>Your deep link is: <strong><a href="${link}">${link}</a></strong></p>`;

        return this.mailService.sendEmail(email, subject, html);
      });

      // Wait for all emails to be sent
      await Promise.all(promises);

      const updateDisclosure = await this.userModel.findByIdAndUpdate(userId, { acceptedNonDisclosure: true }, { new: true });
      const step = await this.commonService.checkStep(userId);
      return this.responseHandler.successResponseWithData(res, "Email sent to all saved guards to complete signup", { step: step.step });
    } catch (error) {
      this.logger.error("Error while generating a link and setting acceptedNonDisclosure to true", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async saveAllGuards(res: Response, userId: string) {
    try {
      const step = await this.commonService.checkStep(userId);
      return this.responseHandler.successResponseWithData(res, "Guard added successfully", { step: step.step });
    } catch (error) {
      this.logger.error("Error while clicking on next, after guard saving", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async saveJobLocationAndJobType(res: Response, userId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          step: 9,
        },
        { new: true }
      );

      return this.responseHandler.successResponseWithData(res, "Job location and job type saved successfully", { step: user.step });
    } catch (error) {
      this.logger.error("Error while saving job location and job type", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  // async setGuardAndSecuritySize(
  //   res: Response,
  //   userId: string,
  //   setGuardAndSecuritySizeDto: SetGuardAndSecuritySizeDto
  // ) {
  //   try {
  //     const { totalGuard, totalSecurity } = setGuardAndSecuritySizeDto;
  //     const user = await this.userModel.findByIdAndUpdate(
  //       userId,
  //       {
  //         totalGuard,
  //         totalSecurity,
  //       },
  //       { new: true }
  //     );
  //     if (!user) {
  //       return this.responseHandler.errorResponse(
  //         res,
  //         "Failed to update guard and security size"
  //       );
  //     }

  //     const step = await this.commonService.checkStep(userId);
  //     return this.responseHandler.successResponseWithData(
  //       res,
  //       "client's guard and security size saved successfully",
  //       { step: step.step }
  //     );
  //   } catch (error) {
  //     this.logger.error(error);
  //     return this.responseHandler.catchErrorResponse(res);
  //   }
  // }

  async setProfilePhoto(res: Response, userId: string, setProfilePhoto: SetProfilePhoto) {
    try {
      const { profilePhoto } = setProfilePhoto;
      console.log("---profilepic---", profilePhoto);
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          profilePhoto,
        },
        { new: true }
      );
      console.log("---user---", user);
      if (!user) {
        return this.responseHandler.errorResponse(res, "Failed to update profile picture");
      }

      const step = await this.commonService.checkStep(userId);
      return this.responseHandler.successResponseWithData(res, "Profile picture updated successfully", { step: step.step });
    } catch (error) {
      this.logger.error(error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async test(res: Response, userId: string) {
    try {
      const tokenData = {
        userId: "67e3d13f20fdded2d3359782",
        firstName: "Rahul",
        lastName: "Doe",
        email: "rahul@yopmail.com",
        userType: "guard",
        companyId: "67e3d13f20fdded2d3359782",
        companyName: "Sunfocus Sol Test api",
      };
      const link = await this.branchService.generateDeepLink(tokenData);

      return this.responseHandler.successResponseWithData(res, "Email sent to all saved guards to complete signup", link);
    } catch (error) {
      this.logger.error("Error while generating a link", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }
}
