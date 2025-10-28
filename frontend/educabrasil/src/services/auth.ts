import { api } from "./api";


export type LoginPayload = {
username: string;
senha: string; // importante: usa "senha" e não "password"
};


export type RegisterPayload = {
name: string;
username: string;
email: string;
senha: string;
professor: boolean;
cidade: string;
};


export async function signIn(payload: LoginPayload) {
const { data } = await api.post("/login", payload);
// supondo que a API retorne { token, user }
if (data?.token) localStorage.setItem("token", data.token);
return data;
}


export async function signUp(payload: RegisterPayload) {
const { data } = await api.post("/user/create", payload);
return data; // pode retornar o usuário criado ou mensagem
}


export function signOut() {
localStorage.removeItem("token");
}