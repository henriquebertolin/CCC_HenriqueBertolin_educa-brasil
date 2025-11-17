import { db } from "../db";
import { Curso, CursosUsuarios, GetCursoData } from "../entities/Curso";
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

    async findCursosByAluno(alunoData: GetAlunoData): Promise<CursosUsuarios[]> {
        const result = await db.query(
            `SELECT curso.* 
       FROM curso
       INNER JOIN matriculas ON matriculas.curso_id = curso.id
      WHERE matriculas.aluno_id = $1`,
            [alunoData.id]
        );

        const cursos = result.rows as CursosUsuarios[];

        // Calcula a porcentagem para cada curso
        for (const curso of cursos) {
            const { rows } = await db.query(
                `
      SELECT 
        COALESCE(
          (COUNT(*) FILTER (WHERE ua.finalizado = true) * 100.0 / NULLIF(COUNT(*), 0)),
          0
        ) AS porcentagem
      FROM usuarios_aulas ua
      INNER JOIN aulas a ON ua.id_aula = a.id
      WHERE ua.id_aluno = $1
        AND a.id_curso = $2
      `,
                [alunoData.id, curso.id]
            );

            curso.porcentagem = Number(rows[0]?.porcentagem ?? 0);
        }

        return cursos;
    }


    async findAlunosByCurso(cursoData: GetCursoData): Promise<Usuario[]> {
        const result = await db.query(`
            select usuarios.* from matriculas inner join usuarios
            on matriculas.aluno_id = usuarios.id 
            where matriculas.curso_id = $1`,
            [cursoData.id]);
        return result.rows;
    }
}