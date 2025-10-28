import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    senha: "",
    confirmSenha: "",
    professor: false,
    cidade: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.senha !== form.confirmSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/create", {
        name: form.name,
        username: form.username,
        email: form.email,
        senha: form.senha,
        professor: form.professor,
        cidade: form.cidade,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha no cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card">
        <h1>Criar cadastro</h1>
        <p className="muted">Preencha seus dados para começar.</p>

        {error && <div className="error">{error}</div>}

        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Nome completo</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Seu nome"
            />
          </div>

          <div className="field">
            <label className="label">Usuário</label>
            <input
              className="input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="seu_usuario"
            />
          </div>

          <div className="field">
            <label className="label">E-mail</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="field">
            <label className="label">Senha</label>
            <input
              type="password"
              className="input"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="field">
            <label className="label">Confirmar senha</label>
            <input
              type="password"
              className="input"
              value={form.confirmSenha}
              onChange={(e) => setForm({ ...form, confirmSenha: e.target.value })}
              placeholder="Repita a senha"
            />
          </div>

          <div className="checkbox">
            <input
              type="checkbox"
              checked={form.professor}
              onChange={(e) => setForm({ ...form, professor: e.target.checked })}
              id="prof"
            />
            <label htmlFor="prof">Sou professor</label>
          </div>

          <div className="field">
            <label className="label">Cidade</label>
            <input
              className="input"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              placeholder="Passo Fundo"
            />
          </div>

          <div className="actions">
            <button className="button" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </button>
            <Link className="link" to="/login">Já tenho conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
