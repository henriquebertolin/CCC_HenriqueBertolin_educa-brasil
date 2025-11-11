import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;
  if (!user) return <div style={{ padding: 40 }}>Sessão inválida. Faça login novamente.</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo, {user.nome}!</h1>
      {user.professor ? <ProfessorView /> : <AlunoView />}
    </div>
  );
}


function ProfessorView() {
  return (
    <div>
      <h2>Visão do Professor 👨‍🏫</h2>
      <ul>
        <li>Gerenciar cursos</li>
        <li>Criar novas aulas</li>
        <li>Acompanhar progresso dos alunos</li>
      </ul>
    </div>
  );
}

function AlunoView() {
  return (
    <div>
      <h2>Visão do Aluno 🎓</h2>
      <ul>
        <li>Ver meus cursos</li>
        <li>Continuar aula em andamento</li>
        <li>Ver desempenho</li>
      </ul>
    </div>
  );
}
