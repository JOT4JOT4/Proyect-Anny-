import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credential, CredentialDocument } from '../schemas/credential.schema';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService, @InjectModel(Credential.name) private credentialModel: Model<CredentialDocument>) {}

  async login(email: string, password: string) {
    // If LOCAL_AUTH env flag is set, authenticate against local credentials collection
    if (process.env.LOCAL_AUTH === 'true') {
      const cred = await this.credentialModel.findOne({ email, password }).lean();
      if (!cred) return { error: 'credenciales incorrectas' };
      return { rut: cred.rut, carreras: cred.carreras };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://puclaro.ucn.cl/eross/avance/login.php`, {
          params: {
            email,
            password,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Error en la autenticación');
    }
  }
}