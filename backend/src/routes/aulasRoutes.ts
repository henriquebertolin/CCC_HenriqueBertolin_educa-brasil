import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { AulasController } from "../controllers/aulasController";

export async function aulasRoutes(fastify: FastifyInstance) {
    const aulasController = new AulasController();

    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.post("/aulas/create", aulasController.create.bind(aulasController));
        fastify.get("/aulas/getAulasFromCurso/:id", aulasController.getAulasFromCurso.bind(aulasController));
    })
}