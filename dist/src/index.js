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
const fastify_1 = __importDefault(require("fastify"));
const CustomAPIError_1 = require("./api/errors/CustomAPIError");
const publicApi_1 = __importDefault(require("./api/routes/publicApi"));
const ApiResponder_1 = require("./api/utils/ApiResponder");
const authPlugin_1 = __importDefault(require("./api/plugins/authPlugin"));
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const cors_1 = __importDefault(require("@fastify/cors"));
const path_1 = __importDefault(require("path"));
const web3_1 = require("web3");
const port = Number(process.env.PORT) || 9000;
const fastify = (0, fastify_1.default)({
    logger: true,
});
fastify.register(cors_1.default, {
    origin: "http://localhost:8080",
});
const pathProfile = path_1.default.join(__dirname, "../uploads/candidate/profile");
console.log(pathProfile);
fastify.register(require("@fastify/static"), {
    root: pathProfile,
    prefix: "/profile/",
});
fastify.register(fastify_multer_1.default.contentParser);
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    if (error instanceof CustomAPIError_1.CustomAPIError) {
        ApiResponder_1.ApiResponder.errorResponse(reply, error.statusCode, error.message);
    }
    else if (error.validation) {
        ApiResponder_1.ApiResponder.errorResponse(reply, 400, error.message);
    }
    else if (error instanceof web3_1.ContractExecutionError) {
        if (error.cause instanceof web3_1.Eip838ExecutionError) {
            ApiResponder_1.ApiResponder.errorResponse(reply, 409, error.cause.message);
        }
        ApiResponder_1.ApiResponder.errorResponse(reply, 500, error.message);
    }
    else if (error.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
        ApiResponder_1.ApiResponder.errorResponse(reply, 401, error.message);
    }
    else {
        console.log(error.code);
        reply.status(500).send("Something went wrong please try again later");
    }
});
fastify.register(authPlugin_1.default);
fastify.register(publicApi_1.default, { prefix: "/api" });
fastify.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Home");
}));
fastify.listen({ port: port, host: "127.0.0.1" }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`server is listening on ${address}`);
});
