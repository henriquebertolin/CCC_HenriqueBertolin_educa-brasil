// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  nome: string;
  username: string;
  email: string;
  cidade: string;
  professor: boolean;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, setUser: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1) hidrata do cache para evitar flash
    const cached = localStorage.getItem("user");
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch {}
    }

    // 2) sem token → termina
    if (!token) { setLoading(false); return; }

    // 3) valida/atualiza no servidor
    api.get("/user/loggedUser")
      .then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
