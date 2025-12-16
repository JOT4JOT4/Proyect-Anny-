import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProyeccionDocument = Proyeccion & Document;

@Schema({ timestamps: true })
export class Proyeccion {
  // Relación con tu User (igual que en Avance)
  @Prop({ required: true, index: true }) 
  rut: string; 

  // Relación con la carrera (para saber de qué malla es este plan)
  @Prop({ required: true }) 
  codCarrera: string;

  // El nombre que el alumno le ponga (ej: "Plan optimista", "Plan relajado")
  @Prop({ required: true }) 
  nombre: string;

  // Aquí guardamos el objeto JSON que devuelve tu algoritmo
  // Usamos type: Object porque la estructura es dinámica ("Semestre 1", "Semestre 2"...)
  @Prop({ type: Object, required: true }) 
  matrizResultante: Record<string, any[]>; 
}

export const ProyeccionSchema = SchemaFactory.createForClass(Proyeccion);

// Índice compuesto único: Un usuario no puede tener dos planes con el MISMO nombre en la MISMA carrera.
// Esto permite sobreescribir (actualizar) si guardan con el mismo nombre.
ProyeccionSchema.index({ rut: 1, codCarrera: 1, nombre: 1 }, { unique: true });