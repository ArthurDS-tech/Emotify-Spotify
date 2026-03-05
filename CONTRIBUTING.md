# 🤝 Contribuindo para o Emotify

Obrigado por considerar contribuir para o Emotify! 🎵

## 📋 Código de Conduta

Este projeto segue um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e acolhedor.

## 🚀 Como Contribuir

### 1. Fork o Projeto

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/emotify.git
cd emotify

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/emotify.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/nome-da-feature

# Ou para um bugfix
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga os padrões de código do projeto
- Adicione comentários quando necessário
- Teste suas alterações

### 4. Commit suas Mudanças

Usamos commits semânticos:

```bash
# Features
git commit -m "feat: adiciona análise de gêneros musicais"

# Bugfixes
git commit -m "fix: corrige erro no cálculo de emoções"

# Documentação
git commit -m "docs: atualiza guia de instalação"

# Estilo
git commit -m "style: formata código com prettier"

# Refatoração
git commit -m "refactor: reorganiza estrutura de pastas"

# Testes
git commit -m "test: adiciona testes para emotion engine"

# Performance
git commit -m "perf: otimiza queries do banco de dados"
```

### 5. Push para seu Fork

```bash
git push origin feature/nome-da-feature
```

### 6. Abra um Pull Request

1. Vá para o repositório original no GitHub
2. Clique em "Pull Requests" > "New Pull Request"
3. Selecione sua branch
4. Preencha o template de PR
5. Aguarde review

## 🎯 Áreas que Precisam de Ajuda

### 🎨 Frontend
- Melhorias no design/UX
- Novos componentes visuais
- Animações e transições
- Responsividade mobile

### 🧠 Backend
- Otimização de algoritmos
- Novos endpoints
- Melhorias de performance
- Testes unitários

### 📊 Análise Emocional
- Refinamento do algoritmo
- Novas métricas emocionais
- Machine Learning
- Análise de letras

### 🌐 Internacionalização
- Traduções
- Suporte a múltiplos idiomas
- Formatação de datas/números

### 📱 Mobile
- App React Native
- PWA
- Notificações push

### 📚 Documentação
- Tutoriais
- Exemplos de uso
- Vídeos explicativos
- Melhorias no README

## 💻 Padrões de Código

### JavaScript/TypeScript

```javascript
// ✅ Bom
const analyzeEmotion = (audioFeatures) => {
  const { valence, energy } = audioFeatures;
  return calculateScore(valence, energy);
};

// ❌ Ruim
function analyze(f) {
  return f.v * f.e;
}
```

### Nomenclatura

- **Variáveis**: camelCase (`userName`, `trackId`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `MAX_TRACKS`)
- **Componentes**: PascalCase (`EmotionCard`, `Dashboard`)
- **Arquivos**: kebab-case (`emotion-engine.js`, `user-profile.tsx`)

### Comentários

```javascript
// ✅ Bom - Explica o "porquê"
// Normalize tempo to 0-1 scale because Spotify returns 0-200 BPM
const normalizedTempo = tempo / 200;

// ❌ Ruim - Explica o "o quê" (óbvio)
// Divide tempo by 200
const normalizedTempo = tempo / 200;
```

## 🧪 Testes

### Backend
```bash
npm test
```

### Frontend
```bash
cd Front
npm test
```

### Escrever Testes

```javascript
describe('EmotionEngine', () => {
  it('should calculate joy score correctly', () => {
    const features = { valence: 0.8, energy: 0.7 };
    const result = emotionEngine.analyzeTrack(features);
    expect(result.emotions.joy).toBeGreaterThan(0.6);
  });
});
```

## 📝 Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bugfix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Comentários adicionados quando necessário
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] Testes passando
- [ ] Sem warnings no console
```

## 🐛 Reportando Bugs

### Template de Issue

```markdown
## Descrição do Bug
Descrição clara do problema

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
Se aplicável

## Ambiente
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Versão: [1.0.0]

## Informações Adicionais
Qualquer outra informação relevante
```

## 💡 Sugerindo Features

### Template de Feature Request

```markdown
## Descrição da Feature
Descrição clara da feature

## Problema que Resolve
Qual problema esta feature resolve?

## Solução Proposta
Como você imagina que funcione?

## Alternativas Consideradas
Outras formas de resolver o problema

## Informações Adicionais
Mockups, exemplos, etc.
```

## 🎨 Design Guidelines

### Cores
- Spotify Green: `#1DB954`
- Spotify Black: `#191414`
- Use as cores de emoção definidas no Tailwind config

### Componentes
- Use Tailwind CSS
- Componentes devem ser reutilizáveis
- Props devem ter tipos definidos (TypeScript)

### Animações
- Use Framer Motion
- Mantenha animações sutis (< 500ms)
- Sempre teste performance

## 📦 Estrutura de Pastas

```
src/
├── config/         # Configurações
├── controllers/    # Controladores de rotas
├── middleware/     # Middlewares
├── routes/         # Definição de rotas
├── services/       # Lógica de negócio
└── utils/          # Utilitários

Front/src/
├── app/            # Pages (Next.js App Router)
├── components/     # Componentes React
└── lib/            # Utilitários e API client
```

## 🔍 Code Review

Ao revisar PRs, considere:

- ✅ Código está limpo e legível?
- ✅ Segue os padrões do projeto?
- ✅ Tem testes adequados?
- ✅ Documentação está atualizada?
- ✅ Não introduz bugs?
- ✅ Performance está ok?
- ✅ Segurança está ok?

## 🎓 Recursos para Aprender

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🙏 Agradecimentos

Obrigado por contribuir! Cada contribuição, por menor que seja, faz diferença. 🎵❤️

## 📞 Contato

- Issues: [GitHub Issues](https://github.com/seu-usuario/emotify/issues)
- Discussões: [GitHub Discussions](https://github.com/seu-usuario/emotify/discussions)

---

**Lembre-se:** Não existe contribuição pequena demais. Seja corrigindo um typo ou adicionando uma feature complexa, toda ajuda é bem-vinda! 🚀
