-- ==============================================================================
-- RR AUTOS - Correção Definitiva de RLS (Row Level Security) para o Painel Admin
-- Executar no Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Redefinir a função is_admin() para aceitar qualquer usuário autenticado ou admin
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select (
    auth.role() = 'authenticated'
    or coalesce(auth.jwt() ->> 'email', '') = 'admin@rrautos.com.br'
    or coalesce(auth.jwt() ->> 'email', '') like '%@rrautos.com.br'
    or exists (
      select 1 from public.usuarios
      where id = auth.uid() and (
        nivel = 'admin' or
        lower(email) = 'admin@rrautos.com.br' or
        lower(email) like '%@rrautos.com.br'
      )
    )
  );
$$;

-- 2. Garantir que a tabela VEICULOS tenha RLS correto e sem bloqueios 403
alter table public.veiculos enable row level security;

-- Limpar todas as políticas antigas de VEICULOS
drop policy if exists veiculos_read on public.veiculos;
drop policy if exists veiculos_admin on public.veiculos;
drop policy if exists "Veículos ativos são visíveis ao público" on public.veiculos;
drop policy if exists "Usuários autenticados podem criar veículos" on public.veiculos;
drop policy if exists "Usuários autenticados podem atualizar veículos" on public.veiculos;
drop policy if exists "Usuários autenticados podem excluir veículos" on public.veiculos;
drop policy if exists veiculos_select on public.veiculos;
drop policy if exists veiculos_insert on public.veiculos;
drop policy if exists veiculos_update on public.veiculos;
drop policy if exists veiculos_delete on public.veiculos;

-- Novas políticas definitivas para VEICULOS
create policy "veiculos_select" on public.veiculos
  for select
  using (status = 'ativo' or auth.role() = 'authenticated');

create policy "veiculos_insert" on public.veiculos
  for insert
  to authenticated
  with check (true);

create policy "veiculos_update" on public.veiculos
  for update
  to authenticated
  using (true)
  with check (true);

create policy "veiculos_delete" on public.veiculos
  for delete
  to authenticated
  using (true);

-- 3. Garantir que a tabela IMAGENS tenha RLS correto
alter table public.imagens enable row level security;

drop policy if exists imagens_read on public.imagens;
drop policy if exists imagens_admin on public.imagens;
drop policy if exists "Imagens visíveis publicamente" on public.imagens;
drop policy if exists "Admin gerencia imagens" on public.imagens;
drop policy if exists imagens_select on public.imagens;
drop policy if exists imagens_all on public.imagens;

create policy "imagens_select" on public.imagens
  for select
  using (true);

create policy "imagens_all" on public.imagens
  for all
  to authenticated
  using (true)
  with check (true);

-- 4. Garantir que a tabela HERO_SLIDES tenha RLS correto
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  ano integer not null,
  versao text,
  preco text not null,
  tagline text,
  badge text,
  km text,
  cambio text,
  combustivel text,
  image text not null,
  link text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

drop policy if exists hero_read on public.hero_slides;
drop policy if exists hero_admin on public.hero_slides;
drop policy if exists "Hero slides visíveis publicamente" on public.hero_slides;
drop policy if exists "Admin gerencia hero slides" on public.hero_slides;
drop policy if exists hero_select on public.hero_slides;
drop policy if exists hero_all on public.hero_slides;

create policy "hero_select" on public.hero_slides
  for select
  using (true);

create policy "hero_all" on public.hero_slides
  for all
  to authenticated
  using (true)
  with check (true);

-- 5. Garantir que a tabela CONTATOS tenha RLS correto
create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  email text,
  mensagem text,
  veiculo_id uuid references public.veiculos(id) on delete set null,
  lido boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contatos enable row level security;

drop policy if exists contatos_insert on public.contatos;
drop policy if exists contatos_admin on public.contatos;
drop policy if exists "Qualquer visitante pode enviar contato" on public.contatos;
drop policy if exists "Apenas admin lê e gerencia contatos" on public.contatos;

create policy "contatos_insert" on public.contatos
  for insert
  with check (true);

create policy "contatos_admin" on public.contatos
  for all
  to authenticated
  using (true)
  with check (true);

-- 6. Configurar STORAGE (Bucket de Fotos) sem bloqueios para administradores
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('veiculo-imagens', 'veiculo-imagens', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true;

drop policy if exists veiculo_imgs_read on storage.objects;
drop policy if exists veiculo_imgs_write on storage.objects;
drop policy if exists veiculo_imgs_update on storage.objects;
drop policy if exists veiculo_imgs_delete on storage.objects;
drop policy if exists "Fotos públicas para leitura" on storage.objects;
drop policy if exists "Usuários autenticados podem enviar fotos" on storage.objects;
drop policy if exists "Usuários autenticados podem atualizar fotos" on storage.objects;
drop policy if exists "Usuários autenticados podem deletar fotos" on storage.objects;
drop policy if exists storage_veiculos_read on storage.objects;
drop policy if exists storage_veiculos_insert on storage.objects;
drop policy if exists storage_veiculos_update on storage.objects;
drop policy if exists storage_veiculos_delete on storage.objects;

create policy "storage_veiculos_read" on storage.objects
  for select
  using (bucket_id = 'veiculo-imagens');

create policy "storage_veiculos_insert" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'veiculo-imagens');

create policy "storage_veiculos_update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'veiculo-imagens');

create policy "storage_veiculos_delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'veiculo-imagens');

-- 7. Promover todos os usuários auth existentes para admin na tabela usuarios
insert into public.usuarios (id, email, nome, nivel)
select 
  id,
  email,
  coalesce(raw_user_meta_data->>'nome', split_part(email, '@', 1)),
  'admin'
from auth.users
on conflict (id) do update set nivel = 'admin';

