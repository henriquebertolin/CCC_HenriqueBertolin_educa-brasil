import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { AulasController } from "../controllers/aulasController";

export async function aulasRoutes(fastify: FastifyInstance) {
    const aulasController = new AulasController();

    
    await fastify.register(require('@fastify/multipart'), {
        limits: {
            fieldNameSize: 100,
            fieldSize: 100,
            fields: 10,
            fileSize: 15 * 1024 * 1024, // 5MB
            files: 1,
            headerPairs: 2000,
        },
    });

    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.post("/aulas/create", aulasController.create.bind(aulasController));
        fastify.get("/aulas/getAulasFromCurso/:id", aulasController.getAulasFromCurso.bind(aulasController));
        fastify.put("/aulas/uploadMaterial/:id", aulasController.uploadMaterial.bind(aulasController));
        fastify.get("/aulas/find/:id", aulasController.find.bind(aulasController));
        fastify.get("/aulas/getSignedUrl/:id", aulasController.getMaterialUrl.bind(aulasController));
        fastify.put("/aulas/updateFinalizado/:aluno/:aulaId", aulasController.updateFinalizado.bind(aulasController));
    })
}