export interface Store {
    id: string,
    cnpj: string,
    password: string,
    name: string,
    city: string,
    posted_amount: Number,
    paid_amount: Number,
    creation_date: Date,
    update_date: Date,
    active: boolean,
}

export interface CreateStoreRequest {
    name: string,
    cnpj: string,
    password: string,
    city: string,
}

export interface CreateStoreReponse {
    id: string
}

export interface LoginRequest {
    username: string,
    password: string,
}

export interface LoginResponse {
    token: string
    user: {
        id: string,
        username: string,
        name: string,
        city: string,
        creation_date: Date,
    }

}

