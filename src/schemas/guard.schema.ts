import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class CompanyGuard {
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Company" })
  companyId: Types.ObjectId;
}

export type CompanyGuardDocument = CompanyGuard & Document;
export const CompanyGuardSchema = SchemaFactory.createForClass(CompanyGuard);
export const COMPANY_GUARD_MODEL = CompanyGuard.name;
