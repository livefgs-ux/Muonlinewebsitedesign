/**
 * 🛡️ ROTAS DE SEGURANÇA & LOGS - AdminCP
 * 
 * Endpoints:
 * - GET  /api/admin/security/status - Status geral de segurança
 * - GET  /api/admin/security/logs - Lista logs de atividades
 * - POST /api/admin/security/ban - Bane um IP
 * - POST /api/admin/security/scan - Executa scan de segurança
 * - POST /api/admin/security/firewall/restart - Reinicia firewall
 * - GET  /api/admin/security/export - Exporta logs
 */

import express from 'express';
import pool from '../../config/database.js';

const router = express.Router();

// ===== STATUS GERAL DE SEGURANÇA =====
router.get('/status', async (req, res) => {
  try {
    // Mock data - futuramente buscar de tabelas reais
    const status = {
      blockedAttempts24h: 37,
      suspendedIPs: 12,
      firewallStatus: 'active',
      lastScan: '2025-12-19T02:00:00Z',
      threatLevel: 'low', // low, medium, high, critical
      protections: {
        antiDDoS: true,
        sqlInjectionFilter: true,
        bruteForceProtection: true,
        xssSanitizer: true,
        sessionValidator: true,
        fileIntegrityScanner: true
      }
    };

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('❌ Erro ao buscar status de segurança:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar status de segurança'
    });
  }
});

// ===== LISTAR LOGS DE SEGURANÇA =====
router.get('/logs', async (req, res) => {
  try {
    const { limit = 50, status, user, startDate, endDate } = req.query;

    // Mock data - futuramente buscar da tabela SecurityLogs
    let logs = [
      {
        id: 1,
        timestamp: '2025-12-19T02:45:00Z',
        user: 'admin_test',
        action: 'Alterou configuração de PayPal',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Configuração atualizada com sucesso'
      },
      {
        id: 2,
        timestamp: '2025-12-19T02:41:00Z',
        user: 'root',
        action: 'Tentativa de login incorreta',
        ip: '201.8.14.92',
        status: 'blocked',
        details: 'Senha incorreta - tentativa 3/3'
      },
      {
        id: 3,
        timestamp: '2025-12-19T02:38:00Z',
        user: 'SoulMageX',
        action: 'Solicitou reset de personagem',
        ip: '192.168.1.100',
        status: 'success',
        details: 'Reset do personagem DarkKnight executado'
      },
      {
        id: 4,
        timestamp: '2025-12-19T02:30:00Z',
        user: 'unknown',
        action: 'Tentativa de SQL Injection detectada',
        ip: '45.123.67.89',
        status: 'blocked',
        details: 'Query maliciosa bloqueada: DROP TABLE users'
      },
      {
        id: 5,
        timestamp: '2025-12-19T02:15:00Z',
        user: 'admin_test',
        action: 'Criou nova notícia',
        ip: '127.0.0.1',
        status: 'success',
        details: 'Notícia "Novo Evento de Natal" publicada'
      }
    ];

    // Filtros opcionais
    if (status) {
      logs = logs.filter(log => log.status === status);
    }
    if (user) {
      logs = logs.filter(log => log.user.includes(user));
    }

    res.json({
      success: true,
      data: logs.slice(0, parseInt(limit)),
      total: logs.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar logs de segurança:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar logs'
    });
  }
});

// ===== BANIR IP =====
router.post('/ban', async (req, res) => {
  try {
    const { ip, reason, duration } = req.body;

    // Validações
    if (!ip) {
      return res.status(400).json({
        success: false,
        error: 'IP é obrigatório'
      });
    }

    // Validar formato de IP
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de IP inválido'
      });
    }

    // Mock de banimento - futuramente inserir na tabela BannedIPs
    const expiresAt = duration 
      ? new Date(Date.now() + duration * 60 * 1000).toISOString()
      : null;

    const bannedIP = {
      id: Date.now(),
      ip,
      reason: reason || 'Atividade suspeita',
      createdAt: new Date().toISOString(),
      expiresAt,
      bannedBy: req.user?.username || 'admin'
    };

    console.log('🚫 IP banido:', bannedIP);

    // Registrar no log de segurança
    console.log('📝 Log de segurança: IP banido', {
      user: req.user?.username || 'admin',
      action: `Baniu IP ${ip}`,
      ip: req.ip,
      status: 'success'
    });

    res.json({
      success: true,
      message: `IP ${ip} banido com sucesso`,
      data: bannedIP
    });

  } catch (error) {
    console.error('❌ Erro ao banir IP:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao banir IP'
    });
  }
});

