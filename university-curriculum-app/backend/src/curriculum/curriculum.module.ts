import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { HttpModule } from '@nestjs/axios';
import { CurriculumService } from './curriculum.service';

@Module({
  imports: [HttpModule],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}