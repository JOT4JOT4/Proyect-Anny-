"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MallasModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mallas_service_1 = require("./mallas.service");
const mallas_controller_1 = require("./mallas.controller");
const mongoose_1 = require("@nestjs/mongoose");
const course_schema_1 = require("../schemas/course.schema");
const malla_schema_1 = require("../schemas/malla.schema");
const avance_schema_1 = require("../schemas/avance.schema");
let MallasModule = class MallasModule {
};
MallasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([
                { name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema },
                { name: malla_schema_1.Malla.name, schema: malla_schema_1.MallaSchema },
                { name: avance_schema_1.Avance.name, schema: avance_schema_1.AvanceSchema },
            ]),
        ],
        controllers: [mallas_controller_1.MallasController],
        providers: [mallas_service_1.MallasService],
    })
], MallasModule);
exports.MallasModule = MallasModule;
//# sourceMappingURL=mallas.module.js.map