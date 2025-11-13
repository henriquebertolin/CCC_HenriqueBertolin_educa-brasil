import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import jwt from 'jsonwebtoken'
import { AulasUseCase } from "../usecase/AulasUseCase";
import { CreateAulasRequest } from "../entities/Aulas";
import { GetCursoData } from "../entities/Curso";

export class AulasController {
    private aulasUseCase: AulasUseCase;

    constructor() {
        this.aulasUseCase = new AulasUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const createAulaSchema = z.object({
                id_curso: z.string().min(1, "Curso é obrigatório"),
                titulo: z.string().min(1, "Título é obrigatório"),
                descricao: z.string().min(1, "Descrição é obrigatório"),
                is_video: z.boolean("Tipo de aula é obrigatório"),
                posicao: z.number().min(1, "Posição é obrigatória")
            })
            console.log()
            const validationResult = createAulaSchema.safeParse(request.body);
            if (!validationResult.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                });
            }
            const createData = validationResult.data as CreateAulasRequest;

            if (!createData) {
                return reply.code(400).send({
                    error: 'Cannot be null'
                })
            }

            const aula = await this.aulasUseCase.createAula(createData);

            return reply.status(201).send({
                message: 'Aula created sucessfully',
                aula
            })
        }
        catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create aula'
            })
        }
    }

    async getAulasFromCurso(request: FastifyRequest, reply: FastifyReply) {
        try {
            const getCursoIdParamsSchema = z.object({
                id: z.string().min(1, "id is required"),
            });
            const paramsValidation = getCursoIdParamsSchema.safeParse(
                request.params
            );
            if (!paramsValidation.success) {
                return reply.status(400).send({
                    error: "Invalid params data",
                    details: paramsValidation.error,
                });
            }
            const cursoData = paramsValidation.data as GetCursoData;
            const aulas = await this.aulasUseCase.getAulasFromCurso(cursoData);

            return reply.status(200).send({
                message: 'Aulas found',
                aulas
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || "Failed to find aulas",
            });
        }
    }


}
