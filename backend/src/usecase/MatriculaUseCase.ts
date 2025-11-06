import { db } from "../db";
import { Curso, GetCursoData } from "../entities/Curso";
import { createMatriculaRequest, GetAlunoData, Matricula } from "../entities/Matricula";
import { CreateUsuarioReponse, CreateUsuarioRequest, FindByIdResponse, GetUserByIdRequest, LoginRequest, LoginResponse, Usuario } from "../entities/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class MatriculaUseCase {
    async createMatricula(matriculaData: createMatriculaRequest): Promise<Matricula> {
        const result = await db.query(`SELECT 1 from matriculas where curso_id = $1 and aluno_id = $2`, [matriculaData.cursoId, matriculaData.alunoId]);
        if (result.rows.length > 0) {
            throw new Error("Aluno já matriculado nesse curso");
        }
        const create = await db.query(`insert into matriculas (aluno_id, curso_id) values ($1, $2)`, [matriculaData.alunoId, matriculaData.cursoId]);
        return create.rows[0];

    }

    async findCursosByAluno(alunoData: GetAlunoData): Promise<Curso[]> {
        const result = await db.query(`select curso.* from curso
            inner join matriculas on matriculas.curso_id = curso.id
            where matriculas.aluno_id  = $1`, [alunoData.id])

            return result.rows;
    }

    async findAlunosByCurso(cursoData : GetCursoData) : Promise<Usuario[]> {
        const result = await db.query(`
            select usuarios.* from matriculas inner join usuarios
            on matriculas.aluno_id = usuarios.id 
            where matriculas.curso_id = $1`,
            [cursoData.id]);
        return result.rows;
    }
}