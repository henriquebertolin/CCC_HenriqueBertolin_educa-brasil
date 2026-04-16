import Fastify from 'fastify'
import cors from '@fastify/cors'
import { loginRoute } from './routes/loginRoutes'
import dotenv from 'dotenv'
import { userRoutes } from './routes/userRoutes'
import { cursosRoutes } from './routes/cursosRoutes'
import { matriculasRoutes } from './routes/matriculaRoutes'
import { aulasRoutes } from './routes/aulasRoutes'
import { perguntasRoutes } from './routes/perguntasRoutes'
import { respostasRoutes } from './routes/respostasRoutes'

dotenv.config()


const fastify = Fastify({
    logger: true
})


fastify.register(cors, {
  origin: ["http://localhost:5173", "http://100.96.1.2:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
fastify.register(loginRoute);
fastify.register(userRoutes);
fastify.register(cursosRoutes);
fastify.register(matriculasRoutes);
fastify.register(aulasRoutes);
fastify.register(perguntasRoutes);
fastify.register(respostasRoutes);

// validar conexão com o banco

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: '100.96.1.2'
    });

    fastify.log.info(`Servidor rodando na porta ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();