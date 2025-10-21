import { db } from "../db";
import { CreateUsuarioReponse, CreateUsuarioRequest, LoginRequest, LoginResponse } from "../entities/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class UserUseCase {

    async createUser (userData : CreateUsuarioRequest): Promise<CreateUsuarioReponse> {
    const result = await db.query(
      `SELECT 1 FROM usuarios WHERE email = $1 OR username = $2`,
      [userData.email, userData.username]
    );

    if (result.rows.length > 0) {
      throw new Error("Email ou username já estão sendo utilizados");
    }

        const password = await bcrypt.hash(userData.senha, 10);

        const create = await db.query(`insert into usuarios (username, email, senha, nome, cidade, professor) values ($1, $2, $3, $4, $5, $6) returning id`
            , [userData.username, userData.email, password, userData.name, userData.cidade, userData.professor]
        );
        return create.rows[0];
    }

}