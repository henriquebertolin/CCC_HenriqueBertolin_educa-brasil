import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CursosUseCase } from "../usecase/CursosUseCase"
import jwt from 'jsonwebtoken'
import { CreateCursoRequest, GetCursoData } from "../entities/Curso";


export class CursosController {
    private cursosUseCase: CursosUseCase;

    constructor() {
        this.cursosUseCase = new CursosUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const createCursoSchema = z.object({
                title: z.string().min(1, "Título é obrigatório"),
                description: z.string().min(1, "Descrição é obrigatório"),
                teacherId: z.string().min(1, "Professor é obrigatório"),
            })

            const validationResult = createCursoSchema.safeParse(request.body);

            if (!validationResult.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                });
            }

            const createData = validationResult.data as CreateCursoRequest;

            if (!createData) {
                return reply.code(400).send({
                    error: 'Cannot be null'
                })
            }

            const curso = await this.cursosUseCase.createCurso(createData);

            return reply.status(201).send({
                message: 'curso created sucessfully',
                curso
            })

        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create curso'
            })
        }

    }

    async getCursos(request: FastifyRequest, reply: FastifyReply) {
        try {
            const summary = await this.cursosUseCase.findCursos();
            return reply.status(200).send({
                message: 'cursos retrieved successfully',
                data: summary
            });
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to retrieve cursos'
            });
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply) {
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
            const aulas = await this.cursosUseCase.findById(cursoData);

            return reply.status(200).send({
                message: 'Curso found',
                aulas
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to retrieve curso'
            });
        }
    }

    async findCursosByProf(request: FastifyRequest, reply: FastifyReply) {
        const token = request.headers.authorization?.replace('Bearer ', '') as any;
        const decoded = jwt.decode(token) as any;
        console.log("DECODED: " + decoded.username);
        const curso = await this.cursosUseCase.findByProf(({ id: decoded.id }));
        return reply.status(200).send({
            message: 'Cursos found',
            curso
        })

    }


}