import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CredentialDocument = Credential & Document;

@Schema()
export class Credential {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) rut: string;
  @Prop({ type: Array, default: [] }) carreras: any[]; // { codigo, nombre, catalogo }
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
