import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MallasController } from './mallas.controller';
import { MallasService } from './mallas.service';

@Module({
  imports: [HttpModule],
  controllers: [MallasController],
  providers: [MallasService],
  exports: [MallasService],
})
export class MallasModule {}
