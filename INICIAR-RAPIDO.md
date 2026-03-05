# 🚀 Guia de Inicialização Rápida - Emotify

## ⚡ Início Rápido (3 passos)

### 1. Configure o Spotify Dashboard

Acesse: https://developer.spotify.com/dashboard

- Abra seu app "Emotify"
- Vá em **Settings**
- Em **Redirect URIs**, adicione:
  ```
  http://localhost:3001/api/auth/callback
  ```
- Clique em **Save**
- **AGUARDE 2 MINUTOS** para as mudanças propagarem

### 2. Execute o SQL no Supabase

Acesse: https://supabase.com/dashboard

- Abra seu projeto
- Vá em **SQL Editor**
- Clique em **New Query**
- Cole TODO o conteúdo do arquivo `supabase-schema.sql`
- Clique em **Run**
- Aguarde a mensagem de sucesso

### 3. Inicie os Servidores

Execute o arquivo:
```
START-CLEAN.bat
```

Ou manualmente:

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Front
npm run dev
```

---

## ✅ Verificação

Após iniciar, você deve ver:

**Backend (Terminal 1):**
```
✅ Supabase client initialized
🎵 Emotion Engine Backend rodando em development
📍 http://localhost:3001
🔐 Spotify OAuth integrado
```

**Frontend (Terminal 2):**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

---

## 🎯 Primeiro Uso

1. Abra: http://localhost:3000
2. Clique em **"Conectar com Spotify"**
3. Faça login no Spotify
4. Autorize o app
5. Você será redirecionado para o Dashboard
6. Clique em **"Analisar Minhas Músicas"**
7. Aguarde 10-30 segundos
8. Veja seus dados emocionais!

---

## 🔧 Problemas?

### Frontend mostra 404
- Pare o frontend (Ctrl+C)
- Delete a pasta `Front\.next`
- Inicie novamente: `cd Front && npm run dev`

### "Authentication failed"
1. Verifique se o Redirect URI está correto no Spotify Dashboard
2. Aguarde 2 minutos após salvar no Spotify
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Tente fazer login novamente

### Backend não conecta com Supabase
```bash
node test-supabase-connection.js
```

Se falhar:
- Verifique as credenciais no `.env`
- Confirme que executou o SQL no Supabase
- Verifique se as tabelas foram criadas

---

## 📋 Checklist Pré-Inicialização

- [ ] Spotify Dashboard configurado com Redirect URI
- [ ] SQL executado no Supabase
- [ ] Arquivo `.env` configurado
- [ ] Arquivo `Front/.env.local` configurado
- [ ] Aguardou 2 minutos após salvar no Spotify
- [ ] Portas 3000 e 3001 livres

---

## 🎵 Funcionalidades

Após o login bem-sucedido:

1. **Dashboard** - Visão geral das suas emoções musicais
2. **Minhas Músicas** - Top tracks com análise emocional
3. **Playlists** - Crie playlists baseadas em emoções

---

## 📞 Suporte

Se ainda tiver problemas, consulte:
- `TROUBLESHOOTING.md` - Guia completo de solução de problemas
- `SETUP.md` - Configuração detalhada
- `API.md` - Documentação da API

---

## 🔑 Variáveis de Ambiente

### Backend (.env)
```env
SUPABASE_URL=sua_url
SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_KEY=sua_chave_service
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback
JWT_SECRET=seu_jwt_secret
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (Front/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

**Pronto! Agora é só curtir sua música com insights emocionais! 🎵✨**
