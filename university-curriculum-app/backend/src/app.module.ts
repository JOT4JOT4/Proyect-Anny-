import { Module } from '@nestjs/common';
import { CurriculumModule } from './curriculum/curriculum.module';
import { AuthModule } from './auth/auth.module';
import { MallasModule } from './mallas/mallas.module';

@Module({
  imports: [CurriculumModule, AuthModule, MallasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}