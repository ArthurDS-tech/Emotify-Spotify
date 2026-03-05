# 🎵 Emotify - Guia Completo de Instalação

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Spotify for Developers](https://developer.spotify.com/dashboard)
- Conta no [Supabase](https://supabase.com)
- Git instalado

## 🚀 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone <seu-repositorio>
cd emotify
```

### 2. Configurar Supabase

#### 2.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação (2-3 minutos)

#### 2.2 Executar Schema SQL

1. No painel do Supabase, vá em "SQL Editor"
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a execução (deve mostrar "Success")

#### 2.3 Obter Credenciais

1. Vá em "Settings" > "API"
2. Copie:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_KEY) - ⚠️ Mantenha seguro!

### 3. Configurar Spotify API

#### 3.1 Criar Aplicação no Spotify

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Clique em "Create an App"
3. Preencha:
   - App name: "Emotify"
   - App description: "Emotion analysis for Spotify"
   - Redirect URI: `http://localhost:3001/api/auth/callback`
4. Aceite os termos e clique em "Create"

#### 3.2 Obter Credenciais

1. Na página do app, clique em "Settings"
2. Copie:
   - Client ID
   - Client Secret (clique em "View client secret")

### 4. Configurar Backend

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

#### 4.1 Editar .env

Abra o arquivo `.env` e preencha:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_KEY=sua_service_key_aqui

# Spotify
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback

# JWT
JWT_SECRET=gere_uma_string_aleatoria_segura_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Dica:** Para gerar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Configurar Frontend

```bash
cd Front

# Instalar dependências
npm install

# Criar arquivo .env.local
cp .env.example .env.local
```

#### 5.1 Editar .env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 6. Executar o Projeto

#### Terminal 1 - Backend

```bash
# Na raiz do projeto
npm run dev
```

Você deve ver:
```
🎵 Emotion Engine Backend rodando em development
📍 http://localhost:3001
🔐 Spotify OAuth integrado
```

#### Terminal 2 - Frontend

```bash
cd Front
npm run dev
```

Você deve ver:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
```

### 7. Testar a Aplicação

1. Abra o navegador em `http://localhost:3000`
2. Clique em "Conectar com Spotify"
3. Faça login com sua conta Spotify
4. Autorize o aplicativo
5. Você será redirecionado para o dashboard
6. Clique em "Analisar Minhas Músicas"
7. Aguarde a análise (pode levar 10-30 segundos)
8. Veja seus resultados! 🎉

## 🔧 Solução de Problemas

### Erro: "Spotify not connected"

- Verifique se as credenciais do Spotify estão corretas no `.env`
- Confirme que a Redirect URI está configurada no Spotify Dashboard
- Tente fazer logout e login novamente

### Erro: "Supabase credentials missing"

- Verifique se todas as variáveis SUPABASE_* estão no `.env`
- Confirme que o schema SQL foi executado com sucesso
- Verifique se o projeto Supabase está ativo

### Erro: "Failed to fetch"

- Confirme que o backend está rodando na porta 3001
- Verifique se o CORS está configurado corretamente
- Limpe o cache do navegador e tente novamente

### Erro: "Invalid or expired token"

- Limpe o localStorage do navegador
- Faça logout e login novamente
- Verifique se JWT_SECRET está configurado

## 📊 Estrutura do Projeto

```
emotify/
├── src/                      # Backend
│   ├── config/              # Configurações (Supabase, Spotify)
│   ├── controllers/         # Controladores de rotas
│   ├── middleware/          # Middlewares (auth, error handling)
│   ├── models/              # (Não usado - Supabase direto)
│   ├── routes/              # Definição de rotas
│   ├── services/            # Lógica de negócio
│   └── utils/               # Utilitários
├── Front/                   # Frontend Next.js
│   ├── src/
│   │   ├── app/            # Pages e layouts
│   │   ├── components/     # Componentes React
│   │   └── lib/            # Utilitários e API client
├── supabase-schema.sql     # Schema do banco de dados
├── .env.example            # Exemplo de variáveis de ambiente
└── package.json            # Dependências do backend
```

## 🎯 Próximos Passos

Após a instalação, você pode:

1. **Analisar suas músicas** - Descubra seu perfil emocional
2. **Criar playlists** - Baseadas em emoções específicas
3. **Ver insights** - Entenda seus padrões musicais
4. **Explorar recomendações** - Descubra novas músicas

## 🚀 Deploy em Produção

### Backend (Vercel/Railway/Render)

1. Configure as variáveis de ambiente
2. Atualize SPOTIFY_REDIRECT_URI para URL de produção
3. Atualize FRONTEND_URL para URL do frontend
4. Deploy!

### Frontend (Vercel)

1. Configure NEXT_PUBLIC_API_URL para URL do backend
2. Configure variáveis do Supabase
3. Deploy!

### Supabase

- Já está em produção! ✅
- Configure Row Level Security (RLS) para segurança adicional

## 📝 Notas Importantes

- ⚠️ Nunca commite o arquivo `.env` ou `.env.local`
- 🔐 Mantenha o `SUPABASE_SERVICE_KEY` seguro
- 🎵 A API do Spotify tem rate limits - use com moderação
- 💾 O cache de tracks expira em 7 dias
- 🔄 Tokens do Spotify expiram em 1 hora (refresh automático)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do backend e frontend
2. Consulte a documentação do [Spotify API](https://developer.spotify.com/documentation/web-api)
3. Consulte a documentação do [Supabase](https://supabase.com/docs)
4. Abra uma issue no repositório

## 🎉 Pronto!

Agora você tem o Emotify rodando localmente! Divirta-se descobrindo as emoções por trás da sua música! 🎵❤️
