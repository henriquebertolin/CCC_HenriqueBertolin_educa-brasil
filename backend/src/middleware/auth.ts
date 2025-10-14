import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aws-ccc-labengsoft';


export interface AuthenticatedRequest  extends FastifyRequest {
    store?: {
        cnpj: String,
        password: string
    }
}

export async function authMiddleware(
    request: AuthenticatedRequest,
    reply: FastifyReply
){
    try{
        const token = request.headers.authorization?.replace('Bearer ', '');

        if(!token){
            return reply.status(401).send({error: 'Token not provided'})

        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        request.store = decoded
    }catch(error){
        return reply.status(401).send({ error: 'Invalid token' });
    }
}