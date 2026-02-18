const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { connectDB } = require('./config/database');

const authRoutes = require('./routes/auth');
const emotionRoutes = require('./routes/emotion');
const tracksRoutes = require('./routes/tracks');
const userRoutes = require('./routes/user');
const playlistRoutes = require('./routes/playlists');

const app = express();

// Configurar trust proxy para funcionar com ngrok
app.set('trust proxy', true);

connectDB();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: '*', credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(morgan('combined', { stream: { write: msg => logger.info(msg) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/user', userRoutes);
app.use('/api/playlists', playlistRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint de debug temporário
app.get('/api/debug/config', (req, res) => {
  const config = require('./config/spotify');
  res.json({
    clientId: config.clientId,
    clientSecret: config.clientSecret ? '***' + config.clientSecret.slice(-4) : 'NOT SET',
    redirectUri: config.redirectUri,
    redirectUriLength: config.redirectUri?.length,
    hasSpaces: {
      start: config.redirectUri?.startsWith(' '),
      end: config.redirectUri?.endsWith(' ')
    }
  });
});

// Rota raiz para evitar 404 em "/"
app.get('/', (req, res) => {
  res.json({
    name: 'Spotify Emotion Engine API',
    status: 'ok',
    healthCheck: '/api/health',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;