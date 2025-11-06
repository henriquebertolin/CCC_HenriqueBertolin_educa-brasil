import { FastifyReply, FastifyRequest } from "fastify";
import { UserUseCase } from "../usecase/UserUseCase";
import z from "zod";
import jwt from 'jsonwebtoken'
import { CreateUsuarioRequest, GetUserByIdRequest } from "../entities/User";
import { MatriculaUseCase } from "../usecase/MatriculaUseCase";
import { createMatriculaRequest, GetAlunoData } from "../entities/Matricula";
import { GetCursoData } from "../entities/Curso";

export class MatriculaController {
    private matriculaUseCase: MatriculaUseCase;

    constructor() {
        this.matriculaUseCase = new MatriculaUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        console.log('oi')
        try {
            const createMatriculaSchema = z.object({
                alunoId: z.string().min(1, "Id do aluno é obrigatório"),
                cursoId: z.string().min(1, "Id do curso é obrigatório")
            })

            const validationResult = createMatriculaSchema.safeParse(request.body)


            if (!validationResult.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                });
            }

            const createData = validationResult.data as createMatriculaRequest;

            if (!createData) {
                return reply.code(400).send({
                    error: 'Cannot be null'
                })
            }

            const matricula = await this.matriculaUseCase.createMatricula(createData);
            return reply.status(201).send({
                message: 'Matricula created successfully',
                matricula
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create matricula'
            })
        }
    }

    async getCursosByAluno(request: FastifyRequest, reply: FastifyReply) {
        try {
            const getAlunoParamsSchema = z.object({
                id: z.string().min(1, "id is required"),
            });
            const paramsValidation = getAlunoParamsSchema.safeParse(
                request.params
            );

            if (!paramsValidation.success) {
                return reply.status(400).send({
                    error: "Invalid params data",
                    details: paramsValidation.error,
                });
            }
            const alunoData = paramsValidation.data as GetAlunoData;

            const aluno = await this.matriculaUseCase.findCursosByAluno(alunoData);

            return reply.status(200).send({
                message: "aluno found",
                aluno: aluno,
            });
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || "Failed to find aluno",
            });
        }
    }

    async getAlunosByCurso(request: FastifyRequest, reply: FastifyReply) {
        try {
            const getCursoParamsSchema = z.object({
                id: z.string().min(1, "id is required"),
            });
            const paramsValidation = getCursoParamsSchema.safeParse(
                request.params
            );

            if (!paramsValidation.success) {
                return reply.status(400).send({
                    error: "Invalid params data",
                    details: paramsValidation.error,
                });
            }
            const cursoData = paramsValidation.data as GetCursoData;

            const alunos = await this.matriculaUseCase.findAlunosByCurso(cursoData);

            return reply.status(200).send({
                message: "alunos found",
                aluno: alunos,
            });
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || "Failed to find alunos",
            });
        }
    }
}