# 🚗 RR AUTOS - Portal Veicular Premium & Painel Administrativo

> Concessionária de Veículos Seminovos Selecionados em **Itabaiana – Sergipe**

---

## 🎨 Identidade Visual & Conceito
- **Azul Escuro:** `#002D7A` (Elegância, Solidez e Credibilidade)
- **Azul Médio / Primário:** `#0A4ABF` (Tecnologia e Destaque)
- **Branco Puro:** `#FFFFFF` (Clareza e Sofisticação)
- **Tipografia:** `Barlow Condensed` (Titulos esportivos) e `Inter` (Leitura moderna e limpa)
- **Inspiração:** Webmotors, iCarros, Kavak e OLX Autos com estética dark/premium moderna.

---

## 🛠️ Stack Tecnológica
- **Frontend:** React 19 + Vite
- **Roteamento:** React Router DOM (v7)
- **Ícones:** Lucide React
- **Notificações:** React Hot Toast
- **SEO & Metatags:** React Helmet Async
- **Estilização:** CSS3 Nativo com Design System (Tokens, Flexbox, CSS Grid, Glassmorphism, Micro-interações)
- **Backend & Autenticação:** Supabase (PostgreSQL, Row Level Security, Auth JWT, Storage de Imagens)

---

## 📱 Estrutura e Funcionalidades

### 🌐 Área Pública
1. **Página Inicial (`/`)**:
   - Hero dinâmico com call-to-action e estatísticas
   - Mecanismo de busca rápida (marca, modelo, faixa de preço, tipo)
   - Carrossel / grid de veículos em destaque com selo promocional
   - Categorias rápidas (Sedans, SUVs, Hatches, Picapes, etc.)
   - Diferenciais da RR Autos (Garantia, Vistoria Cautelar, Financiamento Facilitado)
   - Avaliações e depoimentos de clientes
   - Botão flutuante integrado do WhatsApp

2. **Catálogo de Veículos (`/veiculos`)**:
   - Busca em tempo real
   - Filtros por: Marca, Modelo, Ano, Câmbio, Combustível, Preço Mínimo/Máximo
   - Ordenação (Mais recentes, Menor preço, Maior preço, Mais visualizados)
   - Layout responsivo em grid com paginação

3. **Detalhes do Veículo (`/veiculo/:id` ou `/veiculo/:slug/:id`)**:
   - Galeria de fotos com visualização expandida
   - Ficha técnica detalhada (Câmbio, Motor, Combustível, KM, Cor, Ano)
   - Contador automático de visualizações
   - Botão de favoritar (sincronizado localmente)
   - Formulário de proposta com envio direto ao Supabase (`contatos`)
   - Botão direto para WhatsApp com mensagem pré-preenchida do veículo

4. **Quem Somos (`/quem-somos`)**:
   - História da RR Autos em Itabaiana/SE
   - Missão, Visão e Valores
   - Galeria da estrutura física e diferenciais

5. **Contato (`/contato`)**:
   - Informações de endereço, telefone, e-mail e horário de funcionamento
   - Formulário de mensagem integrado ao banco de dados
   - Mapa de localização interativo

6. **Favoritos (`/favoritos`)**:
   - Lista personalizada de veículos salvos pelo visitante

---

### 🔐 Painel Administrativo (`/admin`)
- **Login Seguro (`/admin/login`)**: Autenticação com e-mail e senha via Supabase Auth (JWT).
- **Dashboard (`/admin/dashboard`)**: Métricas de estoque total, veículos ativos, veículos vendidos, total de leads recebidos e visualizações.
- **Gestão de Veículos (`/admin/veiculos`)**:
  - Tabela com busca, paginação e status
  - Cadastro de novo veículo com modal completo
  - Edição de informações e troca de status (ativo / inativo / vendido)
  - Upload de fotos com pré-visualização e ordenação
  - Exclusão com confirmação
- **Gestão de Leads (`/admin/leads`)**:
  - Listagem de propostas e mensagens recebidas
  - Visualização dos dados do cliente e veículo de interesse
  - Ação rápida para responder via WhatsApp ou ligar direto

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
- Node.js (v18+)
- Conta no [Supabase](https://supabase.com)

### 2. Configuração do Supabase
1. No painel do seu projeto no Supabase, acesse **SQL Editor**.
2. Abra o arquivo [`supabase_schema.sql`](file:///d:/rrautos/supabase_schema.sql) deste projeto.
3. Copie todo o conteúdo e execute no SQL Editor do Supabase. Isso criará:
   - Tabelas `veiculos`, `imagens` e `contatos`
   - Políticas RLS (Row Level Security)
   - Bucket de armazenamento `veiculo-imagens`
   - Função RPC `increment_views`
   - 6 veículos de demonstração com fotos de alta qualidade
4. Crie seu usuário administrador no Supabase:
   - Acesse **Authentication > Users > Add user**
   - Cadastre seu e-mail e senha de administrador

### 3. Variáveis de Ambiente
Verifique o arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anon-ou-publishable
```

### 4. Rodando o Projeto
```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

O portal estará acessível em `http://localhost:5173`.
Acesse o painel administrativo em `http://localhost:5173/admin`.
