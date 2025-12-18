import { SimulacroService } from './simulacro.service';
export declare class SimulacroController {
    private readonly simulService;
    constructor(simulService: SimulacroService);
    create(payload: any): Promise<{
        ok: boolean;
        data: import("./simulacro.entity").SimulacroDocument;
    }>;
    list(): Promise<{
        ok: boolean;
        data: import("./simulacro.entity").SimulacroDocument[];
    }>;
    getOne(id: string): Promise<{
        ok: boolean;
        data: import("./simulacro.entity").SimulacroDocument;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
