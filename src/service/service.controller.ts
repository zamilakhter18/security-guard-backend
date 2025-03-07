import { Controller, Get, Res } from '@nestjs/common';
import { ServiceService } from './service.service';
import { Response } from 'express';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async listAllServices( @Res() res: Response) {
    return await this.serviceService.listAllServices(res);
  }
}
