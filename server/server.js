// Backend API Server para MeuMU Online
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { testConnection } from './config/database.js';
import { applySecurity } from './middleware/security.js';
import { refreshTokenIfNeeded, requireAuth } from './middleware/auth.js';
import statsRoutes from './routes/stats.js';
import rankingsRoutes from './routes/rankings.js';
import statusRoutes from './routes/status.js';
import authRoutes from './routes/auth.js';
import playerRoutes from './routes/player.js';

// AdminCP Routes
import adminAccountsRoutes from './routes/admin/accounts.js';
import adminCharactersRoutes from './routes/admin/characters.js';
import adminNewsRoutes from './routes/admin/news.js';
import adminSettingsRoutes from './routes/admin/settings.js';
import adminPluginsRoutes from './routes/admin/plugins.js';
import adminCronsRoutes from './routes/admin/crons.js';
import adminLogsRoutes from './routes/admin/logs.js';
import adminSiteEditorRoutes from './routes/admin/site-editor.js';
import adminDonationsRoutes from './routes/admin/donations.js';
import adminSecurityRoutes from './routes/admin/security.js';
import adminCronJobsRoutes from './routes/admin/cronjobs.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARES BÁSICOS =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Permite cookies
}));
app.use(express.json());
app.use(cookieParser());

// ===== SEGURANÇA AVANÇADA =====
// Aplica todos os middlewares de segurança (Helmet, XSS, Rate Limiting, etc)
applySecurity(app);

// ===== RENOVAÇÃO AUTOMÁTICA DE TOKEN =====
// Renova tokens que estão próximos de expirar
app.use(refreshTokenIfNeeded);

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'MeuMU Online API'
  });
});

// ===== ROTAS DA API =====
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/player', playerRoutes);

// ===== ROTAS ADMINCP (PROTEGIDAS) =====
// Todas as rotas admin requerem autenticação e role de admin
app.use('/api/admin/accounts', requireAuth, adminAccountsRoutes);
app.use('/api/admin/characters', requireAuth, adminCharactersRoutes);
app.use('/api/admin/news', requireAuth, adminNewsRoutes);
app.use('/api/admin/settings', requireAuth, adminSettingsRoutes);
app.use('/api/admin/plugins', requireAuth, adminPluginsRoutes);
app.use('/api/admin/crons', requireAuth, adminCronsRoutes);
app.use('/api/admin/logs', requireAuth, adminLogsRoutes);
app.use('/api/admin/site-editor', requireAuth, adminSiteEditorRoutes);
app.use('/api/admin/donations', requireAuth, adminDonationsRoutes);
app.use('/api/admin/security', requireAuth, adminSecurityRoutes);
app.use('/api/admin/cronjobs', requireAuth, adminCronJobsRoutes);

// Rota para testar conexão com banco
app.get('/api/test-connection', async (req, res) => {
  const isConnected = await testConnection();
  res.json({
    success: isConnected,
    message: isConnected ? 'Conexão com MySQL OK' : 'Falha ao conectar com MySQL'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro na API:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Inicializa servidor
async function startServer() {
  try {
    // Testa conexão com banco de dados
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  AVISO: Servidor iniciado sem conexão com MySQL');
      console.warn('Configure as variáveis de ambiente no arquivo .env:');
      console.warn('DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor MeuMU Online API rodando na porta ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Stats: http://localhost:${PORT}/api/stats/online`);
      console.log(`🏆 Rankings: http://localhost:${PORT}/api/rankings/players`);
      console.log(`⚙️  AdminCP: http://localhost:${PORT}/api/admin/*`);
      console.log(`\n⚔️  MeuMU Online - Season 19-2-3 Épico\n`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;