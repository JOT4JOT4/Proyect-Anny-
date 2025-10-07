import { Injectable } from '@nestjs/common';

@Injectable()
export class CurriculumService {
    private curriculums = [];

    findAll() {
        return this.curriculums;
    }

    findOne(id: number) {
        return this.curriculums.find(curriculum => curriculum.id === id);
    }

    create(curriculum) {
        this.curriculums.push(curriculum);
        return curriculum;
    }

    update(id: number, updatedCurriculum) {
        const index = this.curriculums.findIndex(curriculum => curriculum.id === id);
        if (index > -1) {
            this.curriculums[index] = { ...this.curriculums[index], ...updatedCurriculum };
            return this.curriculums[index];
        }
        return null;
    }

    remove(id: number) {
        const index = this.curriculums.findIndex(curriculum => curriculum.id === id);
        if (index > -1) {
            return this.curriculums.splice(index, 1);
        }
        return null;
    }
}