import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { ResponseHandler } from 'src/helpers/responseHandler';
import { SERVICE_MODEL, ServiceDocument } from 'src/schemas/service.schema';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(SERVICE_MODEL)
    private readonly serviceModel: Model<ServiceDocument>,
    private readonly responseHandler: ResponseHandler,
  ) {}
  async listAllServices(@Res() res: Response) {
    const services = await this.serviceModel.find().exec();

    return this.responseHandler.successResponseWithData(
      res,
      'Services retrieved successfully',
      services,
    );
  }
}
