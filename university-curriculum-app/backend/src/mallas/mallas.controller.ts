import { Controller, Post, Body, Get, Query, Param, Delete } from '@nestjs/common';
import { MallasService } from './mallas.service';

@Controller('mallas')
export class MallasController {
  constructor(private readonly mallasService: MallasService) {}


  @Post('optimize-plan')
  getOptimizedPlan(@Body() body: any) {
    return this.mallasService.generatePlan(body);
  }

  @Post('save-proyeccion')
  async saveProyeccion(@Body() body: any) {
    const { rut, codCarrera, nombre, plan, id } = body;
    
    return this.mallasService.saveProyeccion(rut, codCarrera, nombre, plan, id);
  }

  @Get('mis-proyecciones')
  async getMisProyecciones(
    @Query('rut') rut: string, 
    @Query('codCarrera') codCarrera: string,
    @Query('sort') sort?: 'date' | 'alpha' 
  ) {
    return this.mallasService.getProyeccionesByUser(rut, codCarrera, sort);
  }

  @Get('proyeccion/:id')
  async getProyeccion(@Param('id') id: string) {
    return this.mallasService.getProyeccionById(id);
  }
  
  @Delete('proyeccion/:id')
  async deleteProyeccion(@Param('id') id: string) {
    return this.mallasService.deleteProyeccion(id);
  }

  // GET /mallas/avance?rut=...&codcarrera=...
  @Get('avance')
  async getAvance(@Query('rut') rut: string, @Query('codcarrera') codcarrera: string) {
    return this.mallasService.getAvance(rut, codcarrera);
  }

  // GET /mallas/:codigo/:catalogo
  @Get(':codigo/:catalogo')
  async getMalla(@Param('codigo') codigo: string, @Param('catalogo') catalogo: string) {
    return this.mallasService.getMalla(codigo, catalogo);
  }


}
