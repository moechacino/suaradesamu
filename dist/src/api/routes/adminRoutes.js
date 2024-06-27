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
const adminValidator_1 = require("../validators/adminValidator");
const AdminController_1 = require("../controllers/AdminController");
const CustomAPIError_1 = require("../errors/CustomAPIError");
const loginValidator = adminValidator_1.adminValidator.login();
function adminRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fastify.post("/login", {
                schema: loginValidator,
            }, AdminController_1.AdminController.login);
            fastify.patch("/logout", {
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, AdminController_1.AdminController.logout);
        }
        catch (error) {
            throw new CustomAPIError_1.CustomAPIError(error, 500);
        }
    });
}
exports.default = adminRoutes;
