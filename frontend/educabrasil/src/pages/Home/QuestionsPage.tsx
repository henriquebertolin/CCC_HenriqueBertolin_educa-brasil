import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { api } from "../../services/api";
import type { User } from "../../types/user";

type Pergunta = {
  id: string;
  texto: string;
  id_usuario: string;
  id_curso: string;
  nome: string;
};

export default function QuestionsPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;

  const [questions, setQuestions] = useState<Pergunta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/perguntas/findByCurso/${courseId}`);
        setQuestions(res.data.perguntas ?? []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [courseId]);

  if (!user) {
    return <div>Você precisa estar logado.</div>;
  }

  return (
    <>
      <Header user={user} />

      <div className="questions-container">
        <button
          className="back-link"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          ← Voltar para o curso
        </button>

        <div className="questions-header">
          <h2>Dúvidas do Curso</h2>

          <button
            className="button"
            onClick={() => navigate(`/course/${courseId}/questions/new`)}
          >
            Nova Pergunta
          </button>
        </div>


        {loading ? (
          <p>Carregando perguntas...</p>
        ) : questions.length === 0 ? (
          <p className="muted">Nenhuma pergunta enviada ainda.</p>
        ) : (
          <ul className="questions-list">
            {questions.map((p) => (
              <li
                key={p.id}
                className="question-item"
                onClick={() =>
                  navigate(`/course/${courseId}/questions/${p.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <p className="question-text">❓ {p.texto}</p>
                <span className="question-author">por {p.nome}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
