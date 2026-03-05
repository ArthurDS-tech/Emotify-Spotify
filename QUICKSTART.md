# ⚡ Emotify - Guia Rápido de Início

## 🚀 Começar em 5 Minutos

### 1️⃣ Pré-requisitos (2 min)

```bash
# Verifique se tem Node.js instalado
node --version  # Deve ser 18+

# Se não tiver, baixe em: https://nodejs.org
```

### 2️⃣ Configurar Spotify (2 min)

1. Acesse: https://developer.spotify.com/dashboard
2. Clique em "Create an App"
3. Preencha nome e descrição
4. Em "Redirect URIs", adicione: `http://localhost:3001/api/auth/callback`
5. Copie o **Client ID** e **Client Secret**

### 3️⃣ Configurar Supabase (3 min)

1. Acesse: https://supabase.com
2. Clique em "New Project"
3. Preencha os dados e aguarde criação
4. Vá em "SQL Editor" > "New Query"
5. Cole o conteúdo de `supabase-schema.sql` e execute
6. Vá em "Settings" > "API" e copie:
   - Project URL
   - anon public key
   - service_role key

### 4️⃣ Instalar e Configurar (3 min)

```bash
# Clone o repositório
git clone <seu-repo>
cd emotify

# Instale dependências do backend
npm install

# Configure o backend
cp .env.example .env
# Edite .env com suas credenciais

# Instale dependências do frontend
cd Front
npm install

# Configure o frontend
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 5️⃣ Executar (1 min)

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd Front
npm run dev
```

### 6️⃣ Testar (1 min)

1. Abra: http://localhost:3000
2. Clique em "Conectar com Spotify"
3. Faça login
4. Clique em "Analisar Minhas Músicas"
5. 🎉 Pronto!

---

## 📝 Arquivo .env Mínimo

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_KEY=sua_service_key

# Spotify
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback

# JWT (gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=sua_string_aleatoria_aqui

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📝 Arquivo .env.local (Frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

---

## ❓ Problemas Comuns

### "Spotify not connected"
```bash
# Verifique se as credenciais estão corretas no .env
# Confirme que a Redirect URI está no Spotify Dashboard
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### "Supabase credentials missing"
```bash
# Verifique se todas as variáveis SUPABASE_* estão no .env
# Confirme que o schema SQL foi executado
```

---

## 🎯 Próximos Passos

Depois de rodar:

1. ✅ Analise suas músicas
2. ✅ Veja seu perfil emocional
3. ✅ Crie playlists por emoção
4. ✅ Explore insights personalizados

---

## 📚 Documentação Completa

- **Instalação Detalhada**: [SETUP.md](SETUP.md)
- **API Reference**: [API.md](API.md)
- **Comandos Úteis**: [COMMANDS.md](COMMANDS.md)
- **Contribuir**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🆘 Precisa de Ajuda?

- 📖 Leia: [SETUP.md](SETUP.md)
- 🐛 Bug? Abra uma [Issue](https://github.com/seu-usuario/emotify/issues)
- 💬 Dúvida? Use [Discussions](https://github.com/seu-usuario/emotify/discussions)

---

**Tempo total**: ~15 minutos ⏱️  
**Dificuldade**: Fácil 🟢  
**Resultado**: App completo funcionando! 🎉
