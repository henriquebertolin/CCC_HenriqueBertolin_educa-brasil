import { db } from "../db";
import { LoginRequest, LoginResponse } from "../entities/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'henrigor';

export class LoginUseCase {

    async login(userData: LoginRequest): Promise<LoginResponse>{
        const {username, password} = userData;

        const result = await db.query(`SELECT * from users where username = $1`, [username]);
        if(result.rows.length === 0){
            throw new Error('Invalid credentials');
        }

        const user = result.rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword){
            
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
                city: user.city,
                creation_date: user.creation_date, 
            }
        }
    }
}