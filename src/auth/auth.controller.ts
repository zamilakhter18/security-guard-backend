import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';

@Controller({ version : '1', path : 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    return this.authService.create(res, signUpDto);
  }

}