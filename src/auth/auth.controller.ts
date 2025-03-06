import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Throttle({ default: { limit: 1, ttl: 60000 * 2 } })
  @ApiOperation({ summary: 'Send OTP on email' })
  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto, @Res() res: Response) {
    return this.authService.sendOtp(res, sendOtpDto);
  }

  // @Throttle({ default: { limit: 1, ttl: 60000 } })
  @ApiOperation({ summary: 'Resend OTP on email' })
  @Post('resend-otp')
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
        },
        token: 'your_jwt_token',
        message: 'User created successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists',
    schema: {
      example: { statusCode: 400, message: 'Email already exist' },
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
  async signIn(@Res() res: Response, @Body() signInDto: SignInDto) {
    return await this.authService.signIn(res, signInDto);
  }
}
