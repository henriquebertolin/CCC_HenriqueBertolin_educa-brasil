import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { User } from "../../types/user";

export default function CreateCourse() {
  const navigate = useNavigate();

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

  if (!user) return <div style={{ padding: 40 }}>Usuário inválido.</div>;

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const body = {
        title: form.title,
        description: form.description,
        teacherId: user.id // 🔥 sempre pega do usuário logado
      };

      const { data } = await api.post("/cursos/create", body);

      setMessage("Curso criado com sucesso!");

      // se backend retornar ID do curso, pode redirecionar automaticamente:
      if (data?.curso?.id) {
        navigate(`/course/${data.curso.id}`);
      } else {
        navigate("/home");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar o curso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header user={user} />

      <div className="create-course-container">
        <h2>Criar novo curso</h2>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form className="create-course-form" onSubmit={handleSubmit}>
          <label>Título do curso</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label>Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            required
          />

          <button className="button" disabled={loading}>
            {loading ? "Criando..." : "Criar curso"}
          </button>
        </form>
      </div>
    </>
  );
}
