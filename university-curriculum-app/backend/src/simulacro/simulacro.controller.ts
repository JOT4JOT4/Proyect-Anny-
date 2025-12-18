import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { SimulacroService } from './simulacro.service';

@Controller('simulacro')
export class SimulacroController {
	constructor(private readonly simulService: SimulacroService) {}

	@Post()
	async create(@Body() payload: any) {
		// payload expected to contain at least `rut` and `cursos` (or any structure from frontend export)
		const saved = await this.simulService.create(payload);
		return { ok: true, data: saved };
	}

	@Get()
	async list() {
		const all = await this.simulService.findAll();
		return { ok: true, data: all };
	}

	@Get(':id')
	async getOne(@Param('id') id: string) {
		const item = await this.simulService.findOne(id);
		return { ok: true, data: item };
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.simulService.remove(id);
		return { ok: true };
	}
}
