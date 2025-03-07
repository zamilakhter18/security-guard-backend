import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateCompanyDto } from './dto/create-company.dto';
import { COMPANY_MODEL, CompanyDocument } from 'src/schemas/company.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { userTypeEnum } from 'src/helpers/constants';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class OnboardingService {
    constructor(
        @InjectModel(COMPANY_MODEL) private readonly companyModel: Model<CompanyDocument>,
        @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
        private readonly responseHandler: ResponseHandler,
    ){}
    async companyInformation(req,res : Response,createCompanyDto : CreateCompanyDto){
        const userId = req?.user?.sub;
        const {email} = createCompanyDto;

        const user = await this.userModel.findById(userId);
        if(user.userType !== userTypeEnum.COMPANY){
        }

        console.log('-----userId--->>>',userId)
        console.log('-----email--->>>',email)
        console.log('-----createCompanyDto--->>>',createCompanyDto)







        return this.responseHandler.successResponseWithData(res,'s','')
    }
}
