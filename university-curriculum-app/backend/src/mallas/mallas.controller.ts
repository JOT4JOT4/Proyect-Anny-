import { Controller, Get, Param, Query } from '@nestjs/common';
import { MallasService } from './mallas.service';

@Controller('mallas')
export class MallasController {
  constructor(private readonly mallasService: MallasService) {}

  // GET /mallas/:codigo/:catalogo
  @Get(':codigo/:catalogo')
  async getMalla(@Param('codigo') codigo: string, @Param('catalogo') catalogo: string) {
    return this.mallasService.getMalla(codigo, catalogo);
  }

  // GET /mallas/avance?rut=...&codcarrera=...
  @Get('avance')
  async getAvance(@Query('rut') rut: string, @Query('codcarrera') codcarrera: string) {
    return this.mallasService.getAvance(rut, codcarrera);
  }
}
