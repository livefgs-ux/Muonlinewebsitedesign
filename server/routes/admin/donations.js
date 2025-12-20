/**
 * 💳 ROTAS DE DOAÇÕES & ECONOMIA - AdminCP
 * 
 * Endpoints:
 * - GET  /api/admin/donations - Lista doações recentes
 * - POST /api/admin/donations - Registra nova doação
 * - POST /api/admin/donations/send-coins - Envia moedas para conta
 * - GET  /api/admin/donations/stats - Estatísticas de doações
 * - POST /api/admin/donations/config - Salva configurações de doação
 * - GET  /api/admin/donations/config - Retorna configurações atuais
 */

import express from 'express';
import pool from '../../config/database.js';

const router = express.Router();

// ===== ESTATÍSTICAS DE DOAÇÕES =====
router.get('/stats', async (req, res) => {
  try {
    // Mock data - substituir por queries reais no futuro
    const stats = {
      totalEarned: 3215.00,
      totalTransactions: 124,
      averageBalance: 4550,
      recentDonations: [
        {
          id: 1,
          date: '2025-12-15',
          account: 'SoulMageX',
          amountUSD: 20,
          credits: 2000,
          method: 'PayPal',
          status: 'confirmed',
          transactionId: 'PAYPAL-ABC123'
        },
        {
          id: 2,
          date: '2025-12-13',
          account: 'Dr4g0nSl4yer',
          amountUSD: 10,
          credits: 1000,
          method: 'Trillex Card',
          status: 'pending',
          transactionId: 'TLLX-XYZ789'
        },
        {
          id: 3,
          date: '2025-12-12',
          account: 'DarkWarrior99',
          amountUSD: 50,
          credits: 5000,
          method: 'PayPal',
          status: 'confirmed',
          transactionId: 'PAYPAL-DEF456'
        },
        {
          id: 4,
          date: '2025-12-10',
          account: 'ElfQueen',
          amountUSD: 15,
          credits: 1500,
          method: 'Pix',
          status: 'confirmed',
          transactionId: 'PIX-GHI012'
        }
      ]
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas de doações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar estatísticas de doações'
    });
  }
});

// ===== LISTAR DOAÇÕES =====
router.get('/', async (req, res) => {
  try {
    const { limit = 50, status, method } = req.query;

    // Mock data - futuramente buscar da tabela Donations
    let donations = [
      {
        id: 1,
        accountId: 'SoulMageX',
        amountUSD: 20,
        credits: 2000,
        method: 'PayPal',
        status: 'confirmed',
        transactionId: 'PAYPAL-ABC123',
        createdAt: '2025-12-15T14:30:00Z'
      },
      {
        id: 2,
        accountId: 'Dr4g0nSl4yer',
        amountUSD: 10,
        credits: 1000,
        method: 'Trillex Card',
        status: 'pending',
        transactionId: 'TLLX-XYZ789',
        createdAt: '2025-12-13T10:15:00Z'
      }
    ];

    // Filtros opcionais
    if (status) {
      donations = donations.filter(d => d.status === status);
    }
    if (method) {
      donations = donations.filter(d => d.method === method);
    }

    res.json({
      success: true,
      data: donations.slice(0, parseInt(limit)),
      total: donations.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar doações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar doações'
    });
  }
});

// ===== REGISTRAR NOVA DOAÇÃO =====
router.post('/', async (req, res) => {
  try {
    const { accountId, amountUSD, credits, method, transactionId } = req.body;

    // Validações
    if (!accountId || !amountUSD || !credits || !method) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: accountId, amountUSD, credits, method'
      });
    }

    // Mock de inserção - futuramente inserir na tabela Donations
    const newDonation = {
      id: Date.now(),
      accountId,
      amountUSD,
      credits,
      method,
      status: 'pending',
      transactionId: transactionId || `TXN-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    console.log('💰 Nova doação registrada:', newDonation);

    res.json({
      success: true,
      message: 'Doação registrada com sucesso',
      data: newDonation
    });

  } catch (error) {
    console.error('❌ Erro ao registrar doação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar doação'
    });
  }
});

// ===== ENVIAR MOEDAS MANUALMENTE =====
router.post('/send-coins', async (req, res) => {
  try {
    const { accountId, amount, coinType } = req.body;

    // Validações
    if (!accountId || !amount || !coinType) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: accountId, amount, coinType'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'A quantidade deve ser maior que zero'
      });
    }

    // Verifica se a conta existe
    const [account] = await pool.query(
      'SELECT memb___id FROM MEMB_INFO WHERE memb___id = ?',
      [accountId]
    );

    if (account.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    // Mock de envio - futuramente atualizar tabela Credits
    const transaction = {
      id: Date.now(),
      accountId,
      amount,
      coinType,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    console.log(`💎 Moedas enviadas - ${amount} ${coinType} para ${accountId}`);

    res.json({
      success: true,
      message: `Enviado ${amount} ${coinType} para ${accountId}`,
      data: transaction
    });

  } catch (error) {
    console.error('❌ Erro ao enviar moedas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar moedas'
    });
  }
});

// ===== OBTER CONFIGURAÇÕES =====
router.get('/config', async (req, res) => {
  try {
    // Mock data - futuramente buscar de uma tabela de configurações
    const config = {
      conversionRate: 100, // 1 USD = 100 WCoin
      vipBonus: 20, // 20% bônus VIP
      paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
      trillexKey: process.env.TRILLEX_API_KEY || '',
      pixEnabled: true,
      minDonation: 5, // USD
      maxDonation: 1000 // USD
    };

    res.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar configurações'
    });
  }
});

// ===== SALVAR CONFIGURAÇÕES =====
router.post('/config', async (req, res) => {
  try {
    const { conversionRate, vipBonus, paypalClientId, trillexKey } = req.body;

    // Validações básicas
    if (conversionRate && conversionRate < 1) {
      return res.status(400).json({
        success: false,
        error: 'Taxa de conversão deve ser maior que 0'
      });
    }

    if (vipBonus && (vipBonus < 0 || vipBonus > 100)) {
      return res.status(400).json({
        success: false,
        error: 'Bônus VIP deve estar entre 0 e 100'
      });
    }

    // Mock de salvamento - futuramente salvar em tabela de configurações
    const updatedConfig = {
      conversionRate: conversionRate || 100,
      vipBonus: vipBonus || 20,
      paypalClientId: paypalClientId || '',
      trillexKey: trillexKey || '',
      updatedAt: new Date().toISOString()
    };

    console.log('⚙️ Configurações de doação atualizadas:', updatedConfig);

    res.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      data: updatedConfig
    });

  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar configurações'
    });
  }
});

// ===== CONSULTAR SALDO DE UMA CONTA =====
router.get('/credits/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    // Verifica se a conta existe
    const [account] = await pool.query(
      'SELECT memb___id FROM MEMB_INFO WHERE memb___id = ?',
      [accountId]
    );

    if (account.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    // Mock data - futuramente buscar da tabela Credits
    const credits = {
      accountId,
      wcoin: 5000,
      goblinPoints: 1250,
      zen: 999999999,
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      data: credits
    });

  } catch (error) {
    console.error('❌ Erro ao consultar saldo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao consultar saldo'
    });
  }
});

export default router;
