import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Double } from "mongoose";

@Schema()
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  contactName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  countryCode: string;

  @Prop()
  countryShortName: string;

  @Prop()
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
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  // @Prop({ })
  // companyMinSize: string;

  @Prop({})
  companyMaxSize: string;

  @Prop()
  companyLogo: string;
}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);
export const COMPANY_MODEL = Company.name;
