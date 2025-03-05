import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { deviceTypeEnum, userTypeEnum } from 'src/helpers/constants';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String] })
  socialProviders: string[];

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ required: false })
  socialLoginType: string;

  @Prop({ type: String, enum: Object.values(userTypeEnum) })
  userType: userTypeEnum;

  @Prop({ required: false })
  dateOfBirth: Date;

  @Prop({ type: [String] })
  services: string[];

  @Prop({})
  profilePhoto: string;

  @Prop({})
  phoneNumber: string;

  @Prop({})
  countryCode: string;

  @Prop({})
  address: string;

  @Prop({})
  socialSecurityNumber: string;

  @Prop({})
  otp: string;

  @Prop({
    type: {
      idCardFront: String,
      idCardBack: String,
      wForm: String,
      licence: String,
      insurance: String,
    },
  })
  document: {
    idCardFront: string;
    idCardBack: string;
    wForm: string;
    licence: string;
    insurance: string;
  };

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  })
  location?: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({})
  about: string;

  @Prop({ type: String, enum: Object.values(deviceTypeEnum) })
  deviceType: deviceTypeEnum;

  @Prop({})
  deviceToken: string;

  @Prop({ default: 1 })
  step: number;

  @Prop({ default: false })
  isProfileSetup: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
export const USER_MODEL = User.name;
