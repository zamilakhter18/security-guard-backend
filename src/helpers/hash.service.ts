import { Global, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


Global();
Injectable();
export class HashService {
  constructor() {}

  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
