import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { COMPANY_MODEL, CompanySchema } from 'src/schemas/company.schema';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtService } from 'src/helpers/jwt.service';
import { User, USER_MODEL } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COMPANY_MODEL, schema: CompanySchema },
      { name: USER_MODEL, schema: User },
    ]),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, ResponseHandler, AuthGuard, JwtService],
})
export class OnboardingModule {}
