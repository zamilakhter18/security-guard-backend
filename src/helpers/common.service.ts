import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, USER_MODEL, UserDocument } from "src/schemas/user.schema";
import { userTypeEnum } from "./constants";
import { COMPANY_MODEL, CompanyDocument } from "src/schemas/company.schema";
import { COMPANY_GUARD_MODEL, CompanyGuardDocument } from "src/schemas/guard.schema";
import { ResponseHandler } from "./response-handler";
import { BANK_INFORMATION_MODEL, BankInformationDocument } from "src/schemas/bank-information.schema";

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    @InjectModel(BANK_INFORMATION_MODEL) private readonly bankInformationModel: Model<BankInformationDocument>,
    @InjectModel(COMPANY_MODEL) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(COMPANY_GUARD_MODEL) private readonly companyGuardModel: Model<CompanyGuardDocument>
  ) {}

  public generateOtp() {
    let digits = "123456789";
    let otp = "";
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * len)];
    }
    return otp;
  }

  public async checkStep(userId: string) {
    const user = await this.userModel.findById(userId);
    console.log("----user---", user);
    if (!user) {
      throw new Error("User not found");
    }
    const company = user.companyId ? await this.companyModel.findById(user.companyId) : null;
    const companyGuard = company ? await this.companyGuardModel.findOne({ companyId: company._id }) : null;

    console.log("company--------", company);

    const getBankInformation = await this.bankInformationModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    console.log("getBankInformation--------", getBankInformation);

    let step = user.step;
    switch (user.userType) {
      case userTypeEnum.COMPANY:
        console.log("-----company---------");
        if (user.userType === null || user.userType === undefined) {
          step = 1;
        } else if (user.services === null || user.services.length === 0) {
          step = 2;
        } else if (user.companyId === null || user.companyId === undefined) {
          step = 3;
        } else if (!company || company.companyMaxSize == null) {
          step = 4;
        } else if (!companyGuard || !companyGuard.userId) {
          step = 5;
        } else if (!company.companyLogo) {
          step = 6;
        } else if (!getBankInformation) {
          step = 7;
        } else if (!user.document) {
          step = 8;
        } else if (user.acceptedNonDisclosure === false) {
          step = 10;
        } else {
          step = 11;
        }
        break;
      case userTypeEnum.CLIENT:
        console.log("-----client---------");
        if (user.userType === null || user.userType === undefined) {
          step = 1;
        } else if (user.dateOfBirth === null || user.dateOfBirth === undefined) {
          step = 2;
        } else if (user.services === null || user.services.length === 0) {
          step = 3;
        } else if (!user.profilePhoto || !user.profilePhoto === null) {
          step = 4;
        } else {
          step = 5;
        }
        break;
      case userTypeEnum.GUARD:
        console.log("-----Guard---------");
        if (user.isEmailVerified === false) {
          step = 1;
        } else if (user.profilePhoto === null || user.profilePhoto === undefined) {
          step = 2;
        } else if (user.document?.idCardFront === null || user.document?.idCardFront === undefined || user.document?.idCardBack === null || user.document?.idCardBack === undefined) {
          step = 3;
        } else if (!getBankInformation) {
          step = 4;
        } else {
          step = 5;
        }
        break;
    }
    console.log("step----------", step);

    if (user.step != step) {
      const condition: Record<string, any> = {};
      console.log("----condition------", condition);
      if (user.userType === userTypeEnum.COMPANY && step === 11) {
        condition["step"] = 11;
        condition["isProfileSetup"] = true; // Corrected syntax
      } else if (user.userType === userTypeEnum.CLIENT && step === 5) {
        condition["step"] = 5;
        condition["isProfileSetup"] = true; // Corrected syntax
      } else if (user.userType === userTypeEnum.GUARD && step === 5) {
        condition["step"] = 5;
        condition["isProfileSetup"] = true; // Corrected syntax
      } else {
        condition["step"] = step;
        condition["isProfileSetup"] = false;
      }
      console.log("----condition------", condition);
      await this.userModel.findByIdAndUpdate(userId, condition);
      user.step = step;
    }
    return user;
  }

  public async setLocation(updateCompanyDto: any) {
    if (updateCompanyDto.address) {
      if (updateCompanyDto.address.longitude && updateCompanyDto.address.latitude) {
        const long = parseFloat(updateCompanyDto.address.longitude);
        const lat = parseFloat(updateCompanyDto.address.latitude);
        if (isNaN(long) || isNaN(lat)) {
          throw new Error("Invalid longitude or latitude");
        }
        updateCompanyDto["location"] = {
          type: "Point",
          coordinates: [long, lat],
        };
        return updateCompanyDto;
      }
      return updateCompanyDto;
    }
    return updateCompanyDto;
  }
}
