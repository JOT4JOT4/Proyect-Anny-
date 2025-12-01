import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type MallaDocument = Malla & Document;

@Schema({ timestamps: true })
export class Malla {
  @Prop({ required: true }) carreraKey: string;
  @Prop() catalogo: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] }) cursos: Types.ObjectId[]; // o guardar códigos
}

export const MallaSchema = SchemaFactory.createForClass(Malla);