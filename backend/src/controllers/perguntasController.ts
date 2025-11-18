import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import jwt from 'jsonwebtoken'
import { CreatePerguntasRequest } from "../entities/Perguntas";
import { PerguntasUseCase } from "../usecase/PerguntasUseCase";
import { GetCursoData } from "../entities/Curso";

export class PerguntasController {
    private perguntasUseCase: PerguntasUseCase;

    constructor() {
        this.perguntasUseCase = new PerguntasUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const createPerguntaSchema = z.object({
                texto: z.string().min(1, "Pergunta é obrigatória"),
                id_usuario: z.uuid("Id must be a valid UUID"),
                id_curso: z.uuid("Id must be a valid UUID")
            });
            const validationResult = createPerguntaSchema.safeParse(request.body);
            if (!validationResult.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                });
            }
            const createData = validationResult.data as CreatePerguntasRequest;
            if (!createData) {
                return reply.code(400).send({
                    error: 'Cannot be null'
                })
            }
            const pergunta = await this.perguntasUseCase.createPergunta(createData);

            return reply.status(201).send({
                message: 'Pergunta created sucessfully',
                pergunta
            })
        }
        catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create aula'
            })
        }
    }

    async findByCurso(request: FastifyRequest, reply: FastifyReply) {
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
            const perguntas = await this.perguntasUseCase.findPerguntasByCurso(cursoData);

            return reply.status(200).send({
                message: 'Perguntas found',
                perguntas
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create aula'
            })
        }
    }
}