# 🗄️ Documentação do Banco de Dados - Supabase | RR AUTOS

Este documento detalha toda a modelagem relacional, tipos de dados, regras de segurança (Row Level Security), funções e instruções passo a passo para configuração no **Supabase**.

---

## 📋 Sumário das Tabelas

| Tabela | Finalidade | RLS Ativo |
| :--- | :--- | :---: |
| `usuarios` | Perfis e níveis de acesso administrativo (`admin`, `vendedor`) | ✅ Sim |
| `veiculos` | Estoque de veículos seminovos com especificações e status | ✅ Sim |
| `imagens` | Fotos de cada veículo (com ordem de exibição) | ✅ Sim |
| `hero_slides` | Banners e imagens dinâmicas do slider principal (Hero) da Home | ✅ Sim |
| `contatos` | Leads, mensagens de proposta e solicitações de financiamento | ✅ Sim |
| `storage.buckets` (`veiculo-imagens`) | Armazenamento de arquivos de imagem no Supabase Storage | ✅ Sim |

---

## 🏗️ Modelagem e Estrutura das Tabelas

### 1. Tabela: `usuarios`
Armazena os perfis de usuários com seus respectivos privilégios no painel.

```sql
create table public.usuarios (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    email text unique not null,
    senha text,
    nivel text not null default 'admin' check (nivel in ('admin', 'vendedor')),
    created_at timestamptz not null default now()
);
```
* **Campos:**
  - `id`: Identificador único (sincronizado automaticamente com `auth.users` via trigger).
  - `nome`: Nome completo do administrador/vendedor.
  - `email`: E-mail corporativo de acesso.
  - `senha`: Hash criptografado (gerenciado pelo Supabase Auth).
  - `nivel`: Nível de permissão (`admin` ou `vendedor`).
  - `created_at`: Data de cadastro.

---

### 2. Tabela: `veiculos`
Catálogo central de veículos seminovos da RR Autos.

```sql
create table public.veiculos (
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
```
* **Status disponíveis:**
  - `'ativo'`: Visível no catálogo público e disponível para venda.
  - `'inativo'`: Oculto temporariamente da vitrine pública.
  - `'vendido'`: Marcado como vendido para histórico e relatórios.

---

### 3. Tabela: `imagens`
Registra a galeria de fotos associada a cada veículo.

```sql
create table public.imagens (
    id uuid primary key default gen_random_uuid(),
    veiculo_id uuid not null references public.veiculos(id) on delete cascade,
    url text not null,
    ordem integer not null default 0,
    created_at timestamptz not null default now()
);
```
* **Relacionamento:** `veiculo_id` com exclusão em cascata (`on delete cascade`). Ao excluir um veículo, todas as fotos cadastradas são excluídas automaticamente.

---

### 4. Tabela: `contatos` (Leads)
Mensagens, propostas e contatos enviados pelos visitantes do site.

```sql
create table public.contatos (
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
```
* **Status:**
  - `'novo'`: Lead recém-chegado.
  - `'em_atendimento'`: Vendedor já fez o primeiro contato.
  - `'finalizado'`: Negociação concluída ou encerrada.

---

## 🔒 Segurança & Políticas de Acesso (Row Level Security - RLS)

Todas as tabelas possuem RLS habilitado:

1. **`veiculos`**:
   - `SELECT`: Público para qualquer veículo com `status = 'ativo'`. Usuários autenticados (`admin`) visualizam todos os status.
   - `INSERT`, `UPDATE`, `DELETE`: Permitido exclusivamente para usuários autenticados.
2. **`imagens`**:
   - `SELECT`: Público para leitura das fotos.
   - `ALL` (`INSERT`, `UPDATE`, `DELETE`): Exclusivo para usuários autenticados.
3. **`contatos`**:
   - `INSERT`: Qualquer visitante público pode enviar mensagens pelo formulário.
   - `SELECT`, `UPDATE`, `DELETE`: Exclusivo para administradores autenticados.
4. **`usuarios`**:
   - Visualização e atualização restritas a sessões autenticadas.
5. **Storage `veiculo-imagens`**:
   - Leitura pública via CDN/URL pública.
   - Envio e exclusão de arquivos restritos a usuários autenticados.

---

## ⚡ Passo a Passo de Execução no Supabase

1. Abra o painel do seu projeto no Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. No menu lateral esquerdo, clique no ícone **SQL Editor** (ou pressione `Ctrl + Shift + S`).
3. Clique em **"New query"**.
4. Abra o arquivo [`supabase_schema.sql`](file:///d:/rrautos/supabase_schema.sql) localizado na raiz deste projeto.
5. Copie todo o código SQL e cole no editor do Supabase.
6. Clique no botão **"Run"** (ou `Ctrl + Enter`).
7. **Pronto!** Todas as tabelas, índices, trigger de sincronização de administradores, bucket de imagens e os 6 veículos iniciais estarão configurados.

---

## 👤 Como Criar o Administrador

1. No Supabase Dashboard, acesse **Authentication > Users**.
2. Clique no botão **"Add user" > "Create user"**.
3. Insira o e-mail (ex: `admin@rrautos.com.br`) e defina uma senha segura.
4. Marque a opção **"Auto Confirm User"** para ativar a conta imediatamente.
5. Com isso, o trigger `on_auth_user_created` adicionará automaticamente seu registro na tabela `usuarios` com `nivel = 'admin'`.
6. Acesse `http://localhost:5173/admin/login` e entre no Painel Administrativo!
