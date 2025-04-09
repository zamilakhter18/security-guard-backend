import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model } from "mongoose";
import { JwtService } from "src/helpers/jwt.service";
import { USER_MODEL, UserDocument } from "src/schemas/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("No authentication token provided.");
    }

    try {
      const payload = await this.jwtService.verify(token);
      if (!payload) {
        throw new ForbiddenException("Invalid token payload.");
      }

      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new ForbiddenException("User not found.");
      }

      request.companyId = user?.companyId;
      request.user = user;
      return true;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException("Invalid or expired token.");
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    // console.log('----authHeader-----',authHeader)
    if (!authHeader) {
      return null;
    }
    return authHeader.split(" ")[1];
  }
}
