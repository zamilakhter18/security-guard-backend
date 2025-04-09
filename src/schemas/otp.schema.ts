import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Otp {
  @Prop({ lowercase: true })
  email: string;

  @Prop({})
  phone: string;

  @Prop({ match: /^[0-9]+$/ })
  otp: string;

  @Prop({ default: () => new Date(Date.now() + 2 * 60 * 1000) })
  otpExpiresAt: Date;
}

export type OtpDocument = Otp & Document;
export const OtpSchema = SchemaFactory.createForClass(Otp);
export const OTP_MODEL = Otp.name;
