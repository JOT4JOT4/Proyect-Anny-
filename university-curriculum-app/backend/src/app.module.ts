import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { MallasModule } from './mallas/mallas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { SimulacroModule } from './simulacro/simulacro.module';

@Module({
  imports: [
    HttpModule.register({}),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/university_curriculum?authSource=admin', {
      // opciones recomendadas por mongoose (Nest añade por defecto)
    }),
    AuthModule,
    MallasModule,
    UsersModule,
    SimulacroModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}