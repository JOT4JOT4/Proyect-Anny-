/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
export type ProyeccionDocument = Proyeccion & Document;
export declare class Proyeccion {
    rut: string;
    codCarrera: string;
    nombre: string;
    matrizResultante: Record<string, any[]>;
}
export declare const ProyeccionSchema: import("mongoose").Schema<Proyeccion, import("mongoose").Model<Proyeccion, any, any, any, Document<unknown, any, Proyeccion> & Proyeccion & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Proyeccion, Document<unknown, {}, import("mongoose").FlatRecord<Proyeccion>> & import("mongoose").FlatRecord<Proyeccion> & {
    _id: import("mongoose").Types.ObjectId;
}>;
