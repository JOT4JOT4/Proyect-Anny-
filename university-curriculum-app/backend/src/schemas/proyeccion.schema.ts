import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProyeccionDocument = Proyeccion & Document;

@Schema({ timestamps: true })
export class Proyeccion {
  @Prop({ required: true, index: true }) 
  rut: string; 

  @Prop({ required: true }) 
  codCarrera: string;

  @Prop({ required: true }) 
  nombre: string;

  @Prop({ type: Object, required: true }) 
  matrizResultante: Record<string, any[]>; 
}
export const ProyeccionSchema = SchemaFactory.createForClass(Proyeccion);

ProyeccionSchema.index({ rut: 1, codCarrera: 1, nombre: 1 }, { unique: true });