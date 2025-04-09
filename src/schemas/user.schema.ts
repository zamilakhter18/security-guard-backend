import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Double, Types } from "mongoose";
import { deviceTypeEnum, loinTypeEnum, userTypeEnum } from "src/helpers/constants";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, default: null })
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: null })
  firstName: string;

  @Prop({ default: null })
  lastName: string;

  @Prop({ default: null })
  password: string;

  @Prop({ type: Types.ObjectId, ref: "Company", default: null })
  companyId: Types.ObjectId;

  @Prop({ type: String, default: null })
  socialId: string;

  @Prop({ type: String, enum: Object.values(loinTypeEnum), default: null })
  loginType: string;

  @Prop({ type: String, enum: Object.values(userTypeEnum), default: null })
  userType: string;

  @Prop({ default: null })
  dateOfBirth: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Service" }], default: null })
  services: Types.ObjectId[];

  @Prop({ default: null })
  profilePhoto: string;

  @Prop({ default: null })
  countryCode: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ type: Object, default: null })
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
      default: null,
    },
    coordinates: {
      type: [Number],
      default: null,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ default: null })
  socialSecurityNumber: string;

  @Prop({
    type: Object,
    default: null,
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

  @Prop({ default: null })
  about: string;

  @Prop({ type: String, enum: Object.values(deviceTypeEnum), default: null })
  deviceType: deviceTypeEnum;

  @Prop({ default: null })
  deviceToken: string;

  @Prop({ default: 0 })
  step: number;

  @Prop({ default: false })
  isProfileSetup: boolean;

  @Prop({ default: false })
  acceptedNonDisclosure: boolean;

  @Prop({ default: null })
  totalGuard: string;

  @Prop({ default: null })
  totalSecurity: string;

  @Prop({ default: null })
  gender: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
export const USER_MODEL = User.name;
