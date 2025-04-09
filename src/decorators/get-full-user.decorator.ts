import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const GetFullUser = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) {
    throw new UnauthorizedException("User not found");
  }
  return user;
});
