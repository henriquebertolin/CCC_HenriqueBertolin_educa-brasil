import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { Lesson } from "../../types/lesson";
import type { User } from "../../types/user";

export default function EditLesson() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);

  // Formulário local
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    is_video: true,
    posicao: 1,
    estimatedMin: 0,
    material_text: "",
  });

  useEffect(() => {
    async function loadLesson() {
      try {
        const { data } = await api.get(`/aulas/find/${lessonId}`);
        const aula: Lesson = data.aula;

        setLesson(aula);

        setForm({
          titulo: aula.titulo,
          descricao: aula.descricao,
          is_video: aula.is_video,
          posicao: aula.position,
          estimatedMin: aula.estimated_sec ? Math.round(aula.estimated_sec / 60) : 0,
          material_text: aula.material_text ?? "",
        });
      } catch (err) {
        setError("Erro ao carregar aula.");
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!lesson) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const estimated_sec =
        Number(form.estimatedMin) > 0 ? Number(form.estimatedMin) * 60 : 0;

      await api.put(`/aulas/update/${lesson.id}`, {
        titulo: form.titulo,
        descricao: form.descricao,
        is_video: form.is_video,
        posicao: Number(form.posicao),
        estimated_sec,
        material_text: form.material_text,
      });

      setSuccess("Aula atualizada com sucesso!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao atualizar aula.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload() {
    if (!file || !lesson) {
      setError("Selecione um arquivo antes de enviar.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.put(
        `/aulas/uploadMaterial/${lesson.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess("Material enviado com sucesso!");
      console.log("Upload response:", res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  }

  if (!user) return <div>Usuário inválido</div>;
  if (loading) return <><Header user={user} /><p>Carregando...</p></>;

  return (
    <>
      <Header user={user} />

      <div className="edit-lesson-container">
        <button
          className="back-link"
          onClick={() => navigate(`/course/${courseId}/lessons`)}
        >
          ← Voltar
        </button>

        <h2>Editar aula</h2>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}

        {/* FORM DE EDIÇÃO */}
        <form className="edit-lesson-form" onSubmit={handleUpdate}>
          <label>Título</label>
          <input
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <label>Descrição</label>
          <textarea
            value={form.descricao}
            rows={4}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            required
          />

          <label>É vídeo?</label>
          <select
            value={form.is_video ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, is_video: e.target.value === "true" })
            }
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label>Posição</label>
          <input
            type="number"
            min={1}
            value={form.posicao}
            onChange={(e) =>
              setForm({ ...form, posicao: Number(e.target.value) })
            }
          />

          <label>Duração (minutos)</label>
          <input
            type="number"
            min={0}
            value={form.estimatedMin}
            onChange={(e) =>
              setForm({ ...form, estimatedMin: Number(e.target.value) })
            }
          />

          <label>Material textual</label>
          <textarea
            value={form.material_text}
            rows={3}
            onChange={(e) =>
              setForm({ ...form, material_text: e.target.value })
            }
          />

          <button className="button" disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <hr style={{ margin: "30px 0" }} />

        {/* UPLOAD DE ARQUIVO */}
        <h3>Enviar vídeo/material da aula</h3>

        <input
          type="file"
          accept="video/*,application/pdf,text/plain"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          className="button secondary"
          disabled={uploading}
          onClick={handleUpload}
          style={{ marginTop: 12 }}
        >
          {uploading ? "Enviando..." : "Enviar arquivo"}
        </button>
      </div>
    </>
  );
}
