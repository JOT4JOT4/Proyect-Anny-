import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true, unique: true }) codigo: string;
  @Prop() nombre: string;
  @Prop() creditos: number;
  @Prop() nivel?: number;
  @Prop({ type: [String], default: [] }) prerequisitos: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);