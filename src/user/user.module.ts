import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtService } from 'src/helpers/jwt.service';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService,AuthGuard,JwtService,ResponseHandler],
})
export class UserModule {}
