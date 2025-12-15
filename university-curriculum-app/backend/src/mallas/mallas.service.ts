import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { Malla, MallaDocument } from '../schemas/malla.schema';
import { calculateOptimizedPlan, OptimizedPlan } from './plan-calculator.util'; 

@Injectable()
export class MallasService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Malla.name) private mallaModel: Model<MallaDocument>,
  ) {}

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

  async persistMalla(carreraKey: string, catalogo: string, cursos: Partial<Course & { codigo?: string }>[]) {
    // upsert cursos
    await Promise.all(
      cursos.map((c) => this.courseModel.updateOne({ codigo: c.codigo }, { $set: c }, { upsert: true }).exec()),
    );
    // guardar malla con códigos
    const cursoCodigos = cursos.map((c) => c.codigo);
    return this.mallaModel.findOneAndUpdate(
      { carreraKey, catalogo },
      { $set: { carreraKey, catalogo, cursos: cursoCodigos } },
      { upsert: true, new: true },
    ).exec();
  }

    // Método plan optimizado
  generatePlan(data: any): OptimizedPlan { 
    const { mergedCourses, approvedCodes, creditLimit, manuallyInscribedCodes } = data;

    const approvedSet = new Set<string>(approvedCodes);
    const manualSet = new Set<string>(manuallyInscribedCodes);


    const parsePrereqsLogic = (curso: any) => {
        if (Array.isArray(curso.requisitos)) {
            return curso.requisitos.map(req => ({ 
                code: typeof req === 'string' ? req : req.codigo 
            }));
        }
        return [];
    };

    return calculateOptimizedPlan(
      mergedCourses,
      approvedSet,
      parsePrereqsLogic, 
      creditLimit,
      manualSet
    );

  }
}
