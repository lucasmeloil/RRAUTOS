-- RR Autos — schema completo (veículos, imagens, leads, hero, usuários, storage)
create extension if not exists pgcrypto;

-- ─── Usuários (perfil ligado ao auth.users) ─────────────────────────────────
create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text,
  nivel text not null default 'cliente' check (nivel in ('admin','cliente')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.usuarios
    where id = auth.uid() and (
      nivel = 'admin' or
      lower(email) = 'admin@rrautos.com.br' or
      lower(email) like '%@rrautos.com.br'
    )
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_adm boolean;
begin
  is_adm := (lower(new.email) = 'admin@rrautos.com.br' or lower(new.email) like '%@rrautos.com.br');
  
  insert into public.usuarios (id, email, nome, nivel)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)),
    case when is_adm then 'admin' else 'cliente' end
  )
  on conflict (id) do update set
    nivel = case when is_adm then 'admin' else public.usuarios.nivel end,
    email = excluded.email;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── updated_at helper ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ─── Veículos ───────────────────────────────────────────────────────────────
create table if not exists public.veiculos (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  versao text,
  ano integer not null check (ano between 1900 and 2100),
  km integer not null default 0 check (km >= 0),
  cor text,
  combustivel text,
  motor text,
  cambio text,
  preco numeric(12,2) check (preco is null or preco >= 0),
  descricao text,
  observacoes text,
  video_url text,
  destaque boolean not null default false,
  destaque_hero boolean not null default false,
  status text not null default 'ativo' check (status in ('ativo','inativo','vendido')),
  visualizacoes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists veiculos_status_idx on public.veiculos(status);
create index if not exists veiculos_marca_idx on public.veiculos(marca);
create index if not exists veiculos_preco_idx on public.veiculos(preco);
drop trigger if exists veiculos_updated on public.veiculos;
create trigger veiculos_updated before update on public.veiculos
  for each row execute function public.set_updated_at();

-- ─── Imagens ────────────────────────────────────────────────────────────────
create table if not exists public.imagens (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid not null references public.veiculos(id) on delete cascade,
  url text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists imagens_veiculo_idx on public.imagens(veiculo_id);

-- ─── Contatos / Leads ───────────────────────────────────────────────────────
create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  email text,
  mensagem text,
  veiculo_id uuid references public.veiculos(id) on delete set null,
  status text not null default 'novo' check (status in ('novo','em_atendimento','concluido','descartado')),
  created_at timestamptz not null default now()
);
create index if not exists contatos_created_idx on public.contatos(created_at desc);

-- ─── Hero Slides ────────────────────────────────────────────────────────────
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  marca text, modelo text, versao text, ano integer,
  preco text, tagline text, badge text, km text,
  cambio text, combustivel text, image text, link text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists hero_updated on public.hero_slides;
create trigger hero_updated before update on public.hero_slides
  for each row execute function public.set_updated_at();

-- ─── RPC visualizações ──────────────────────────────────────────────────────
create or replace function public.increment_views(vehicle_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.veiculos set visualizacoes = visualizacoes + 1
  where id = vehicle_id and status = 'ativo';
$$;
grant execute on function public.increment_views(uuid) to anon, authenticated;

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table public.usuarios    enable row level security;
alter table public.veiculos    enable row level security;
alter table public.imagens     enable row level security;
alter table public.contatos    enable row level security;
alter table public.hero_slides enable row level security;

drop policy if exists usuarios_self on public.usuarios;
create policy usuarios_self on public.usuarios for select using (id = auth.uid() or public.is_admin());
drop policy if exists usuarios_admin on public.usuarios;
create policy usuarios_admin on public.usuarios for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists veiculos_read on public.veiculos;
create policy veiculos_read on public.veiculos for select using (status = 'ativo' or public.is_admin());
drop policy if exists veiculos_admin on public.veiculos;
create policy veiculos_admin on public.veiculos for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists imagens_read on public.imagens;
create policy imagens_read on public.imagens for select using (true);
drop policy if exists imagens_admin on public.imagens;
create policy imagens_admin on public.imagens for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists contatos_insert on public.contatos;
create policy contatos_insert on public.contatos for insert with check (true);
drop policy if exists contatos_admin on public.contatos;
create policy contatos_admin on public.contatos for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists hero_read on public.hero_slides;
create policy hero_read on public.hero_slides for select using (ativo or public.is_admin());
drop policy if exists hero_admin on public.hero_slides;
create policy hero_admin on public.hero_slides for all using (public.is_admin()) with check (public.is_admin());

-- ─── Storage bucket ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('veiculo-imagens','veiculo-imagens', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true;

drop policy if exists veiculo_imgs_read on storage.objects;
create policy veiculo_imgs_read on storage.objects for select using (bucket_id = 'veiculo-imagens');
drop policy if exists veiculo_imgs_write on storage.objects;
create policy veiculo_imgs_write on storage.objects for insert with check (bucket_id = 'veiculo-imagens' and public.is_admin());
drop policy if exists veiculo_imgs_update on storage.objects;
create policy veiculo_imgs_update on storage.objects for update using (bucket_id = 'veiculo-imagens' and public.is_admin());
drop policy if exists veiculo_imgs_delete on storage.objects;
create policy veiculo_imgs_delete on storage.objects for delete using (bucket_id = 'veiculo-imagens' and public.is_admin());

-- ─── Seed inicial (apenas se vazio) ─────────────────────────────────────────
insert into public.veiculos (id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio, preco, descricao, observacoes, destaque, destaque_hero, visualizacoes)
select * from (values
 ('c1b48b78-43d9-485e-990a-995c73950e01'::uuid,'Toyota','Corolla','Altis Hybrid 1.8 16V',2023,24500,'Branco Pérola','Híbrido','1.8 Hybrid','CVT',159900,'Sedã premium impecável, única dona, com pacote Toyota Safety Sense completo, teto solar e bancos em couro.','Garantia de fábrica até 2028. Laudo cautelar 100% aprovado.',true,true,142),
 ('c1b48b78-43d9-485e-990a-995c73950e02'::uuid,'Jeep','Compass','Limited T270 Turbo Flex',2022,38900,'Cinza Granite','Flex','1.3 Turbo 185cv','Automático',148500,'SUV sofisticado com painel digital, multimídia 10.1" com CarPlay/Android Auto e teto panorâmico.','Revisões na concessionária Jeep. Pneus novos.',true,true,98),
 ('c1b48b78-43d9-485e-990a-995c73950e03'::uuid,'Honda','Civic','Touring 1.5 Turbo',2021,45000,'Preto Cristal','Gasolina','1.5 Turbo 173cv','CVT',139900,'Topo de linha do Civic G10, som premium, teto solar e LaneWatch.','Impecável estado de conservação.',true,false,215),
 ('c1b48b78-43d9-485e-990a-995c73950e04'::uuid,'Chevrolet','Tracker','Premier 1.2 Turbo',2023,19200,'Azul Eclipse','Flex','1.2 Turbo 133cv','Automático',124900,'Teto panorâmico, frenagem autônoma, sensor de ponto cego e Easy Park.','Carro de não-fumante. Manual e chave reserva.',true,false,87),
 ('c1b48b78-43d9-485e-990a-995c73950e05'::uuid,'Volkswagen','T-Cross','Highline 250 TSI',2022,33400,'Prata Pyrit','Flex','1.4 TSI 150cv','Automático',119900,'Painel Active Info Display, ar Climatronic Touch e acabamento premium.','Laudo cautelar aprovado. Aceitamos troca.',false,false,64),
 ('c1b48b78-43d9-485e-990a-995c73950e06'::uuid,'BMW','320i','M Sport 2.0 TwinPower Turbo',2023,16800,'Azul Portimão','Flex','2.0 Turbo 184cv','Automático 8M',289900,'Pacote M Sport, bancos elétricos com memória, som Harman Kardon e Live Cockpit Professional.','Sem retoques. Vitrificação de 3 anos.',true,true,312)
) v
where not exists (select 1 from public.veiculos);

insert into public.imagens (veiculo_id, url, ordem)
select v.id::uuid, v.url, v.ordem from (values
 ('c1b48b78-43d9-485e-990a-995c73950e01','https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',0),
 ('c1b48b78-43d9-485e-990a-995c73950e01','https://images.unsplash.com/photo-1590362891988-f778047831d0?auto=format&fit=crop&w=1200&q=80',1),
 ('c1b48b78-43d9-485e-990a-995c73950e02','https://images.unsplash.com/photo-1542362567-b07e5359815e?auto=format&fit=crop&w=1200&q=80',0),
 ('c1b48b78-43d9-485e-990a-995c73950e02','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',1),
 ('c1b48b78-43d9-485e-990a-995c73950e03','https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',0),
 ('c1b48b78-43d9-485e-990a-995c73950e04','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',0),
 ('c1b48b78-43d9-485e-990a-995c73950e05','https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',0),
 ('c1b48b78-43d9-485e-990a-995c73950e06','https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',0),
 ('c1b48b78-43d9-485e-990a-995c73950e06','https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',1)
) v(id,url,ordem)
where not exists (select 1 from public.imagens);

insert into public.hero_slides (marca, modelo, ano, versao, preco, tagline, badge, km, cambio, combustivel, image, link, ordem)
select * from (values
 ('BMW','320i M Sport',2023,'2.0 TwinPower Turbo 184cv','R$ 289.900','O ápice da esportividade e elegância premium','Destaque Exclusivo','16.800 km','Automático 8M','Flex','https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=85','/veiculo/bmw-320i-2023/c1b48b78-43d9-485e-990a-995c73950e06',0),
 ('Toyota','Corolla Altis',2023,'Hybrid 1.8 16V Automático','R$ 159.900','Máxima economia, conforto e segurança para você','Mais Desejado','24.500 km','CVT','Híbrido','https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1920&q=85','/veiculo/toyota-corolla-2023/c1b48b78-43d9-485e-990a-995c73950e01',1),
 ('Jeep','Compass Limited',2022,'T270 Turbo Flex 185cv','R$ 148.500','O SUV líder em tecnologia, robustez e presença','Oportunidade','38.900 km','Automático','Flex','https://images.unsplash.com/photo-1542362567-b07e5359815e?auto=format&fit=crop&w=1920&q=85','/veiculo/jeep-compass-2022/c1b48b78-43d9-485e-990a-995c73950e02',2)
) v
where not exists (select 1 from public.hero_slides);
