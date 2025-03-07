import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { JwtService } from 'src/helpers/jwt.service';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided.');
    }

    try {
      const payload = await this.jwtService.verify(token);
      // console.debug(payload);
      // Check if payload contains the required fields
      if (!payload) {
        throw new ForbiddenException('Invalid token payload.');
      }

      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new ForbiddenException('User not found.');
      }

      request.user = payload;
      return true;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Invalid or expired token.');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
