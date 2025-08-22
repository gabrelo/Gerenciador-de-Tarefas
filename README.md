# Gerenciador de Tarefas

API REST para gerenciamento de tarefas construída com Node.js, Express e Prisma.

## 🚀 Deploy no Vercel

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Banco de dados PostgreSQL no [Supabase](https://supabase.com)

### 📋 Configuração do Supabase

#### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login com GitHub
2. Clique em **"New Project"**
3. Escolha organização e nome do projeto
4. Defina uma senha forte para o banco
5. Escolha região (recomendado: mais próxima do Brasil)
6. Aguarde a criação do projeto

#### 2. Obter DATABASE_URL
1. No dashboard do projeto, vá para **Settings** → **Database**
2. Procure por **"Connection string"**
3. Clique em **"URI"** e copie a URL
4. **IMPORTANTE**: Adicione `?pgbouncer=true&connection_limit=1` no final da URL

#### 3. Testar conexão localmente
```bash
# Copie .env.local.example para .env.local
cp .env.local.example .env.local

# Edite .env.local com sua DATABASE_URL do Supabase
# Execute as migrações
npx prisma db push

# Teste o servidor
npm start
```

### 🚀 Deploy no Vercel

#### Opção 1: Via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

#### Opção 2: Via GitHub
1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure a variável `DATABASE_URL` com a URL do Supabase

#### Configurar Variáveis de Ambiente no Vercel
1. Dashboard do projeto → **Settings** → **Environment Variables**
2. Adicione: `DATABASE_URL` com a URL completa do Supabase
3. **IMPORTANTE**: Inclua `?pgbouncer=true&connection_limit=1` no final

#### Executar Migrações após Deploy
```bash
# Via Vercel CLI
vercel env pull .env
npx prisma db push

# Ou via dashboard do Vercel
```

### 📋 Endpoints da API

- `GET /` - Informações da API
- `GET /tasks` - Listar todas as tarefas
- `POST /tasks` - Criar nova tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `PUT /tasks/:id/finish` - Finalizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa

### 🛠️ Tecnologias
- Node.js
- Express
- Prisma
- PostgreSQL (Supabase)

### 📝 Estrutura do Projeto
```
├── index.js          # Servidor Express
├── prisma/          # Configuração do Prisma
│   ├── schema.prisma # Schema do banco
│   └── migrations/  # Migrações
├── vercel.json      # Configuração do Vercel
└── package.json     # Dependências
```

### 🔧 Configurações Específicas do Supabase
- **Pooling**: Usar `?pgbouncer=true&connection_limit=1` na DATABASE_URL
- **SSL**: Habilitado por padrão
- **Limites**: 500MB de banco gratuito, 2GB de transferência

