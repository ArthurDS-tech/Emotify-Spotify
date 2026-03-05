# 🚀 Guia de Deploy - Emotify

## 📋 Checklist Pré-Deploy

### ✅ Desenvolvimento Completo
- [x] Backend funcional
- [x] Frontend funcional
- [x] Integração Spotify OK
- [x] Integração Supabase OK
- [x] Testes locais passando
- [x] Documentação completa

### ✅ Segurança
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets não commitados
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] JWT secrets fortes
- [ ] Row Level Security (RLS) no Supabase

### ✅ Performance
- [ ] Cache implementado
- [ ] Compressão gzip ativa
- [ ] Imagens otimizadas
- [ ] Bundle size otimizado
- [ ] Database indexes criados

---

## 🌐 Deploy do Backend

### Opção 1: Railway (Recomendado)

#### 1. Criar Conta
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub

#### 2. Novo Projeto
```bash
# No terminal
railway login
railway init
railway link
```

#### 3. Configurar Variáveis
No painel Railway, adicione:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_key

SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
SPOTIFY_REDIRECT_URI=https://seu-backend.railway.app/api/auth/callback

JWT_SECRET=seu_jwt_secret_forte
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
```

#### 4. Deploy
```bash
railway up
```

#### 5. Obter URL
```bash
railway domain
# Exemplo: emotify-backend.railway.app
```

---

### Opção 2: Render

#### 1. Criar Conta
1. Acesse [render.com](https://render.com)
2. Conecte com GitHub

#### 2. Novo Web Service
1. Clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório
4. Configure:
   - **Name**: emotify-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 3. Variáveis de Ambiente
Adicione as mesmas variáveis do Railway

#### 4. Deploy
Render faz deploy automático ao detectar push no GitHub

---

### Opção 3: Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create emotify-backend

# Configurar variáveis
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_ANON_KEY=...
# ... todas as outras

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

---

## 🎨 Deploy do Frontend

### Vercel (Recomendado)

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login
```bash
vercel login
```

#### 3. Deploy
```bash
cd Front
vercel
```

#### 4. Configurar Variáveis
No painel Vercel:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

#### 5. Deploy Produção
```bash
vercel --prod
```

#### 6. Domínio Customizado (Opcional)
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS

---

### Netlify (Alternativa)

#### 1. Build Local
```bash
cd Front
npm run build
```

#### 2. Deploy
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.next
```

---

## 🗄️ Supabase (Já em Produção)

### Verificações

#### 1. Row Level Security
```sql
-- Verificar se RLS está ativo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Deve mostrar rowsecurity = true para todas as tabelas
```

#### 2. Policies
```sql
-- Listar policies
SELECT * FROM pg_policies;

-- Deve ter policies para users, emotion_analyses, etc.
```

#### 3. Indexes
```sql
-- Verificar indexes
SELECT * FROM pg_indexes 
WHERE schemaname = 'public';

-- Deve ter indexes em user_id, track_id, etc.
```

#### 4. Backup
1. Vá em "Database" > "Backups"
2. Configure backups automáticos
3. Teste restore

---

## 🔧 Configurações Pós-Deploy

### 1. Atualizar Spotify Redirect URI

No [Spotify Dashboard](https://developer.spotify.com/dashboard):

1. Selecione seu app
2. Clique em "Edit Settings"
3. Em "Redirect URIs", adicione:
   ```
   https://seu-backend.railway.app/api/auth/callback
   ```
4. Salve

### 2. Testar Autenticação

```bash
# Teste o fluxo completo
curl https://seu-backend.railway.app/api/health

# Deve retornar:
# {"status":"ok","timestamp":"..."}
```

### 3. Configurar CORS

No backend, verifique `src/app.js`:

```javascript
app.use(cors({
  origin: [
    'https://seu-frontend.vercel.app',
    'http://localhost:3000' // Para desenvolvimento
  ],
  credentials: true
}));
```

### 4. Configurar Rate Limiting

Ajuste conforme necessário em `src/middleware/rateLimiter.js`:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: 'Too many requests'
});
```

---

## 📊 Monitoring

### 1. Logs

#### Railway
```bash
railway logs
```

#### Render
- Painel > Logs

#### Vercel
```bash
vercel logs
```

### 2. Uptime Monitoring

Configure em:
- [UptimeRobot](https://uptimerobot.com) (Free)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

### 3. Error Tracking

Integre:
- [Sentry](https://sentry.io)
- [Rollbar](https://rollbar.com)
- [Bugsnag](https://www.bugsnag.com)

```javascript
// Backend
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

