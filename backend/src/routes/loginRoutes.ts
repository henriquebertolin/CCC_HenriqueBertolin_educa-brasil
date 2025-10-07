import { FastifyInstance } from "fastify";
import { LoginController } from "../controllers/loginController";

export async function loginRoute(fastify:FastifyInstance) {
    
    const loginController = new LoginController();
    //ROTA PUBLICA
    fastify.post('/login', loginController.login.bind(loginController))
}