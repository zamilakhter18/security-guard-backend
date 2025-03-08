import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Service extends Document {
  @Prop({ required: true })
  name: string;
}

export type ServiceDocument = Service & Document;
export const ServiceSchema = SchemaFactory.createForClass(Service);
export const SERVICE_MODEL = Service.name;
