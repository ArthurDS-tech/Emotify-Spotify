# 🚀 Como Iniciar o Emotify

## Método 1: Automático (Recomendado)

Clique duas vezes no arquivo:
```
START.bat
```

Isso vai:
1. Matar processos nas portas 3000 e 3001
2. Iniciar o backend na porta 3001
3. Iniciar o frontend na porta 3000

---

## Método 2: Manual

### Passo 1: Abra o primeiro terminal
```bash
npm run dev
```

Aguarde ver:
```
🎵 Emotion Engine Backend rodando em development
📍 http://localhost:3001
```

### Passo 2: Abra o segundo terminal
```bash
cd Front
npm run dev
```

Aguarde ver:
```
▲ Next.js 14.1.0
- Local: http://localhost:3000
```

---

## ⚙️ Configuração do Spotify (OBRIGATÓRIO)

1. Acesse: https://developer.spotify.com/dashboard
2. Selecione seu app (Client ID: e159bc0419af4208a6252f6ba727cbe7)
3. Clique em **"Edit Settings"**
4. Em **"Redirect URIs"**, adicione:
   ```
   http://localhost:3001/api/auth/callback
   ```
5. Clique em **"Add"** e depois **"Save"**

---

## 🧪 Testar

1. Abra: **http://localhost:3000**
2. Clique em **"Conectar com Spotify"**
3. Faça login no Spotify
4. Autorize o aplicativo
5. Você será redirecionado de volta

---

## ❌ Problemas Comuns

### "Port already in use"
Execute:
```bash
START.bat
```
Ou manualmente:
```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force
```

### "Failed to fetch"
- Verifique se o backend está rodando (porta 3001)
- Teste: http://localhost:3001/api/health

### "CORS error"
- Reinicie o backend
- Verifique se o .env está correto

### "Redirect URI mismatch"
- Verifique se adicionou a URL no Spotify Dashboard
- URL deve ser EXATAMENTE: `http://localhost:3001/api/auth/callback`

---

## 📋 Checklist

- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 3000
- [ ] Redirect URI configurada no Spotify
- [ ] Schema SQL executado no Supabase
- [ ] Arquivo .env configurado
- [ ] Arquivo Front/.env.local configurado

---

## 🆘 Ainda com problemas?

1. Feche TODOS os terminais
2. Execute `START.bat`
3. Aguarde 10 segundos
4. Acesse http://localhost:3000
5. Tente conectar

Se ainda não funcionar, verifique:
- [ ] Node.js instalado (v18+)
- [ ] npm install executado (raiz e Front/)
- [ ] Credenciais do Spotify corretas no .env
- [ ] Credenciais do Supabase corretas no .env

---

**Boa sorte!** 🎵
