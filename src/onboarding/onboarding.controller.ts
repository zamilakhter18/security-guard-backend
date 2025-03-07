import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { Request, Response } from 'express';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('onboarding')
@ApiBearerAuth()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('create-company')
  async companyInformation(@Req() req:Request, @Res() res: Response,@Body() createCompanyDto : CreateCompanyDto){
    return await this.onboardingService.companyInformation(req,res,createCompanyDto);
  }
}
