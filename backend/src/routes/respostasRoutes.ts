import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { RespostasController } from "../controllers/respostasController";


export async function respostasRoutes(fastify: FastifyInstance) {
    const respostasController = new RespostasController();

    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.post(
            "/respostas/create",
            respostasController.create.bind(respostasController)
        );

        fastify.get("/respostas/findByPergunta/:id", respostasController.findByPerguntas.bind(respostasController));

    });
    
}