---

## 🔐 Segurança em Produção

### 1. Environment Variables

✅ **Nunca** commite:
- `.env`
- `.env.local`
- Secrets
- API keys

### 2. HTTPS

✅ Sempre use HTTPS em produção
- Railway/Render/Vercel fornecem automaticamente
- Para domínio próprio, use Let's Encrypt

### 3. Secrets Rotation

🔄 Rotacione periodicamente:
- JWT_SECRET (a cada 3-6 meses)
- Spotify Client Secret (se comprometido)
- Supabase Service Key (se comprometido)

### 4. Database

✅ Supabase já tem:
- Backups automáticos
- SSL/TLS
- Row Level Security
- Connection pooling

---

## 🚦 CI/CD com GitHub Actions

### 1. Criar Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd Front
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 2. Configurar Secrets

No GitHub:
1. Settings > Secrets and variables > Actions
2. Adicione:
   - `RAILWAY_TOKEN`
   - `VERCEL_TOKEN`

---

## 📈 Performance Optimization

### 1. CDN

Vercel já inclui CDN global para frontend

### 2. Caching

```javascript
// Backend - Cache headers
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache');
  }
  next();
});
```

### 3. Compression

Já implementado com `compression` middleware

### 4. Database Connection Pooling

Supabase já gerencia automaticamente

---

## 🧪 Testes Pós-Deploy

### 1. Health Check
```bash
curl https://seu-backend.railway.app/api/health
```

### 2. Autenticação
```bash
curl https://seu-backend.railway.app/api/auth/login
```

### 3. Frontend
```bash
curl https://seu-frontend.vercel.app
```

### 4. Fluxo Completo
1. Acesse frontend
2. Clique em "Conectar com Spotify"
3. Faça login
4. Analise músicas
5. Verifique dashboard

---

## 🐛 Troubleshooting

### Erro: "CORS policy"
```javascript
// Adicione origem no backend
app.use(cors({
  origin: 'https://seu-frontend.vercel.app'
}));
```

### Erro: "Invalid redirect_uri"
- Verifique Spotify Dashboard
- Confirme URL exata (com/sem trailing slash)

### Erro: "Database connection failed"
- Verifique variáveis SUPABASE_*
- Confirme que projeto Supabase está ativo

### Erro: "Token expired"
- Implemente refresh token automático
- Já implementado em `src/services/spotifyService.js`

---

## 📞 Suporte

### Plataformas

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Spotify**: [developer.spotify.com](https://developer.spotify.com)

### Comunidade

- GitHub Issues
- Discord (futuro)
- Stack Overflow

---

## ✅ Checklist Final

- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] Supabase configurado e seguro
- [ ] Spotify redirect URI atualizado
- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS ativo
- [ ] CORS configurado
- [ ] Monitoring ativo
- [ ] Backups configurados
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Domínio customizado (opcional)

---

## 🎉 Deploy Completo!

Seu Emotify está no ar! 🚀

**URLs:**
- Frontend: `https://seu-frontend.vercel.app`
- Backend: `https://seu-backend.railway.app`
- API Docs: `https://seu-backend.railway.app/api/health`

**Próximos passos:**
1. Compartilhe com amigos
2. Colete feedback
3. Itere e melhore
4. Contribua com a comunidade

---

**Boa sorte!** 🎵❤️
