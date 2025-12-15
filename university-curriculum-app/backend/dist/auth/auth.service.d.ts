import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { CredentialDocument } from '../schemas/credential.schema';
export declare class AuthService {
    private readonly httpService;
    private credentialModel;
    constructor(httpService: HttpService, credentialModel: Model<CredentialDocument>);
    login(email: string, password: string): Promise<any>;
}
