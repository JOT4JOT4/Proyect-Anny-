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
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { Malla, MallaDocument } from '../schemas/malla.schema';
export declare class MallasService {
    private readonly httpService;
    private courseModel;
    private mallaModel;
    constructor(httpService: HttpService, courseModel: Model<CourseDocument>, mallaModel: Model<MallaDocument>);
    getMalla(codigo: string, catalogo: string): Promise<any>;
    getAvance(rut: string, codcarrera: string): Promise<any>;
    persistMalla(carreraKey: string, catalogo: string, cursos: Partial<Course & {
        codigo?: string;
    }>[]): Promise<import("mongoose").Document<unknown, {}, MallaDocument> & Malla & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
