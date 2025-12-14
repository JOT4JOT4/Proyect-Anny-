import { HttpService } from '@nestjs/axios';
import { OptimizedPlan } from './plan-calculator.util';
export declare class MallasService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getMalla(codigo: string, catalogo: string): Promise<any>;
    getAvance(rut: string, codcarrera: string): Promise<any>;
    generatePlan(data: any): OptimizedPlan;
}
