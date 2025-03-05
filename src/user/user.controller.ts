import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';
import { UserTypeDto } from './dto/user.dto';
import {
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

  @Post('set-user-type')
  @ApiOperation({ summary: 'Set user type for an authenticated user' })
  @ApiResponse({ status: 200, description: 'UserType set successfully', schema: {
    example: { statusCode: 200, message: 'UserType set successfully' }
  }})
  @ApiResponse({ status: 400, description: 'Bad request (validation or other errors)', schema: {
    example: { statusCode: 400, message: 'Invalid user type' }
  }})
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: {
    example: { statusCode: 401, message: 'Unauthorized user' }
  }})
  @ApiResponse({ status: 404, description: 'User not found', schema: {
    example: { statusCode: 400, message: 'User not found' }
  }})
  @ApiResponse({ status: 500, description: 'Internal server error', schema: {
    example: { statusCode: 500, error: 'Internal Server Error' }
  }})
  setUserType(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userTypeDto: UserTypeDto,
  ) {
    return this.userService.setUserType(req, res, userTypeDto);
  }
}
