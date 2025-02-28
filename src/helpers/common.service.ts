import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonService {
  constructor(private configService: ConfigService) {}

  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

