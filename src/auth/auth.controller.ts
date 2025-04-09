import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { Response } from "express";
import { SendOtpDto } from "./dto/send-otp.dto";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { SignInDto } from "./dto/sign-in.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { AuthTag, ResendOtpSwagger, SendOtpSwagger, SignInSwagger, SignUpSwagger, socialAuthSwagger, VerifyOtpSwagger } from "./auth.swagger";
import { SocialAuthDto } from "./dto/social-auth.dto";

@AuthTag()
@Controller({ version: "1", path: "auth" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Throttle({ default: { limit: 1, ttl: 60000 * 2 } })
  @Post("send-otp")
  @SendOtpSwagger()
  async sendOtp(@Body() sendOtpDto: SendOtpDto, @Res() res: Response) {
    return this.authService.sendOtp(res, sendOtpDto);
  }

  @Post("resend-otp")
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @ResendOtpSwagger()
  async resendOtp(@Body() sendOtpDto: SendOtpDto, @Res() res: Response) {
    return this.authService.sendOtp(res, sendOtpDto);
  }

  @Post("verify-otp")
  @VerifyOtpSwagger()
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res() res: Response) {
    return this.authService.verifyOtp(res, verifyOtpDto);
  }

  @Post("sign-up")
  @SignUpSwagger()
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    return await this.authService.signUp(res, signUpDto);
  }

  @Post("sign-in")
  @SignInSwagger()
  async signIn(@Res() res: Response, @Body() signInDto: SignInDto) {
    return await this.authService.signIn(res, signInDto);
  }

  @Post("social-auth")
  @socialAuthSwagger()
  async socialAuth(@Body() socialAuthDto: SocialAuthDto, @Res() res: Response) {
    return await this.authService.socialAuth(res, socialAuthDto);
  }
}
