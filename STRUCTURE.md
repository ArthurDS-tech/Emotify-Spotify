# 📁 Estrutura do Projeto Emotify

## 🌳 Árvore de Diretórios

```
emotify/
├── 📂 src/                          # Backend (Node.js + Express)
│   ├── 📂 config/                   # Configurações
│   │   ├── supabase.js             # Cliente Supabase
│   │   ├── database.js             # (Legacy - não usado)
│   │   ├── redis.js                # (Legacy - não usado)
│   │   └── spotify.js              # (Legacy - não usado)
│   │
│   ├── 📂 controllers/              # Controladores de rotas
│   │   ├── authController.js       # Autenticação e OAuth
│   │   ├── emotionController.js    # Análise emocional
│   │   ├── playlistController.js   # Gerenciamento de playlists
│   │   ├── tracksController.js     # Operações com músicas
│   │   └── userController.js       # Perfil e dados do usuário
│   │
│   ├── 📂 middleware/               # Middlewares Express
│   │   ├── auth.js                 # Verificação de JWT
│   │   ├── errorHandler.js         # Tratamento de erros
│   │   └── rateLimiter.js          # Rate limiting
│   │
│   ├── 📂 models/                   # (Legacy - Supabase direto)
│   │   ├── EmotionAnalysis.js      # (Não usado)
│   │   ├── TrackCache.js           # (Não usado)
│   │   └── User.js                 # (Não usado)
│   │
│   ├── 📂 routes/                   # Definição de rotas
│   │   ├── index.js                # Router principal
│   │   ├── authRoutes.js           # Rotas de autenticação
│   │   ├── emotionRoutes.js        # Rotas de emoção
│   │   ├── playlistRoutes.js       # Rotas de playlists
│   │   ├── tracksRoutes.js         # Rotas de músicas
│   │   └── userRoutes.js           # Rotas de usuário
│   │
│   ├── 📂 services/                 # Lógica de negócio
│   │   ├── emotionEngine.js        # 🧠 Algoritmo de análise emocional
│   │   ├── spotifyService.js       # Integração com Spotify API
│   │   ├── supabaseService.js      # Operações de banco de dados
│   │   ├── cacheService.js         # (Legacy - não usado)
│   │   └── insightGenerator.js     # (Legacy - não usado)
│   │
│   ├── 📂 utils/                    # Utilitários
│   │   ├── logger.js               # Sistema de logs
│   │   ├── tokenManager.js         # Gerenciamento de tokens
│   │   └── validators.js           # Validações
│   │
│   └── app.js                       # Configuração do Express
│
├── 📂 Front/                        # Frontend (Next.js + React)
│   ├── 📂 src/
│   │   ├── 📂 app/                  # Pages (App Router)
│   │   │   ├── 📂 auth/
│   │   │   │   └── 📂 success/
│   │   │   │       └── page.tsx    # Callback OAuth
│   │   │   ├── 📂 dashboard/
│   │   │   │   └── page.tsx        # Dashboard principal
│   │   │   ├── layout.tsx          # Layout raiz
│   │   │   ├── page.tsx            # Landing page
│   │   │   └── globals.css         # Estilos globais
│   │   │
│   │   ├── 📂 components/           # Componentes React (futuro)
│   │   │   ├── EmotionCard.tsx
│   │   │   ├── TrackList.tsx
│   │   │   └── ...
│   │   │
│   │   └── 📂 lib/                  # Utilitários
│   │       ├── api.ts              # Cliente API
│   │       ├── utils.ts            # Funções auxiliares
│   │       └── types.ts            # TypeScript types
│   │
│   ├── next.config.js              # Configuração Next.js
│   ├── tailwind.config.js          # Configuração Tailwind
│   ├── tsconfig.json               # Configuração TypeScript
│   ├── postcss.config.js           # Configuração PostCSS
│   ├── package.json                # Dependências frontend
│   └── .env.example                # Exemplo de variáveis de ambiente
│
├── 📂 node_modules/                 # Dependências (não commitado)
├── 📂 .git/                         # Controle de versão Git
│
├── 📄 server.js                     # Entry point do backend
├── 📄 package.json                  # Dependências backend
├── 📄 package-lock.json             # Lock de dependências
│
├── 📄 supabase-schema.sql           # 🗄️ Schema do banco de dados
│
├── 📄 .env.example                  # Exemplo de variáveis de ambiente
├── 📄 .gitignore                    # Arquivos ignorados pelo Git
│
├── 📄 README.md                     # 📖 Documentação principal
├── 📄 SETUP.md                      # 🚀 Guia de instalação
├── 📄 QUICKSTART.md                 # ⚡ Guia rápido
├── 📄 API.md                        # 📡 Documentação da API
├── 📄 COMMANDS.md                   # 🛠️ Comandos úteis
├── 📄 CONTRIBUTING.md               # 🤝 Guia de contribuição
├── 📄 PROJECT_SUMMARY.md            # 📊 Resumo executivo
├── 📄 STRUCTURE.md                  # 📁 Este arquivo
├── 📄 LICENSE                       # ⚖️ Licença MIT
└── 📄 SECURITY.md                   # 🔐 Política de segurança
```

