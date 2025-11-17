import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import jwt from 'jsonwebtoken'
import { AulasUseCase } from "../usecase/AulasUseCase";
import { CreateAulasRequest, CreateAulasResponse, UpdateAulaVideoRequest } from "../entities/Aulas";
import { GetCursoData } from "../entities/Curso";
import { MultipartFile } from '@fastify/multipart';



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
                posicao: z.number().min(1, "Posição é obrigatória"),
                estimated_sec: z.number().min(1, "Tempo estimado é obrigatório"),
                material_text: z.string().min(1, "Texto é obrigatório"),
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

    async find(request: FastifyRequest, reply: FastifyReply) {
        try {
            const getAulaIdParamsSchema = z.object({
                id: z.string().min(1, "id is required"),
            });
            const paramsValidation = getAulaIdParamsSchema.safeParse(
                request.params
            );
            if (!paramsValidation.success) {
                return reply.status(400).send({
                    error: "Invalid params data",
                    details: paramsValidation.error,
                });
            }
            const aulaData = paramsValidation.data as CreateAulasResponse;
            const aula = await this.aulasUseCase.find(aulaData);

            return reply.status(200).send({
                message: 'Aula found',
                aula
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || "Failed to find aulas",
            });
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

    async uploadMaterial(request: FastifyRequest, reply: FastifyReply) {
        console.log("veio pro controller");
        try {
            const getAulaIdParamsSchema = z.object({
                id: z.string().min(1, "id is required"),
            });
            const paramsValidation = getAulaIdParamsSchema.safeParse(
                request.params
            );
            if (!paramsValidation.success) {
                return reply.status(400).send({
                    error: "Invalid params data",
                    details: paramsValidation.error,
                });
            }
            const cursoData = paramsValidation.data as CreateAulasResponse;
            const data = await request.file();
            console.log("um")
            if (!data) {
                return reply.status(400).send({
                    error: 'No files sent',
                    success: false
                });
            }
            console.log('dois')
            // const extraSchema = z.object({
            //     estimated_sec: z.coerce.number().int().min(0),
            //     material_text: z.string().min(1),
            // });

            // const fields = (data as any).fields || {};
            // console.log('tres')
            // const extraValidation = extraSchema.safeParse({
            //     estimated_sec: fields.estimated_sec?.value,
            //     material_text: fields.material_text?.value,
            // });
            // console.log("quatro")
            // if (!extraValidation.success) {
            //     return reply.status(400).send({
            //         error: "Invalid body data",
            //         details: extraValidation.error,
            //         success: false,
            //     });
            // }
            // console.log('cinco')
            // const { estimated_sec, material_text } = extraValidation.data;


            if (!this.isValidFileType(data.mimetype)) {
                return reply.status(400).send({
                    error: "File extension not supported. Use only PDF and MP4.",
                    success: false,
                });
            }

            const buffer = await data.toBuffer();

            if (buffer.length > 15 * 1024 * 1024) { // 15MB
                return reply.status(400).send({
                    error: "File too large. Maximum size: 15MB",
                    success: false,
                });
            }

            // Preparar dados para o useCase ##### TODO
            const aula: UpdateAulaVideoRequest = {
                id: cursoData.id,
                // estimated_sec,
                // material_text,
                material: {
                    filename: data.filename,
                    mimetype: data.mimetype,
                    buffer: buffer
                }
            };
            const result = await this.aulasUseCase.uploadMaterial(aula);
            return result;
        } catch (error: any) {
            console.error("Erro ao fazer upload da aula:", error);
            return reply.status(400).send({
                error: error.message || "Failed to upload aula",
                success: false,
            });
        }
    }

    async getMaterialUrl(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };

            if (!id) {
                return reply.status(400).send({
                    error: "Aula ID is required",
                    success: false
                });
            }

            // Validar UUID
            const paramSchema = z.uuid("ID must be a valid UUID");
            const validation = paramSchema.safeParse(id);

            if (!validation.success) {
                return reply.status(400).send({
                    error: "Invalid ID",
                    success: false,
                });
            }

            // Gerar URL assinada
            const signedUrl = await this.aulasUseCase.getMaterialUrl(id);

            return reply.status(200).send({
                message: "URL success generated",
                data: {
                    signed_url: signedUrl,
                    expires_in: 360000 // 1 hora em segundos
                },
                success: true,
            });

        } catch (error: any) {
            console.error("Erro ao gerar URL do comprovante:", error);
            return reply.status(400).send({
                error: error.message || "Failed accessing the payment proof.",
                success: false,
            });
        }
    }

    private isValidFileType(mimetype: string): boolean {
        return [
            'application/pdf',   // PDF
            'video/mp4'          // MP4
        ].includes(mimetype);
    }

}
