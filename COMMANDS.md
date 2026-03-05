# 🛠️ Comandos Úteis - Emotify

## 📦 Instalação

### Backend
```bash
# Instalar dependências
npm install

# Instalar dependência específica
npm install <package-name>

# Atualizar dependências
npm update
```

### Frontend
```bash
cd Front
npm install
npm update
```

## 🚀 Desenvolvimento

### Backend
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start

# Rodar testes
npm test
```

### Frontend
```bash
cd Front

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start

# Lint
npm run lint
```

## 🔍 Debug e Logs

### Ver logs do backend
```bash
# Logs em tempo real
npm run dev

# Com mais detalhes
NODE_ENV=development npm run dev
```

### Ver logs do Supabase
- Acesse o painel do Supabase
- Vá em "Logs" > "Postgres Logs"

## 🗄️ Banco de Dados

### Executar schema SQL
```bash
# No Supabase SQL Editor, execute:
# Copie o conteúdo de supabase-schema.sql
```

### Limpar dados de teste
```sql
-- No Supabase SQL Editor
TRUNCATE TABLE emotion_analyses CASCADE;
TRUNCATE TABLE listening_history CASCADE;
TRUNCATE TABLE playlists CASCADE;
TRUNCATE TABLE user_insights CASCADE;
```

### Ver dados
```sql
-- Usuários
SELECT * FROM users;

-- Análises emocionais
SELECT * FROM emotion_analyses ORDER BY analyzed_at DESC LIMIT 10;

-- Insights
SELECT * FROM user_insights;
```

## 🧪 Testes de API

### Usando curl

#### Health Check
```bash
curl http://localhost:3001/api/health
```

#### Login (obter URL de autenticação)
```bash
curl http://localhost:3001/api/auth/login
```

#### Obter usuário atual (com token)
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:3001/api/auth/me
```

#### Analisar top tracks
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  "http://localhost:3001/api/emotion/analyze/top-tracks?timeRange=medium_term&limit=50"
```

#### Ver distribuição emocional
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:3001/api/emotion/distribution
```

## 🔧 Manutenção

### Limpar cache do Node
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd Front
rm -rf node_modules package-lock.json .next
npm install
```

### Resetar banco de dados
```sql
-- No Supabase SQL Editor
-- ⚠️ CUIDADO: Isso apaga TODOS os dados!

DROP TABLE IF EXISTS user_connections CASCADE;
DROP TABLE IF EXISTS track_cache CASCADE;
DROP TABLE IF EXISTS user_insights CASCADE;
DROP TABLE IF EXISTS playlist_tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS listening_history CASCADE;
DROP TABLE IF EXISTS emotion_analyses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Depois execute novamente o supabase-schema.sql
```

### Gerar novo JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Monitoramento

### Ver uso de memória
```bash
# Backend
node --inspect server.js

# Abra chrome://inspect no Chrome
```

### Ver requisições em tempo real
```bash
# O Morgan já loga automaticamente
# Veja no terminal onde o backend está rodando
```

## 🐛 Debug

### Backend com debugger
```bash
node --inspect-brk server.js
```

### Frontend com debugger
```bash
cd Front
NODE_OPTIONS='--inspect' npm run dev
```

### Ver variáveis de ambiente
```bash
# Backend
node -e "require('dotenv').config(); console.log(process.env)"

# Frontend
cd Front
npm run dev
# Abra o console do navegador e digite: console.log(process.env)
```

## 🔄 Git

### Commits semânticos
```bash
git commit -m "feat: adiciona análise de emoções"
git commit -m "fix: corrige erro no login"
git commit -m "docs: atualiza README"
git commit -m "style: formata código"
git commit -m "refactor: reorganiza services"
git commit -m "test: adiciona testes unitários"
```

### Branches
```bash
# Criar nova feature
git checkout -b feature/nome-da-feature

# Criar bugfix
git checkout -b fix/nome-do-bug

# Voltar para main
git checkout main
```

## 📦 Build e Deploy

### Build do frontend
```bash
cd Front
npm run build

# Testar build localmente
npm start
```

### Preparar para deploy
```bash
# Backend
npm run build  # Se tiver build script

# Frontend
cd Front
npm run build
```

## 🔐 Segurança

### Verificar vulnerabilidades
```bash
# Backend
npm audit
npm audit fix

# Frontend
cd Front
npm audit
npm audit fix
```

### Atualizar dependências com vulnerabilidades
```bash
npm update
npm audit fix --force  # Use com cuidado!
```

## 📈 Performance

### Analisar bundle do frontend
```bash
cd Front
npm run build
# Veja o tamanho dos bundles no output
```

### Otimizar imagens
```bash
# Next.js otimiza automaticamente
# Mas você pode usar ferramentas como:
# - ImageOptim (Mac)
# - TinyPNG (Web)
```

## 🎯 Comandos Rápidos

```bash
# Iniciar tudo (2 terminais)
# Terminal 1:
npm run dev

# Terminal 2:
cd Front && npm run dev

# Limpar tudo e reinstalar
rm -rf node_modules Front/node_modules Front/.next
npm install && cd Front && npm install

# Ver portas em uso
# Mac/Linux:
lsof -i :3000
lsof -i :3001

# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

## 🆘 Troubleshooting

### Porta já em uso
```bash
# Mac/Linux
kill -9 $(lsof -t -i:3001)
kill -9 $(lsof -t -i:3000)

# Windows
# Encontre o PID
netstat -ano | findstr :3001
# Mate o processo
taskkill /PID <PID> /F
```

### Erro de permissão
```bash
# Mac/Linux
sudo npm install
# Ou melhor, corrija as permissões:
sudo chown -R $USER ~/.npm
```

### Cache do navegador
```
Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete no Mac)
Ou: DevTools > Application > Clear Storage
```

## 📚 Recursos Úteis

- [Documentação Spotify API](https://developer.spotify.com/documentation/web-api)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Express](https://expressjs.com/)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
