/**
 * 🔐 AdminCP - Account Management Routes
 * Gerenciamento completo de contas de usuários
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/accounts
 * Lista todas as contas com filtros
 */
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        memb___id as id,
        memb_name as username,
        mail_addr as email,
        bloc_code as status,
        ctl1_code as ctlCode,
        sno__numb as serialNumber,
        appl_days as applDays,
        modi_days as modiDays
      FROM MEMB_INFO
      WHERE 1=1
    `;
    
    const params = [];

    if (search) {
      query += ` AND (memb___id LIKE ? OR memb_name LIKE ? OR mail_addr LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ` AND bloc_code = ?`;
      params.push(status);
    }

    query += ` ORDER BY appl_days DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [accounts] = await db.query(query, params);

    // Total count
    let countQuery = 'SELECT COUNT(*) as total FROM MEMB_INFO WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (memb___id LIKE ? OR memb_name LIKE ? OR mail_addr LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      countQuery += ` AND bloc_code = ?`;
      countParams.push(status);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: accounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar contas',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/accounts/:id
 * Detalhes de uma conta específica
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [accounts] = await db.query(`
      SELECT 
        memb___id as id,
        memb_name as username,
        memb__pwd as password,
        mail_addr as email,
        bloc_code as status,
        ctl1_code as ctlCode,
        sno__numb as serialNumber,
        appl_days as applDays,
        modi_days as modiDays,
        out__days as outDays,
        true_days as trueDays
      FROM MEMB_INFO
      WHERE memb___id = ?
    `, [id]);

    if (accounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conta não encontrada'
      });
    }

    // Get account stats
    const [stats] = await db.query(`
      SELECT 
        ConnectStat as online,
        ServerName as server,
        IP as lastIp,
        ConnectTM as lastConnection
      FROM MEMB_STAT
      WHERE memb___id = ?
    `, [id]);

    // Get characters
    const [characters] = await db.query(`
      SELECT 
        Name as name,
        cLevel as level,
        Class as class,
        Resets as resets,
        MasterResets as masterResets,
        Money as zen
      FROM Character
      WHERE AccountID = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        account: accounts[0],
        stats: stats[0] || null,
        characters: characters || []
      }
    });

  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes da conta',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/accounts/:id
 * Atualiza informações de uma conta
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, status, ctlCode } = req.body;

    const updates = [];
    const params = [];

    if (email) {
      updates.push('mail_addr = ?');
      params.push(email);
    }

    if (status !== undefined) {
      updates.push('bloc_code = ?');
      params.push(status);
    }

    if (ctlCode !== undefined) {
      updates.push('ctl1_code = ?');
      params.push(ctlCode);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma atualização fornecida'
      });
    }

    params.push(id);

    await db.query(`
      UPDATE MEMB_INFO
      SET ${updates.join(', ')}, modi_days = NOW()
      WHERE memb___id = ?
    `, params);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'account_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ accountId: id, updates: req.body })]);

    res.json({
      success: true,
      message: 'Conta atualizada com sucesso'
    });

  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar conta',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/accounts/:id/ban
 * Banir uma conta
 */
router.post('/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, duration } = req.body;

    await db.query(`
      UPDATE MEMB_INFO
      SET bloc_code = 1, modi_days = NOW()
      WHERE memb___id = ?
    `, [id]);

    // Log the ban
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'account_ban', ?, NOW())
    `, [req.user.username, JSON.stringify({ accountId: id, reason, duration })]);

    res.json({
      success: true,
      message: 'Conta banida com sucesso'
    });

  } catch (error) {
    console.error('Error banning account:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao banir conta',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/accounts/:id/unban
 * Desbanir uma conta
 */
router.post('/:id/unban', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`
      UPDATE MEMB_INFO
      SET bloc_code = 0, modi_days = NOW()
      WHERE memb___id = ?
    `, [id]);

    // Log the unban
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'account_unban', ?, NOW())
    `, [req.user.username, JSON.stringify({ accountId: id })]);

    res.json({
      success: true,
      message: 'Conta desbanida com sucesso'
    });

  } catch (error) {
    console.error('Error unbanning account:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao desbanir conta',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/accounts/:id
 * Deletar uma conta (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - marca como bloqueada
    await db.query(`
      UPDATE MEMB_INFO
      SET bloc_code = 2, modi_days = NOW()
      WHERE memb___id = ?
    `, [id]);

    // Log the deletion
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'account_delete', ?, NOW())
    `, [req.user.username, JSON.stringify({ accountId: id })]);

    res.json({
      success: true,
      message: 'Conta deletada com sucesso'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar conta',
      error: error.message
    });
  }
});

module.exports = router;
