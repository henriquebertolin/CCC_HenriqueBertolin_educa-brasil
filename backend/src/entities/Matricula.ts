export interface Matricula {
    id : string,
    alunoId : string,
    cursoId : string
}

export interface createMatriculaRequest {
    alunoId : string,
    cursoId : string
}

export interface GetAlunoData {
    id : string
}

export interface MatriculaTeste {
    id : string,
    aluno_id : string,
    curso_id : string
}