export interface Curso {
    id : string,
    title : string,
    description : string,
    teacher_id : string,
    teacher_nome : string,
    teacher_email : string,
    isPublished : boolean,
    createdAt : Date
}

export interface CreateCursoRequest {
    title : string,
    description : string,
    teacherId : string,
    isPublished : boolean
}

export interface CreateCursoResponse {
    id: string
}

export interface GetCursoData {
    id: string
}

export interface GetAulasCursoData {
    id: string,
    id_aluno : string
}

export interface CursosUsuarios {
    id : string,
    title : string,
    description : string,
    teacher_id : string,
    teacher_nome : string,
    teacher_email : string,
    isPublished : boolean,
    createdAt : Date,
    porcentagem : number
}