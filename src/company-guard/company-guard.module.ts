import { Module } from "@nestjs/common";
import { CompanyGuardService } from "./company-guard.service";
import { CompanyGuardController } from "./company-guard.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, USER_MODEL } from "src/schemas/user.schema";
import { JwtService } from "src/helpers/jwt.service";
import { COMPANY_GUARD_MODEL, CompanyGuardSchema } from "src/schemas/guard.schema";
import { ResponseHandler } from "src/helpers/response-handler";
import { BranchService } from "src/helpers/branch.service";
import { COMPANY_MODEL, CompanySchema } from "src/schemas/company.schema";
import { MailService } from "src/helpers/mail.service";
import { CommonService } from "src/helpers/common.service";
import { BANK_INFORMATION_MODEL, BankInformationSchema } from "src/schemas/bank-information.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: User },
      { name: COMPANY_GUARD_MODEL, schema: CompanyGuardSchema },
      { name: COMPANY_MODEL, schema: CompanySchema },
      { name: BANK_INFORMATION_MODEL, schema: BankInformationSchema },
    ]),
  ],
  controllers: [CompanyGuardController],
  providers: [CompanyGuardService, JwtService, ResponseHandler, BranchService, MailService, CommonService],
})
export class CompanyGuardModule {}
