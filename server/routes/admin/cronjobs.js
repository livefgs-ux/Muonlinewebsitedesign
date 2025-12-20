/**
 * ⏱️ ROTAS DE CRONJOBS & AUTOMAÇÃO - AdminCP
 * 
 * Endpoints:
 * - GET  /api/admin/cronjobs - Lista todas as tarefas
 * - POST /api/admin/cronjobs/run - Executa tarefa manualmente
 * - POST /api/admin/cronjobs/toggle - Ativa/desativa tarefa
 * - GET  /api/admin/cronjobs/logs - Retorna logs de execuções
 * - POST /api/admin/cronjobs/create - Cria nova tarefa
 * - DELETE /api/admin/cronjobs/:id - Remove tarefa
 */

import express from 'express';
import pool from '../../config/database.js';

const router = express.Router();

// ===== LISTAR TODAS AS TAREFAS =====
router.get('/', async (req, res) => {
  try {
    // Mock data - futuramente buscar da tabela CronJobs
    const cronJobs = [
      {
        id: 1,
        name: 'update_rankings',
        description: 'Atualiza ranking de jogadores e guilds',
        schedule: 'A cada 15 min',
        schedulePattern: '*/15 * * * *',
        lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 2,
        name: 'check_boss_status',
        description: 'Verifica bosses vivos no servidor',
        schedule: 'A cada 10 min',
        schedulePattern: '*/10 * * * *',
        lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 3,
        name: 'check_events',
        description: 'Atualiza timers de Blood Castle / Devil Square',
        schedule: 'A cada 10 min',
        schedulePattern: '*/10 * * * *',
        lastRun: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 4,
        name: 'backup_database',
        description: 'Backup automático do banco webmu',
        schedule: '1x por dia (03:00)',
        schedulePattern: '0 3 * * *',
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'paused'
      },
      {
        id: 5,
        name: 'security_scan',
        description: 'Verificação de logs e IPs suspeitos',
        schedule: 'A cada 30 min',
        schedulePattern: '*/30 * * * *',
        lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 6,
        name: 'cleanup_temp',
        description: 'Remove arquivos de cache temporários',
        schedule: '1x por dia (04:00)',
        schedulePattern: '0 4 * * *',
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 7,
        name: 'email_digest',
        description: 'Envia resumo diário de status do servidor',
        schedule: '1x por dia (08:00)',
        schedulePattern: '0 8 * * *',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 8,
        name: 'update_online_stats',
        description: 'Atualiza estatísticas de jogadores online',
        schedule: 'A cada 5 min',
        schedulePattern: '*/5 * * * *',
        lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ];

    res.json({
      success: true,
      data: cronJobs,
      total: cronJobs.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar cron jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar tarefas'
    });
  }
});

// ===== EXECUTAR TAREFA MANUALMENTE =====
router.post('/run', async (req, res) => {
  try {
    const { jobName } = req.body;

    if (!jobName) {
      return res.status(400).json({
        success: false,
        error: 'Nome da tarefa é obrigatório'
      });
    }

    console.log(`⏱️ Executando tarefa manualmente: ${jobName}`);

    // Simular execução da tarefa
    const executionResult = await executeCronJob(jobName);

    // Registrar no log
    console.log('📝 Log de cron job:', {
      jobName,
      runTime: new Date().toISOString(),
      status: executionResult.success ? 'success' : 'failed',
      output: executionResult.output
    });

    res.json({
      success: true,
      message: `Tarefa ${jobName} executada com sucesso`,
      data: executionResult
    });

  } catch (error) {
    console.error('❌ Erro ao executar cron job:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao executar tarefa'
    });
  }
});

// ===== ATIVAR/DESATIVAR TAREFA =====
router.post('/toggle', async (req, res) => {
  try {
    const { jobId, status } = req.body;

    if (!jobId || !status) {
      return res.status(400).json({
        success: false,
        error: 'jobId e status são obrigatórios'
      });
    }

    if (!['active', 'paused'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status deve ser "active" ou "paused"'
      });
    }

    console.log(`🔄 Alterando status da tarefa #${jobId} para: ${status}`);

    // Mock de atualização - futuramente atualizar tabela CronJobs
    const result = {
      jobId,
      newStatus: status,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.username || 'admin'
    };

    // Registrar no log
    console.log('📝 Log de cron job:', {
      action: 'toggle_status',
      jobId,
      status,
      user: req.user?.username || 'admin'
    });

    res.json({
      success: true,
      message: `Tarefa ${status === 'active' ? 'ativada' : 'desativada'} com sucesso`,
      data: result
    });

  } catch (error) {
    console.error('❌ Erro ao alternar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao alternar status da tarefa'
    });
  }
});

