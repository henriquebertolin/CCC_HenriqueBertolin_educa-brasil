import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { Lesson } from "../../types/lesson";
import type { User } from "../../types/user";

export default function WatchLesson() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [loadingUrl, setLoadingUrl] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const { data } = await api.get(`/aulas/find/${lessonId}`);
        setLesson(data.aula);
      } catch (err) {
        setError("Erro ao carregar aula.");
      } finally {
        setLoadingLesson(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) return;

    async function loadSignedUrl() {
      try {
        const { data } = await api.get(`/aulas/getSignedUrl/${lessonId}`);
        setSignedUrl(data?.data?.signed_url ?? null);
      } catch (err) {
        setError("Erro ao obter link da aula.");
      } finally {
        setLoadingUrl(false);
      }
    }

    loadSignedUrl();
  }, [lessonId]);

  if (!user) return <div>Usuário inválido</div>;

  if (loadingLesson) {
    return (
      <>
        <Header user={user} />
        <div style={{ padding: 40 }}>Carregando aula...</div>
      </>
    );
  }

  if (error || !lesson) {
    return (
      <>
        <Header user={user} />
        <div style={{ padding: 40, color: "#b91c1c" }}>
          {error || "Aula não encontrada."}
        </div>
      </>
    );
  }

  const isVideo = lesson.is_video;

  return (
    <>
      <Header user={user} />

      <div className="watch-lesson-container">
        <button
          className="back-link"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          ← Voltar
        </button>

        <h2>{lesson.titulo}</h2>
        <p className="muted">{lesson.descricao}</p>

        {/* MATERIAL TEXTUAL */}
        {lesson.material_text && (
          <div className="lesson-text-material">
            <h3>Material textual</h3>
            <p>{lesson.material_text}</p>
          </div>
        )}

        {/* VÍDEO */}
        {isVideo && signedUrl && (
          <video
            controls
            src={signedUrl}
            style={{
              width: "100%",
              maxWidth: 900,
              borderRadius: 12,
              marginTop: 20,
            }}
          />
        )}

        {/* PDF / MATERIAL */}
        {!isVideo && signedUrl && (
          <button
            className="button"
            onClick={() => window.open(signedUrl, "_blank")}
            style={{ marginTop: 20 }}
          >
            Baixar material
          </button>
        )}

        {/* LOADING */}
        {loadingUrl && (
          <p style={{ marginTop: 20 }}>Gerando link seguro para o conteúdo...</p>
        )}
      </div>
    </>
  );
}
