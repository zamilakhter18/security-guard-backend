import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { userTypeEnum } from '../helpers/constants';

@Injectable()
export class IndividualGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new ForbiddenException('Unauthorized access.');
    }

    if (request.user.userType !== userTypeEnum.INDIVIDUAL) {
      throw new ForbiddenException('Access restricted to Individual only.');
    }

    return true;
  }
}
