// Backend API Server para MeuMU Online
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import statsRoutes from './routes/stats.js';
import rankingsRoutes from './routes/rankings.js';
import authRoutes from './routes/auth.js';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

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

// Rotas da API
app.use('/api/stats', statsRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/auth', authRoutes);

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
      console.log(`🔒 Auth: http://localhost:${PORT}/api/auth/login`);
      console.log(`\n⚔️  MeuMU Online - Season 19-2-3 Épico\n`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;