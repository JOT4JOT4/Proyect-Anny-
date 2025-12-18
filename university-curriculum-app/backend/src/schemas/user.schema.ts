import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) rut: string;
  @Prop() nombre: string;
  @Prop({ default: [] }) roles: string[];
  @Prop({ type: Types.ObjectId, ref: 'Malla' }) mallaActiva?: Types.ObjectId;
  @Prop({ type: Array, default: [] }) proyecciones?: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);