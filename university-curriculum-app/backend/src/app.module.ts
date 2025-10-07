import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [CurriculumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}