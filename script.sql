CREATE TABLE alunos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    data_nascimento DATE,
    telefone VARCHAR(30),
    ativo BOOLEAN NOT NULL
);

CREATE TABLE professores (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(30),
    ativo BOOLEAN NOT NULL
);

CREATE TABLE cursos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    id_professor BIGINT NOT NULL,
    carga_horaria INTEGER,
    ativo BOOLEAN NOT NULL,
    FOREIGN KEY (id_professor) REFERENCES professores (id)
);

CREATE TABLE aulas (
    id BIGSERIAL PRIMARY KEY,
    id_curso BIGINT NOT NULL,
    duracao_minutos INTEGER,
    ativo BOOLEAN NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES cursos (id)
);

CREATE TABLE alunos_cursos (
    id BIGSERIAL PRIMARY KEY,
    id_aluno BIGINT NOT NULL,
    id_curso BIGINT NOT NULL,
    data_matricula DATE NOT NULL,
    finalizado BOOLEAN NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES alunos (id),
    FOREIGN KEY (id_curso) REFERENCES cursos (id)
);

CREATE TABLE certificados_alunos (
    id BIGSERIAL PRIMARY KEY,
    data_emissao DATE NOT NULL,
    id_aluno BIGINT NOT NULL,
    id_curso BIGINT NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES alunos (id),
    FOREIGN KEY (id_curso) REFERENCES cursos (id)
);
