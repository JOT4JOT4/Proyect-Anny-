import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(email: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://puclaro.ucn.cl/eross/avance/login.php`, {
          params: {
            email,
            password,
          },
        })
      );
      return response.data;
    } catch (error) {
      throw new Error('Error en la autenticación');
    }
  }
}