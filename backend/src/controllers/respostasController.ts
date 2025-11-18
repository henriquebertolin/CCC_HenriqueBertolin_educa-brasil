import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import jwt from 'jsonwebtoken'
import { CreateRespostaRequest } from "../entities/Resposta";
import { RespostasUseCase } from "../usecase/RespostasUseCase";
import { GetCursoData } from "../entities/Curso";

export class RespostasController {
    private respostasUseCase: RespostasUseCase;

    constructor() {
        this.respostasUseCase = new RespostasUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {

            const createRespostaSchema = z.object({
                texto: z.string().min(1, "Resposta é obrigatória"),
                id_usuario: z.uuid("Id must be a valid UUID"),
                id_pergunta: z.uuid("Id must be a valid UUID")
            });
            const validationResult = createRespostaSchema.safeParse(request.body);
            if (!validationResult.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                });
            }
            const createData = validationResult.data as CreateRespostaRequest;
            if (!createData) {
                return reply.code(400).send({
                    error: 'Cannot be null'
                })
            }
            const resposta = await this.respostasUseCase.createResposta(createData);

            return reply.status(201).send({
                message: 'Resposta created sucessfully',
                resposta
            })
        }
        catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create resposta'
            })
        }
    }

    async findByPerguntas(request: FastifyRequest, reply: FastifyReply) {
        try {
            const getRespostasParamsSchema = z.object({
                id: z.string().min(1, "id is required"),
            });
            const paramsValidation = getRespostasParamsSchema.safeParse(
                request.params
            );

            if (!paramsValidation.success) {
                return reply.status(400).send({
                    error: "Invalid params data",
                    details: paramsValidation.error,
                });
            }
            const cursoData = paramsValidation.data as GetCursoData;
            const respostas = await this.respostasUseCase.findRespostasByPergunta(cursoData);

            return reply.status(200).send({
                message: 'Respostas found',
                respostas
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to find Respostas'
            })
        }
    }
}