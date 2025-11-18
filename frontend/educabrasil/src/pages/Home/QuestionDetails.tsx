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

type Resposta = {
  id: string;
  texto: string;
  id_usuario: string;
  id_pergunta: string;
  nome: string;
};

export default function QuestionDetails() {
  const navigate = useNavigate();

  const { courseId, questionId } = useParams<{
    courseId: string;
    questionId: string;
  }>();

  const cached = localStorage.getItem("user");
  const user: User | null = cached ? JSON.parse(cached) : null;

  const [question, setQuestion] = useState<Pergunta | null>(null);
  const [answers, setAnswers] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 estados para criação de resposta
  const [newAnswer, setNewAnswer] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [qRes, aRes] = await Promise.all([
          api.get(`/perguntas/findById/${questionId}`),
          api.get(`/respostas/findByPergunta/${questionId}`)
        ]);

        setQuestion(qRes.data.pergunta?.[0] ?? null);
        setAnswers(aRes.data.respostas ?? []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [questionId]);

  if (!user) {
    return <div style={{ padding: 40 }}>Usuário inválido.</div>;
  }

  if (loading) {
    return (
      <>
        <Header user={user} />
        <div style={{ padding: 40 }}>Carregando dúvida...</div>
      </>
    );
  }

  if (!question) {
    return (
      <>
        <Header user={user} />
        <div style={{ padding: 40 }}>
          <p style={{ color: "#b91c1c" }}>Pergunta não encontrada.</p>
        </div>
      </>
    );
  }

  // 🔥 enviar nova resposta
  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!newAnswer.trim()) {
      setPostError("Digite uma resposta antes de enviar.");
      return;
    }

    try {
      setPosting(true);
      setPostError(null);

      const body = {
        texto: newAnswer.trim(),
        id_usuario: user.id,
        id_pergunta: question.id,
      };

      const { data } = await api.post("/respostas/create", body);

      const createdId: string | undefined = data?.resposta?.id;

      // adiciona na lista local para aparecer imediatamente
      const novaResposta: Resposta = {
        id: createdId ?? crypto.randomUUID?.() ?? String(Date.now()),
        texto: newAnswer.trim(),
        id_usuario: user.id,
        id_pergunta: question.id,
        nome: user.nome, // assume que o backend retornaria isso depois
      };

      setAnswers((prev) => [novaResposta, ...prev]);
      setNewAnswer("");
    } catch (err: any) {
      setPostError(
        err?.response?.data?.message || "Erro ao enviar resposta."
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      <Header user={user} />

      <div className="question-details-container">
        <button
          className="back-link"
          onClick={() => navigate(`/course/${courseId}/questions`)}
        >
          ← Voltar para dúvidas
        </button>

        <div className="question-box">
          <h2 className="question-title">❓ {question.texto}</h2>
          <span className="question-author">
            feita por <strong>{question.nome}</strong>
          </span>
        </div>

        <h3 className="answers-title">Respostas</h3>

        {answers.length === 0 ? (
          <p className="muted">Nenhuma resposta ainda. Seja o primeiro a responder!</p>
        ) : (
          <ul className="answers-list">
            {answers.map((a) => (
              <li key={a.id} className="answer-item">
                <p className="answer-text">{a.texto}</p>
                <span className="answer-author">— {a.nome}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 🔹 Formulário de nova resposta */}
        <div className="answer-form-container">
          <h4>Responder à dúvida</h4>

          {postError && (
            <p className="error-msg" style={{ marginBottom: 8 }}>
              {postError}
            </p>
          )}

          <form onSubmit={handleSubmitAnswer} className="answer-form">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={3}
              placeholder="Escreva sua resposta aqui..."
            />

            <button className="button" type="submit" disabled={posting}>
              {posting ? "Enviando..." : "Enviar resposta"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
