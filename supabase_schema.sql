-- ==============================================================================
-- RR AUTOS - Script de Banco de Dados Supabase (PostgreSQL)
-- Itabaiana, Sergipe
-- ==============================================================================

-- 1. Extensões
create extension if not exists "uuid-ossp";

-- 2. Tabela: USUARIOS
create table if not exists public.usuarios (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    email text unique not null,
    senha text,
    nivel text not null default 'admin' check (nivel in ('admin', 'vendedor')),
    created_at timestamptz not null default now()
);

create index if not exists idx_usuarios_email on public.usuarios(email);

-- 3. Tabela: VEICULOS
create table if not exists public.veiculos (
    id uuid primary key default gen_random_uuid(),
    marca text not null,
    modelo text not null,
    versao text,
    ano integer not null,
    km integer not null default 0,
    cor text,
    combustivel text default 'Flex',
    motor text,
    cambio text default 'Automático',
    preco numeric(12, 2) not null,
    descricao text,
    observacoes text,
    video_url text,
    destaque boolean not null default false,
    status text not null default 'ativo' check (status in ('ativo', 'inativo', 'vendido')),
    visualizacoes integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Índices para busca otimizada
create index if not exists idx_veiculos_status on public.veiculos(status);
create index if not exists idx_veiculos_marca on public.veiculos(marca);
create index if not exists idx_veiculos_modelo on public.veiculos(modelo);
create index if not exists idx_veiculos_ano on public.veiculos(ano);
create index if not exists idx_veiculos_preco on public.veiculos(preco);
create index if not exists idx_veiculos_destaque on public.veiculos(destaque);
create index if not exists idx_veiculos_created_at on public.veiculos(created_at desc);

-- 4. Tabela: IMAGENS
create table if not exists public.imagens (
    id uuid primary key default gen_random_uuid(),
    veiculo_id uuid not null references public.veiculos(id) on delete cascade,
    url text not null,
    ordem integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_imagens_veiculo on public.imagens(veiculo_id, ordem);

-- 5. Tabela: CONTATOS / LEADS
create table if not exists public.contatos (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    telefone text not null,
    email text,
    mensagem text,
    veiculo_id uuid references public.veiculos(id) on delete set null,
    status text not null default 'novo' check (status in ('novo', 'em_atendimento', 'finalizado')),
    lido boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_contatos_created_at on public.contatos(created_at desc);
create index if not exists idx_contatos_status on public.contatos(status);

-- 5.1 Tabela: HERO_SLIDES (Banners e Imagens do Slider Principal da Home)
create table if not exists public.hero_slides (
    id uuid primary key default gen_random_uuid(),
    marca text not null,
    modelo text not null,
    versao text,
    ano integer not null default 2024,
    km text,
    cambio text default 'Automático',
    combustivel text default 'Flex',
    preco text not null,
    tagline text,
    badge text default 'Destaque Exclusivo',
    image text not null,
    link text default '/veiculos',
    ordem integer not null default 0,
    ativo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_hero_slides_ativo_ordem on public.hero_slides(ativo, ordem);

-- 6. Função RPC: Incrementar Visualizações
create or replace function public.increment_views(vehicle_id uuid)
returns void
language sql
security definer
as $$
  update public.veiculos
  set visualizacoes = coalesce(visualizacoes, 0) + 1
  where id = vehicle_id;
$$;

-- 7. Trigger para sincronizar novos usuários do Supabase Auth com a tabela public.usuarios
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, nome, email, nivel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email,
    'admin'
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. Configuração de Row Level Security (RLS)
alter table public.usuarios enable row level security;
alter table public.veiculos enable row level security;
alter table public.imagens enable row level security;
alter table public.contatos enable row level security;
alter table public.hero_slides enable row level security;

-- Políticas para HERO_SLIDES
create policy "Slides ativos visíveis publicamente"
    on public.hero_slides for select
    using (ativo = true or auth.role() = 'authenticated');

create policy "Admin gerencia hero slides"
    on public.hero_slides for all
    to authenticated
    using (true)
    with check (true);

-- Políticas para USUARIOS
create policy "Usuários autenticados podem ver perfil"
    on public.usuarios for select
    to authenticated
    using (true);

create policy "Usuários autenticados podem atualizar seu perfil"
    on public.usuarios for update
    to authenticated
    using (true)
    with check (true);

-- Políticas para VEICULOS
create policy "Veículos ativos são visíveis ao público"
    on public.veiculos for select
    using (status = 'ativo' or auth.role() = 'authenticated');

create policy "Usuários autenticados podem criar veículos"
    on public.veiculos for insert
    to authenticated
    with check (true);

create policy "Usuários autenticados podem atualizar veículos"
    on public.veiculos for update
    to authenticated
    using (true)
    with check (true);

create policy "Usuários autenticados podem excluir veículos"
    on public.veiculos for delete
    to authenticated
    using (true);

-- Políticas para IMAGENS
create policy "Imagens visíveis publicamente"
    on public.imagens for select
    using (true);

create policy "Admin gerencia imagens"
    on public.imagens for all
    to authenticated
    using (true)
    with check (true);

-- Políticas para CONTATOS / LEADS
create policy "Qualquer visitante pode enviar contato"
    on public.contatos for insert
    with check (true);

create policy "Apenas admin lê e gerencia contatos"
    on public.contatos for all
    to authenticated
    using (true)
    with check (true);

-- 9. Configuração do Storage (Bucket de Fotos)
insert into storage.buckets (id, name, public)
values ('veiculo-imagens', 'veiculo-imagens', true)
on conflict (id) do nothing;

create policy "Fotos públicas para leitura"
    on storage.objects for select
    using (bucket_id = 'veiculo-imagens');

create policy "Usuários autenticados podem enviar fotos"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'veiculo-imagens');

create policy "Usuários autenticados podem atualizar fotos"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'veiculo-imagens');

create policy "Usuários autenticados podem deletar fotos"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'veiculo-imagens');

-- 10. DADOS INICIAIS (SEED DATA COM VEÍCULOS DE DEMONSTRAÇÃO)
do $$
declare
    v_id1 uuid := 'c1b48b78-43d9-485e-990a-995c73950e01';
    v_id2 uuid := 'c1b48b78-43d9-485e-990a-995c73950e02';
    v_id3 uuid := 'c1b48b78-43d9-485e-990a-995c73950e03';
    v_id4 uuid := 'c1b48b78-43d9-485e-990a-995c73950e04';
    v_id5 uuid := 'c1b48b78-43d9-485e-990a-995c73950e05';
    v_id6 uuid := 'c1b48b78-43d9-485e-990a-995c73950e06';
begin
    -- 1. Toyota Corolla Altis Hybrid
    insert into public.veiculos (
        id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio,
        preco, descricao, observacoes, destaque, status, visualizacoes
    ) values (
        v_id1, 'Toyota', 'Corolla', 'Altis Hybrid 1.8 16V', 2023, 24500, 'Branco Pérola',
        'Híbrido', '1.8 Hybrid', 'CVT', 159900.00,
        'Sedã premium impecável, única dona, com pacote Toyota Safety Sense completo, teto solar, bancos em couro claro e revisão rigorosamente em dia na concessionária.',
        'Garantia de fábrica até 2028. IPVA 2024 total pago. Laudo cautelar 100% aprovado sem apontamentos.',
        true, 'ativo', 142
    ) on conflict (id) do nothing;

    insert into public.imagens (veiculo_id, url, ordem) values
        (v_id1, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80', 0),
        (v_id1, 'https://images.unsplash.com/photo-1590362891988-f778047831d0?auto=format&fit=crop&w=1200&q=80', 1)
    on conflict do nothing;

    -- 2. Jeep Compass Limited
    insert into public.veiculos (
        id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio,
        preco, descricao, observacoes, destaque, status, visualizacoes
    ) values (
        v_id2, 'Jeep', 'Compass', 'Limited T270 Turbo Flex', 2022, 38900, 'Cinza Granite',
        'Flex', '1.3 Turbo 185cv', 'Automático', 148500.00,
        'SUV de alta sofisticação com painel 100% digital TFT 10.25", central multimídia 10.1" sem fio com Apple CarPlay e Android Auto, piloto automático adaptativo e teto panorâmico.',
        'Todas as revisões realizadas na concessionária Jeep. Pneus novos Pirelli Scorpion.',
        true, 'ativo', 98
    ) on conflict (id) do nothing;

    insert into public.imagens (veiculo_id, url, ordem) values
        (v_id2, 'https://images.unsplash.com/photo-1542362567-b07e5359815e?auto=format&fit=crop&w=1200&q=80', 0),
        (v_id2, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 1)
    on conflict do nothing;

    -- 3. Honda Civic Touring
    insert into public.veiculos (
        id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio,
        preco, descricao, observacoes, destaque, status, visualizacoes
    ) values (
        v_id3, 'Honda', 'Civic', 'Touring 1.5 Turbo', 2021, 45000, 'Preto Cristal',
        'Gasolina', '1.5 Turbo 173cv', 'CVT', 139900.00,
        'A versão topo de linha do Civic G10. Motor 1.5 Turbo potente e econômico, sistema de som premium de 452W com subwoofer, teto solar e LaneWatch.',
        'Impecável estado de conservação. Chave presencial com partida remota.',
        true, 'ativo', 215
    ) on conflict (id) do nothing;

    insert into public.imagens (veiculo_id, url, ordem) values
        (v_id3, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80', 0)
    on conflict do nothing;

    -- 4. Chevrolet Tracker Premier
    insert into public.veiculos (
        id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio,
        preco, descricao, observacoes, destaque, status, visualizacoes
    ) values (
        v_id4, 'Chevrolet', 'Tracker', 'Premier 1.2 Turbo', 2023, 19200, 'Azul Eclipse',
        'Flex', '1.2 Turbo 133cv', 'Automático', 124900.00,
        'Versão mais completa com teto solar panorâmico, alerta de colisão frontal com frenagem autônoma, sensor de ponto cego e assistente de estacionamento semiautônomo (Easy Park).',
        'Carro de não-fumante. Manual e chave reserva. Garantia de procedência RR Autos.',
        true, 'ativo', 87
    ) on conflict (id) do nothing;

    insert into public.imagens (veiculo_id, url, ordem) values
        (v_id4, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 0)
    on conflict do nothing;

    -- 5. Volkswagen T-Cross Highline
    insert into public.veiculos (
        id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio,
        preco, descricao, observacoes, destaque, status, visualizacoes
    ) values (
        v_id5, 'Volkswagen', 'T-Cross', 'Highline 250 TSI', 2022, 33400, 'Prata Pyrit',
        'Flex', '1.4 TSI 150cv', 'Automático', 119900.00,
        'Excelente dirigibilidade e torque forte. Painel digital Active Info Display, ar digital Climatronic Touch e acabamento com detalhes premium.',
        'Laudo cautelar Dekra 100% aprovado. Aceitamos seu seminovo na troca com excelente avaliação.',
        false, 'ativo', 64
    ) on conflict (id) do nothing;

    insert into public.imagens (veiculo_id, url, ordem) values
        (v_id5, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', 0)
    on conflict do nothing;

    -- 6. BMW 320i M Sport
    insert into public.veiculos (
        id, marca, modelo, versao, ano, km, cor, combustivel, motor, cambio,
        preco, descricao, observacoes, destaque, status, visualizacoes
    ) values (
        v_id6, 'BMW', '320i', 'M Sport 2.0 TwinPower Turbo', 2023, 16800, 'Azul Portimão',
        'Flex', '2.0 Turbo 184cv', 'Automático 8M', 289900.00,
        'O ápice esportivo da categoria. Pacote M Sport autêntico, bancos esportivos com regulagem elétrica e memória, som Harman Kardon, display curvo BMW Live Cockpit Professional.',
        'Exemplar sem qualquer retoque ou detalhe. Película térmica instalada. Vitrificação de pintura de 3 anos.',
        true, 'ativo', 312
    ) on conflict (id) do nothing;

    insert into public.imagens (veiculo_id, url, ordem) values
        (v_id6, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 0),
        (v_id6, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 1)
    on conflict do nothing;

    -- Lead de exemplo
    insert into public.contatos (nome, telefone, email, mensagem, veiculo_id, status) values
        ('Carlos Alberto Silva', '(79) 99876-5432', 'carlos.alberto@email.com', 'Olá, tenho interesse no Toyota Corolla Altis Hybrid. Aceitam Corolla 2018 na troca?', v_id1, 'novo')
    on conflict do nothing;

    -- Slides Iniciais do Hero Slider
    insert into public.hero_slides (id, marca, modelo, ano, versao, preco, tagline, badge, km, cambio, combustivel, image, link, ordem, ativo) values
        ('c1b48b78-43d9-485e-990a-995c73950e06', 'BMW', '320i M Sport', 2023, '2.0 TwinPower Turbo 184cv', 'R$ 289.900', 'O ápice da esportividade e elegância premium', 'Destaque Exclusivo', '16.800 km', 'Automático 8M', 'Flex', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=85', '/veiculo/bmw-320i-2023/c1b48b78-43d9-485e-990a-995c73950e06', 0, true),
        ('c1b48b78-43d9-485e-990a-995c73950e01', 'Toyota', 'Corolla Altis', 2023, 'Hybrid 1.8 16V Automático', 'R$ 159.900', 'Máxima economia, conforto e segurança para você', 'Mais Desejado', '24.500 km', 'CVT', 'Híbrido', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1920&q=85', '/veiculo/toyota-corolla-2023/c1b48b78-43d9-485e-990a-995c73950e01', 1, true),
        ('c1b48b78-43d9-485e-990a-995c73950e02', 'Jeep', 'Compass Limited', 2022, 'T270 Turbo Flex 185cv', 'R$ 148.500', 'O SUV líder em tecnologia, robustez e presença', 'Oportunidade', '38.900 km', 'Automático', 'Flex', 'https://images.unsplash.com/photo-1542362567-b07e5359815e?auto=format&fit=crop&w=1920&q=85', '/veiculo/jeep-compass-2022/c1b48b78-43d9-485e-990a-995c73950e02', 2, true),
        ('c1b48b78-43d9-485e-990a-995c73950e03', 'Honda', 'Civic Touring', 2021, '1.5 Turbo 173cv', 'R$ 139.900', 'Design esportivo com motorização turbo impecável', 'Seleção Premium', '45.000 km', 'CVT', 'Gasolina', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=85', '/veiculo/honda-civic-2021/c1b48b78-43d9-485e-990a-995c73950e03', 3, true)
    on conflict (id) do nothing;

end $$;
