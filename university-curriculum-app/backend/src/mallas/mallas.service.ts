import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../schemas/course.schema';
import { Malla, MallaDocument } from '../schemas/malla.schema';
import { Avance, AvanceDocument } from '../schemas/avance.schema';
import { Proyeccion, ProyeccionDocument } from '../schemas/proyeccion.schema';
import { calculateOptimizedPlan, OptimizedPlan } from './plan-calculator.util'; 

@Injectable()
export class MallasService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Malla.name) private mallaModel: Model<MallaDocument>,
    @InjectModel(Proyeccion.name) private proyeccionModel: Model<ProyeccionDocument>,
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

  // GUARDAR PROYECCIÓN 
  async saveProyeccion(rut: string, codCarrera: string, nombre: string, planData: any, planId?: string) {
    
    // ACTUALIZAR EXISTENTE
    if (planId) {
      return this.proyeccionModel.findByIdAndUpdate(
        planId,
        { 
          nombre: nombre,            
          matrizResultante: planData, 
          rut,                      
          codCarrera
        },
        { new: true } 
      ).exec();
    }

    // CREAR NUEVO 
    const existe = await this.proyeccionModel.findOne({ rut, codCarrera, nombre });
    if (existe) {
       return this.proyeccionModel.findOneAndUpdate(
           { rut, codCarrera, nombre },
           { matrizResultante: planData },
           { new: true }
       ).exec();
    }

    const nuevaProyeccion = new this.proyeccionModel({
      rut,
      codCarrera,
      nombre,
      matrizResultante: planData
    });
    return nuevaProyeccion.save();
  }

  // LISTAR PROYECCIONES DE UN USUARIO
  async getProyeccionesByUser(rut: string, codCarrera: string, sort: 'date' | 'alpha' = 'date') {

    let sortOptions: any = {};
    
    if (sort === 'alpha') {
      sortOptions = { nombre: 1 }; 
    } else {
      sortOptions = { updatedAt: -1 }; 
    }

    return this.proyeccionModel
      .find({ rut, codCarrera })
      .select('nombre updatedAt createdAt') 
      .sort(sortOptions)
      .exec();
  }

  // CARGAR UNA PROYECCIÓN ESPECÍFICA
  async getProyeccionById(id: string) {
    return this.proyeccionModel.findById(id).exec();
  }
  
  // ELIMINAR PROYECCIÓN
  async deleteProyeccion(id: string) {
    return this.proyeccionModel.findByIdAndDelete(id).exec();
  }

    // Método plan optimizado
  generatePlan(data: any): OptimizedPlan { 
    const { mergedCourses, approvedCodes, creditLimits, manuallyInscribedCodes,ignorePracticas } = data;

    const approvedSet = new Set<string>(approvedCodes);
    const manualSet = new Set<string>(manuallyInscribedCodes);

    const limitsArray = Array.isArray(creditLimits) && creditLimits.length > 0 
        ? creditLimits 
        : [30];

    const failedSet = new Set<string>();
    if (Array.isArray(mergedCourses)) {
        mergedCourses.forEach(m => {
            const status = m.avance?.status || m.avance?.result || ''; 
            const code = String(m.curso.codigo || '').trim();
            if (status === 'REPROBADO' || status === 'Reprobado') {
                failedSet.add(code);
            }
        });
    }
    const parsePrereqsLogic = (curso: any) => {
        if (Array.isArray(curso.requisitos)) {
            return curso.requisitos.map(req => ({ 
                code: typeof req === 'string' ? req : req.codigo 
            }));
        }
        if (typeof curso.prereq === 'string' && curso.prereq.trim().length > 0) {
            return curso.prereq.split(',').map(code => ({ code: code.trim() }));
        }
        return [];
    };

    return calculateOptimizedPlan(
      mergedCourses,
      approvedSet,
      parsePrereqsLogic, 
      limitsArray,
      manualSet,
      ignorePracticas || false,
      failedSet
    );

  }
}


