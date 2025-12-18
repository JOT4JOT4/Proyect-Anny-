import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Simulacro, SimulacroDocument } from './simulacro.entity';

@Injectable()
export class SimulacroService {
	constructor(@InjectModel(Simulacro.name) private simulModel: Model<SimulacroDocument>) {}

	async create(payload: Partial<Simulacro>): Promise<SimulacroDocument> {
		const created = new this.simulModel(payload);
		return created.save();
	}

	async findAll(): Promise<SimulacroDocument[]> {
		return this.simulModel.find().lean().exec();
	}

	async findOne(id: string): Promise<SimulacroDocument> {
		const doc = await this.simulModel.findById(id).exec();
		if (!doc) throw new NotFoundException('Simulacro no encontrado');
		return doc;
	}

	async remove(id: string): Promise<void> {
		const res = await this.simulModel.findByIdAndDelete(id).exec();
		if (!res) throw new NotFoundException('Simulacro no encontrado');
	}
}
