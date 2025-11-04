export interface Curso {
    id : string,
    title : string,
    description : string,
    teacherId : string,
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