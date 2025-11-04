
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
