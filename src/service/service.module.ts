import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SERVICE_MODEL, ServiceSchema } from 'src/schemas/service.schema';
import { ResponseHandler } from 'src/helpers/responseHandler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SERVICE_MODEL, schema: ServiceSchema }]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ResponseHandler],
})
export class ServiceModule {}
