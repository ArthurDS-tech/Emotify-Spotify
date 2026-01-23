<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Emotion Engine</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #000;
            color: #fff;
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid #1DB954;
        }

        .logo {
            font-size: 48px;
        }

        h1 {
            font-size: 36px;
            font-weight: bold;
        }

        .subtitle {
            font-size: 16px;
            color: #b3b3b3;
            margin-top: 5px;
        }

        section {
            margin-bottom: 50px;
        }

        h2 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #1DB954;
        }

        h3 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        p {
            color: #b3b3b3;
            margin-bottom: 15px;
        }

        code {
            background: #1a1a1a;
            padding: 15px;
            border-left: 3px solid #1DB954;
            display: block;
            margin: 15px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            border-radius: 4px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .card {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #282828;
        }

        .card h4 {
            color: #1DB954;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .card p {
            font-size: 14px;
        }

        a {
            color: #1DB954;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .badge {
            display: inline-block;
            background: #1DB954;
            color: #000;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 8px;
            margin-bottom: 8px;
        }

        ul, ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }

        li {
            margin-bottom: 8px;
            color: #b3b3b3;
        }

        .footer {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid #282828;
            color: #666;
            font-size: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #282828;
            color: #b3b3b3;
        }

        th {
            color: #1DB954;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">🎵</div>
            <div>
                <h1>Spotify Emotion Engine</h1>
                <p class="subtitle">Análise emocional baseada em dados musicais com Machine Learning</p>
            </div>
        </header>

        <section>
            <h2>O que é?</h2>
            <p>Um backend que analisa suas emoções através dos dados das suas músicas do Spotify. A gente pega as características de áudio das suas faixas (energia, valência, acústica) e identifica os sentimentos dominantes na sua playlist.</p>
        </section>

        <section>
            <h2>Começar</h2>
            
            <h3>Pré-requisitos</h3>
            <div class="grid">
                <div class="card">
                    <h4>Node.js</h4>
                    <p>v18 ou superior</p>
                </div>
                <div class="card">
                    <h4>MongoDB</h4>
                    <p>v5 ou superior</p>
                </div>
                <div class="card">
                    <h4>Redis</h4>
                    <p>v6 ou superior</p>
                </div>
                <div class="card">
                    <h4>Spotify Dev</h4>
                    <p><a href="https://developer.spotify.com" target="_blank">developer.spotify.com</a></p>
                </div>
            </div>

            <h3>1. Clone e instale</h3>
            <code>git clone https://github.com/seu-usuario/spotify-emotion-engine.git
cd spotify-emotion-engine
npm install</code>

            <h3>2. Variáveis de ambiente</h3>
            <code>cp .env.example .env</code>

            <p>Preencha seu .env com:</p>
            <code>PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SPOTIFY_CLIENT_ID=seu_id
SPOTIFY_CLIENT_SECRET=seu_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/callback

JWT_SECRET=sua_chave_secreta
JWT_EXPIRY=7d

REDIS_HOST=localhost
REDIS_PORT=6379
MONGODB_URI=mongodb://localhost:27017/emotion-engine</code>

            <h3>3. Crie app no Spotify Developer</h3>
            <ol>
                <li>Acesse <a href="https://developer.spotify.com/dashboard" target="_blank">developer.spotify.com/dashboard</a></li>
                <li>Clique em "Create an App"</li>
                <li>Copie Client ID e Secret para .env</li>
                <li>Configure Redirect URI: <code style="display: inline; padding: 2px 6px; background: #1a1a1a;">http://localhost:5000/api/auth/callback</code></li>
            </ol>

            <h3>4. Inicie os bancos</h3>
            <code># MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Redis
docker run -d -p 6379:6379 --name redis redis:latest</code>

            <h3>5. Rode o servidor</h3>
            <code>npm run dev</code>

            <p>Servidor em: <a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>
        </section>

        <section>
            <h2>API Endpoints</h2>

            <h3>Autenticação</h3>
            <code>GET /api/auth/url
# Retorna URL para login no Spotify

GET /api/auth/callback?code=...
# Callback automático do OAuth

POST /api/auth/refresh
# Renova seu token de acesso</code>

            <h3>Perfil</h3>
            <code>GET /api/user/profile
# Headers: Authorization: Bearer &lt;token&gt;

PUT /api/user/profile
# Body: { "name": "Seu Nome" }</code>

            <h3>Análise Emocional</h3>
            <code>GET /api/emotion/analyze?period=medium_term
# period: short_term | medium_term | long_term

Resposta:
{
  "dominantEmotion": "Nostalgia",
  "emotionalBalance": 72,
  "emotionBreakdown": {
    "alegria": 65,
    "melancolia": 45,
    "nostalgia": 88,
    "calma": 52,
    "euforia": 71,
    "energia": 78
  },
  "insights": [...]
}</code>

            <h3>Tracks</h3>
            <code>GET /api/tracks/top?period=medium_term&limit=50
# Suas músicas favoritas

GET /api/tracks/recently-played?limit=50
# Ouvidas recentemente

GET /api/emotion/history
# Histórico de análises</code>
        </section>

        <section>
            <h2>Como as emoções funcionam</h2>
            <table>
                <tr>
                    <th>Emoção</th>
                    <th>O que significa</th>
                </tr>
                <tr>
                    <td>Alegria</td>
                    <td>Músicas positivas e enérgicas</td>
                </tr>
                <tr>
                    <td>Melancolia</td>
                    <td>Tom mais triste, menos energia</td>
                </tr>
                <tr>
                    <td>Nostalgia</td>
                    <td>Acústico, calmo e reflexivo</td>
                </tr>
                <tr>
                    <td>Calma</td>
                    <td>Relaxante, sem muita energia</td>
                </tr>
                <tr>
                    <td>Euforia</td>
                    <td>Dançável, animado, festivo</td>
                </tr>
                <tr>
                    <td>Introspecção</td>
                    <td>Instrumental, reflexivo</td>
                </tr>
                <tr>
                    <td>Energia</td>
                    <td>Intensidade e ritmo forte</td>
                </tr>
            </table>
        </section>

        <section>
            <h2>Segurança</h2>
            <div class="grid">
                <div class="card">
                    <h4>🔐 JWT com expiração</h4>
                    <p>Tokens seguros com refresh automático</p>
                </div>
                <div class="card">
                    <h4>🔒 Bcrypt</h4>
                    <p>Senhas criptografadas</p>
                </div>
                <div class="card">
                    <h4>⚔️ CORS</h4>
                    <p>Protegido contra requisições maliciosas</p>
                </div>
                <div class="card">
                    <h4>🚦 Rate Limiting</h4>
                    <p>Limite de requisições por IP</p>
                </div>
            </div>
        </section>

        <section>
            <h2>Problemas comuns</h2>

            <h3>Token expirado</h3>
            <p>Use POST /api/auth/refresh com seu refreshToken para gerar um novo accessToken.</p>

            <h3>MongoDB não conecta</h3>
            <p>Verifique se o mongod está rodando: <code style="display: inline; padding: 2px 6px;">docker ps | grep mongodb</code></p>

            <h3>Muitas requisições</h3>
            <p>Spotify limita a 30 requisições por minuto. Aguarde um tempo antes de fazer novas requisições.</p>

            <h3>Redis não conecta</h3>
            <p>O cache funciona sem Redis, mas as análises ficarão mais lentas. Reinicie com: <code style="display: inline; padding: 2px 6px;">docker restart redis</code></p>
        </section>

        <section>
            <h2>Deploy</h2>

            <h3>Docker</h3>
            <code>docker build -t emotion-engine .
docker run -p 5000:5000 emotion-engine</code>

            <h3>Heroku</h3>
            <code>heroku login
heroku create seu-app
heroku config:set JWT_SECRET=...
git push heroku main</code>
        </section>

        <section>
            <h2>Estrutura do banco</h2>

            <h3>Users</h3>
            <code>{
  spotifyId: String,
  email: String,
  name: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  tokenExpiresAt: Date
}</code>

            <h3>EmotionAnalysis</h3>
            <code>{
  userId: ObjectId,
  period: String,
  dominantEmotion: String,
  emotionalBalance: Number,
  emotionBreakdown: Object,
  emotionalTimeline: Array,
  insights: Array
}</code>
        </section>

        <div class="footer">
            <p>MIT © 2024 • Feito com ☕</p>
        </div>
    </div>
</body>
</html>