// ===== LISTAR LOGS DE EXECUÇÕES =====
router.get('/logs', async (req, res) => {
  try {
    const { jobName, limit = 50, startDate, endDate } = req.query;

    // Mock data - futuramente buscar da tabela CronLogs
    let logs = [
      {
        id: 1,
        jobName: 'update_rankings',
        runTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'success',
        output: 'Rankings atualizados com sucesso. 1247 jogadores processados.',
        duration: 2340 // ms
      },
      {
        id: 2,
        jobName: 'check_boss_status',
        runTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'success',
        output: 'Bosses verificados. 3 bosses ativos no momento.',
        duration: 890
      },
      {
        id: 3,
        jobName: 'backup_database',
        runTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'failed',
        output: 'Erro: Espaço em disco insuficiente.',
        duration: 1200
      },
      {
        id: 4,
        jobName: 'security_scan',
        runTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'success',
        output: 'Scan completo. Nenhuma ameaça detectada.',
        duration: 5670
      },
      {
        id: 5,
        jobName: 'check_events',
        runTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: 'success',
        output: 'Eventos atualizados. Próximo Blood Castle em 45 minutos.',
        duration: 450
      }
    ];

    // Filtrar por nome da tarefa se especificado
    if (jobName) {
      logs = logs.filter(log => log.jobName === jobName);
    }

    res.json({
      success: true,
      data: logs.slice(0, parseInt(limit)),
      total: logs.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar logs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar logs'
    });
  }
});

// ===== CRIAR NOVA TAREFA =====
router.post('/create', async (req, res) => {
  try {
    const { name, description, schedulePattern } = req.body;

    // Validações
    if (!name || !description || !schedulePattern) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: name, description, schedulePattern'
      });
    }

    // Validar padrão cron (básico)
    const cronRegex = /^(\*|([0-9]|[1-5][0-9])|\*\/([0-9]|[1-5][0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|[12][0-9]|3[01])|\*\/([1-9]|[12][0-9]|3[01])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|[0-6]|\*\/[0-6])$/;
    
    if (!cronRegex.test(schedulePattern)) {
      return res.status(400).json({
        success: false,
        error: 'Padrão cron inválido. Use formato: * * * * * (min hour day month weekday)'
      });
    }

    // Mock de criação - futuramente inserir na tabela CronJobs
    const newJob = {
      id: Date.now(),
      name,
      description,
      schedulePattern,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: req.user?.username || 'admin'
    };

    console.log('✅ Nova tarefa cron criada:', newJob);

    res.json({
      success: true,
      message: 'Tarefa criada com sucesso',
      data: newJob
    });

  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar tarefa'
    });
  }
});

// ===== REMOVER TAREFA =====
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Removendo tarefa cron #${id}`);

    // Mock de remoção - futuramente deletar da tabela CronJobs
    const result = {
      id,
      deletedAt: new Date().toISOString(),
      deletedBy: req.user?.username || 'admin'
    };

    res.json({
      success: true,
      message: 'Tarefa removida com sucesso',
      data: result
    });

  } catch (error) {
    console.error('❌ Erro ao remover tarefa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover tarefa'
    });
  }
});

// ===== ESTATÍSTICAS DE CRONJOBS =====
router.get('/stats', async (req, res) => {
  try {
    // Mock data - futuramente calcular baseado em dados reais
    const stats = {
      totalJobs: 8,
      activeJobs: 7,
      pausedJobs: 1,
      executionsToday: 124,
      successRate: 98.5, // %
      avgExecutionTime: 2145, // ms
      lastExecution: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      nextExecution: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// ===== FUNÇÃO AUXILIAR: EXECUTAR TAREFA =====
async function executeCronJob(jobName) {
  // Simula execução de diferentes tarefas
  switch (jobName) {
    case 'update_rankings':
      // Simula atualização de rankings
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        output: 'Rankings atualizados com sucesso. 1247 jogadores processados.',
        duration: 2000
      };

    case 'check_boss_status':
      // Simula verificação de bosses
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        output: 'Bosses verificados. 3 bosses ativos no momento.',
        duration: 1000
      };

    case 'backup_database':
      // Simula backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      return {
        success: true,
        output: 'Backup criado com sucesso: webmu_backup_2025-12-19.sql',
        duration: 3000
      };

    case 'security_scan':
      // Simula scan de segurança
      await new Promise(resolve => setTimeout(resolve, 2500));
      return {
        success: true,
        output: 'Scan completo. Nenhuma ameaça detectada.',
        duration: 2500
      };

    case 'check_events':
      // Simula verificação de eventos
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        output: 'Eventos atualizados. Próximo Blood Castle em 45 minutos.',
        duration: 500
      };

    default:
      return {
        success: true,
        output: `Tarefa ${jobName} executada com sucesso.`,
        duration: 1000
      };
  }
}

export default router;
