import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { Lesson } from "../../types/lesson";
import type { User } from "../../types/user";

type LessonsResponse = {
  message: string;
  aulas: Lesson[];
};

export default function ManageLessons() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.position - b.position),
    [lessons]
  );

  useEffect(() => {
    async function loadLessons() {
      try {
        setLoading(true);
        const { data } = await api.get<LessonsResponse>(
          `/aulas/getAulasFromCurso/${id}`
        );

        setLessons(data.aulas ?? []);
      } catch (err) {
        setError("Erro ao carregar aulas.");
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [id]);

  if (!user) return <div>Usuário inválido</div>;

  return (
    <>
      <Header user={user} />

      <div className="manage-lessons-container">
        <button className="back-link" onClick={() => navigate("/home")}>
          ← Voltar
        </button>

        <h2>Gerenciar aulas</h2>

        <button
          className="button"
          onClick={() => navigate(`/course/${id}/lessons/new`)}
          style={{ marginBottom: 20 }}
        >
          + Nova aula
        </button>

        {loading && <p>Carregando aulas...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && sortedLessons.length === 0 && (
          <p className="muted">Nenhuma aula cadastrada ainda.</p>
        )}

        <ul className="lessons-list">
          {sortedLessons.map((lesson) => (
            <li key={lesson.id} className="lesson-item">
              <div className="lesson-header">
                <span className="lesson-position">#{lesson.position}</span>
                <span className="lesson-title">{lesson.titulo}</span>

                {lesson.is_published ? (
                  <span className="lesson-badge green">Publicado</span>
                ) : (
                  <span className="lesson-badge">Rascunho</span>
                )}
              </div>

              <p className="lesson-description">{lesson.descricao}</p>

              <div className="lesson-actions">
                <button
                  className="button small"
                  onClick={() =>
                    navigate(`/course/${id}/lessons/${lesson.id}/edit`)
                  }
                >
                  Editar
                </button>
                {/* Em breve: botão de excluir */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
