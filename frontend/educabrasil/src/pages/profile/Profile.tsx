import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../services/api";
import Header from "../../components/Header";
import type { User } from "../../types/user";

export default function Profile() {
  const cached = localStorage.getItem("user");
  const user: User | null = cached ? JSON.parse(cached) : null;

  const [form, setForm] = useState({
    nome: "",
    username: "",
    email: "",
    senha: "",
    cidade: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 carrega dados do backend
  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/user/loggedUser");

        const u = data.user;
        setForm({
          nome: u.nome ?? "",
          username: u.username ?? "",
          email: u.email ?? "",
          senha: "",
          cidade: u.cidade ?? ""
        });
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🔹 quando salvar → envia apenas os campos alterados
  async function handleSave() {
    if (!user) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const diffBody: any = {};

      if (form.nome !== user.nome) diffBody.name = form.nome;
      if (form.username !== user.username) diffBody.username = form.username;
      if (form.email !== user.email) diffBody.email = form.email;
      if (form.cidade !== user.cidade) diffBody.cidade = form.cidade;
      if (form.senha && form.senha.trim() !== "") diffBody.senha = form.senha;

      if (Object.keys(diffBody).length === 0) {
        setSuccess("Nenhuma alteração foi feita.");
        setSaving(false);
        return;
      }

      const { data } = await api.put("/user/update", diffBody);

      // Atualiza localStorage com novos dados
      const updatedUser = { ...user, ...diffBody };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Dados atualizados com sucesso!");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erro ao atualizar os dados."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div style={{ padding: 40 }}>Sessão inválida.</div>;
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando...</div>;
  }

  return (
    <>
      <Header user={user} />

      <div className="profile-container">
        <h2>Meu Perfil</h2>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        <div className="profile-form">
          <label>Nome</label>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <label>Usuário</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Cidade</label>
          <input
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          />

          <label>Senha (opcional)</label>
          <input
            type="password"
            placeholder="Deixe em branco para não alterar"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
          />

          <button className="save-button" disabled={saving} onClick={handleSave}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </>
  );
}
