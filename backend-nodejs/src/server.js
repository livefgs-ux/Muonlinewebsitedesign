/**
 * MEUMU ONLINE - BACKEND API
 * Servidor Node.js/Express com MariaDB
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configurações
const { testConnection, closePool } = require('./config/database');
const logger = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/error-handler');

// Importar rotas
const authRoutes = require('./routes/auth');
const rankingsRoutes = require('./routes/rankings');
const charactersRoutes = require('./routes/characters');
const newsRoutes = require('./routes/news');
const serverRoutes = require('./routes/server');
const wcoinRoutes = require('./routes/wcoin');
const eventsRoutes = require('./routes/events');
const adminLogsRoutes = require('./routes/adminLogs');
const sandboxRoutes = require('./routes/sandbox');

// Criar app Express
const app = express();
const PORT = process.env.PORT || 3001;

// ==================================
// MIDDLEWARES DE SEGURANÇA
// ==================================

// Helmet - Headers de segurança
app.use(helmet());

// CORS - Configurar domínios permitidos
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting - Proteção contra abuso
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por IP
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente mais tarde.'
  }
});

app.use('/api/', limiter);

// ==================================
// MIDDLEWARES GERAIS
// ==================================

// Compressão gzip
app.use(compression());

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de requisições
app.use(logger);

// ==================================
// ROTAS DA API
// ==================================

// Health check (sem prefixo /api)
app.get('/health', serverRoutes);

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/server', serverRoutes);
app.use('/api/wcoin', wcoinRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/admin/logs', adminLogsRoutes);
app.use('/api/sandbox', sandboxRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MeuMU Online API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      rankings: '/api/rankings',
      characters: '/api/characters',
      news: '/api/news',
      server: '/api/server',
      wcoin: '/api/wcoin',
      events: '/api/events',
      adminLogs: '/api/admin/logs',
      health: '/health'
    }
  });
});

// ==================================
// TRATAMENTO DE ERROS
// ==================================

// Rota não encontrada
app.use(notFound);

// Error handler
app.use(errorHandler);

// ==================================
// INICIALIZAÇÃO DO SERVIDOR
// ==================================

const startServer = async () => {
  try {
    console.log('🚀 Iniciando MeuMU Online Backend...');
    console.log('================================================');
    
    // Testar conexão com o banco
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Falha ao conectar no banco de dados!');
      console.error('Verifique as configurações no arquivo .env');
      process.exit(1);
    }
    
    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log('================================================');
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log('================================================');
    });
    
    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} recebido. Encerrando servidor...`);
      
      server.close(async () => {
        console.log('🔌 Servidor HTTP fechado');
        await closePool();
        console.log('👋 Servidor encerrado com sucesso');
        process.exit(0);
      });
      
      // Force shutdown após 10 segundos
      setTimeout(() => {
        console.error('❌ Forçando encerramento...');
        process.exit(1);
      }, 10000);
    };
    
    // Lidar com sinais de encerramento
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Lidar com erros não tratados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection:', reason);
    });
    
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

module.exports = app;