"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("../../config/database");
const AdminModel_1 = require("../models/AdminModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Unauthenticated_1 = require("../errors/Unauthenticated");
const NotFoundError_1 = require("../errors/NotFoundError");
const CustomAPIError_1 = require("../errors/CustomAPIError");
class AdminService {
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginAdminRequest = request.body;
            let admin = yield database_1.prismaClient.admin.findUnique({
                where: {
                    username: loginAdminRequest.username,
                },
            });
            if (!admin)
                throw new NotFoundError_1.NotFoundError("you are not registered");
            const isMatch = yield bcrypt_1.default.compare(loginAdminRequest.password, admin.password);
            if (!isMatch) {
                throw new Unauthenticated_1.Unauthenticated("username or password is wrong");
            }
            const token = request.server.jwt.sign({
                id: admin.id,
                username: admin.username,
            }, { expiresIn: "24h" });
            admin = yield database_1.prismaClient.admin.update({
                where: { id: admin.id },
                data: {
                    token: token,
                },
            });
            return (0, AdminModel_1.toAdminResponse)(admin);
        });
    }
    static logout(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield database_1.prismaClient.admin.update({
                    where: {
                        id: id,
                    },
                    data: {
                        token: null,
                    },
                });
                return (0, AdminModel_1.toAdminResponse)(admin);
            }
            catch (error) {
                throw new CustomAPIError_1.CustomAPIError(JSON.stringify({
                    message: "Failed to logout",
                    errors: error,
                }), 500);
            }
        });
    }
}
exports.AdminService = AdminService;
