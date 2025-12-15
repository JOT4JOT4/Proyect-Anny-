import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvanceDocument = Avance & Document;

@Schema()
export class Avance {
  @Prop({ required: true }) nrc: string;
  @Prop() period: string;
  @Prop({ required: true }) student: string; // rut
  @Prop({ required: true }) course: string; // codigo curso
  @Prop({ default: false }) excluded: boolean;
  @Prop() inscriptionType: string;
  @Prop() status: string;
  @Prop() codcarrera: string;
}

export const AvanceSchema = SchemaFactory.createForClass(Avance);
