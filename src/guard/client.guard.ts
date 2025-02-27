import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { userTypeEnum } from '../helpers/constants';

@Injectable()
export class ClientGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      throw new ForbiddenException('Unauthorized access.');
    }

    if (request.user.userType !== userTypeEnum.CLIENT) {
      throw new ForbiddenException('Access restricted to clients only.');
    }

    return true;
  }
}
