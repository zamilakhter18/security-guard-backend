import { Body, Controller, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { OnboardingService } from "./onboarding.service";
import { Request, Response } from "express";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { SetDateOfBirthDto } from "./dto/set-date-of-birth.dto";
import { SendPhoneOtpDto } from "./dto/send-phone-otp.dto";
import { CompanySizeDto } from "./dto/company-size.dto";
import { CompanyGuard } from "src/guard/company.guard";
import { Throttle } from "@nestjs/throttler";
import { CompanyLogoDto } from "./dto/company-logo.dto";
import { DocumentDto } from "./dto/document.dto";
import { CreateBankDto } from "./dto/create-bank.dto";
import { GetUserID } from "src/decorators/get-user-id.decorator";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyLogoSwagger, CompanySizeSwagger, createBankSwagger, CreateCompanySwagger, DateOfBirthSwagger, DocumentSwagger, OnboardingTag, ResendPhoneOtpSwagger, SendPhoneOtpSwagger, VerifyPhoneOtpSwagger } from "./onboarding.swagger";
import { VerifyNumberDto } from "./dto/verify-number.dto";
import { VerifyPhoneOtpDto } from "./dto/verify-phone-otp";
import { SetProfilePhoto } from "./dto/set-profile-picture.dto";
import { SetGuardAndSecuritySizeDto } from "./dto/set-guard-and-security-size.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ClientGuard } from "src/guard/client.guard";

@Controller({ version: "1", path: "onboarding" })
@OnboardingTag()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post("company/create")
  @UseGuards(AuthGuard, CompanyGuard)
  @CreateCompanySwagger()
  async createCompany(@GetUserID() userId: string, @Res() res: Response, @Body() createCompanyDto: CreateCompanyDto) {
    return await this.onboardingService.createCompany(res, userId, createCompanyDto);
  }

  @Post("verify-number")
  async verifyNumber(@Body() verifyNumberDto: VerifyNumberDto, @Res() res: Response) {
    return await this.onboardingService.verifyNumber(res, verifyNumberDto);
  }

  @Post("send-phone-otp")
  @SendPhoneOtpSwagger()
  async sendPhoneOtp(@Body() sendPhoneOtpDto: SendPhoneOtpDto, @Res() res: Response) {
    return await this.onboardingService.sendPhoneOtp(res, sendPhoneOtpDto);
  }

  @Post("resend-phone-otp")
  // @Throttle({ default: { limit: 1, ttl: 60000 } })
  @ResendPhoneOtpSwagger()
  async resendPhoneOtp(@Body() sendPhoneOtpDto: SendPhoneOtpDto, @Res() res: Response) {
    return await this.onboardingService.sendPhoneOtp(res, sendPhoneOtpDto);
  }

  @Post("verify-phone-otp")
  @VerifyPhoneOtpSwagger()
  async verifyPhoneOtp(@Body() verifyPhoneOtpDto: VerifyPhoneOtpDto, @Res() res: Response) {
    return this.onboardingService.verifyPhoneOtp(res, verifyPhoneOtpDto);
  }

  @UseGuards(AuthGuard)
  @Patch("company/company-size")
  @CompanySizeSwagger()
  async companySize(@GetUserID() userId: string, @Res() res: Response, @Body() companySizeDto: CompanySizeDto) {
    return await this.onboardingService.companySize(userId, res, companySizeDto);
  }

  @UseGuards(AuthGuard, CompanyGuard)
  @Patch("company/company-logo")
  @CompanyLogoSwagger()
  async companyLogo(@GetUserID() userId: string, @Res() res: Response, @Body() companyLogoDto: CompanyLogoDto) {
    return await this.onboardingService.companyLogo(userId, res, companyLogoDto);
  }

  @UseGuards(AuthGuard)
  @Post("bank")
  @createBankSwagger()
  async createBank(@Res() res: Response, @GetUserID() userId: string, @Body() createBankDto: CreateBankDto) {
    return await this.onboardingService.createBank(res, createBankDto, userId);
  }

  @UseGuards(AuthGuard)
  @Patch("document")
  @DocumentSwagger()
  async document(@Res() res: Response, @Body() documentDto: DocumentDto, @GetUserID() userId: string) {
    return await this.onboardingService.document(res, userId, documentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch("client/date-of-birth")
  @DateOfBirthSwagger()
  async dateOfBirth(@GetUserID() userId: string, @Res() res: Response, @Body() setDateOfBirthDto: SetDateOfBirthDto) {
    return await this.onboardingService.dateOfBirth(userId, res, setDateOfBirthDto);
  }

  @Patch("company/update")
  async updateCompany(
    @GetUserID() userId: string,
    @Res() res: Response,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    return await this.onboardingService.updateCompany(
      res,
      userId,
      updateCompanyDto
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch("company/non-disclosure")
  async nonDisclosure(@GetUserID() userId: string, @Res() res: Response) {
    return await this.onboardingService.nonDisclosure(res, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("company/save-all-guards")
  async saveAllGuards(@GetUserID() userId: string, @Res() res: Response) {
    return await this.onboardingService.saveAllGuards(res, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("company/job-location-and-type")
  async saveJobLocationAndJobType(@GetUserID() userId: string, @Res() res: Response) {
    return await this.onboardingService.saveJobLocationAndJobType(res, userId);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard,ClientGuard)
  // @Patch("client/guard-and-security-size")
  // async setGuardAndSecuritySize(
  //   @GetUserID() userId: string,
  //   @Res() res: Response,
  //   @Body() setGuardAndSecuritySizeDto: SetGuardAndSecuritySizeDto
  // ) {
  //   return await this.onboardingService.setGuardAndSecuritySize(
  //     res,
  //     userId,
  //     setGuardAndSecuritySizeDto
  //   );
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch("profile-photo")
  async setProfilePicture(@GetUserID() userId: string, @Res() res: Response, @Body() setProfilePhoto: SetProfilePhoto) {
    return await this.onboardingService.setProfilePhoto(res, userId, setProfilePhoto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("test-api")
  async test(@GetUserID() userId: string, @Res() res: Response) {
    return await this.onboardingService.test(res, userId);
  }
}
