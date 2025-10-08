import { CurriculumService } from './curriculum.service';
import { GetCurriculumDto } from './get-curriculum.dto';
export declare class CurriculumController {
    private readonly curriculumService;
    constructor(curriculumService: CurriculumService);
    getCombinedCurriculum(getCurriculumDto: GetCurriculumDto): Promise<{
        estado: string;
        codigo: string;
        asignatura: string;
        creditos: number;
        nivel: number;
        prereq: string;
    }[]>;
}
