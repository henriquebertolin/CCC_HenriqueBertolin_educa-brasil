import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { Course } from "../../types/course";
import CourseSection from "./CourseSection";

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

  return user.professor ? <ProfessorView /> : <AlunoView />;
}

/* =========================================================
   VISÃO DO ALUNO
========================================================= */
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
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado. Faça login novamente.");

        const [allRes, mineRes] = await Promise.all([
          api.get("/cursos/findAll"),
          api.get("/matriculas/findCursosByAluno"),
        ]);

        if (!mounted) return;

        const allData: Course[] = allRes?.data?.data ?? [];
        const mineData: Course[] = mineRes?.data?.aluno ?? [];

        setAllCourses(allData);
        setMyCourses(mineData);
      } catch (err: any) {
        if (!mounted) return;

        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Falha ao carregar cursos.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  function openCourse(c: Course) {
    alert(`Abrir curso: ${c.title}`);
  }

  function enrollCourse(c: Course) {
    alert(`Matricular no curso: ${c.title}`);
  }

  if (loading) return <div style={{ padding: 40 }}>Carregando cursos...</div>;
  if (error) return <div style={{ padding: 40, color: "#b91c1c" }}>{error}</div>;

  const availableNotEnrolled = allCourses.filter((c) => !enrolledSet.has(c.id));

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ marginBottom: 16 }}>Meus cursos</h1>

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
    </div>
  );
}

/* =========================================================
   VISÃO DO PROFESSOR
========================================================= */
function ProfessorView() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Visão do Professor</h1>
      <p>Gerencie seus cursos, crie aulas e acompanhe o progresso dos alunos.</p>
    </div>
  );
}
