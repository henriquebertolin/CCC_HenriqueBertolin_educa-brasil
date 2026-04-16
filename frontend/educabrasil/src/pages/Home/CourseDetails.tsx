import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../../components/Header";
import type { Course } from "../../types/course";
import type { Lesson } from "../../types/lesson";
import type { User } from "../../types/user";
import jsPDF from "jspdf";


type CourseResponse = {
  message: string;
  aulas: Course; // backend chama de "aulas", mas é o curso em si
};

type LessonsResponse = {
  message: string;
  aulas: Lesson[];
};

export default function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Curso inválido</div>;
  const courseId = id; // agora o TS sabe que é string

  const cachedUser = localStorage.getItem("user");
  const user: User | null = cachedUser ? JSON.parse(cachedUser) : null;
  const isProfessor = user?.professor === true;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingLessonId, setUpdatingLessonId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.position - b.position),
    [lessons]
  );

  const allLessonsDone =
    !isProfessor &&
    sortedLessons.length > 0 &&
    sortedLessons.every((l) => l.finalizado);


  // cursos em que o aluno está matriculado (só faz sentido para aluno)
  const [myCourses, setMyCourses] = useState<string[]>([]);

  useEffect(() => {
    async function loadMyCourses() {
      if (isProfessor) return; // professor não precisa disso

      try {
        const { data } = await api.get("/matriculas/findCursosByAluno");
        const ids = data.aluno.map((c: any) => c.id);
        setMyCourses(ids);
      } catch (err) {
        console.error("Erro ao carregar matrículas", err);
      }
    }

    loadMyCourses();
  }, [isProfessor]);

  const isEnrolled = !isProfessor && myCourses.includes(courseId);

  // alunos matriculados (só para professor)
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    if (!isProfessor) return;

    async function loadStudents() {
      try {
        const { data } = await api.get(`/matriculas/findAlunosByCurso/${courseId}`);
        setStudents(data.aluno ?? []);
      } catch (err) {
        console.error("Erro ao carregar alunos do curso:", err);
      }
    }

    loadStudents();
  }, [courseId, isProfessor]);

  // Dados do curso + aulas
  useEffect(() => {
    if (!courseId) {
      setError("Curso não encontrado.");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ carrega o curso
        const courseRes = await api.get<CourseResponse>(`/cursos/find/${courseId}`);
        const courseData = courseRes.data.aulas;

        if (!mounted) return;
        setCourse(courseData);

        // 2️⃣ escolhe endpoint conforme matriculado
        const endpoint = isEnrolled
          ? `/aulas/getAulasFromCurso/${courseId}`
          : `/aulas/notMatriculado/${courseId}`;

        const lessonsRes = await api.get<LessonsResponse>(endpoint);

        if (!mounted) return;
        setLessons(lessonsRes.data.aulas ?? []);

      } catch (err: any) {
        if (!mounted) return;
        setError(
          err?.response?.data?.message || "Erro ao carregar detalhes do curso."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [courseId, isEnrolled]);


  async function handleEnroll() {
    if (!user || !course) return;

    setEnrolling(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/matriculas/create", {
        alunoId: user.id,
        cursoId: course.id,
      });

      setSuccess("Matrícula realizada com sucesso!");
      // opcional: atualizar lista de cursos do aluno na hora
      setMyCourses((prev) => [...prev, course.id]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Erro ao realizar matrícula."
      );
    } finally {
      setEnrolling(false);
    }
  }

  if (!user) {
    return <div style={{ padding: 40 }}>Sessão inválida. Faça login novamente.</div>;
  }

  if (loading) {
    return (
      <>
        <Header user={user} />
        <div style={{ padding: 40 }}>Carregando curso...</div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header user={user} />
        <div style={{ padding: 40, color: "#b91c1c" }}>
          {error || "Curso não encontrado."}
        </div>
      </>
    );
  }

  async function handleFinishLesson(lessonId: string) {
    if (!user) return;

    try {
      setUpdatingLessonId(lessonId);

      await api.put(`/aulas/updateFinalizado/${user.id}/${lessonId}`);

      // Atualiza só essa aula localmente para finalizado = true
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId ? { ...l, finalizado: true } : l
        )
      );
    } catch (err) {
      console.error("Erro ao marcar aula como finalizada", err);
      // se você quiser, pode setar uma mensagem de erro aqui
    } finally {
      setUpdatingLessonId(null);
    }
  }

  function handleGenerateCertificate() {
    if (!user || !course) return;

    // A5 horizontal
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a5"
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // 🎨 Fundo azul claro
    doc.setFillColor("#e3f2fd"); // azul bem claro
    doc.rect(0, 0, width, height, "F");

    // 🎨 Faixa azul escura no topo
    doc.setFillColor("#0d47a1");
    doc.rect(0, 0, width, 60, "F");

    // 🌟 Título branco centralizado
    doc.setFontSize(22);
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICADO DE CONCLUSÃO", width / 2, 38, { align: "center" });

    // 🧩 Container branco
    doc.setFillColor("#ffffff");
    doc.roundedRect(30, 80, width - 60, height - 140, 8, 8, "F");

    let y = 120;

    // Texto preto
    doc.setTextColor("#000000");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text("A plataforma EducaBrasil certifica que:", width / 2, y, { align: "center" });
    y += 30;

    // Nome do aluno em destaque
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#0d47a1");
    doc.text(user.nome, width / 2, y, { align: "center" });
    y += 30;

    // Curso
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#000");
    doc.text("concluiu o curso:", width / 2, y, { align: "center" });
    y += 25;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`"${course.title}"`, width / 2, y, { align: "center" });
    y += 30;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `ministrado pelo professor ${course.nome_professor}.`,
      width / 2,
      y,
      { align: "center" }
    );

    // Rodapé
    const today = new Date().toLocaleDateString("pt-BR");
    doc.setFontSize(10);
    doc.text(`Data: ${today}`, width - 50, height - 30, { align: "right" });

    // Salvar PDF
    doc.save(`certificado-${course.title}.pdf`);
  }




  return (
    <>
      <Header user={user} />

      <div className="course-details-container">
        <div className="course-details-header">
          <button
            className="back-link"
            onClick={() => navigate("/home")}
          >
            ← Voltar para meus cursos
          </button>

          <h2 className="course-title-main">{course.title}</h2>
          <p className="course-teacher">
            Professor:{" "}
            <strong>{course.nome_professor}</strong> ({course.email_professor})
          </p>

          <p className="course-description-main">{course.description}</p>

          <div className="course-actions-main">
            {/* 🔹 Botão de matrícula só aparece para ALUNO */}
            {!isProfessor && (
              isEnrolled ? (
                <button className="button enrolled" disabled>
                  Matriculado
                </button>
              ) : (
                <button
                  className="button"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Matriculando..." : "Matricular-se neste curso"}
                </button>
              )
            )}

            {success && <span className="success-msg-inline">{success}</span>}
            {error && <span className="error-msg-inline">{error}</span>}
          </div>
          <div style={{ marginTop: 16 }}>
            <button
              className="button secondary"
              onClick={() => navigate(`/course/${courseId}/questions`)}
            >
              Dúvidas do curso
            </button>
          </div>


        </div>

        <div className="course-lessons">
          <h3>Conteúdo do curso</h3>

          {sortedLessons.length === 0 ? (
            <p className="muted">Ainda não há aulas cadastradas para este curso.</p>
          ) : (
            <ul className="lessons-list">
              {sortedLessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="lesson-item"
                  onClick={() => {
                    if (!isEnrolled && !isProfessor) return;
                    navigate(`/course/${courseId}/lessons/${lesson.id}/watch`);
                  }}
                  style={{ cursor: (isEnrolled || isProfessor) ? "pointer" : "not-allowed" }}
                >

                  <div className="lesson-header">

                    <div className="lesson-header-left">
                      <span className="lesson-position">#{lesson.position}</span>
                      <span className="lesson-title">{lesson.titulo}</span>
                      {lesson.is_video && <span className="lesson-badge">Vídeo</span>}
                    </div>

                    {/* Botão ou badge — somente aluno matriculado */}
                    {!isProfessor && isEnrolled && (
                      lesson.finalizado ? (
                        <span className="lesson-done">✔ Concluída</span>
                      ) : (
                        <button
                          className="lesson-finish-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFinishLesson(lesson.id);
                          }}
                          disabled={updatingLessonId === lesson.id}
                        >
                          {updatingLessonId === lesson.id
                            ? "Marcando..."
                            : "Marcar como concluída"}
                        </button>
                      )
                    )}
                  </div>


                  <p className="lesson-description">{lesson.descricao}</p>
                  {lesson.estimated_sec > 0 && (
                    <span className="lesson-time">
                      ~ {Math.round(lesson.estimated_sec / 60)} min
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔹 Botão de certificado – só para aluno, e só se 100% concluído */}
        {allLessonsDone && !isProfessor && (
          <div style={{ marginTop: 24 }}>
            <button className="button" onClick={handleGenerateCertificate}>
              Gerar certificado
            </button>
          </div>
        )}

        {/* 🔹 Lista de alunos matriculados – apenas para professor */}
        {isProfessor && (
          <div className="course-students">
            <h3>Alunos matriculados</h3>

            {students.length === 0 ? (
              <p className="muted">Nenhum aluno matriculado ainda.</p>
            ) : (
              <ul className="students-list">
                {students.map((s) => (
                  <li key={s.id} className="student-item">
                    <strong>{s.nome}</strong> — {s.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
