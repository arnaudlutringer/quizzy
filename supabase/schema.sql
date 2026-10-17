-- Schéma Quizzy : à exécuter une fois dans l'éditeur SQL de Supabase.
-- Toutes les lectures et écritures passent par le serveur Next.js avec la clé
-- service_role : RLS est activé sans aucune policy, donc la clé publique n'a accès à rien.

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  admin_key text not null,
  owner_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes (id) on delete cascade,
  position int not null,
  text text not null,
  choices jsonb not null,
  correct_index int not null
);

create index if not exists questions_quiz_id_idx on questions (quiz_id, position);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes (id) on delete cascade,
  player_name text not null,
  answers jsonb not null,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);

create index if not exists attempts_quiz_id_idx on attempts (quiz_id, score desc, created_at);

alter table quizzes enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
