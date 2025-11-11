import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

type LoggedUserResponse = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    nome: string;
    cidade: string;
    professor: boolean;
    ativo: boolean;
    criacao: string;
    atualizacao: string;
  };
};

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ username: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // valida token antes de pular
    api.get("/user/loggedUser")
      .then(({ data }) => {
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          navigate("/home");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  }, [navigate, setUser]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/login", form);
      const token: string | undefined = data?.token;
      if (!token) throw new Error("Token não retornado pelo servidor.");

      localStorage.setItem("token", token);
      // valida token e obtém usuário
      const { data: logged } = await api.get("/user/loggedUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!logged?.user) throw new Error("Token inválido.");

      localStorage.setItem("user", JSON.stringify(logged.user));
      setUser(logged.user);

      navigate("/home");
    } catch (err: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setError(err?.response?.data?.message || err?.message || "Falha no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h1>Entrar</h1>
        <p className="muted">Acesse sua conta para continuar.</p>

        {error && <div className="error">{error}</div>}

        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Usuário</label>
            <input
              className="input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="seu_usuario"
              autoFocus
            />
          </div>

          <div className="field">
            <label className="label">Senha</label>
            <input
              type="password"
              className="input"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="actions">
            <button className="button" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <Link className="link" to="/register">
              Criar cadastro
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
