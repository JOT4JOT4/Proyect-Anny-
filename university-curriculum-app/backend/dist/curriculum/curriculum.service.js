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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const HAWAII_AUTH_TOKEN = 'jf400fejof13f';
let CurriculumService = class CurriculumService {
    findAll() {
        return this.curriculums;
    }
    findOne(id) {
        return this.curriculums.find(curriculum => curriculum.id === id);
    }
    create(curriculum) {
        this.curriculums.push(curriculum);
        return curriculum;
    }
    update(id, updatedCurriculum) {
        const index = this.curriculums.findIndex(curriculum => curriculum.id === id);
        if (index > -1) {
            this.curriculums[index] = { ...this.curriculums[index], ...updatedCurriculum };
            return this.curriculums[index];
        }
        return null;
    }
    remove(id) {
        const index = this.curriculums.findIndex(curriculum => curriculum.id === id);
        if (index > -1) {
            return this.curriculums.splice(index, 1);
        }
        return null;
    }
    constructor(httpService) {
        this.httpService = httpService;
        this.curriculums = [];
    }
    async getCombinedCurriculum(email, password) {
        try {
            const loginUrl = `https://puclaro.ucn.cl/eross/avance/login.php?email=${email}&password=${password}`;
            const { data: usuario } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(loginUrl));
            if (!usuario.rut) {
                throw new common_1.UnauthorizedException('Credenciales incorrectas');
            }
            const primeraCarrera = usuario.carreras[0];
            if (!primeraCarrera) {
                throw new Error('El usuario no tiene carreras asignadas.');
            }
            const mallaUrl = `https://losvilos.ucn.cl/hawaii/api/mallas?${primeraCarrera.codigo}-${primeraCarrera.catalogo}`;
            const avanceUrl = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${usuario.rut}&codcarrera=${primeraCarrera.codigo}`;
            const [mallaResponse, avanceResponse] = await Promise.all([
                (0, rxjs_1.firstValueFrom)(this.httpService.get(mallaUrl, {
                    headers: { 'X-HAWAII-AUTH': HAWAII_AUTH_TOKEN },
                })),
                (0, rxjs_1.firstValueFrom)(this.httpService.get(avanceUrl)),
            ]);
            const mallaBase = mallaResponse.data;
            const avanceAlumno = avanceResponse.data;
            return mallaBase.map((asignatura) => {
                const avanceCorrespondiente = avanceAlumno.find((avance) => avance.course === asignatura.codigo);
                let estadoFinal = 'PENDIENTE';
                if (avanceCorrespondiente) {
                    switch (avanceCorrespondiente.status) {
                        case 'APROBADO':
                            estadoFinal = 'APROBADO';
                            break;
                        case 'REPROBADO':
                            estadoFinal = 'REPROBADO';
                            break;
                        case 'INSCRITO':
                            estadoFinal = 'INSCRITO';
                            break;
                    }
                }
                return {
                    ...asignatura,
                    estado: estadoFinal,
                };
            });
        }
        catch (error) {
            console.error('Error fetching curriculum data:', error.message);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al obtener los datos curriculares');
        }
    }
};
CurriculumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], CurriculumService);
exports.CurriculumService = CurriculumService;
//# sourceMappingURL=curriculum.service.js.map