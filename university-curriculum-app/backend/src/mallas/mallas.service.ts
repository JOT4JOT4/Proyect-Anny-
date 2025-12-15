import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { Malla, MallaDocument } from '../schemas/malla.schema';
import { Avance, AvanceDocument } from '../schemas/avance.schema';

@Injectable()
export class MallasService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Malla.name) private mallaModel: Model<MallaDocument>,
    @InjectModel(Avance.name) private avanceModel: Model<AvanceDocument>,
  ) {}

  async getMalla(codigo: string, catalogo: string) {
    // If LOCAL_MALLAS flag set, serve from DB
    if (process.env.LOCAL_MALLAS === 'true') {
      const carreraKey = `${codigo}-${catalogo}`;
      const m = await this.mallaModel.findOne({ carreraKey }).lean();
      if (!m) return [];
      // m.cursos may be course codes
      const cursos = await this.courseModel.find({ codigo: { $in: m.cursos } }).lean();
      // format like external API
      return cursos.map((c) => ({ codigo: c.codigo, asignatura: c.nombre, creditos: c.creditos || 0, nivel: c.nivel || 0, prereq: (c.prerequisitos || []).join(',') }));
    }

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
    if (process.env.LOCAL_MALLAS === 'true') {
      const docs = await this.avanceModel.find({ student: rut, codcarrera }).lean();
      if (!docs || docs.length === 0) return { error: 'Avance no encontrado' };
      return docs;
    }

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
}