// ===== EXECUTAR SCAN DE SEGURANÇA =====
router.post('/scan', async (req, res) => {
  try {
    const { scanType = 'full' } = req.body;

    console.log(`🔍 Iniciando scan de segurança (tipo: ${scanType})...`);

    // Mock de scan - futuramente executar verificações reais
    const scanResults = {
      id: Date.now(),
      type: scanType,
      startedAt: new Date().toISOString(),
      status: 'completed',
      results: {
        filesScanned: 1247,
        threatsFound: 0,
        suspiciousActivities: 0,
        vulnerabilities: [],
        recommendations: [
          'Sistema operando normalmente',
          'Nenhuma ameaça detectada',
          'Todas as proteções estão ativas'
        ]
      }
    };

    // Registrar no log
    console.log('📝 Log de segurança: Scan executado', {
      user: req.user?.username || 'admin',
      action: 'Executou scan de segurança',
      ip: req.ip,
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Scan de segurança concluído',
      data: scanResults
    });

  } catch (error) {
    console.error('❌ Erro ao executar scan:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao executar scan de segurança'
    });
  }
});

// ===== REINICIAR FIREWALL =====
router.post('/firewall/restart', async (req, res) => {
  try {
    console.log('🔄 Reiniciando firewall...');

    // Mock de reinício - futuramente executar comando real
    const result = {
      status: 'success',
      message: 'Firewall reiniciado com sucesso',
      timestamp: new Date().toISOString(),
      previousStatus: 'active',
      newStatus: 'active'
    };

    // Registrar no log
    console.log('📝 Log de segurança: Firewall reiniciado', {
      user: req.user?.username || 'admin',
      action: 'Reiniciou firewall',
      ip: req.ip,
      status: 'success'
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erro ao reiniciar firewall:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao reiniciar firewall'
    });
  }
});

// ===== EXPORTAR LOGS =====
router.get('/export', async (req, res) => {
  try {
    const { format = 'txt', startDate, endDate } = req.query;

    console.log(`📂 Exportando logs (formato: ${format})...`);

    // Mock de exportação - futuramente gerar arquivo real
    const exportData = {
      filename: `security_logs_${new Date().toISOString().split('T')[0]}.${format}`,
      path: `/webmu/logs/security_${new Date().toISOString().split('T')[0]}.${format}`,
      generatedAt: new Date().toISOString(),
      totalRecords: 150,
      format
    };

    // Registrar no log
    console.log('📝 Log de segurança: Logs exportados', {
      user: req.user?.username || 'admin',
      action: 'Exportou logs de segurança',
      ip: req.ip,
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Logs exportados com sucesso',
      data: exportData
    });

  } catch (error) {
    console.error('❌ Erro ao exportar logs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao exportar logs'
    });
  }
});

// ===== LISTAR IPs BANIDOS =====
router.get('/banned-ips', async (req, res) => {
  try {
    // Mock data - futuramente buscar da tabela BannedIPs
    const bannedIPs = [
      {
        id: 1,
        ip: '201.8.14.92',
        reason: 'Múltiplas tentativas de login falhadas',
        createdAt: '2025-12-19T02:41:00Z',
        expiresAt: '2025-12-19T12:41:00Z',
        bannedBy: 'admin_test'
      },
      {
        id: 2,
        ip: '45.123.67.89',
        reason: 'SQL Injection detectado',
        createdAt: '2025-12-19T02:30:00Z',
        expiresAt: null,
        bannedBy: 'system'
      }
    ];

    res.json({
      success: true,
      data: bannedIPs,
      total: bannedIPs.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar IPs banidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar IPs banidos'
    });
  }
});

// ===== REMOVER BAN DE IP =====
router.delete('/ban/:ip', async (req, res) => {
  try {
    const { ip } = req.params;

    console.log(`✅ Removendo ban do IP: ${ip}`);

    // Mock de remoção - futuramente deletar da tabela BannedIPs
    const result = {
      ip,
      unbannedAt: new Date().toISOString(),
      unbannedBy: req.user?.username || 'admin'
    };

    // Registrar no log
    console.log('📝 Log de segurança: IP desbanido', {
      user: req.user?.username || 'admin',
      action: `Removeu ban do IP ${ip}`,
      ip: req.ip,
      status: 'success'
    });

    res.json({
      success: true,
      message: `Ban do IP ${ip} removido com sucesso`,
      data: result
    });

  } catch (error) {
    console.error('❌ Erro ao remover ban:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover ban'
    });
  }
});

export default router;
