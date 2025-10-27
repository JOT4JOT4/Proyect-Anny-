import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: {
        email: string;
        password: string;
    }): Promise<any>;
}
