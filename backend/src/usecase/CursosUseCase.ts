import { db } from "../db";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CreateCursoRequest, CreateCursoResponse } from "../entities/Curso";

export class CursosUseCase {

    async createCurso (cursoData : CreateCursoRequest): Promise<CreateCursoResponse> {

        const create = await db.query(`insert into curso (title, description, teacher_id, is_published) values ($1, $2, $3, true) returning id`
            , [cursoData.title, cursoData.description, cursoData.teacherId]
        );
        return create.rows[0];
    }}