# 🎵 Emotify - Análise Emocional de Música Spotify

Transforme seus dados do Spotify em insights emocionais profundos usando IA avançada.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ instalado
- Conta Spotify (gratuita ou premium)
- Conta Supabase (gratuita)
- Conta Spotify Developer

### Configuração em 3 Passos

#### 1️⃣ Configure o Spotify Developer Dashboard

1. Acesse: https://developer.spotify.com/dashboard
2. Crie um app ou abra o existente
3. Vá em **Settings**
4. Em **Redirect URIs**, adicione:
   ```
   http://localhost:3001/api/auth/callback
   ```
5. Clique em **Save**
6. **IMPORTANTE**: Aguarde 2 minutos para as mudanças propagarem

#### 2️⃣ Configure o Supabase

1. Acesse: https://supabase.com/dashboard
2. Crie um projeto ou abra o existente
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Cole TODO o conteúdo do arquivo `supabase-schema.sql`
6. Clique em **Run**
7. Aguarde a mensagem de sucesso

#### 3️⃣ Configure as Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```env
# Supabase (pegue em: Settings > API)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_chave_service

# Spotify (pegue em: Dashboard > Settings)
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback

# JWT (gere uma chave aleatória)
JWT_SECRET=sua_chave_secreta_aleatoria

# Servidor
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Configure também `Front/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 🎯 Iniciar Aplicação

**Opção 1: Script Automático (Recomendado)**
```bash
START-CLEAN.bat
```

**Opção 2: Manual**

Terminal 1 (Backend):
```bash
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd Front
npm install
npm run dev
```

### ✅ Verificação

Acesse: http://localhost:3000

Você deve ver a página inicial do Emotify com o botão "Conectar com Spotify".

---

## 📖 Documentação

- **[INICIAR-RAPIDO.md](INICIAR-RAPIDO.md)** - Guia de início rápido
- **[SETUP.md](SETUP.md)** - Configuração detalhada
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solução de problemas
- **[API.md](API.md)** - Documentação da API
- **[COMMANDS.md](COMMANDS.md)** - Comandos úteis

---

## 🎨 Funcionalidades

### ✨ Análise Emocional
- Identifica 7 emoções diferentes: Alegria, Melancolia, Energia, Calma, Nostalgia, Euforia, Introspecção
- Análise baseada em características de áudio do Spotify
- Engine de IA proprietária

### 📊 Dashboard Interativo
- Visualização de distribuição emocional
- Insights personalizados
- Estatísticas detalhadas

### 🎵 Análise de Músicas
- Top tracks com análise emocional
- Histórico de reprodução
- Características de áudio detalhadas

### 🎧 Playlists Inteligentes
- Crie playlists baseadas em emoções
- Recomendações personalizadas
- Integração direta com Spotify

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- Spotify Web API
- JWT Authentication

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

---

## 🔧 Problemas Comuns

### Frontend mostra 404
```bash
RESTART-FRONTEND.bat
```

### "Authentication failed"
1. Verifique o Redirect URI no Spotify Dashboard
2. Aguarde 2 minutos após salvar
3. Limpe o cache do navegador
4. Tente novamente

### Erro de conexão com Supabase
```bash
node test-supabase-connection.js
```

Consulte [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para mais detalhes.

---

## 📝 Scripts Úteis

```bash
# Testar conexão Supabase
node test-supabase-connection.js

# Testar configuração Spotify
node test-spotify-config.js

# Reiniciar frontend
RESTART-FRONTEND.bat

# Inicialização limpa
START-CLEAN.bat
```

---

## 🎯 Primeiro Uso

1. Acesse http://localhost:3000
2. Clique em "Conectar com Spotify"
3. Faça login e autorize o app
4. No dashboard, clique em "Analisar Minhas Músicas"
5. Aguarde 10-30 segundos
6. Explore seus insights emocionais!

---

## 📊 Estrutura do Projeto

```
Emotify-Spotify/
├── src/                    # Backend
│   ├── controllers/        # Controladores da API
│   ├── services/          # Lógica de negócio
│   ├── models/            # Modelos de dados
│   ├── middleware/        # Middlewares
│   ├── routes/            # Rotas da API
│   ├── config/            # Configurações
│   └── utils/             # Utilitários
├── Front/                 # Frontend Next.js
│   └── src/
│       ├── app/           # App Router
│       └── lib/           # Bibliotecas
├── .env                   # Variáveis backend
├── Front/.env.local       # Variáveis frontend
└── supabase-schema.sql    # Schema do banco
```

---

## 🤝 Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de contribuição.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 🎵 Feito com ❤️ e muita música

Powered by Spotify Web API

---

## 📞 Suporte

Problemas? Consulte:
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. [SETUP.md](SETUP.md)
3. [API.md](API.md)

---

**Aproveite sua jornada emocional musical! 🎵✨**
