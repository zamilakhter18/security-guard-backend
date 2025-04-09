import { Injectable, Logger } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";
import { InjectModel } from "@nestjs/mongoose";
import { USER_MODEL, UserDocument } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { ResponseHandler } from "../helpers/response-handler";
import { Response } from "express";
import { JwtService } from "src/helpers/jwt.service";
import { HashService } from "src/helpers/hash.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { OTP_MODEL, OtpDocument } from "src/schemas/otp.schema";
import { SignInDto } from "./dto/sign-in.dto";
import { CommonService } from "src/helpers/common.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { messages } from "src/helpers/message";
import { COMPANY_MODEL, CompanyDocument } from "src/schemas/company.schema";
import { MailService } from "src/helpers/mail.service";
import { SocialAuthDto } from "./dto/social-auth.dto";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import axios from "axios";
import { loinTypeEnum, userTypeEnum } from "src/helpers/constants";
import * as jwt from "jsonwebtoken";
import * as jwksClient from "jwks-rsa";
import mongoose from "mongoose";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client;
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(OTP_MODEL) private readonly otpModel: Model<OtpDocument>,
    @InjectModel(COMPANY_MODEL)
    private readonly companyModel: Model<CompanyDocument>,
    private readonly responseHandler: ResponseHandler,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly mailService: MailService,
    private readonly commonService: CommonService
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  async sendOtp(res: Response, sendOtpDto: SendOtpDto) {
    try {
      const { email } = sendOtpDto;

      this.logger.debug(`Attempting to send OTP to email: ${email}`);
      const user = await this.userModel.findOne({
        email,
        isEmailVerified: true,
      });
      if (user) {
        this.logger.warn(`User already exists with email: ${email}`);
        return this.responseHandler.errorResponse(res, messages.USER_ALREADY_EXISTS);
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
        return this.responseHandler.errorResponse(res, messages.FAILED_TO_SEND_OTP);
      }

      const subject = "Your OTP Code";
      const html = `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`;
      await this.mailService.sendEmail(email, subject, html);

      this.logger.debug(`Otp ${otp} successfully sent to email: ${email}`);
      return this.responseHandler.successResponse(res, messages.OTP_SENT_SUCCESSFULLY);
    } catch (error) {
      this.logger.error(`Error in sendOtp: ${error.message}`);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async verifyOtp(res: Response, verifyOtpDto: VerifyOtpDto) {
    try {
      const { email, otp } = verifyOtpDto;
      this.logger.debug(`Verifying Otp : ${otp} for email: ${email}`);

      const isEmailExist = await this.otpModel.findOne({ email });
      if (!isEmailExist) {
        return this.responseHandler.errorResponse(res, messages.EMAIL_NOT_FOUND);
      }

      const otpRecord = await this.otpModel.findOne({ email, otp }).sort({ createdAt: -1 });

      if (!otpRecord) {
        return this.responseHandler.errorResponse(res, messages.OTP_INCORRECT);
      }

      if (new Date() > otpRecord.otpExpiresAt) {
        return this.responseHandler.errorResponse(res, messages.OTP_EXPIRED);
      }

      // For forget password
      await this.otpModel.deleteMany({ email });
      const isUserExistsWithThisEmail = await this.userModel.findOne({ email });
      if (isUserExistsWithThisEmail) {
        const token = await this.jwtService.sign({ sub: isUserExistsWithThisEmail._id }, "15m");
        return this.responseHandler.successResponseWithToken(res, messages.OTP_VERIFIED, token);
      }
      this.logger.debug(`Otp : ${otp} successfully verified for email: ${email}`);
      return this.responseHandler.successResponse(res, messages.OTP_VERIFIED);
    } catch (error) {
      this.logger.error(`Error in verifyOtp: ${error.message}`);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async signUp(res: Response, signUpDto: SignUpDto) {
    try {
      let { email, firstName, lastName, password, countryCode, phone, userType, userId } = signUpDto;
      this.logger.debug(`Signing up user with email: ${email}`);

      // For guard signup screen
      if (userType === userTypeEnum.GUARD) {
        if (!userId) {
          return this.responseHandler.errorResponse(res, messages.USER_ID_REQUIRED);
        }
        const isUserExistWith = await this.userModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (!isUserExistWith) {
          return this.responseHandler.errorResponse(res, messages.USER_NOT_FOUND);
        }
        const isUserExist = await this.userModel.findOne({ email, isEmailVerified: true });
        if (isUserExist) {
          return this.responseHandler.errorResponse(res, messages.EMAIL_ALREADY_EXIST);
        }
        const updateGuard = await this.userModel.findByIdAndUpdate(
          userId,
          {
            email,
            firstName,
            lastName,
            password: await this.hashService.hash(password),
            countryCode,
            phone,
            isPhoneVerified: true,
            userType,
            isEmailVerified: true,
          },
          { new: true }
        );
        // Generate JWT token
        const token = await this.jwtService.sign({ sub: updateGuard.id });
        const step = await this.commonService.checkStep(updateGuard.id);
        const responseData = {
          id: updateGuard._id,
          firstName: updateGuard.firstName,
          lastName: updateGuard.lastName,
          countryCode: updateGuard.countryCode,
          phone: updateGuard.phone,
          userType: updateGuard.userType,
          step: step.step,
        };
        return this.responseHandler.successResponseWithDataAndToken(res, messages.GUARD_SIGN_UP_SUCCESS, responseData, token);
      }

      // for company and client sign up and update
      let user = await this.userModel.findOne({ email });
      if (user) {
        if (user.isEmailVerified && user.userType === userTypeEnum.GUARD) {
          return this.responseHandler.errorResponse(res, messages.EMAIL_ALREADY_EXIST);
        }

        // Update existing user
        const updateData: any = {
          firstName,
          lastName,
          isEmailVerified: true,
          isPhoneVerified: true,
          countryCode,
          phone,
        };
        if (password) {
          updateData.password = await this.hashService.hash(password);
        }

        const updatedUser = await this.userModel.findOneAndUpdate({ email }, updateData, {
          new: true,
        });

        if (!updatedUser) {
          return this.responseHandler.errorResponse(res, messages.USER_UPDATION_FAILED);
        }

        // Generate JWT token
        const token = await this.jwtService.sign({ sub: updatedUser.id });
        const step = await this.commonService.checkStep(updatedUser.id);

        const responseData = {
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          step: step.step,
          isProfileSetup: updatedUser.isProfileSetup,
        };

        this.logger.debug(`User updated successfully with email: ${email}`);
        return this.responseHandler.successResponseWithDataAndToken(res, messages.USER_UPDATION_SUCCESS, responseData, token);
      }

      password = await this.hashService.hash(password);
      const createdUser = await this.userModel.create({
        email,
        firstName,
        lastName,
        password,
        step: 1,
        isEmailVerified: true,
        isPhoneVerified: true
      });

      if (!createdUser) {
        return this.responseHandler.errorResponse(res, messages.USER_CREATION_FAILED);
      }

      const step = await this.commonService.checkStep(createdUser.id);
      const token = await this.jwtService.sign({ sub: createdUser.id });
      const responseData = {
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        step: step.step,
        isProfileSetup: createdUser.isProfileSetup,
      };

      this.logger.debug(`User created successfully with email: ${email}`);
      return this.responseHandler.successResponseWithDataAndToken(res, messages.USER_CREATION_SUCCESS, responseData, token);
    } catch (error) {
      this.logger.error("Error in signing up: ", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async signIn(res: Response, signInDto: SignInDto) {
    try {
      let { email, password } = signInDto;
      this.logger.debug(`User is signing in with email: ${email}`);
      const user = await this.userModel.findOne({
        email,
        isEmailVerified: true,
      });
      if (!user) {
        return this.responseHandler.errorResponse(res, messages.EMAIL_NOT_FOUND);
      }
      console.log("----user.password------", user.password);
      if (user.password) {
        const isPasswordCorrect = await this.hashService.compare(password, user.password);
        console.log("----isPasswordCorrect--", isPasswordCorrect);
        if (!isPasswordCorrect) {
          return this.responseHandler.errorResponse(res, messages.INCORRECT_PASSWORD);
        }
        const token = await this.jwtService.sign({ sub: user.id });

        // const company = await this.companyModel.findById(user.companyId);

        const company = user?.companyId ? await this.companyModel.findById(user.companyId) : null;

        const responseData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          step: user.step,
          services: user.services,
          isProfileSetup: user.isProfileSetup,
          userType: user.userType,
          // companyMinSize : company?.companyMinSize,
          companyMaxSize: company?.companyMaxSize,
        };

        this.logger.debug(`User signed in successfully with email: ${email}`);
        return this.responseHandler.successResponseWithDataAndToken(res, messages.LOGIN_SUCCESS, responseData, token);
      } else {
        return this.responseHandler.errorResponse(res, messages.PASSWORD_NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  // Fetch Apple's public key dynamically
  async getApplePublicKey(kid: string): Promise<string> {
    const url = "https://appleid.apple.com/auth/keys"; // Apple's public keys URL
    const response = await axios.get(url);
    const keys = response.data.keys;

    const key = keys.find((k: any) => k.kid === kid);
    if (!key) throw new Error("Apple public key not found");

    // Convert Apple key to PEM format
    return `-----BEGIN PUBLIC KEY-----\n${Buffer.from(key.n, "base64").toString("ascii")}\n-----END PUBLIC KEY-----`;
  }

  async socialAuth(res: Response, socialAuthDto: SocialAuthDto) {
    this.logger.debug("A user is trying to login with social auth");
    try {
      const { token, type } = socialAuthDto;
      let email: string, name: string, picture: string | undefined, socialId: string | undefined;

      if (type === loinTypeEnum.GOOGLE) {
        // Google Authentication
        let ticket: LoginTicket;
        try {
          ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          // console.log("--------ticket----", ticket);
        } catch (error) {
          if (error.message.includes("Token used too late")) {
            return this.responseHandler.errorResponse(res, "Google token has expired. Please re-login.");
          }
          return this.responseHandler.errorResponse(res, "Invalid Google token. Please try again.");
        }

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.sub) {
          return this.responseHandler.errorResponse(res, "Invalid Google token");
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (!payload.exp || currentTime > payload.exp) {
          return this.responseHandler.errorResponse(res, "Google token has expired. Please re-login.");
        }

        email = payload.email;
        name = payload.name;
        socialId = payload.sub; // Use 'sub' for Google ID (unique identifier)
        // picture = payload.picture;

        console.log("-----email---", email);
        console.log("-----name---", name);
        console.log("-----socialId---", socialId);
        console.log("-----payload---", payload);
      } else if (type === loinTypeEnum.FACEBOOK) {
        // Facebook Authentication
        const fbResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);

        if (!fbResponse.data || !fbResponse.data.email || !fbResponse.data.id) {
          return this.responseHandler.errorResponse(res, "Invalid Facebook token");
        }

        email = fbResponse.data.email;
        name = fbResponse.data.name;
        socialId = fbResponse.data.id; // Facebook unique ID
        // picture = fbResponse.data.picture?.data?.url;
      }
      // else if (type === loinTypeEnum.APPLE) {
      //   try {
      //     // Decode the token header to get the `kid`
      //     const decodedHeader: any = jwt.decode(token, { complete: true });
      //     if (!decodedHeader || !decodedHeader.header.kid) {
      //       return this.responseHandler.errorResponse(res, "Invalid Apple token");
      //     }

      //     // Get the correct public key dynamically
      //     const applePublicKey = await getApplePublicKey(decodedHeader.header.kid);

      //     // Verify Apple JWT
      //     const decodedToken: any = jwt.verify(token, applePublicKey, {
      //       algorithms: ["RS256"],
      //     });

      //     if (!decodedToken) {
      //       return this.responseHandler.errorResponse(res, "Invalid Apple token");
      //     }

      //     email = decodedToken.email || undefined;
      //     socialId = decodedToken.sub; // 'sub' is the unique identifier for Apple users

      //     if (!socialId) {
      //       return this.responseHandler.errorResponse(res, "Invalid Apple token");
      //     }

      //     this.logger.debug("Apple sign-in token decoded successfully");
      //   } catch (error) {
      //     this.logger.error("Error verifying Apple token:", error);
      //     return this.responseHandler.errorResponse(res, "Invalid Apple token");
      //   }

      // }
      else {
        return this.responseHandler.errorResponse(res, "Invalid social auth type");
      }

      // Check if the user exists in the database
      let user = await this.userModel.findOne({ email });

      if (!user) {
        const [firstName, ...lastNameParts] = name.split(" ");
        const lastName = lastNameParts.join(" ");
        // If user doesn't exist, create a new user (sign-up)
        user = new this.userModel({
          email,
          firstName,
          lastName,
          socialId,
          loginType: type,
          isEmailVerified: true,
          step: 1,
        });
        await user.save();
      } else {
        user.socialId = socialId;
        user.loginType = type;
        user.step = 1;
        await user.save();
      }

      // Generate JWT token for the user
      const jwtToken = await this.jwtService.sign({ sub: user.id });

      const responseData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        step: user.step,
        services: user.services,
        isProfileSetup: user.isProfileSetup,
        userType: user.userType,
        isVerified: user.isVerified,
      };

      this.logger.debug("User authenticated successfully with social auth");
      return this.responseHandler.successResponseWithDataAndToken(res, "User authenticated successfully", responseData, jwtToken);
    } catch (error) {
      this.logger.error("Error while social sign in:", error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }
}
