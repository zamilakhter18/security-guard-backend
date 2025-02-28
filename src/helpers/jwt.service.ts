import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

Global();
Injectable();
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  public async sign(payload: object): Promise<string> {
    return jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '1d',
    });
  }

  public async verify(token: string): Promise<any> {
    return jwt.verify(token, this.configService.get('JWT_SECRET'));
  }
}
