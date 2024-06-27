import { FastifyPluginCallback } from "fastify";
declare module "fastify" {
    interface FastifyInstance {
        authenticate: Function;
    }
}
declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            username: string;
        };
    }
}
declare const _default: FastifyPluginCallback;
export default _default;
