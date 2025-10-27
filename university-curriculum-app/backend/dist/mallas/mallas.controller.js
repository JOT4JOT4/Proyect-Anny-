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
    async getMalla(codigo, catalogo) {
        return this.mallasService.getMalla(codigo, catalogo);
    }
    async getAvance(rut, codcarrera) {
        return this.mallasService.getAvance(rut, codcarrera);
    }
};
__decorate([
    (0, common_1.Get)(':codigo/:catalogo'),
    __param(0, (0, common_1.Param)('codigo')),
    __param(1, (0, common_1.Param)('catalogo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "getMalla", null);
__decorate([
    (0, common_1.Get)('avance'),
    __param(0, (0, common_1.Query)('rut')),
    __param(1, (0, common_1.Query)('codcarrera')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MallasController.prototype, "getAvance", null);
MallasController = __decorate([
    (0, common_1.Controller)('mallas'),
    __metadata("design:paramtypes", [mallas_service_1.MallasService])
], MallasController);
exports.MallasController = MallasController;
//# sourceMappingURL=mallas.controller.js.map