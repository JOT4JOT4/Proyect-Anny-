import { MallasService } from './mallas.service';
export declare class MallasController {
    private readonly mallasService;
    constructor(mallasService: MallasService);
    getMalla(codigo: string, catalogo: string): Promise<any>;
    getAvance(rut: string, codcarrera: string): Promise<any>;
}
