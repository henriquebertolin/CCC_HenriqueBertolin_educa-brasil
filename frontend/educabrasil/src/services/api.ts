// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// aplica token salvo (ao recarregar a página)
const saved = localStorage.getItem("token");
if (saved) {
  api.defaults.headers.common.Authorization = `Bearer ${saved}`;
}

// helper para login/logout
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  }
}

// 401 inteligente: só desloga se falhar em endpoint protegido “crítico”
const HARD_PROTECTED = ["/user/loggedUser", "/matriculas", "/alunos", "/profile"];

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url || "";

    if (status === 401) {
      const shouldForceLogout = HARD_PROTECTED.some((frag) => url.includes(frag));

      if (shouldForceLogout) {
        localStorage.removeItem("user");
        setAuthToken(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      // para 401 em endpoints não críticos, só repassa o erro
    }

    return Promise.reject(error);
  }
);
