# 🌐 Configuração com Ngrok - Emotify

## ✅ Configurações Atualizadas

### 1. Spotify Developer Dashboard

Acesse: https://developer.spotify.com/dashboard

No seu app, em **"Edit Settings"** > **"Redirect URIs"**, adicione:

```
https://dian-deanthropomorphic-unlicentiously.ngrok-free.dev/api/auth/callback
```

⚠️ **IMPORTANTE**: É `/api/auth/callback` e NÃO `/api/auth/login`

### 2. Ngrok Rodando

Certifique-se que o ngrok está rodando:

```bash
ngrok http 3001
```

E que a URL é: `https://dian-deanthropomorphic-unlicentiously.ngrok-free.dev`

### 3. Arquivos Atualizados

✅ `.env` - Backend configurado com ngrok  
✅ `Front/.env.local` - Frontend configurado com ngrok  
✅ `src/app.js` - CORS configurado para aceitar ngrok  
✅ `Front/src/app/page.tsx` - Login atualizado  

## 🚀 Como Testar

### 1. Inicie o Backend
```bash
npm run dev
```

Deve mostrar:
```
🎵 Emotion Engine Backend rodando em development
📍 http://localhost:3001
```

### 2. Inicie o Frontend
```bash
cd Front
npm run dev
```

Deve mostrar:
```
▲ Next.js 14.1.0
- Local: http://localhost:3000
```

### 3. Teste a Conexão

1. Abra: **http://localhost:3000**
2. Clique em **"Conectar com Spotify"**
3. Você será redirecionado para o Spotify
4. Faça login e autorize
5. Será redirecionado de volta para o app

## 🔍 Verificar se Está Funcionando

### Teste 1: Health Check via Ngrok
```bash
curl https://dian-deanthropomorphic-unlicentiously.ngrok-free.dev/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### Teste 2: Auth URL via Ngrok
```bash
curl https://dian-deanthropomorphic-unlicentiously.ngrok-free.dev/api/auth/login
```

Deve retornar:
```json
{"authUrl":"https://accounts.spotify.com/authorize?..."}
```

### Teste 3: Frontend
Abra o console do navegador (F12) e veja se há erros.

## ❌ Problemas Comuns

### "CORS error"
- Verifique se o ngrok está rodando
- Reinicie o backend após mudar o .env

### "Redirect URI mismatch"
- Verifique se a URL no Spotify Dashboard está EXATAMENTE:
  ```
  https://dian-deanthropomorphic-unlicentiously.ngrok-free.dev/api/auth/callback
  ```
- Sem espaços, sem barra no final

### "Cannot connect to backend"
- Verifique se o backend está rodando
- Verifique se o ngrok está apontando para a porta 3001
- Teste: `curl http://localhost:3001/api/health`

## 📊 Fluxo Completo

```
1. User clica "Conectar com Spotify" no frontend (localhost:3000)
   ↓
2. Frontend chama: https://dian...ngrok.../api/auth/login
   ↓
3. Backend retorna URL do Spotify
   ↓
4. User é redirecionado para Spotify
   ↓
5. User autoriza
   ↓
6. Spotify redireciona para: https://dian...ngrok.../api/auth/callback?code=...
   ↓
7. Backend troca code por tokens
   ↓
8. Backend salva user no Supabase
   ↓
9. Backend gera JWT
   ↓
10. Backend redireciona para: http://localhost:3000/auth/success?token=...
    ↓
11. Frontend salva token e redireciona para /dashboard
```

## 🎯 Checklist Final

- [ ] Ngrok rodando na porta 3001
- [ ] URL do ngrok no Spotify Dashboard
- [ ] Backend rodando (npm run dev)
- [ ] Frontend rodando (cd Front && npm run dev)
- [ ] Schema SQL executado no Supabase
- [ ] Testar login completo

## 🆘 Se Ainda Não Funcionar

1. Pare tudo (Ctrl+C nos terminais)
2. Reinicie o ngrok
3. Atualize a URL no Spotify Dashboard se mudou
4. Atualize o .env com a nova URL do ngrok
5. Reinicie backend e frontend
6. Limpe o cache do navegador (Ctrl+Shift+Delete)
7. Tente novamente

---

**Última atualização**: 2024
**Ngrok URL**: https://dian-deanthropomorphic-unlicentiously.ngrok-free.dev
