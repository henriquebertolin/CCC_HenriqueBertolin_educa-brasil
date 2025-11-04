import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { CursosController } from "../controllers/cursosController";


export async function cursosRoutes(fastify: FastifyInstance) {
    const cursosController = new CursosController();

    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.post(
            "/cursos/create",
            cursosController.create.bind(cursosController)
        );

    });
}