"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulacroModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const simulacro_controller_1 = require("./simulacro.controller");
const simulacro_service_1 = require("./simulacro.service");
const simulacro_entity_1 = require("./simulacro.entity");
let SimulacroModule = class SimulacroModule {
};
SimulacroModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: simulacro_entity_1.Simulacro.name, schema: simulacro_entity_1.SimulacroSchema }])],
        controllers: [simulacro_controller_1.SimulacroController],
        providers: [simulacro_service_1.SimulacroService],
        exports: [simulacro_service_1.SimulacroService],
    })
], SimulacroModule);
exports.SimulacroModule = SimulacroModule;
//# sourceMappingURL=simulacro.module.js.map