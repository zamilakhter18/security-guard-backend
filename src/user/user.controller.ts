import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';
import { UserTypeDto } from './dto/user.dto';

@UseGuards(AuthGuard)
@Controller({ version : '1', path : 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('set-user-type')
  setUserType(@Req() req: Request, @Res() res: Response, @Body() userTypeDto: UserTypeDto) {
    return this.userService.setUserType(req, res, userTypeDto);
  }

}