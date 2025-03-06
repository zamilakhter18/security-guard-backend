import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmailOtp extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, default: () => Date.now() + 5 * 60 * 1000 }) // OTP expires in 5 mins
  expiresAt: Date;
}

export type EmailOtpDocument = EmailOtp & Document;
export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);
export const EMAIL_OTP_MODEL = EmailOtp.name;