import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { CursosController } from "../controllers/cursosController";
import { MatriculaController } from "../controllers/matriculaController";


export async function matriculasRoutes(fastify: FastifyInstance) {
    const matriculasController = new MatriculaController();

    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.post(
            "/matriculas/create",
            matriculasController.create.bind(matriculasController)
        );

        fastify.get("/matriculas/findAlunosByCurso/:id", matriculasController.getAlunosByCurso.bind(matriculasController));
        fastify.get("/matriculas/findCursosByAluno", matriculasController.getCursosByAluno.bind(matriculasController));
        
    });

}