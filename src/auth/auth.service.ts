import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { ResponseHandler } from '../helpers/responseHandler';
import { Response } from 'express';
import { JwtService } from 'src/helpers/jwt.service';
import { HashService } from 'src/helpers/hash.service';
import { SendOtpDto } from './dto/send-otp.dto';
import {
  EMAIL_OTP_MODEL,
  EmailOtpDocument,
} from 'src/schemas/email-otp.schema';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(EMAIL_OTP_MODEL)
    private readonly emailOtpModel: Model<EmailOtpDocument>,
    private readonly responseHandler: ResponseHandler,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}
  async sendOtp(res: Response, sendOtpDto: SendOtpDto) {
    try {
      const { email } = sendOtpDto;

      const user = await this.userModel.findOne({ email });
      if (user) {
        return this.responseHandler.errorResponse(res, 'User already exists');
      }

      // generate otp further
      const otp = 1234;

      const storedOtp = await this.emailOtpModel.findOneAndUpdate(
        { email },
        { email, otp },
        { new: true, upsert: true },
      );
      return this.responseHandler.successResponseWithData(
        res,
        { email, otp },
        'OTP sent successfully',
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async signUp(res: Response, signUpDto: SignUpDto) {
    try {
      let { email, firstName, lastName, password, otp } = signUpDto;

      const isOtpCorrect = await this.emailOtpModel.findOne({ email, otp });
      if (!isOtpCorrect) {
        return this.responseHandler.errorResponse(res, 'Invalid OTP');
      }

      const isEmailExist = await this.userModel.findOne({ email });
      if (isEmailExist) {
        return this.responseHandler.errorResponse(res, 'Email already exist');
      }

      password = await this.hashService.hash(password);

      const createdUser = await this.userModel.create({
        email,
        firstName,
        lastName,
        password,
      });

      const token = await this.jwtService.sign({ sub: createdUser.id });
      const responseData = {
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        step: createdUser.step,
        isProfileSetup: createdUser.isProfileSetup,
      };
      return this.responseHandler.successResponseWithDataAndToken(
        res,
        responseData,
        token,
        'User created successfully',
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  async signIn(res: Response, signInDto: SignInDto) {
    try {
      let { email, password } = signInDto;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return this.responseHandler.errorResponse(res, 'Email not found');
      }
      const isPasswordCorrect = await this.hashService.compare(
        password,
        user.password,
      );
      if (!isPasswordCorrect) {
        return this.responseHandler.errorResponse(res, 'Invalid password');
      }
      const token = await this.jwtService.sign({ sub: user.id });
      const responseData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified : user.isVerified,
        step: user.step,
        isProfileSetup: user.isProfileSetup,
      };

      return this.responseHandler.successResponseWithDataAndToken(
        res,
        responseData,
        token,
        'User login successfully',
      );
    } catch (error) {
      console.error(error.message);
      return this.responseHandler.catchErrorResponse(res);
    }
  }
}
