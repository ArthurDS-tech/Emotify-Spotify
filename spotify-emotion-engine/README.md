<div align="center">

# 🎵 **Emotify** 
### *Descubra as emoções por trás da sua música*

<img src="https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">

---

*Transforme seus dados do Spotify em insights emocionais profundos*

</div>

## 🌟 **O que é o Emotify?**

> **Emotify** é uma aplicação revolucionária que analisa seus hábitos musicais do Spotify e revela o **DNA emocional** das suas músicas favoritas. Descubra padrões ocultos, entenda seus estados de espírito através da música e conecte-se com pessoas que compartilham sua vibe musical.

<div align="center">

---

## ✨ **Funcionalidades Principais**

<div align="center">

| 🎯 **Análise Emocional** | 🎵 **Dados Reais** | 👥 **Social** | 📊 **Insights** |
|:---:|:---:|:---:|:---:|
| Algoritmo de IA que analisa valência, energia e dançabilidade | Integração completa com Spotify Web API | Conecte-se com pessoas de gosto musical similar | Visualizações interativas dos seus padrões |
| 7 emoções diferentes identificadas | Top músicas, histórico real, audio features | Crie e compartilhe playlists colaborativas | Timeline emocional semanal |

</div>

### 🚀 **Principais Features**

```typescript
🎵 Análise Emocional Avançada
├── 🧠 Engine de IA para processamento emocional
├── 📈 7 categorias emocionais (Alegria, Melancolia, Nostalgia, etc.)
├── ⚡ Análise de energia, valência e dançabilidade
└── 📊 Insights personalizados baseados em seus dados

🎶 Integração Real com Spotify
├── 🔐 OAuth 2.0 seguro
├── 🎵 Top músicas por período (curto/médio/longo prazo)
├── ⏰ Histórico de reprodução em tempo real
└── 🎨 Criação de playlists diretamente no Spotify

👥 Recursos Sociais
├── 🤝 Matching por compatibilidade musical
├── 🎵 Playlists colaborativas
├── 📱 Feed de atividades dos amigos
└── 🌍 Descoberta de novos usuários

📱 Interface Moderna
├── 🎨 Design inspirado no Spotify
├── 📱 Totalmente responsivo
├── ⚡ Animações fluidas com Framer Motion
└── 🌙 Suporte a tema escuro/claro
```

---

## 🛠️ **Stack Tecnológica**

<div align="center">

### **Frontend** 
<img src="https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion">

### **Backend**
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis">
<img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">

### **APIs & Integrações**
<img src="https://img.shields.io/badge/Spotify_Web_API-1DB954?style=flat-square&logo=spotify&logoColor=white" alt="Spotify API">
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">

</div>

---

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- MongoDB (local ou Atlas)
- Redis (opcional)
- Conta de desenvolvedor do Spotify

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/emotify.git
cd emotify
```

### **2. Configure o Backend**
```bash
cd spotify-emotion-engine
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Spotify
```

### **3. Configure o Frontend**
```bash
cd Front/Spotify-frontend
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### **4. Configuração do Spotify**
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie uma nova aplicação
3. Configure as URLs de redirecionamento:
   - `http://localhost:3001/api/auth/callback`
4. Copie `Client ID` e `Client Secret` para o `.env`

### **5. Execute o projeto**
```bash
# Terminal 1 - Backend
cd spotify-emotion-engine
npm start

# Terminal 2 - Frontend  
cd Front/Spotify-frontend
npm run dev
```

<div align="center">

🎉 **Acesse:** `http://localhost:3000`

</div>

---

## 📸 **Screenshots**

<div align="center">

### 🏠 **Dashboard Principal**
<img src="https://via.placeholder.com/800x400/1DB954/FFFFFF?text=🏠+Dashboard+Principal" alt="Dashboard" width="800">

### 📊 **Análise Emocional**
<img src="https://via.placeholder.com/800x400/191414/1DB954?text=📊+Análise+Emocional" alt="Análise" width="800">

### 👥 **Área Social**
<img src="https://via.placeholder.com/800x400/1ED760/FFFFFF?text=👥+Área+Social" alt="Social" width="800">

</div>

---

## 🎯 **Como Funciona a Análise Emocional**

<div align="center">

```mermaid
graph TD
    A[🎵 Suas Músicas] --> B[📊 Audio Features]
    B --> C[🧠 Engine Emocional]
    C --> D[📈 Scores Emocionais]
    D --> E[🎨 Visualização]
    
    B --> F[Valência<br/>Energia<br/>Dançabilidade<br/>Acústica]
    F --> G[Algoritmo de IA]
    G --> H[7 Emoções<br/>Identificadas]
```

</div>

### **Emoções Detectadas:**
- 😊 **Alegria** - Músicas positivas e energéticas
- 😢 **Melancolia** - Faixas introspectivas e melancólicas  
- 💭 **Nostalgia** - Sons que evocam memórias
- 😌 **Calma** - Músicas relaxantes e tranquilas
- 🎉 **Euforia** - Tracks para dançar e celebrar
- 🤔 **Introspecção** - Músicas para reflexão
- ⚡ **Energia** - Faixas que te fazem mover

---

## 🤝 **Contribuindo**

<div align="center">

Adoramos contribuições! 🎵

</div>

### **Como contribuir:**

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### **Áreas que precisam de ajuda:**
- 🎨 Melhorias no design/UX
- 🧠 Algoritmos de análise emocional
- 🌐 Internacionalização
- 📱 App mobile (React Native)
- 🔧 Otimizações de performance

---

## 📄 **Licença**

<div align="center">

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

### 🎵 **Feito com ❤️ e muita música**

<img src="https://img.shields.io/badge/Made_with-❤️-1DB954?style=for-the-badge" alt="Made with Love">
<img src="https://img.shields.io/badge/Powered_by-Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Powered by Spotify">

**Desenvolvido por:** [Seu Nome](https://github.com/seu-usuario)

</div>

---

<div align="center">

### 🌟 **Se você gostou, deixe uma estrela!** ⭐

<img src="https://img.shields.io/github/stars/seu-usuario/emotify?style=social" alt="GitHub stars">
<img src="https://img.shields.io/github/forks/seu-usuario/emotify?style=social" alt="GitHub forks">
<img src="https://img.shields.io/github/watchers/seu-usuario/emotify?style=social" alt="GitHub watchers">

</div>
