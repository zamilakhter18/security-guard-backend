import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Company {

//   @Prop({ type: Types.ObjectId, required: true, refPath: 'reviewerUserType' })
//   reviewedBy: Types.ObjectId;
}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);
export const AGENT_RATING_MODEL = Company.name;
