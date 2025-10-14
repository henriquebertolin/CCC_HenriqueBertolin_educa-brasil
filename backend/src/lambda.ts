import Fastify from 'fastify'
import awsLambdaFastify from '@fastify/aws-lambda'
import dotenv from 'dotenv'
import { loginRoute } from './routes/loginRoutes'
import cors from '@fastify/cors'

dotenv.config() 
const PORT = Number(process.env.PORT) || 3000;
const fastify = Fastify({ logger : true})
fastify.register(loginRoute)
fastify.register(cors);

fastify.ready()

if (require.main === module) {
    fastify.listen({ port : PORT }).then(() => {
        console.log('🚀 Server listening on http://localhost:3333')
    }).catch(err => {
        console.error(err)
        process.exit(1)
    })
}

const proxy = awsLambdaFastify(fastify)

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false
  
  try {
    return await proxy(event, context)
  } catch (error) {
    console.error('Lambda error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}