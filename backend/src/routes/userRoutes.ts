import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";

export async function userRoutes (fastify:FastifyInstance) {
    const userController = new UserController();

    fastify.post('/user/create', userController.create.bind(userController))

}