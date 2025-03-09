import { Body, Controller, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { Request, Response } from 'express';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SetDateOfBirthDto } from './dto/set-date-of-birth.dto';

@UseGuards(AuthGuard)
@Controller('onboarding')
@ApiBearerAuth()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('company')
  async companyInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return await this.onboardingService.companyInformation(
      req,
      res,
      createCompanyDto,
    );
  }

  @Post('send-phone-otp')
  async sendPhoneOtp(@Req() req: Request, @Res() res: Response) {
    return await this.onboardingService.sendPhoneOtp(req, res);
  }


  @Patch('date-of-birth')
  async dateOfBirth(
    @Req() req: Request,
    @Res() res: Response,
    @Body() setDateOfBirthDto: SetDateOfBirthDto,
  ) {
    return await this.onboardingService.dateOfBirth(req, res, setDateOfBirthDto);
  }
}
