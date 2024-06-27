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
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const candidateRoutes_1 = __importDefault(require("./candidateRoutes"));
const voterRoutes_1 = __importDefault(require("./voterRoutes"));
const votingRoutes_1 = __importDefault(require("./votingRoutes"));
function publicApi(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.register(adminRoutes_1.default, { prefix: "/admin" });
        server.register(candidateRoutes_1.default, { prefix: "/candidate" });
        server.register(voterRoutes_1.default, { prefix: "/voter" });
        server.register(votingRoutes_1.default, { prefix: "/voting" });
    });
}
exports.default = publicApi;