---

## 📂 Detalhamento de Pastas

### Backend (`src/`)

#### `config/`
Arquivos de configuração e inicialização de serviços externos.

- **supabase.js**: Cliente Supabase (público e admin)
- ~~database.js~~: MongoDB (não usado - migrado para Supabase)
- ~~redis.js~~: Redis (não usado - cache in-memory)
- ~~spotify.js~~: Spotify config (movido para .env)

#### `controllers/`
Controladores que processam requisições HTTP e retornam respostas.

- **authController.js**: Login, callback OAuth, refresh token
- **emotionController.js**: Análise emocional, insights, distribuição
- **playlistController.js**: Criar playlists, recomendações
- **tracksController.js**: Top tracks, busca, audio features
- **userController.js**: Perfil, histórico, conexões

#### `middleware/`
Funções que interceptam requisições antes dos controladores.

- **auth.js**: Verifica JWT e adiciona `req.user`
- **errorHandler.js**: Captura e formata erros
- **rateLimiter.js**: Limita requisições (100/15min)

#### `models/`
~~Modelos Mongoose~~ (não usado - Supabase direto)

#### `routes/`
Definição de rotas e mapeamento para controladores.

- **index.js**: Router principal que monta todas as rotas
- **authRoutes.js**: `/api/auth/*`
- **emotionRoutes.js**: `/api/emotion/*`
- **playlistRoutes.js**: `/api/playlists/*`
- **tracksRoutes.js**: `/api/tracks/*`
- **userRoutes.js**: `/api/user/*`

#### `services/`
Lógica de negócio e integrações externas.

- **emotionEngine.js**: 🧠 Algoritmo de análise emocional (core)
- **spotifyService.js**: Wrapper da Spotify Web API
- **supabaseService.js**: Operações CRUD no banco
- ~~cacheService.js~~: Redis (não usado)
- ~~insightGenerator.js~~: Movido para emotionEngine

#### `utils/`
Funções auxiliares e utilitários.

- **logger.js**: Winston logger
- **tokenManager.js**: Gerenciamento de tokens JWT
- **validators.js**: Validações de entrada

---

### Frontend (`Front/`)

#### `src/app/`
Pages usando Next.js App Router (file-based routing).

```
app/
├── page.tsx                 # / (landing page)
├── layout.tsx               # Layout raiz
├── globals.css              # Estilos globais
├── auth/
│   └── success/
│       └── page.tsx         # /auth/success (callback)
└── dashboard/
    └── page.tsx             # /dashboard (app principal)
```

#### `src/components/` (futuro)
Componentes React reutilizáveis.

```
components/
├── EmotionCard.tsx          # Card de emoção
├── TrackList.tsx            # Lista de músicas
├── InsightCard.tsx          # Card de insight
├── PlaylistCreator.tsx      # Criador de playlists
└── ...
```

#### `src/lib/`
Utilitários e configurações do frontend.

- **api.ts**: Cliente Axios com interceptors
- **utils.ts**: Funções auxiliares
- **types.ts**: TypeScript interfaces

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais

```sql
users                    # Usuários e tokens Spotify
├── id (UUID)
├── spotify_id
├── email
├── display_name
├── profile_image
├── spotify_access_token
├── spotify_refresh_token
└── token_expires_at

emotion_analyses         # Análises emocionais
├── id (UUID)
├── user_id (FK)
├── track_id
├── track_name
├── audio_features (valence, energy, etc.)
├── emotion_scores (joy, sadness, etc.)
├── primary_emotion
└── emotion_intensity

listening_history        # Histórico de reprodução
├── id (UUID)
├── user_id (FK)
├── track_id
├── played_at
└── context

playlists                # Playlists criadas
├── id (UUID)
├── user_id (FK)
├── spotify_playlist_id
├── name
├── emotion_theme
└── track_count

user_insights            # Insights agregados
├── id (UUID)
├── user_id (FK)
├── top_emotion
├── avg_valence
├── total_tracks_analyzed
└── favorite_genres

track_cache              # Cache de tracks
├── track_id (PK)
├── track_data (JSONB)
├── audio_features (JSONB)
└── expires_at
```

---

## 📦 Dependências Principais

### Backend

