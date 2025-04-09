import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const GetCompanyID = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const companyId = request.companyId;
  console.log("----companyId-----in --- GetCompanyID----", companyId);
  if (!companyId) {
    throw new UnauthorizedException("User not found");
  }
  return companyId;
});
