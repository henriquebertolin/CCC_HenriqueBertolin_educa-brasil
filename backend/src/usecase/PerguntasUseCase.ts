import { db } from "../db";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CreatePerguntasRequest, CreatePerguntasResponse } from "../entities/Perguntas";
import { GetCursoData } from "../entities/Curso";

export class PerguntasUseCase {
    async createPergunta(perguntaData: CreatePerguntasRequest): Promise<CreatePerguntasResponse> {

        const create = await db.query(`insert into perguntas (texto, id_usuario, id_curso) values ($1, $2, $3) returning id`
            , [perguntaData.texto,perguntaData.id_usuario, perguntaData.id_curso]
        );
        return create.rows[0];
    }

    async findPerguntasByCurso(cursoData : GetCursoData): Promise<CreatePerguntasRequest[]> {
        const query = await db.query(`select p.*, u.nome from perguntas p inner join usuarios u on p.id_usuario = u.id where p.id_curso = $1`, [cursoData.id]);
        return query.rows;
    }
}