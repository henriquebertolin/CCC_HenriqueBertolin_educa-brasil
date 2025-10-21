import { db } from "../db";
import { LoginRequest, LoginResponse } from "../entities/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'henrigor';

export class LoginUseCase {

    async login(userData: LoginRequest): Promise<LoginResponse>{
        const {username, senha} = userData;

        const result = await db.query(`SELECT * from usuarios where username = $1`, [username]);
        if(result.rows.length === 0){
            throw new Error('Invalid credentials');
        }

        const user = result.rows[0];

        const isValidSenha = await bcrypt.compare(senha, user.senha);

        if(!isValidSenha){
            
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({
            id: user.id, username: user.username
        }, JWT_SECRET, {
            expiresIn: '24h'
        })
        return {
            token,
            user: {
                id: user.id,
                username: user.username, 
                name: user.name,
                cidade: user.cidade,
                criacao: user.creation_date, 
            }
        }
    }
}