import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MallasService {
  constructor(private readonly httpService: HttpService) {}

  async getMalla(codigo: string, catalogo: string) {
    const key = `${codigo}-${catalogo}`;
    const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${key}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'X-HAWAII-AUTH': 'jf400fejof13f',
          },
        }),
      );
      return response.data;
    } catch (err) {
      throw new Error('Error fetching malla');
    }
  }

  async getAvance(rut: string, codcarrera: string) {
    const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${encodeURIComponent(rut)}&codcarrera=${encodeURIComponent(codcarrera)}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (err) {
      throw new Error('Error fetching avance');
    }
  }
}
