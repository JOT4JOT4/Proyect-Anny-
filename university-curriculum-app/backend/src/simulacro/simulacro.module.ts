import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulacroController } from './simulacro.controller';
import { SimulacroService } from './simulacro.service';
import { Simulacro, SimulacroSchema } from './simulacro.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Simulacro.name, schema: SimulacroSchema }])],
  controllers: [SimulacroController],
  providers: [SimulacroService],
  exports: [SimulacroService],
})
export class SimulacroModule {}
