export interface Usuario {
    id: string,
    username: string,
    email: string,
    senha: string,
    name: string,
    cidade: string,
    criacao: Date,
    atualizacao: Date,
    ativo: boolean,
    professor: boolean,
}

export interface CreateUsuarioRequest {
    name: string,
    username: string,
    email: string,
    senha: string,
    professor: boolean,
    cidade: string,
}

export interface CreateUsuarioReponse {
    id: string
}

export interface LoginRequest {
    username: string,
    senha: string,
}

export interface LoginResponse {
    token: string
    user: {
        id: string,
        username: string,
        name: string,
        cidade: string,
        criacao: Date,
    }

}

export interface GetUserByIdRequest {
    id: string
}

export interface GetUserByUsernameRequest {
    username: string
}

export interface FindByIdResponse {
    id : string,
    username: string,
    email: string,
    senha: string,
    name: string,
    cidade: string,
    criacao: Date,
    atualizacao: Date,
    ativo: boolean,
    professor: boolean,
}

export interface UpdateUsuarioRequest {
    id: string,
    name?: string,
    username?: string,
    email?: string,
    senha?: string,
    cidade?: string,
}

export interface UpdateResponse {
    success : true
}