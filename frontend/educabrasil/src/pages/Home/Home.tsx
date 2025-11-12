import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../../services/api";
import type { Course } from "../../types/course";
import CourseSection from "./CourseSection";
import Header from "../../components/Header";

type User = { nome: string; professor: boolean };

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

  // 🔹 Função de logout global
  function handleLogout() {
    setAuthToken(null);
    localStorage.removeItem("user");
    navigate("/login");
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
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  const enrolledSet = useMemo(() => new Set(myCourses.map((c) => c.id)), [myCourses]);

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
    alert(`Abrir curso: ${c.title}`);
  }

  function enrollCourse(c: Course) {
    alert(`Matricular-se em: ${c.title}`);
  }

  return (
    <>
      <CourseSection
        title="Cursando / Matriculado"
        subtitle={`Total: ${myCourses.length}`}
        courses={myCourses}
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

/* -------- Visão do Professor (placeholder) -------- */
function ProfessorView() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Visão do Professor</h2>
      <p>Gerencie seus cursos e alunos.</p>
    </div>
  );
}
