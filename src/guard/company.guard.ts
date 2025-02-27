import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { userTypeEnum } from '../helpers/constants';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new ForbiddenException('Unauthorized access.');
    }

    if (request.user.userType !== userTypeEnum.COMPANY) {
      throw new ForbiddenException('Access restricted to Company only.');
    }

    return true;
  }
}
