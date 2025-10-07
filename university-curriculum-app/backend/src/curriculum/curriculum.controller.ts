import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { Curriculum } from './curriculum.entity';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  findAll(): Promise<Curriculum[]> {
    return this.curriculumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Curriculum> {
    return this.curriculumService.findOne(id);
  }

  @Post()
  create(@Body() curriculum: Curriculum): Promise<Curriculum> {
    return this.curriculumService.create(curriculum);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() curriculum: Curriculum): Promise<Curriculum> {
    return this.curriculumService.update(id, curriculum);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.curriculumService.remove(id);
  }
}