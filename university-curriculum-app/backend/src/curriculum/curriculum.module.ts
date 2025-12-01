import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CurriculumService } from './curriculum.service';
import { CurriculumController } from './curriculum.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Malla, MallaSchema } from '../schemas/malla.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }, { name: Malla.name, schema: MallaSchema }]),
  ],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}