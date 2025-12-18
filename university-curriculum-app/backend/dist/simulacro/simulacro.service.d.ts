import { Model } from 'mongoose';
import { Simulacro, SimulacroDocument } from './simulacro.entity';
export declare class SimulacroService {
    private simulModel;
    constructor(simulModel: Model<SimulacroDocument>);
    create(payload: Partial<Simulacro>): Promise<SimulacroDocument>;
    findAll(): Promise<SimulacroDocument[]>;
    findOne(id: string): Promise<SimulacroDocument>;
    remove(id: string): Promise<void>;
}
