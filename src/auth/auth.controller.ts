import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  create(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    return this.authService.create(res, signUpDto);
  }
}
