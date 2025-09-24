# EducaBrasil

EducaBrasil é uma plataforma de aulas online desenvolvida para atender instituições de ensino, professores e alunos, oferecendo uma solução eficiente e organizada para publicação, acesso e acompanhamento de cursos.

## 📚 Descrição do Projeto

O sistema tem como objetivo centralizar a gestão de cursos e aulas, permitindo que professores cadastrem e organizem conteúdos, enquanto os alunos podem acompanhar seu progresso e acessar materiais de estudo.  
A plataforma garante segurança e controle de acesso através de login e registro de ações (logs), promovendo rastreabilidade e confiabilidade.

## 🚀 Funcionalidades Principais

- Cadastro de usuários com diferentes perfis:
  - **Professor**: Criação e gerenciamento de cursos e aulas.
  - **Aluno**: Acesso aos cursos e acompanhamento do progresso.
- Criação e organização de cursos.
- Upload de materiais (vídeos, PDFs e outros arquivos).
- Aplicação de exercícios e avaliações.
- Acompanhamento do progresso do aluno.
- Login seguro e controle de permissões por perfil.
- Registro de ações para fins de auditoria e segurança.

## 🗄️ Modelo de Dados

O sistema utiliza um modelo relacional com as seguintes entidades principais:
- **Alunos**  
- **Professores**  
- **Cursos**  
- **Aulas**  
- **Alunos_Cursos** (matrículas)
- **Certificados_Alunos**

## 🛠️ Tecnologias Utilizadas

- **Backend:** TypeScript
- **Banco de Dados:** PostgreSQL
- **Frontend:** React.js
- **Cloud:** AWS (S3, Lambda, API Gateway, RDS)

## 💾 Estrutura Básica do Banco

As tabelas principais:
- `alunos`
- `professores`
- `cursos`
- `aulas`
- `alunos_cursos`
- `certificados_alunos`

## 📥 Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/educabrasil.git

