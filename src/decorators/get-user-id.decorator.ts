import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const GetUserID = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = request.user._id;
  if (!userId) {
    throw new UnauthorizedException("User not found");
  }
  return userId;
});
