import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL, UserSchema } from "src/schemas/user.schema";
import { ResponseHandler } from "src/helpers/response-handler";
import { JwtService } from "src/helpers/jwt.service";
import { HashService } from "src/helpers/hash.service";
import { OTP_MODEL, OtpSchema } from "src/schemas/otp.schema";
import { CommonService } from "src/helpers/common.service";
import { COMPANY_MODEL, CompanySchema } from "src/schemas/company.schema";
import { COMPANY_GUARD_MODEL, CompanyGuardSchema } from "src/schemas/guard.schema";
import { BANK_INFORMATION_MODEL, BankInformationSchema } from "src/schemas/bank-information.schema";
import { MailService } from "src/helpers/mail.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: COMPANY_MODEL, schema: CompanySchema },
      { name: COMPANY_GUARD_MODEL, schema: CompanyGuardSchema },
      { name: BANK_INFORMATION_MODEL, schema: BankInformationSchema },
      { name: OTP_MODEL, schema: OtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseHandler, JwtService, HashService, CommonService, MailService],
  exports: [MongooseModule],
})
export class AuthModule {}
