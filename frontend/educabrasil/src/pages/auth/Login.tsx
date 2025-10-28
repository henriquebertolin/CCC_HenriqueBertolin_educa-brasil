import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api"; // ajuste o caminho se diferente

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/login", form);
      if (data?.token) localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha no login.");
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
            <Link className="link" to="/register">Criar cadastro</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
