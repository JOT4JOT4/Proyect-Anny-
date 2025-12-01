import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MallasService } from './mallas.service';
import { MallasController } from './mallas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Malla, MallaSchema } from '../schemas/malla.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }, { name: Malla.name, schema: MallaSchema }]),
  ],
  controllers: [MallasController],
  providers: [MallasService],
})
export class MallasModule {}
