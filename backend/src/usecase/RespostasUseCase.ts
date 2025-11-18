import { db } from "../db";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CreateRespostaRequest, CreateRespostaResponse } from "../entities/Resposta";
import { GetCursoData } from "../entities/Curso";

export class RespostasUseCase {
    async createResposta(respostaData: CreateRespostaRequest): Promise<CreateRespostaResponse> {

        const create = await db.query(`insert into respostas (texto, id_usuario, id_pergunta) values ($1, $2, $3) returning id`
            , [respostaData.texto, respostaData.id_usuario, respostaData.id_pergunta]
        );
        return create.rows[0];
    }

    async findRespostasByPergunta(cursoData: GetCursoData): Promise<CreateRespostaRequest[]> {
        const query = await db.query(`select r.*, u.nome from respostas r inner join usuarios u on r.id_usuario = u.id where r.id_pergunta = $1`, [cursoData.id]);
        return query.rows;
    }
}