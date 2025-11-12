import { db } from "../db";
import { CreateUsuarioReponse, CreateUsuarioRequest, FindByIdResponse, GetUserByIdRequest, GetUserByUsernameRequest, LoginRequest, LoginResponse, UpdateResponse, UpdateUsuarioRequest } from "../entities/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class UserUseCase {

  async createUser(userData: CreateUsuarioRequest): Promise<CreateUsuarioReponse> {
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

  async findById(userData: GetUserByIdRequest): Promise<FindByIdResponse> {
    const result = await db.query(`select * from usuarios where id = $1`, [userData.id]);
    if (result.rows.length < 1) {
      throw new Error('There is no user with this ID');
    }
    return result.rows[0];
  }

  async findByUsername(userData: GetUserByUsernameRequest): Promise<FindByIdResponse> {
    console.log(userData.username)
    const result = await db.query(`select * from usuarios where username = $1`, [userData.username]);
    if (result.rows.length < 1) {
      throw new Error('There is no user with this username');
    }
    return result.rows[0];
  }

  async updateUser(userData : UpdateUsuarioRequest): Promise<UpdateResponse> {
    const { id, name, username, email, senha, cidade } = userData;
    const existingUser = await db.query(`select * from usuarios where id = $1`, [id]);
    if (existingUser.rows.length < 1) {
      throw new Error ('There is no user with this ID');
    }
    let hashPass;
    if (senha) {
      hashPass = await bcrypt.hash(senha, 10);
    }
    const currentDate = new Date();
    console.log("CIDADE")
    console.log(existingUser.rows[0].cidade)
    const user = {
      id,
      name : name || existingUser.rows[0].name,
      username : username || existingUser.rows[0].username,
      email : email || existingUser.rows[0].email,
      senha : hashPass || existingUser.rows[0].senha,
      cidade : cidade || existingUser.rows[0].cidade
    }
    const result = await db.query(`UPDATE usuarios set 
      nome = $2,
      username = $3,
      email = $4,
      senha = $5,
      cidade = $6
      where id = $1`, [user.id, user.name, user.username, user.email, user.senha, user.cidade])
      if (result.rowCount && result.rowCount < 1) {
            throw new Error('Error on update');
        }
        return { success: true };
  }
}