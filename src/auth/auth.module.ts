import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from 'src/schemas/user.schema';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { JwtService } from 'src/helpers/jwt.service';
import { HashService } from 'src/helpers/hash.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, ResponseHandler,JwtService,HashService],
  exports : [MongooseModule]
})
export class AuthModule {}
