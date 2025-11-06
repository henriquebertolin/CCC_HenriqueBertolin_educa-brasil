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