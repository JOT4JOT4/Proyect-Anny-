"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MallasService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../schemas/course.schema");
const malla_schema_1 = require("../schemas/malla.schema");
const avance_schema_1 = require("../schemas/avance.schema");
const proyeccion_schema_1 = require("../schemas/proyeccion.schema");
const plan_calculator_util_1 = require("./plan-calculator.util");
let MallasService = class MallasService {
    constructor(httpService, courseModel, mallaModel, proyeccionModel, avanceModel) {
        this.httpService = httpService;
        this.courseModel = courseModel;
        this.mallaModel = mallaModel;
        this.proyeccionModel = proyeccionModel;
        this.avanceModel = avanceModel;
    }
    async getMalla(codigo, catalogo) {
        if (process.env.LOCAL_MALLAS === 'true') {
            const carreraKey = `${codigo}-${catalogo}`;
            const m = await this.mallaModel.findOne({ carreraKey }).lean();
            if (!m)
                return [];
            const cursos = await this.courseModel.find({ codigo: { $in: m.cursos } }).lean();
            return cursos.map((c) => ({ codigo: c.codigo, asignatura: c.nombre, creditos: c.creditos || 0, nivel: c.nivel || 0, prereq: (c.prerequisitos || []).join(','), permiteRecuperacion: c.permiteRecuperacion || false,
                esPracticaVerano: c.esPracticaVerano || false }));
        }
        const key = `${codigo}-${catalogo}`;
        const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${key}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: { 'X-HAWAII-AUTH': 'jf400fejof13f' },
            }));
            if (!response.data || !Array.isArray(response.data)) {
                return [];
            }
            const cursosExternos = response.data;
            const codigos = cursosExternos.map((c) => c.codigo);
            const cursosLocales = await this.courseModel.find({
                codigo: { $in: codigos }
            }).select('codigo permiteRecuperacion esPracticaVerano').lean();
            const mapaLocal = new Map();
            cursosLocales.forEach((doc) => {
                mapaLocal.set(doc.codigo, doc);
            });
            const mallaFinal = cursosExternos.map((cursoExt) => {
                const infoLocal = mapaLocal.get(cursoExt.codigo);
                return {
                    ...cursoExt,
                    permiteRecuperacion: infoLocal ? !!infoLocal.permiteRecuperacion : false,
                    esPracticaVerano: infoLocal ? !!infoLocal.esPracticaVerano : false
                };
            });
            return mallaFinal;
        }
        catch (err) {
            console.error('Error fetching malla externa:', err.message);
            throw new Error(`Failed to fetch malla for ${key}`);
        }
    }
    async getAvance(rut, codcarrera) {
        if (process.env.LOCAL_MALLAS === 'true') {
            const docs = await this.avanceModel.find({ student: rut, codcarrera }).lean();
            if (!docs || docs.length === 0)
                return { error: 'Avance no encontrado' };
            return docs;
        }
        const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${encodeURIComponent(rut)}&codcarrera=${encodeURIComponent(codcarrera)}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            return response.data;
        }
        catch (err) {
            throw new Error('Error fetching avance');
        }
    }
    async persistMalla(carreraKey, catalogo, cursos) {
        await Promise.all(cursos.map((c) => this.courseModel.updateOne({ codigo: c.codigo }, { $set: c }, { upsert: true }).exec()));
        const cursoCodigos = cursos.map((c) => c.codigo);
        return this.mallaModel.findOneAndUpdate({ carreraKey, catalogo }, { $set: { carreraKey, catalogo, cursos: cursoCodigos } }, { upsert: true, new: true }).exec();
    }
    async saveProyeccion(rut, codCarrera, nombre, planData, planId) {
        if (planId) {
            return this.proyeccionModel.findByIdAndUpdate(planId, {
                nombre: nombre,
                matrizResultante: planData,
                rut,
                codCarrera
            }, { new: true }).exec();
        }
        const existe = await this.proyeccionModel.findOne({ rut, codCarrera, nombre });
        if (existe) {
            return this.proyeccionModel.findOneAndUpdate({ rut, codCarrera, nombre }, { matrizResultante: planData }, { new: true }).exec();
        }
        const nuevaProyeccion = new this.proyeccionModel({
            rut,
            codCarrera,
            nombre,
            matrizResultante: planData
        });
        return nuevaProyeccion.save();
    }
    async getProyeccionesByUser(rut, codCarrera, sort = 'date') {
        let sortOptions = {};
        if (sort === 'alpha') {
            sortOptions = { nombre: 1 };
        }
        else {
            sortOptions = { updatedAt: -1 };
        }
        return this.proyeccionModel
            .find({ rut, codCarrera })
            .select('nombre updatedAt createdAt')
            .sort(sortOptions)
            .exec();
    }
    async getProyeccionById(id) {
        return this.proyeccionModel.findById(id).exec();
    }
    async deleteProyeccion(id) {
        return this.proyeccionModel.findByIdAndDelete(id).exec();
    }
    generatePlan(data) {
        const { mergedCourses, approvedCodes, creditLimits, manuallyInscribedCodes, allowSpecialPeriods, includePracticeInNormal, simulatedStatus } = data;
        console.log("--- DEBUG SERVICIO: Revisando datos entrantes ---");
        console.log(`Modo Periodo Especial Activo: ${allowSpecialPeriods}`);
        const algunRecuperable = mergedCourses.find((m) => m.curso.permiteRecuperacion === true);
        if (algunRecuperable) {
            console.log(`✅ DATO CONFIRMADO: El curso ${algunRecuperable.curso.codigo} (${algunRecuperable.curso.nombre}) tiene permiteRecuperacion: true`);
        }
        else {
            console.log("⚠️ ALERTA: No llegó ningún curso con permiteRecuperacion en true. Revisa getMalla o la BD.");
        }
        console.log("---------------------------------------------");
        const approvedSet = new Set(approvedCodes);
        const manualSet = new Set(manuallyInscribedCodes);
        const failedSet = new Set();
        if (Array.isArray(mergedCourses)) {
            mergedCourses.forEach(m => {
                const status = m.avance?.status || '';
                if (status === 'REPROBADO')
                    failedSet.add(m.curso.codigo);
            });
        }
        if (simulatedStatus) {
            Object.entries(simulatedStatus).forEach(([code, status]) => {
                if (status === 'REPROBADO') {
                    failedSet.add(code);
                    approvedSet.delete(code);
                }
                else if (status === 'APROBADO') {
                    failedSet.delete(code);
                    approvedSet.add(code);
                }
            });
        }
        const limitsArray = Array.isArray(creditLimits) && creditLimits.length > 0
            ? creditLimits
            : [30];
        const parsePrereqsLogic = (curso) => {
            if (Array.isArray(curso.requisitos)) {
                return curso.requisitos.map(req => ({
                    code: typeof req === 'string' ? req : req.codigo
                }));
            }
            return [];
        };
        return (0, plan_calculator_util_1.calculateOptimizedPlan)(mergedCourses, approvedSet, parsePrereqsLogic, limitsArray, manualSet, failedSet, allowSpecialPeriods || false, includePracticeInNormal || false);
    }
};
MallasService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __param(2, (0, mongoose_1.InjectModel)(malla_schema_1.Malla.name)),
    __param(3, (0, mongoose_1.InjectModel)(proyeccion_schema_1.Proyeccion.name)),
    __param(4, (0, mongoose_1.InjectModel)(avance_schema_1.Avance.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MallasService);
exports.MallasService = MallasService;
//# sourceMappingURL=mallas.service.js.map