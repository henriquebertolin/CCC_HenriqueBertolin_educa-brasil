import Fastify from 'fastify'
import cors from '@fastify/cors'
import { loginRoute } from './routes/loginRoutes'
import dotenv from 'dotenv'
import { userRoutes } from './routes/userRoutes'
import { cursosRoutes } from './routes/cursosRoutes'
import { matriculasRoutes } from './routes/matriculaRoutes'

dotenv.config()


const fastify = Fastify({
    logger: true
})


fastify.register(cors, {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
fastify.register(loginRoute);
fastify.register(userRoutes);
fastify.register(cursosRoutes);
fastify.register(matriculasRoutes);

// validar conexão com o banco

const PORT = Number(process.env.PORT) || 3000;

const start = async() => { fastify.listen({port: PORT})
.then(() => fastify.log.info(`Servidor rodando na porta ${PORT}`))
.catch(err => {
    fastify.log.error(err);
    process.exit(1);
})
}

start();