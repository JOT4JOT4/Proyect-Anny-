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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const credential_schema_1 = require("../schemas/credential.schema");
let AuthService = class AuthService {
    constructor(httpService, credentialModel) {
        this.httpService = httpService;
        this.credentialModel = credentialModel;
    }
    async login(email, password) {
        if (process.env.LOCAL_AUTH === 'true') {
            const cred = await this.credentialModel.findOne({ email, password }).lean();
            if (!cred)
                return { error: 'credenciales incorrectas' };
            return { rut: cred.rut, carreras: cred.carreras };
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`https://puclaro.ucn.cl/eross/avance/login.php`, {
                params: {
                    email,
                    password,
                },
            }));
            return response.data;
        }
        catch (error) {
            throw new Error('Error en la autenticación');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(credential_schema_1.Credential.name)),
    __metadata("design:paramtypes", [axios_1.HttpService, mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map