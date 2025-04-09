import { Controller, Post, Body, Res, UseGuards, Req, Get, Patch, Put, Param, UseInterceptors, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guard/auth.guard";
import { Request, Response } from "express";
import { ServiceDto, UserTypeDto } from "./dto/user.dto";
import { GetUserID } from "src/decorators/get-user-id.decorator";
import { ResetPasswordSwagger, GetServicesSwagger, SetServicesSwagger, SetUserTypeSwagger, UserTag, forgetPasswordSwagger, DeleteUserSwagger, updateUserSwagger, GetBankAccountSwagger, getUserSwagger, UpdateBankAccountSwagger } from "./user.swagger";
import { UpdateBankAccountDto, UpdateUserDto } from "./dto/update-user.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { GetFullUser } from "src/decorators/get-full-user.decorator";
import mongoose from "mongoose";
import { UserDocument } from "src/schemas/user.schema";

@UserTag()
@Controller({ version: "1", path: "user" })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Patch("set-user-type")
  @SetUserTypeSwagger()
  async setUserType(@Res() res: Response, @Body() userTypeDto: UserTypeDto, @GetUserID() userId: string) {
    return await this.userService.setUserType(res, userTypeDto, userId);
  }

  @UseGuards(AuthGuard)
  @Patch("set-service")
  @SetServicesSwagger()
  async setServices(@GetUserID() userId: string, @Res() res: Response, @Body() serviceDto: ServiceDto) {
    return await this.userService.setUserService(userId, res, serviceDto);
  }

  @UseGuards(AuthGuard)
  @Get("get-selected-service")
  @GetServicesSwagger()
  async getServices(@GetUserID() userId: string, @Res() res: Response) {
    return await this.userService.getUserService(userId, res);
  }

  @Post("forget-password")
  @forgetPasswordSwagger()
  async forgetPassword(@Res() res: Response, @Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.userService.forgetPassword(res, forgetPasswordDto);
  }

  @ResetPasswordSwagger()
  @Post("reset-password")
  async resetPassword(@Res() res: Response, @Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(res, resetPasswordDto);
  }

  @Get("get-user")
  @UseGuards(AuthGuard)
  @getUserSwagger()
  async getUser(@GetFullUser() user: UserDocument, @Res() res: Response) {
    return await this.userService.getUser(res, user);
  }

  @updateUserSwagger()
  @UseGuards(AuthGuard)
  @Put("update-user")
  async updateGuard(@Res() res: Response, @Body() updateUserDto: UpdateUserDto, @GetUserID() userId: string) {
    return await this.userService.updateUser(res, userId, updateUserDto);
  }

  @DeleteUserSwagger()
  @UseGuards(AuthGuard)
  @Delete("delete-user")
  async deleteUser(@Res() res: Response, @GetFullUser() user: UserDocument, @GetUserID() userId: mongoose.Types.ObjectId) {
    return await this.userService.deleteUser(res, user);
  }

  @Get("get-bank-account")
  @UseGuards(AuthGuard)
  @GetBankAccountSwagger()
  async getBankAccount(@GetUserID() userId: string, @Res() res: Response) {
    return await this.userService.getBankAccount(userId, res);
  }

  @Put("update-bank-account")
  @UseGuards(AuthGuard)
  @UpdateBankAccountSwagger()
  async updateBankAccount(@GetUserID() userId: string, @Res() res: Response, @Body() updateBankAccountDto: UpdateBankAccountDto){
    return await this.userService.updateBankAccount( res, userId, updateBankAccountDto)
  }
}
