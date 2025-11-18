import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { User } from "../../types/user";

export default function NewQuestion() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  if (!courseId) return <div>Curso inválido.</div>;

  const cached = localStorage.getItem("user");
  const user: User | null = cached ? JSON.parse(cached) : null;

  if (!user) return <div>Usuário inválido.</div>;

  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const body = {
        texto,
        id_usuario: user.id,
        id_curso: courseId,
      };

      await api.post("/perguntas/create", body);
      setSuccess("Pergunta criada com sucesso!");

      setTimeout(() => {
        navigate(`/course/${courseId}/questions`);
      }, 800);

    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar pergunta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header user={user} />

      <div className="new-question-container">
        <button
          className="back-link"
          onClick={() => navigate(`/course/${courseId}/questions`)}
        >
          ← Voltar
        </button>

        <h2>Nova Pergunta</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form className="new-question-form" onSubmit={handleSubmit}>
          <label>Digite sua dúvida</label>
          <textarea
            required
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite sua pergunta..."
            rows={4}
          />

          <button className="button" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Pergunta"}
          </button>
        </form>
      </div>
    </>
  );
}
