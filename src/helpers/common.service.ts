import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonService {
  constructor(private configService: ConfigService) {}

  public generateOtp() {
    let digits = '123456789';
    let OTP = '';
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  }
}
