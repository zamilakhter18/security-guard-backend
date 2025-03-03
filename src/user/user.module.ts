import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from 'src/helpers/hash.service';

@Module({
  imports : [HashService],
  controllers: [UserController],
  providers: [UserService, HashService],
})
export class UserModule {}
