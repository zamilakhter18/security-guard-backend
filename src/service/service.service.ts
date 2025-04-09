import { Injectable, Logger, Res } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { Model } from "mongoose";
import { ResponseHandler } from "src/helpers/response-handler";
import { SERVICE_MODEL, ServiceDocument } from "src/schemas/service.schema";

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);
  constructor(
    @InjectModel(SERVICE_MODEL)
    private readonly serviceModel: Model<ServiceDocument>,
    private readonly responseHandler: ResponseHandler
  ) {}
  async listAllServices(@Res() res: Response) {
    this.logger.debug("A request to get all services has been made");
    const services = await this.serviceModel.find().exec();
    this.logger.debug("Services retrieved successfully");
    return this.responseHandler.successResponseWithData(res, "Services retrieved successfully", services);
  }
}
