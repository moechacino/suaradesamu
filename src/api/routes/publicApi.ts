import { FastifyInstance } from "fastify";
import adminRoutes from "./adminRoutes";
import candidateRoutes from "./candidateRoutes";
import voterRoutes from "./voterRoutes";

async function publicApi(server: FastifyInstance) {
  server.register(adminRoutes, { prefix: "/admin" });
  server.register(candidateRoutes, { prefix: "/candidate" });
  server.register(voterRoutes, { prefix: "/voter" });
}

export default publicApi;
