"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumModule = void 0;
const common_1 = require("@nestjs/common");
const curriculum_service_1 = require("./curriculum.service");
const curriculum_controller_1 = require("./curriculum.controller");
const mongoose_1 = require("@nestjs/mongoose");
const course_schema_1 = require("../schemas/course.schema");
const malla_schema_1 = require("../schemas/malla.schema");
let CurriculumModule = class CurriculumModule {
};
CurriculumModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema }, { name: malla_schema_1.Malla.name, schema: malla_schema_1.MallaSchema }]),
        ],
        controllers: [curriculum_controller_1.CurriculumController],
        providers: [curriculum_service_1.CurriculumService],
    })
], CurriculumModule);
exports.CurriculumModule = CurriculumModule;
//# sourceMappingURL=curriculum.module.js.map