```json
{
  "express": "^4.18.2",           // Framework web
  "@supabase/supabase-js": "^2.39.0", // Cliente Supabase
  "axios": "^1.6.2",              // HTTP client
  "jsonwebtoken": "^9.0.2",       // JWT
  "bcryptjs": "^2.4.3",           // Hash de senhas
  "helmet": "^7.1.0",             // Segurança
  "cors": "^2.8.5",               // CORS
  "express-rate-limit": "^7.1.5", // Rate limiting
  "compression": "^1.7.4",        // Compressão gzip
  "morgan": "^1.10.0",            // Logger HTTP
  "dotenv": "^16.3.1"             // Variáveis de ambiente
}
```

### Frontend

```json
{
  "next": "14.1.0",               // Framework React
  "react": "^18.2.0",             // React
  "typescript": "^5",             // TypeScript
  "tailwindcss": "^3.3.0",        // CSS utility-first
  "framer-motion": "^10.18.0",    // Animações
  "recharts": "^2.10.3",          // Gráficos
  "lucide-react": "^0.303.0",     // Ícones
  "axios": "^1.6.2"               // HTTP client
}
```

---

## 🔄 Fluxo de Dados

### Autenticação

```
1. Frontend → GET /api/auth/login
2. Backend → Retorna URL do Spotify
3. User → Autoriza no Spotify
4. Spotify → Redireciona para /api/auth/callback?code=...
5. Backend → Troca code por tokens
6. Backend → Salva user no Supabase
7. Backend → Gera JWT
8. Backend → Redireciona para /auth/success?token=...
9. Frontend → Salva token no localStorage
10. Frontend → Redireciona para /dashboard
```

### Análise Emocional

```
1. Frontend → GET /api/emotion/analyze/top-tracks
2. Backend → Busca top tracks no Spotify
3. Backend → Busca audio features no Spotify
4. Backend → Processa com emotionEngine
5. Backend → Salva análises no Supabase
6. Backend → Atualiza user_insights
7. Backend → Retorna análises + agregados
8. Frontend → Renderiza dashboard
```

---

## 🎯 Arquivos Importantes

### Configuração

- **.env**: Variáveis de ambiente (não commitado)
- **.env.example**: Template de variáveis
- **package.json**: Dependências e scripts
- **tsconfig.json**: Configuração TypeScript
- **tailwind.config.js**: Configuração Tailwind

### Documentação

- **README.md**: Visão geral do projeto
- **SETUP.md**: Guia de instalação completo
- **QUICKSTART.md**: Guia rápido (5 min)
- **API.md**: Documentação da API REST
- **COMMANDS.md**: Comandos úteis
- **CONTRIBUTING.md**: Guia de contribuição
- **PROJECT_SUMMARY.md**: Resumo executivo

### Database

- **supabase-schema.sql**: Schema completo do banco

### Segurança

- **.gitignore**: Arquivos ignorados
- **LICENSE**: Licença MIT
- **SECURITY.md**: Política de segurança

---

## 🚀 Entry Points

### Backend
```bash
npm start       # Produção (node server.js)
npm run dev     # Desenvolvimento (nodemon server.js)
```

**Entry point**: `server.js` → `src/app.js` → `src/routes/index.js`

### Frontend
```bash
npm run dev     # Desenvolvimento (next dev)
npm run build   # Build (next build)
npm start       # Produção (next start)
```

**Entry point**: `Front/src/app/layout.tsx` → `Front/src/app/page.tsx`

---

## 📊 Tamanho do Projeto

```
Backend:
- Arquivos: ~30 arquivos .js
- Linhas de código: ~3,500 LOC
- Dependências: ~280 packages

Frontend:
- Arquivos: ~10 arquivos .tsx/.ts
- Linhas de código: ~1,500 LOC
- Dependências: ~200 packages

Documentação:
- Arquivos: 10 arquivos .md
- Linhas: ~3,000 linhas

Total: ~8,000 linhas de código + documentação
```

---

## 🎨 Convenções de Nomenclatura

### Arquivos
- **Backend**: camelCase (`emotionController.js`)
- **Frontend**: PascalCase para componentes (`EmotionCard.tsx`)
- **Config**: kebab-case (`tailwind.config.js`)
- **Docs**: UPPERCASE (`README.md`)

### Código
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Classes**: PascalCase (`EmotionEngine`)
- **Componentes**: PascalCase (`Dashboard`)
- **Funções**: camelCase (`analyzeTrack`)

---

## 🔍 Como Navegar

1. **Começar**: Leia `README.md`
2. **Instalar**: Siga `SETUP.md` ou `QUICKSTART.md`
3. **Entender API**: Consulte `API.md`
4. **Contribuir**: Leia `CONTRIBUTING.md`
5. **Comandos**: Use `COMMANDS.md`
6. **Arquitetura**: Veja `PROJECT_SUMMARY.md`

---

**Última atualização**: 2024  
**Versão**: 1.0.0
