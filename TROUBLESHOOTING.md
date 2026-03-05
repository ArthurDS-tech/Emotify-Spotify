# 🔧 Guia de Solução de Problemas - Emotify

## Problema: "Authentication failed" após login no Spotify

### Passos para Resolver:

#### 1. Verificar Configuração do Spotify Dashboard

Acesse: https://developer.spotify.com/dashboard

- Clique no seu app "Emotify"
- Vá em "Settings"
- Em "Redirect URIs", certifique-se de ter EXATAMENTE:
  ```
  http://localhost:3001/api/auth/callback
  ```
- Clique em "Save" se fez alterações
- **IMPORTANTE**: Aguarde 1-2 minutos para as mudanças propagarem

#### 2. Verificar Arquivo .env

Abra o arquivo `.env` na raiz do projeto e confirme:

```env
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback
FRONTEND_URL=http://localhost:3000
PORT=3001
```

**NÃO deve ter URLs do ngrok!**

#### 3. Testar Conexão com Supabase

Execute no terminal:

```bash
node test-supabase-connection.js
```

Se houver erros:
- Verifique se executou o SQL no Supabase
- Confirme as credenciais no `.env`
- Verifique se as tabelas foram criadas

#### 4. Reiniciar Servidores

```bash
# Parar todos os processos
# Pressione Ctrl+C em ambos os terminais

# Ou use o script START.bat
START.bat
```

#### 5. Verificar Logs Detalhados

Após fazer login, verifique o terminal do backend para mensagens como:

```
✅ Tokens received successfully
✅ User profile received: [seu_spotify_id]
✅ User saved successfully with ID: [uuid]
✅ JWT generated successfully
```

Se aparecer `❌` em algum passo, o erro está ali.

---

## Problema: Backend não inicia (porta 3001 em uso)

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [número_do_processo] /F

# Ou use o START.bat que faz isso automaticamente
```

---

## Problema: Frontend mostra página em branco

1. Verifique se o backend está rodando em `http://localhost:3001`
2. Abra o Console do navegador (F12) e veja os erros
3. Confirme que `Front/.env.local` tem:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

---

## Problema: "No authorization code" no callback

Isso significa que o Spotify não enviou o código de autorização.

**Causas comuns:**
- Redirect URI incorreto no Spotify Dashboard
- Usuário cancelou a autorização
- Problema de rede

**Solução:**
1. Limpe o cache do navegador
2. Tente fazer login novamente
3. Verifique o Redirect URI no Spotify Dashboard

---

## Problema: Dados não aparecem no Dashboard

Isso é NORMAL na primeira vez! O dashboard estará vazio até você clicar em "Analisar Minhas Músicas".

**Passos:**
1. Faça login com sucesso
2. No dashboard, clique no botão verde "Analisar Minhas Músicas"
3. Aguarde 10-30 segundos
4. Os dados aparecerão automaticamente

---

## Verificação Rápida - Checklist

- [ ] Spotify Dashboard tem redirect URI correto
- [ ] Arquivo `.env` tem `SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/callback`
- [ ] Backend rodando em `http://localhost:3001`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] SQL executado no Supabase
- [ ] Teste de conexão Supabase passou
- [ ] Logs do backend mostram ✅ em todos os passos

---

## Comandos Úteis

```bash
# Testar conexão Supabase
node test-supabase-connection.js

# Testar configuração Spotify
node test-spotify-config.js

# Iniciar tudo de uma vez
START.bat

# Backend apenas
cd .
npm run dev

# Frontend apenas
cd Front
npm run dev
```

---

## Ainda com Problemas?

1. Copie os logs completos do terminal do backend
2. Copie os erros do Console do navegador (F12)
3. Verifique se seguiu TODOS os passos do SETUP.md
4. Confirme que aguardou 1-2 minutos após salvar no Spotify Dashboard
