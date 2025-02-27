import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  emailVerifiedAt: Date;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ require: true })
  password: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  otpGeneratedAt: Date;

  @Prop({ required: true })
  timezone: string;

  @Prop({ type: Types.ObjectId, ref: 'File' })
  profileImage: Types.ObjectId;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
export const User_MODEL = User.name;
