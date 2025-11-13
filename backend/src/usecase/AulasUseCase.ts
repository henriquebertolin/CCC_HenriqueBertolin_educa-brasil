import { db } from "../db";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CreateAulasRequest, CreateAulasResponse, GetAulasFromCursoResponse } from "../entities/Aulas";
import { GetCursoData } from "../entities/Curso";

export class AulasUseCase {
    async createAula (aulaData : CreateAulasRequest) : Promise<CreateAulasResponse> {
        const create = await db.query(`insert into aulas (id_curso, titulo, descricao, is_video, position) values ($1, $2, $3, $4, $5) returning id`,
        [aulaData.id_curso, aulaData.titulo, aulaData.descricao, aulaData.is_video, aulaData.posicao]);
        return create.rows[0];
    }

    async getAulasFromCurso (id : GetCursoData) : Promise<GetAulasFromCursoResponse[]> {
        const aulasFromCurso = await db.query(`select id, id_curso, titulo, descricao, 
            is_video, position, is_published, estimated_sec, video_url, material_url, material_text from aulas
            where id_curso = $1`, [id.id]);
        return aulasFromCurso.rows;
    }
}