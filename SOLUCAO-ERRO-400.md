# 🔧 Solução para Erro 400 do Spotify

## ❌ Problema

Ao clicar em "Conectar com Spotify", você recebe:
```
GET https://accounts.spotify.com/authorize?... 400 (Bad Request)
```

## ✅ Solução Rápida (3 minutos)

### Passo 1: Abra o Spotify Dashboard
https://developer.spotify.com/dashboard

### Passo 2: Abra Seu App
Procure pelo app com Client ID: `e159bc0419af4208a6252f6ba727cbe7`

### Passo 3: Clique em "Settings"
Botão no canto superior direito

### Passo 4: Adicione o Redirect URI
Na seção "Redirect URIs", cole EXATAMENTE:
```
http://localhost:3001/api/auth/callback
```

Clique em **"Add"** e depois em **"Save"** no final da página

### Passo 5: AGUARDE 3 MINUTOS ⏰
As mudanças levam tempo para propagar. Não pule este passo!

### Passo 6: Limpe o Cache
Pressione `Ctrl + Shift + Delete` e limpe:
- Cookies
- Cache de imagens

Ou use janela anônima (Ctrl+Shift+N)

### Passo 7: Tente Novamente
Acesse: http://localhost:3000

---

## 🎯 Verificação Rápida

Execute no terminal:
```bash
node verify-spotify-config.js
```

Deve mostrar tudo ✅

---

## 📋 Checklist

- [ ] Redirect URI adicionado no Spotify Dashboard
- [ ] Cliquei em "Save"
- [ ] Aguardei 3 minutos
- [ ] Limpei o cache do navegador
- [ ] Backend rodando (http://localhost:3001)
- [ ] Frontend rodando (http://localhost:3000)

---

## 🚀 Após Corrigir

1. Acesse http://localhost:3000
2. Clique em "Conectar com Spotify"
3. Faça login no Spotify
4. Autorize o app
5. Você será redirecionado para o Dashboard
6. Clique em "Analisar Minhas Músicas"
7. Aguarde 10-30 segundos
8. Veja seus dados emocionais!

---

## 💡 Por Que Isso Acontece?

O Spotify valida se o `redirect_uri` na URL de autorização está registrado no seu app. Se não estiver, retorna erro 400.

**Causas comuns:**
- Redirect URI não foi adicionado
- Redirect URI tem erro de digitação
- Mudanças ainda não propagaram (aguarde 3 minutos)
- Cache do navegador com dados antigos

---

## 📞 Ainda com Problemas?

Consulte o guia detalhado:
- [SPOTIFY-DASHBOARD-SETUP.md](SPOTIFY-DASHBOARD-SETUP.md)

Ou verifique:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [INICIAR-RAPIDO.md](INICIAR-RAPIDO.md)

---

**Lembre-se: Aguardar 3 minutos após salvar no Spotify Dashboard é ESSENCIAL!**
