import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";


export async function userRoutes(fastify: FastifyInstance) {
    const userController = new UserController();

    fastify.post('/user/create', userController.create.bind(userController))
    fastify.register(async function (fastify) {
        fastify.addHook("preHandler", authMiddleware);
        fastify.get(
            "/user/:id",
            userController.getUserById.bind(userController)
        );
        fastify.get(
            "/user/loggedUser",
            userController.getLoggedUser.bind(userController)
        );
        fastify.put("/user/update", userController.updateUser.bind(userController));

    });
}