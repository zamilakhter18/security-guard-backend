import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema()
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  contactName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  countryShortName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Object })
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ })
  companySize: string;

  @Prop()
  companyLogo: string;
}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);
export const COMPANY_MODEL = Company.name;
