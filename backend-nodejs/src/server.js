/**
 * MEUMU ONLINE - BACKEND API
 * Servidor Node.js/Express com MariaDB
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════
// VALIDAR VARIÁVEIS DE AMBIENTE (ANTES DE TUDO!)
// ═══════════════════════════════════════════════════════════════
const { validateEnv } = require('./utils/validate-env');
validateEnv(); // Bloqueia startup se faltar variáveis críticas

// Importar configurações
const { testConnection, closePool } = require('./config/database');
const logger = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/error-handler');

// Importar middlewares de segurança avançada
const { 
  forceHttps, 
  addRealIp, 
  xssMiddleware 
} = require('./middleware/security');
const { detectSuspiciousPatterns } = require('./middleware/security-alerts');

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
const setupRoutes = require('./routes/setup'); // Setup Wizard
const installRoutes = require('./routes/install'); // Instalador Web

// Criar app Express
const app = express();
const PORT = process.env.PORT || 3001;

// ==================================
// PROXY REVERSO - TRUST PROXY
// ==================================
// ⚠️ OBRIGATÓRIO quando rodando atrás de Nginx/OpenLiteSpeed
// Permite que Express confie nos headers X-Forwarded-* do proxy
// 
// ✅ V519 FIX: Especificar exatamente quem pode confiar (não "true" genérico)
// Express-rate-limit 7.x+ exige trust proxy específico para segurança
app.set('trust proxy', 'loopback');  // ✅ Apenas 127.0.0.1, ::1 (localhost)

// ==================================
// MIDDLEWARES DE SEGURANÇA
// ==================================

// ════════════════════════════════════════════════════════════════
// DESABILITAR CSP PARA O INSTALADOR (apenas durante instalação)
// ════════════════════════════════════════════════════════════════
app.use('/install', (req, res, next) => {
  // Remover CSP headers para permitir scripts inline no instalador
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Content-Security-Policy-Report-Only');
  next();
});

// Helmet - Headers de segurança COMPLETOS (Safe Vibe Coding)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://fonts.googleapis.com"  // ✅ Google Fonts
      ],
      scriptSrc: [
        "'self'",
        // ✅ SEGURANÇA: Removido 'unsafe-inline' para prevenir XSS
        // Apenas scripts do próprio domínio são permitidos
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://*",  // ✅ Permitir imagens de qualquer fonte HTTPS
        "http://*"    // ⚠️ Temporário para desenvolvimento
      ],
      connectSrc: [
        "'self'",
        "https://*",  // ✅ APIs externas via HTTPS
        "http://localhost:*",  // ⚠️ Desenvolvimento
        "ws:",
        "wss:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",  // ✅ Google Fonts
        "data:"
      ],
      objectSrc: ["'none'"],  // ✅ Bloquear Flash/plugins
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]    // ✅ Bloquear iframes
    }
  },
  crossOriginEmbedderPolicy: false,  // ⚠️ Desabilitado para compatibilidade
  crossOriginResourcePolicy: { policy: "cross-origin" },  // ✅ Permitir recursos externos
  // ✅ PROTEÇÕES ADICIONAIS CONTRA XSS:
  xssFilter: true,                    // ✅ Ativar XSS filter no navegador
  noSniff: true,                      // ✅ Prevenir MIME sniffing
  referrerPolicy: {                   // ✅ Controlar informações do Referer
    policy: "strict-origin-when-cross-origin"
  },
  hsts: {                             // ✅ Force HTTPS (apenas em produção)
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// ✅ Uniformizar headers Origin-Agent-Cluster
app.use((req, res, next) => {
  res.setHeader('Origin-Agent-Cluster', '?1');
  next();
});

// CORS - Configurar domínios permitidos
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // MODO INSTALAÇÃO: Permitir TODAS as origens se JWT_SECRET não existir
    // OU se .env não tiver INSTALLATION_COMPLETE
    const isInstallComplete = process.env.INSTALLATION_COMPLETE === 'true';
    
    if (!isInstallComplete || !process.env.JWT_SECRET) {
      // ✅ V522 FIX: Permitir requisições localhost SEM origin (curl, health checks)
      // Requisições localhost → localhost não enviam Origin header (normal!)
      if (!origin) {
        console.log('✅ CORS: Requisição localhost (sem Origin) - PERMITIDA');
        return callback(null, true);
      }
      
      console.log('🔓 CORS: Modo instalação - permitindo origem:', origin);
      return callback(null, true);
    }
    
    // Após instalação, permitir:
    // 1. Requisições sem Origin (localhost, curl, health checks)
    // 2. Origens na whitelist
    if (!origin) {
      console.log('✅ CORS: Requisição localhost (sem Origin) - PERMITIDA');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para:', origin);
      console.log('   Origens permitidas:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting - Proteção contra abuso
// ⚠️ IMPORTANTE: Aumentado temporariamente para debug (muitas requisições do frontend)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minuto (reduzido)
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // 1000 requests (MUITO AUMENTADO para debug)
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.' // Mudado "error" para "message"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// Middlewares de segurança avançada
app.use(forceHttps);
app.use(addRealIp);
app.use(xssMiddleware);
app.use(detectSuspiciousPatterns);

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
// SERVIR INSTALADOR WEB (SE EXISTIR)
// ==================================

const installPath = path.join(__dirname, '../../install');
if (fs.existsSync(installPath)) {
  app.use('/install', express.static(installPath));
  console.log('📦 Instalador disponível em /install');
}

// ==================================
// ROTAS DA API
// ==================================

// Health check (sem prefixo /api)
app.get('/health', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');
    const dbConnected = await testConnection();
    
    return res.status(dbConnected ? 200 : 503).json({
      success: true,
      status: dbConnected ? 'healthy' : 'unhealthy',
      message: 'MeuMU Online API está funcionando!',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('❌ Erro no health check:', error);
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

// API de Instalação
app.use('/api/install', installRoutes);

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/server', serverRoutes);
app.use('/api/wcoin', wcoinRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/downloads', require('./routes/downloads')); // ✅ NOVO V558: Downloads
app.use('/api/admin', require('./routes/admin')); // ✅ NOVO V573: Admin dashboard & stats
app.use('/api/admin/logs', adminLogsRoutes);
app.use('/api/admin/accounts', require('./routes/accounts')); // ✅ NOVO V558: Gerenciar contas
app.use('/api/admin/bans', require('./routes/bans')); // ✅ NOVO V558: Sistema de bans
app.use('/api/admin/site-editor', require('./routes/siteEditor')); // ✅ NOVO V563: Site Editor
app.use('/api/admin/plugins', require('./routes/plugins')); // ✅ NOVO V564: Sistema de plugins
app.use('/api/admin/crons', require('./routes/crons')); // ✅ NOVO V577: Cron Jobs Manager
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/settings', require('./routes/settings')); // ✅ Configurações do site

// Setup Wizard (sem /api para evitar conflitos)
app.use('/setup-api', setupRoutes);

// ==================================
// SERVIR FRONTEND REACT (ÚLTIMA PRIORIDADE!)
// ==================================

const frontendPath = path.join(__dirname, '../../dist');
if (fs.existsSync(frontendPath)) {
  // Servir arquivos estáticos do frontend
  app.use(express.static(frontendPath));
  
  // React Router - todas as rotas que NÃO são /api/* vão para index.html
  app.get('*', (req, res, next) => {
    // Se for rota da API, pular para próximo handler
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/health') || 
        req.path.startsWith('/install') || 
        req.path.startsWith('/setup-api')) {
      return next();
    }
    
    // Caso contrário, servir o index.html do React
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  console.log('⚛️  Frontend React disponível na raiz');
} else {
  // Se não tiver frontend buildado, mostrar info da API
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'MeuMU Online API',
      version: '1.0.0',
      warning: 'Frontend não buildado (pasta /dist não existe)',
      installer: '/install',
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
}

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
    
    // Testar conexão com o banco (não bloqueia se falhar - modo instalação)
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Banco não conectado - Modo Instalação ativado');
      console.log('📦 Acesse: http://meumu.com:3001/install para configurar\n');
      // NÃO BLOQUEIA - permite instalador funcionar
    }
    
    // Iniciar servidor HTTP
    // Produção: escuta APENAS localhost (proxy reverso Nginx)
    // Desenvolvimento: escuta todas as interfaces (acesso direto via porta 3001)
    const HOST = process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0';
    
    const server = app.listen(PORT, HOST, () => {
      console.log('================================================');
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Escutando: ${HOST}:${PORT}`);
      
      if (process.env.NODE_ENV === 'production') {
        console.log(`📡 API URL: https://meumu.com/api (via Nginx proxy)`);
        console.log(`📊 Health Check: https://meumu.com/api/health`);
        console.log(`⚛️  Frontend: https://meumu.com`);
        console.log(`🔐 SEGURANÇA: Porta 3001 acessível APENAS internamente`);
      } else {
        console.log(`📡 API URL: http://meumu.com:${PORT}`);
        console.log(`📊 Health Check: http://meumu.com:${PORT}/health`);
        console.log(`⚛️  Frontend: http://meumu.com:${PORT}/`);
      }
      
      if (!dbConnected) {
        const installUrl = process.env.NODE_ENV === 'production' 
          ? `https://meumu.com/api/install` 
          : `http://meumu.com:${PORT}/install`;
        console.log(`📦 Instalador: ${installUrl}`);
      }
      
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