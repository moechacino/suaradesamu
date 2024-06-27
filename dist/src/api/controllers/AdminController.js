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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const AdminService_1 = require("../services/AdminService");
const ApiResponder_1 = require("../utils/ApiResponder");
class AdminController {
    static login(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield AdminService_1.AdminService.login(request);
            console.log(result);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static logout(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = request.user.id;
            const result = yield AdminService_1.AdminService.logout(id);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
}
exports.AdminController = AdminController;
