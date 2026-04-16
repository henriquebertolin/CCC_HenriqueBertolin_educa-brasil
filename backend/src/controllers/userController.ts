import { FastifyReply, FastifyRequest } from "fastify";
import { UserUseCase } from "../usecase/UserUseCase";
import z from "zod";
import jwt from 'jsonwebtoken'
import { CreateUsuarioRequest, GetUserByIdRequest, GetUserByUsernameRequest, UpdateUsuarioRequest } from "../entities/User";

export class UserController {
    private userUseCase: UserUseCase;

    constructor() {
        this.userUseCase = new UserUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const createUserSchema = z.object({
                name: z.string().min(1, "Nome é obrigatório"),
                username: z.string().min(1, "Username é obrigatório"),
                email: z.string().email("Email inválido"),
                senha: z.string()
                    .min(6, "Senha deve ter no mínimo 6 caracteres")
                    .regex(/[A-Z]/, "Deve conter pelo menos 1 letra maiúscula")
                    .regex(/[a-z]/, "Deve conter pelo menos 1 letra minúscula")
                    .regex(/[0-9]/, "Deve conter pelo menos 1 número")
                    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos 1 caractere especial"),
                professor: z.boolean({
                    error: "Professor deve ser true ou false"
                }),
                cidade: z.string().min(1, "Cidade é obrigatória")
            });

            const validationResult = createUserSchema.safeParse(request.body);

            if (!validationResult.success) {
                return reply.status(400).send({
                    message: validationResult.error.issues[0]?.message || "Dados inválidos",
                    errors: validationResult.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });
            }

            const createData: CreateUsuarioRequest = validationResult.data;

            const user = await this.userUseCase.createUser(createData);

            return reply.status(201).send({
                message: "User created successfully",
                user
            });

        } catch (error: any) {
            return reply.status(500).send({
                message: error.message || "Failed to create user"
            });
        }
    }

    async updateUser(request: FastifyRequest, reply: FastifyReply) {
        const token = request.headers.authorization?.replace('Bearer ', '') as any;
        const decoded = jwt.decode(token) as any;
        console.log("DECODED: " + decoded.username);

        try {
            const updateUserBodySchema = z.object({
                name: z.string().optional(),
                username: z.string().optional(),
                email: z.string().optional(),
                senha: z.string().optional(),
                cidade: z.string().optional()
            });

            const parse = updateUserBodySchema.safeParse(request.body);
            if (!parse.success) {
                return reply.status(400).send({
                    error: "Invalid body data",
                    details: parse.error,
                });
            }

            const updateData = parse.data;
            const userData: UpdateUsuarioRequest = {
                id: decoded.id,
                ...updateData
            };

            await this.userUseCase.updateUser(userData);


        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to update user',
            });
        }
    }

    async getLoggedUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '') as any;
            const decoded = jwt.decode(token) as any;
            console.log("DECODED: " + decoded.username);
            const user = await this.userUseCase.findById(({ id: decoded.id }));

            return reply.status(200).send({
                message: 'User found',
                user
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to find user',
            });
        }
    }

    async getUserById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const id = request.params as GetUserByIdRequest;
            if (!id) {
                return reply.status(404).send({
                    error: 'Cannot be null'
                });
            }
            const user = await this.userUseCase.findById(id);

            return reply.status(200).send({
                message: 'User found',
                user
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to find user',
            });
        }
    }
}