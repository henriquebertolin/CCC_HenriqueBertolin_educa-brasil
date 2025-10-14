import Fastify from 'fastify'
import cors from '@fastify/cors'
import { loginRoute } from './routes/loginRoutes'


import dotenv from 'dotenv'

dotenv.config()


const fastify = Fastify({
    logger: true
})


fastify.register(cors);
fastify.register(loginRoute)

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