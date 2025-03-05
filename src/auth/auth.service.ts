import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { ResponseHandler } from '../helpers/responseHandler';
import { Response } from 'express';
import { JwtService } from 'src/helpers/jwt.service';
import { HashService } from 'src/helpers/hash.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly responseHandler: ResponseHandler,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}  
  async create(res: Response, signUpDto: SignUpDto) {
    try {
      let { email, password } = signUpDto;

      // Check if email already exist
      const isEmailExist = await this.userModel.findOne({ email });
      if (isEmailExist) {
        return this.responseHandler.errorResponse(res, 'Email already exist');
      }

      // Hash password
      password = await this.hashService.hash(password);

      // Create user
      const createdUser = await this.userModel.create({
        email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        password,
      });

      // Creating token
      const token = await this.jwtService.sign({ sub: createdUser.id });

      // Filter only required fields
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
}
