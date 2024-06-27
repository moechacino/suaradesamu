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
const fastify_plugin_1 = require("fastify-plugin");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const Unauthenticated_1 = require("../errors/Unauthenticated");
const database_1 = require("../../config/database");
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";
const authPlugin = (server, undefined, done) => {
    server.register(jwt_1.default, { secret: SECRET_KEY });
    server.decorate("authenticate", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = request.headers.authorization || null;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Unauthenticated_1.Unauthenticated("no token provided");
            }
            const token = authHeader.split(" ")[1];
            const decoded = yield request.jwtVerify();
            const id = decoded.id;
            const isExist = yield database_1.prismaClient.admin.findUnique({
                where: { id: id },
            });
            if ((isExist === null || isExist === void 0 ? void 0 : isExist.token) !== token) {
                throw new Unauthenticated_1.Unauthenticated("no access");
            }
        }
        catch (error) {
            reply.send(error);
        }
    }));
    done();
};
exports.default = (0, fastify_plugin_1.fastifyPlugin)(authPlugin);
