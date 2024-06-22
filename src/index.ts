import Fastify from "fastify";
import { CustomAPIError } from "./api/errors/CustomAPIError";
import publicApi from "./api/routes/publicApi";
import { ApiResponder } from "./api/utils/ApiResponder";
import authPlugin from "./api/plugins/authPlugin";
import multer from "fastify-multer";
import { ContractExecutionError, Eip838ExecutionError } from "web3";
const port = (Number(process.env.PORT) as number) || 9000;
const fastify = Fastify({
  logger: true,
});

fastify.setErrorHandler((error, request, reply) => {
  console.log(error);

  if (error instanceof CustomAPIError) {
    ApiResponder.errorResponse(reply, error.statusCode, error.message);
  } else if (error.validation) {
    ApiResponder.errorResponse(reply, 400, error.message);
  } else if (error instanceof ContractExecutionError) {
    if (error.cause instanceof Eip838ExecutionError) {
      ApiResponder.errorResponse(reply, 409, error.cause.message);
    }
    ApiResponder.errorResponse(reply, 500, error.message);
  } else {
    reply.status(500).send("Something went wrong please try again later");
  }
});

fastify.register(multer.contentParser);
fastify.register(authPlugin);

fastify.register(publicApi, { prefix: "/api" });
fastify.get("/", async (req, res) => {
  res.send("Home");
});

fastify.listen({ port: port, host: "127.0.0.1" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server is listening on ${address}`);
});
