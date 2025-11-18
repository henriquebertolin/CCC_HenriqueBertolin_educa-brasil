import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { Course } from "../../types/course";
import type { User } from "../../types/user";
import CourseSection from "./CourseSection";
import Header from "../../components/Header";

export default function Home() {
  const navigate = useNavigate();
  const cached = localStorage.getItem("user");
  const user: User | null = cached ? JSON.parse(cached) : null;

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) {
    return <div style={{ padding: 40 }}>Sessão inválida. Redirecionando...</div>;
  }

  return (
    <>
      {/* Cabeçalho fixo da aplicação */}
      <Header user={user} />

      {/* Conteúdo principal da página */}
      <div style={{ padding: "32px" }}>
        {user.professor ? <ProfessorView /> : <AlunoView />}
      </div>
    </>
  );
}

/* -------- Visão do Aluno -------- */
function AlunoView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  const enrolledSet = useMemo(
    () => new Set(myCourses.map((c) => c.id)),
    [myCourses]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [allRes, mineRes] = await Promise.all([
          api.get("/cursos/findAll"),
          api.get("/matriculas/findCursosByAluno"),
        ]);
        if (!mounted) return;
        setAllCourses(allRes?.data?.data ?? []);
        setMyCourses(mineRes?.data?.aluno ?? []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Erro ao carregar cursos.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Carregando cursos...</div>;
  if (error) return <div style={{ padding: 40, color: "#b91c1c" }}>{error}</div>;

  const availableNotEnrolled = allCourses.filter((c) => !enrolledSet.has(c.id));

  function openCourse(c: Course) {
    // abre detalhes do curso
    navigate(`/course/${c.id}`);
  }

  function enrollCourse(c: Course) {
    // por enquanto também leva para a página do curso
    // mais tarde podemos chamar /matriculas/create direto daqui se quiser
    navigate(`/course/${c.id}`);
  }

  return (
    <>
      <CourseSection
        title="Cursando / Matriculado"
        subtitle={`Total: ${myCourses.length}`}
        courses={myCourses}
        enrolledSet={enrolledSet}
        emptyMessage="Você ainda não está matriculado em nenhum curso."
        onOpen={openCourse}
      />


      <CourseSection
        title="Todos os cursos disponíveis"
        subtitle={`Total: ${allCourses.length}`}
        courses={availableNotEnrolled}
        enrolledSet={enrolledSet}
        emptyMessage="Nenhum curso disponível no momento."
        onOpen={openCourse}
        onEnroll={enrollCourse}
      />
    </>
  );
}

/* -------- Visão do Professor -------- */
function ProfessorView() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/cursos/findByProf");
        if (!mounted) return;

        setCourses(res.data.curso ?? []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Erro ao carregar cursos.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Carregando cursos...</div>;
  if (error) return <div style={{ padding: 40, color: "#b91c1c" }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <div className="prof-header">
        <h2>Meus cursos</h2>
        <button
          className="button"
          onClick={() => navigate("/course/new")}
        >
          Criar novo curso
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="muted">Você ainda não criou nenhum curso.</p>
      ) : (
        <div className="course-grid">
          {courses.map((c) => (
            <div key={c.id} className="course-card">
              <h3 className="course-title">{c.title}</h3>
              <p className="course-description">{c.description}</p>

              <div className="course-actions">
                <button
                  className="button small"
                  onClick={() => navigate(`/course/${c.id}`)}
                >
                  Ver detalhes
                </button>

                <button
                  className="button small secondary"
                  onClick={() => navigate(`/course/${c.id}/lessons`)}
                >
                  Gerenciar aulas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

