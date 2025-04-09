import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthGuard } from "src/guard/auth.guard";
import { JwtService } from "src/helpers/jwt.service";
import { ResponseHandler } from "src/helpers/response-handler";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL, UserSchema } from "src/schemas/user.schema";
import { SERVICE_MODEL, ServiceSchema } from "src/schemas/service.schema";
import { CommonService } from "src/helpers/common.service";
import { COMPANY_MODEL, CompanySchema } from "src/schemas/company.schema";
import { COMPANY_GUARD_MODEL, CompanyGuardSchema } from "src/schemas/guard.schema";
import { BANK_INFORMATION_MODEL, BankInformationSchema } from "src/schemas/bank-information.schema";
import { MailService } from "src/helpers/mail.service";
import { OTP_MODEL, OtpSchema } from "src/schemas/otp.schema";
import { HashService } from "src/helpers/hash.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: COMPANY_MODEL, schema: CompanySchema },
      { name: COMPANY_GUARD_MODEL, schema: CompanyGuardSchema },
      { name: BANK_INFORMATION_MODEL, schema: BankInformationSchema },
      { name: SERVICE_MODEL, schema: ServiceSchema },
      { name: OTP_MODEL, schema: OtpSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard, JwtService, ResponseHandler, CommonService, MailService, HashService],
})
export class UserModule {}
