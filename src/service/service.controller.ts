import { Controller, Get, Res } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { Response } from "express";
import { ListAllServicesSwagger, ServiceTag } from "./service.swagger";

@ServiceTag()
@Controller({ version: "1", path: "service" })
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get("get-all-services")
  @ListAllServicesSwagger()
  async listAllServices(@Res() res: Response) {
    return await this.serviceService.listAllServices(res);
  }
}
