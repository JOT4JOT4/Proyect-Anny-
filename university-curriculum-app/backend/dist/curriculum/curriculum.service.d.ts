import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { CourseDocument } from '../schemas/course.schema';
import { MallaDocument } from '../schemas/malla.schema';
export declare class CurriculumService {
    private readonly httpService;
    private courseModel;
    private mallaModel;
    private curriculums;
    findAll(): any[];
    findOne(id: number): any;
    create(curriculum: any): any;
    update(id: number, updatedCurriculum: any): any;
    remove(id: number): any[];
    constructor(httpService: HttpService, courseModel: Model<CourseDocument>, mallaModel: Model<MallaDocument>);
    getCombinedCurriculum(email: string, password: string): Promise<{
        estado: string;
        codigo: string;
        asignatura: string;
        creditos: number;
        nivel: number;
        prereq: string;
    }[]>;
    private upsertCourses;
    private saveMalla;
}
