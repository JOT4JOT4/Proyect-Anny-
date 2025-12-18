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
exports.SimulacroService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const simulacro_entity_1 = require("./simulacro.entity");
let SimulacroService = class SimulacroService {
    constructor(simulModel) {
        this.simulModel = simulModel;
    }
    async create(payload) {
        const created = new this.simulModel(payload);
        return created.save();
    }
    async findAll() {
        return this.simulModel.find().lean().exec();
    }
    async findOne(id) {
        const doc = await this.simulModel.findById(id).exec();
        if (!doc)
            throw new common_1.NotFoundException('Simulacro no encontrado');
        return doc;
    }
    async remove(id) {
        const res = await this.simulModel.findByIdAndDelete(id).exec();
        if (!res)
            throw new common_1.NotFoundException('Simulacro no encontrado');
    }
};
SimulacroService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(simulacro_entity_1.Simulacro.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SimulacroService);
exports.SimulacroService = SimulacroService;
//# sourceMappingURL=simulacro.service.js.map