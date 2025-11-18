import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { PerguntasController } from "../controllers/perguntasController";


export async function perguntasRoutes(fastify: FastifyInstance) {
    const perguntasController = new PerguntasController();

    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.post(
            "/perguntas/create",
            perguntasController.create.bind(perguntasController)
        );

        fastify.get("/perguntas/findByCurso/:id", perguntasController.findByCurso.bind(perguntasController));
        fastify.get("/perguntas/findById/:id", perguntasController.findById.bind(perguntasController));

    });
    
}