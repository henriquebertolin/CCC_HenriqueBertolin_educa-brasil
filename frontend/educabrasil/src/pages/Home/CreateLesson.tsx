import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { User } from "../../types/user";

export default function CreateLesson() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // id do curso

  if (!id) return <div>Curso inválido</div>;

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

  if (!user) return <div style={{ padding: 40 }}>Usuário inválido.</div>;

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    is_video: true,
    posicao: 1,
    estimatedMin: 0,      // duração em minutos (para o usuário)
    material_text: "",    // texto do material complementar
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const estimated_sec = Number(form.estimatedMin) > 0
        ? Number(form.estimatedMin) * 60
        : 0;

      const body = {
        id_curso: id,
        titulo: form.titulo,
        descricao: form.descricao,
        is_video: form.is_video,
        posicao: Number(form.posicao),
        estimated_sec,
        material_text: form.material_text || null,
      };

      await api.post("/aulas/create", body);

      setSuccess("Aula criada com sucesso!");

      setTimeout(() => {
        navigate(`/course/${id}/lessons`);
      }, 800);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar aula.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header user={user} />

      <div className="create-lesson-container">
        <button
          className="back-link"
          onClick={() => navigate(`/course/${id}/lessons`)}
        >
          ← Voltar
        </button>

        <h2>Criar nova aula</h2>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form className="create-lesson-form" onSubmit={handleSubmit}>
          <label>Título da aula</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <label>Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={4}
            required
          />

          <label>É uma aula em vídeo?</label>
          <select
            value={form.is_video ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, is_video: e.target.value === "true" })
            }
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label>Posição/ordem no curso</label>
          <input
            type="number"
            min={1}
            value={form.posicao}
            onChange={(e) =>
              setForm({ ...form, posicao: Number(e.target.value) })
            }
            required
          />

          <label>Duração estimada (em minutos)</label>
          <input
            type="number"
            min={0}
            value={form.estimatedMin}
            onChange={(e) =>
              setForm({ ...form, estimatedMin: Number(e.target.value) })
            }
          />

          <label>Material textual (opcional)</label>
          <textarea
            value={form.material_text}
            onChange={(e) =>
              setForm({ ...form, material_text: e.target.value })
            }
            rows={3}
            placeholder="Texto do material complementar da aula"
          />

          <button className="button" disabled={loading}>
            {loading ? "Criando..." : "Criar aula"}
          </button>
        </form>
      </div>
    </>
  );
}
