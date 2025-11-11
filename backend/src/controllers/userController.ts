import { FastifyReply, FastifyRequest } from "fastify";
import { UserUseCase } from "../usecase/UserUseCase";
import z from "zod";
import jwt from 'jsonwebtoken'
import { CreateUsuarioRequest, GetUserByIdRequest, GetUserByUsernameRequest } from "../entities/User";

export class UserController {
    private userUseCase: UserUseCase;

    constructor() {
        this.userUseCase = new UserUseCase();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const createUserSchema = z.object({
                name: z.string().min(1, "Nome é obrigatório"),
                username: z.string().min(1, "Usernamr é obrigatório"),
                email: z.email().min(1, "Email é obrigatório"),
                senha: z.string().min(1, "Senha é obrigatória"),
                professor: z.boolean("Boolean é obrigatório"),
                cidade: z.string().min(1, "Cidade é obrigatória")
            })

            const validationResult = createUserSchema.safeParse(request.body);

            if (!validationResult.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                });
            }

            const createData = validationResult.data as CreateUsuarioRequest;

            if (!createData) {
                return reply.code(400).send({
                    error: 'Cannot be null'
                })
            }

            const user = await this.userUseCase.createUser(createData);

            return reply.status(201).send({
                message: 'User created sucessfully',
                user
            })

        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to create user'
            })
        }

    }

    async updateUser(request : FastifyRequest, reply: FastifyReply) {
        const token = request.headers.authorization?.replace('Bearer ', '') as any;
        const decoded = jwt.decode(token) as any;
        console.log("id: " + decoded.id);
        try {

        } catch (error : any) {
            
        }
    }

    async getLoggedUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '') as any;
            const decoded = jwt.decode(token) as any;
            console.log("DECODED: " + decoded.username);
            const user = await this.userUseCase.findByUsername(({ username: decoded.username }));

            return reply.status(200).send({
                message : 'User found',
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
                    error : 'Cannot be null'
                });
            }
            const user = await this.userUseCase.findById(id);

            return reply.status(200).send({
                message : 'User found',
                user
            })
        } catch (error: any) {
            return reply.status(400).send({
                error: error.message || 'Failed to find user',
            });
        }
    }
}