import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from 'src/schemas/user.schema';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { JwtService } from 'src/helpers/jwt.service';
import { HashService } from 'src/helpers/hash.service';
import { EMAIL_OTP_MODEL, EmailOtpSchema } from 'src/schemas/email-otp.schema';
import { CommonService } from 'src/helpers/common.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: EMAIL_OTP_MODEL, schema: EmailOtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseHandler,JwtService,HashService,CommonService],
  exports : [MongooseModule]
})
export class AuthModule {}
