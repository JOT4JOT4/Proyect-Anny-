import { Controller, Post, Body, ValidationPipe,Get } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { GetCurriculumDto } from './get-curriculum.dto';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  getCombinedCurriculum(@Body(new ValidationPipe()) getCurriculumDto: GetCurriculumDto) {
    const { email, password } = getCurriculumDto;
    return this.curriculumService.getCombinedCurriculum(email, password);
  }


}