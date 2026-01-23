const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/auth');
const emotionRoutes = require('./routes/emotion');
const tracksRoutes = require('./routes/tracks');
const userRoutes = require('./routes/user');

const app = express();

// === SEGURANÇA ===
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// === LOGGING ===
app.use(morgan('combined', { stream: { write: msg => logger.info(msg) } }));

// === PARSER ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// === RATE LIMITING ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// === ROTAS ===
app.use('/api/auth', authRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/user', userRoutes);

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// === 404 ===
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path 
  });
});

// === ERROR HANDLER (deve ser o último) ===
app.use(errorHandler);

module.exports = app;