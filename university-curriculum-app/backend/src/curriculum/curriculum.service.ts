import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface Carrera {
  codigo: string;
  nombre: string;
  catalogo: string;
}

interface Usuario {
  rut: string;
  carreras: Carrera[];
}

interface Asignatura {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: string;
}

interface AvanceAsignatura {
  course: string;
  status: 'APROBADO' | 'REPROBADO' | string;
}

const HAWAII_AUTH_TOKEN = 'jf400fejof13f';

@Injectable()
export class CurriculumService {
    private curriculums = [];

    findAll() {
        return this.curriculums;
    }

    findOne(id: number) {
        return this.curriculums.find(curriculum => curriculum.id === id);
    }

    create(curriculum) {
        this.curriculums.push(curriculum);
        return curriculum;
    }

    update(id: number, updatedCurriculum) {
        const index = this.curriculums.findIndex(curriculum => curriculum.id === id);
        if (index > -1) {
            this.curriculums[index] = { ...this.curriculums[index], ...updatedCurriculum };
            return this.curriculums[index];
        }
        return null;
    }

    remove(id: number) {
        const index = this.curriculums.findIndex(curriculum => curriculum.id === id);
        if (index > -1) {
            return this.curriculums.splice(index, 1);
        }
        return null;
    }

    constructor(private readonly httpService: HttpService) {}

    async getCombinedCurriculum(email: string, password: string) {
        try {
        // usar en el login
        const loginUrl = `https://puclaro.ucn.cl/eross/avance/login.php?email=${email}&password=${password}`;
        const { data: usuario } = await firstValueFrom(this.httpService.get<Usuario>(loginUrl));
        
        if (!usuario.rut) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        
        const primeraCarrera = usuario.carreras[0];
        if (!primeraCarrera) {
            throw new Error('El usuario no tiene carreras asignadas.');
        }

        // malla y el avance 
        const mallaUrl = `https://losvilos.ucn.cl/hawaii/api/mallas?${primeraCarrera.codigo}-${primeraCarrera.catalogo}`;
        const avanceUrl = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${usuario.rut}&codcarrera=${primeraCarrera.codigo}`;

        const [mallaResponse, avanceResponse] = await Promise.all([
            firstValueFrom(this.httpService.get<Asignatura[]>(mallaUrl, {
            headers: { 'X-HAWAII-AUTH': HAWAII_AUTH_TOKEN },
            })),
            firstValueFrom(this.httpService.get<AvanceAsignatura[]>(avanceUrl)),
        ]);

        const mallaBase = mallaResponse.data;
        const avanceAlumno = avanceResponse.data;

        const mallaConAvance = mallaBase.map((asignatura) => {
            const avanceCorrespondiente = avanceAlumno.find(
            (avance) => avance.course === asignatura.codigo
            );
            return {
            ...asignatura,
            estado: avanceCorrespondiente?.status === 'APROBADO' ? 'APROBADO' : 'PENDIENTE',
            };
        });

        return mallaConAvance;

        } catch (error) {
        console.error('Error fetching curriculum data:', error.message);
        if (error instanceof UnauthorizedException) {
            throw error;
        }
        throw new InternalServerErrorException('Error al obtener los datos curriculares');
        }
    }
}