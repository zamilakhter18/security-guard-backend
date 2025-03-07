import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';
import { ServiceDto, UserTypeDto } from './dto/user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user-type')
  @ApiOperation({ summary: 'Set user type for an authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'UserType set successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'UserType set successfully',
        data: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'company / individual / client',
          step: 1,
          isProfileSetup: false,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation or other errors)',
    content: {
      'application/json': {
        examples: {
          UserUpdateFailed: {
            value: { statusCode: 400, message: 'User update failed' },
          },
          UserNotFound: {
            value: { statusCode: 400, message: 'User not found' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: { statusCode: 401, message: 'Unauthorized user' },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: { statusCode: 500, error: 'Internal Server Error' },
    },
  })
  async setUserType(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userTypeDto: UserTypeDto,
  ) {
    return await this.userService.setUserType(req, res, userTypeDto);
  }

  @Post('service')
  async setServices(
    @Req() req: Request,
    @Res() res: Response,
    @Body() serviceDto: ServiceDto,
  ) {
    return await this.userService.setUserService(req, res, serviceDto);
  }
}
