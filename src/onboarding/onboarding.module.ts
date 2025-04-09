import { Module } from "@nestjs/common";
import { OnboardingService } from "./onboarding.service";
import { OnboardingController } from "./onboarding.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { COMPANY_MODEL, CompanySchema } from "src/schemas/company.schema";
import { ResponseHandler } from "src/helpers/response-handler";
import { AuthGuard } from "src/guard/auth.guard";
import { JwtService } from "src/helpers/jwt.service";
import { User, USER_MODEL } from "src/schemas/user.schema";
import { Otp, OTP_MODEL } from "../schemas/otp.schema";
import { CompanyGuard, COMPANY_GUARD_MODEL, CompanyGuardSchema } from "../schemas/guard.schema";
import { UploadService } from "src/helpers/aws.service";
import { CommonService } from "src/helpers/common.service";
import { BANK_INFORMATION_MODEL, BankInformationSchema } from "src/schemas/bank-information.schema";
import { TwilioService } from "src/helpers/twilio.service";
import { HttpModule } from "@nestjs/axios";
import { BranchService } from "src/helpers/branch.service";
import { MailService } from "src/helpers/mail.service";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: COMPANY_MODEL, schema: CompanySchema },
      { name: USER_MODEL, schema: User },
      { name: OTP_MODEL, schema: Otp },
      { name: COMPANY_GUARD_MODEL, schema: CompanyGuardSchema },
      { name: BANK_INFORMATION_MODEL, schema: BankInformationSchema },
    ]),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, ResponseHandler, AuthGuard, JwtService, UploadService, CommonService, TwilioService, BranchService, MailService],
})
export class OnboardingModule {}
