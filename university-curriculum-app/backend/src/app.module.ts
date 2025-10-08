import { Module } from '@nestjs/common';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [CurriculumModule],
  controllers: [], 
  providers: [],  
})
export class AppModule {}