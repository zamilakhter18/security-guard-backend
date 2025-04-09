import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document, Double } from "mongoose";

@Schema()
export class BankInformation extends Document {
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ required: true })
  receiptName: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  routingNumber: string;

  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipcode: string;

  @Prop()
  country: string;
}

export type BankInformationDocument = BankInformation & Document;
export const BankInformationSchema = SchemaFactory.createForClass(BankInformation);
export const BANK_INFORMATION_MODEL = BankInformation.name;
