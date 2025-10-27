import { HttpService } from '@nestjs/axios';
export declare class CurriculumService {
    private readonly httpService;
    private curriculums;
    findAll(): any[];
    findOne(id: number): any;
    create(curriculum: any): any;
    update(id: number, updatedCurriculum: any): any;
    remove(id: number): any[];
    constructor(httpService: HttpService);
    getCombinedCurriculum(email: string, password: string): Promise<{
        estado: string;
        codigo: string;
        asignatura: string;
        creditos: number;
        nivel: number;
        prereq: string;
    }[]>;
}
