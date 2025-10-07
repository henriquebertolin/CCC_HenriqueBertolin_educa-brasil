import { FastifyReply, FastifyRequest } from "fastify";
import { LoginUseCase } from "../usecase/LoginUseCase";
import { LoginRequest } from "../entities/User";
import z from "zod";

export class  LoginController {
    private loginUseCase: LoginUseCase;

    constructor(){
        this.loginUseCase = new LoginUseCase();
    }
    //TODO não deixar brute force  no login
    async login(request: FastifyRequest, reply: FastifyReply){
        try{
            const loginSchema = z.object({
                username: z.string().min(1, "username is required"),
                password: z.string().min(1, "Password is required")
            })

            const validationResult = loginSchema.safeParse(request.body)

            if(!validationResult.success){
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validationResult.error
                })
            }
            const loginData = request.body as LoginRequest
            if(!loginData){
                return reply.status(400).send({
                    error: 'Cannot be null'
                })
            }

            const result = await this.loginUseCase.login(loginData);

            return reply.status(200).send(result)

        }catch (error: any){
            return reply.status(401).send({
                error: error.message
            })
        }
    }
}