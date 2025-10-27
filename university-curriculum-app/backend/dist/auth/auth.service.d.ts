import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    login(email: string, password: string): Promise<any>;
}
