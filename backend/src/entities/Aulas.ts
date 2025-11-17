export interface CreateAulasRequest {
    id_curso: string,
    titulo : string,
    descricao: string,
    is_video: boolean,
    posicao: number,
    estimated_sec : number,
    material_text : string,
}

export interface CreateAulasResponse {
    id : string
}

export interface GetAulasFromCursoResponse {
    id : string,
    id_curso : string,
    titulo : string,
    descricao : string,
    is_video : boolean,
    position : number,
    is_published : boolean,
    estimated_sec : number,
    video_url : string,
    material_url : string,
    material_text : string,
}

export interface UpdateAulaVideoRequest {
    id : string,
    // estimated_sec : number,
    // material_text : string,
    material : {
        filename : string,
        mimetype: string,
        buffer : Buffer
    }
}