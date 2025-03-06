import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Throttle({ default: { limit: 1, ttl: 60000 * 2 } })
  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to user email' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'OTP sent successfully',
        data: { email: 'test@example.com', otp: '1234' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
    schema: { example: { statusCode: 400, message: 'User already exists' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { statusCode: 500, error: 'Internal Server Error' },
    },
  })
  async sendOtp(@Body() sendOtpDto: SendOtpDto, @Res() res: Response) {
    return this.authService.sendOtp(res, sendOtpDto);
  }

  // @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to user email' })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'OTP resent successfully',
        data: { email: 'test@example.com', otp: '5678' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
    schema: { example: { statusCode: 400, message: 'User already exists' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { statusCode: 500, error: 'Internal Server Error' },
    },
  })
  async resendOtp(@Body() sendOtpDto: SendOtpDto, @Res() res: Response) {
    return this.authService.sendOtp(res, sendOtpDto);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    schema: {
      example: {
        statusCode: 200,
        data: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          step: 1,
          isProfileSetup: false,
        },
        token: 'your_jwt_token',
        message: 'User created successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          InvalidOTP: {
            value: { statusCode: 400, message: 'Invalid OTP' },
          },
          EmailExists: {
            value: { statusCode: 400, message: 'Email already exists' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { statusCode: 500, error: 'Internal Server Error' },
    },
  })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    return await this.authService.signUp(res, signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        statusCode: 200,
        data: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isVerified: true,
          step: 1,
          isProfileSetup: false,
        },
        token: 'your_jwt_token',
        message: 'User login successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          EmailNotFound: {
            value: { statusCode: 400, message: 'Email not found' },
          },
          InvalidPassword: {
            value: { statusCode: 400, message: 'Invalid password' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: { statusCode: 500, error: 'Internal Server Error' },
    },
  })
  async signIn(@Res() res: Response, @Body() signInDto: SignInDto) {
    return await this.authService.signIn(res, signInDto);
  }
}
