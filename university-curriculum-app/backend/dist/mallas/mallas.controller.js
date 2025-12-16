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
exports.MallasController = void 0;
const common_1 = require("@nestjs/common");
const mallas_service_1 = require("./mallas.service");
let MallasController = class MallasController {
    constructor(mallasService) {
        this.mallasService = mallasService;
    }
    getOptimizedPlan(body) {
        return this.mallasService.generatePlan(body);
    }
    async saveProyeccion(body) {
        const { rut, codCarrera, nombre, plan, id } = body;
        return this.mallasService.saveProyeccion(rut, codCarrera, nombre, plan, id);
    }
    async getMisProyecciones(rut, codCarrera, sort) {
        return this.mallasService.getProyeccionesByUser(rut, codCarrera, sort);
    }
    async getProyeccion(id) {
        return this.mallasService.getProyeccionById(id);
    }
    async deleteProyeccion(id) {
        return this.mallasService.deleteProyeccion(id);
    }
    async getAvance(rut, codcarrera) {
        return this.mallasService.getAvance(rut, codcarrera);
    }
    async getMalla(codigo, catalogo) {
        return this.mallasService.getMalla(codigo, catalogo);
    }
};
__decorate([
    (0, common_1.Post)('optimize-plan'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MallasController.prototype, "getOptimizedPlan", null);
__decorate([
    (0, common_1.Post)('save-proyeccion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "saveProyeccion", null);
__decorate([
    (0, common_1.Get)('mis-proyecciones'),
    __param(0, (0, common_1.Query)('rut')),
    __param(1, (0, common_1.Query)('codCarrera')),
    __param(2, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "getMisProyecciones", null);
__decorate([
    (0, common_1.Get)('proyeccion/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "getProyeccion", null);
__decorate([
    (0, common_1.Delete)('proyeccion/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "deleteProyeccion", null);
__decorate([
    (0, common_1.Get)('avance'),
    __param(0, (0, common_1.Query)('rut')),
    __param(1, (0, common_1.Query)('codcarrera')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "getAvance", null);
__decorate([
    (0, common_1.Get)(':codigo/:catalogo'),
    __param(0, (0, common_1.Param)('codigo')),
    __param(1, (0, common_1.Param)('catalogo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "getMalla", null);
MallasController = __decorate([
    (0, common_1.Controller)('mallas'),
    __metadata("design:paramtypes", [mallas_service_1.MallasService])
], MallasController);
exports.MallasController = MallasController;
//# sourceMappingURL=mallas.controller.js.map