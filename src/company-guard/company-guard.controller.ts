import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, Put, Query } from "@nestjs/common";
import { CompanyGuardService } from "./company-guard.service";
import { Request, request, Response } from "express";
import { AuthGuard } from "src/guard/auth.guard";
import { GetUserID } from "src/decorators/get-user-id.decorator";
import { CompanyGuard } from "src/guard/company.guard";
import { CreateGuardsDto } from "./dto/create-guard.dto";
import { CompanyGuardTag, CreateAGuardSwagger, DeleteOneGuardSwagger, GetAllGuardsofACompanySwagger, UpdateOneGuardSwagger } from "./company-guard.swagger";
import { GetCompanyID } from "src/decorators/get-company-id.decorator";

@CompanyGuardTag()
@Controller({ version: "1", path: "guard" })
export class CompanyGuardController {
  constructor(private readonly companyGuardService: CompanyGuardService) {}

  @UseGuards(AuthGuard, CompanyGuard)
  @Post("create-a-guard")
  @CreateAGuardSwagger()
  async createGuard(@GetCompanyID() companyId: string, @Res() res: Response, @Body() createGuardsDto: CreateGuardsDto) {
    return await this.companyGuardService.createOneGuard(companyId, res, createGuardsDto);
  }

  @GetAllGuardsofACompanySwagger()
  @UseGuards(AuthGuard)
  @Get("get-all-guards")
  async allGuardsofACompany(@Res() res: Response, @GetUserID() userId: string) {
    return await this.companyGuardService.getAllGuardsofACompany(res, userId);
  }

  @UpdateOneGuardSwagger()
  @UseGuards(AuthGuard)
  @Put("update-a-guard/:id")
  async updateOneGuard(@Res() res: Response, @Param("id") id: string, @Body() createGuardsDto: CreateGuardsDto) {
    return await this.companyGuardService.updateOneGuard(res, createGuardsDto, id);
  }

  @DeleteOneGuardSwagger()
  @UseGuards(AuthGuard)
  @Delete("delete-a-guard/:id")
  async remove(@Res() res: Response, @Param("id") id: string) {
    return await this.companyGuardService.deleteOneGuard(res, id);
  }
}
