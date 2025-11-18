export interface CreateRespostaRequest {
    texto : string,
    id_usuario : string,
    id_pergunta : string,
}

export interface CreateRespostaResponse {
    id : string,
}