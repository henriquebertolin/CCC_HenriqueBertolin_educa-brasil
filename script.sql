CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL,
    cidade TEXT NOT NULL,
    professor boolean not null,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table curso (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  teacher_id uuid not null references usuarios(id),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table matriculas (
	id uuid primary key default gen_random_uuid(),
	aluno_id uuid not null references usuarios(id),
	curso_id uuid not null references curso(id)
);

CREATE TABLE aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_curso UUID NOT NULL REFERENCES curso(id),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  is_video boolean not null,
  position INT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  estimated_sec INT DEFAULT 0,
  video_url TEXT,
  material_url TEXT,
  material_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

  create table usuarios_aulas(
 	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	id_aluno UUID not null references usuarios(id),
	id_aula UUID not null references aulas(id),
	finalizado boolean not null default false
  );

  create table perguntas (
 	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	texto text not null,
	id_usuario UUID not null references usuarios(id),
	id_curso UUID not null references curso(id)
  );

  create table respostas(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	texto text not null,
	id_usuario UUID not null references usuarios(id),
	id_pergunta UUID not null references perguntas(id)
  );

CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_atualizar_data_modificacao
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_modificacao();
