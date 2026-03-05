# 🎵 Configuração do Spotify Dashboard - Passo a Passo

## ⚠️ ERRO 400 do Spotify?

Se você está recebendo erro 400 ao tentar fazer login, siga EXATAMENTE estes passos:

---

## 📋 Passo a Passo Detalhado

### 1. Acesse o Spotify Dashboard

Abra no navegador: https://developer.spotify.com/dashboard

### 2. Faça Login

Use sua conta Spotify (a mesma que você vai usar no app)

### 3. Localize Seu App

Você deve ver um app com o nome que você criou. Se não tiver, clique em "Create app".

**Seu Client ID:** `e159bc0419af4208a6252f6ba727cbe7`

### 4. Abra as Configurações

Clique no nome do seu app, depois clique no botão **"Settings"** (canto superior direito)

### 5. Configure o Redirect URI

Role a página até encontrar a seção **"Redirect URIs"**

**IMPORTANTE:** Digite EXATAMENTE como está abaixo (copie e cole):

```
http://localhost:3001/api/auth/callback
```

**Atenção:**
- ❌ NÃO use `https://` (use `http://`)
- ❌ NÃO adicione barra no final (`/`)
- ❌ NÃO use porta diferente (deve ser `:3001`)
- ✅ Deve ser EXATAMENTE: `http://localhost:3001/api/auth/callback`

### 6. Adicione o URI

Depois de colar, clique no botão **"Add"** ao lado do campo

Você deve ver o URI aparecer na lista abaixo

### 7. Salve as Mudanças

Role até o final da página e clique no botão **"Save"** (verde)

### 8. AGUARDE!

**MUITO IMPORTANTE:** As mudanças no Spotify levam de 2 a 3 minutos para propagar.

⏰ Aguarde pelo menos 3 minutos antes de tentar fazer login novamente.

### 9. Limpe o Cache do Navegador

Pressione `Ctrl + Shift + Delete` e:
- Selecione "Cookies e outros dados de sites"
- Selecione "Imagens e arquivos em cache"
- Clique em "Limpar dados"

Ou tente em uma **janela anônima/privada** (Ctrl+Shift+N no Chrome)

### 10. Tente Novamente

Agora sim, acesse: http://localhost:3000

Clique em "Conectar com Spotify"

---

## ✅ Checklist de Verificação

Antes de tentar fazer login, confirme:

- [ ] Redirect URI está EXATAMENTE: `http://localhost:3001/api/auth/callback`
- [ ] Cliquei em "Add" depois de colar o URI
- [ ] Cliquei em "Save" no final da página
- [ ] Aguardei pelo menos 3 minutos
- [ ] Limpei o cache do navegador OU estou usando janela anônima
- [ ] Backend está rodando em http://localhost:3001
- [ ] Frontend está rodando em http://localhost:3000

---

## 🔍 Como Verificar se Está Correto

Execute no terminal:

```bash
node verify-spotify-config.js
```

Deve mostrar todas as configurações como ✅

---

## 🚨 Ainda com Erro 400?

### Possíveis Causas:

1. **Redirect URI incorreto no Dashboard**
   - Verifique letra por letra
   - Não pode ter espaços extras
   - Deve ser exatamente como mostrado

2. **Mudanças não propagaram**
   - Aguarde mais 2-3 minutos
   - Tente em outro navegador

3. **Cache do navegador**
   - Limpe completamente
   - Use janela anônima

4. **App do Spotify em modo Development**
   - Certifique-se que seu app está em "Development Mode"
   - Adicione seu email nas configurações de usuários de teste

---

## 📸 Exemplo Visual

Quando você abrir Settings, deve ver algo assim:

```
┌─────────────────────────────────────────────────┐
│ Redirect URIs                                   │
│                                                 │
│ [http://localhost:3001/api/auth/callback] [Add]│
│                                                 │
│ ✓ http://localhost:3001/api/auth/callback      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 💡 Dica Pro

Se você está desenvolvendo e testando frequentemente:

1. Mantenha o Spotify Dashboard aberto em uma aba
2. Use sempre janela anônima para testar
3. Aguarde sempre 2-3 minutos após qualquer mudança

---

## 📞 Precisa de Ajuda?

Se seguiu TODOS os passos e ainda não funciona:

1. Tire um print da tela de Settings do Spotify Dashboard
2. Copie os logs do terminal do backend
3. Verifique se não há erros de digitação no Redirect URI

---

**Lembre-se: O erro 400 é SEMPRE relacionado ao Redirect URI não estar configurado corretamente no Spotify Dashboard!**
