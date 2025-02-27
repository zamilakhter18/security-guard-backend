import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided.');
    }

    try {
      const payload = this.jwtService.verify(token);

      // Check if payload contains the required fields
      if (!payload || !payload.userType || !payload.id) {
        throw new ForbiddenException('Invalid token payload.');
      }

      //! check if the user exists in the database
      // const user = await this.userService.findById(payload.id);
      // if (!user) {
      //   throw new ForbiddenException('User not found.');
      // }

      request.user = payload; // Attach user data to request
      return true;
    } catch (error) {
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
