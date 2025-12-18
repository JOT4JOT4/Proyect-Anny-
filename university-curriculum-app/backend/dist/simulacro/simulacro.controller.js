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
exports.SimulacroController = void 0;
const common_1 = require("@nestjs/common");
const simulacro_service_1 = require("./simulacro.service");
let SimulacroController = class SimulacroController {
    constructor(simulService) {
        this.simulService = simulService;
    }
    async create(payload) {
        const saved = await this.simulService.create(payload);
        return { ok: true, data: saved };
    }
    async list() {
        const all = await this.simulService.findAll();
        return { ok: true, data: all };
    }
    async getOne(id) {
        const item = await this.simulService.findOne(id);
        return { ok: true, data: item };
    }
    async remove(id) {
        await this.simulService.remove(id);
        return { ok: true };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SimulacroController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimulacroController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SimulacroController.prototype, "getOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SimulacroController.prototype, "remove", null);
SimulacroController = __decorate([
    (0, common_1.Controller)('simulacro'),
    __metadata("design:paramtypes", [simulacro_service_1.SimulacroService])
], SimulacroController);
exports.SimulacroController = SimulacroController;
//# sourceMappingURL=simulacro.controller.js.map