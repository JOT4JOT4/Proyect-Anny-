import { Module } from '@nestjs/common';
import { CurriculumModule } from './curriculum/curriculum.module';
import { AuthModule } from './auth/auth.module';
import { MallasModule } from './mallas/mallas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/university_curriculum', {
      // opciones recomendadas por mongoose (Nest añade por defecto)
    }),
    CurriculumModule,
    AuthModule,
    MallasModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}