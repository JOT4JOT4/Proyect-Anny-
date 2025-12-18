import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SimulacroDocument = Simulacro & Document;

@Schema({ timestamps: true })
export class Simulacro {
	@Prop({ required: true, index: true })
	rut: string; // identificador del usuario que creó la simulación (ej: RUT)

	@Prop()
	nombre?: string; // nombre opcional para la simulación

	@Prop({ type: [Object], default: [] })
	cursos: Record<string, any>[]; // lista de cursos tal como viene en el JSON

	@Prop({ type: Object, default: {} })
	meta?: Record<string, any>; // datos adicionales (por ejemplo filtros, opciones)
}

export const SimulacroSchema = SchemaFactory.createForClass(Simulacro);