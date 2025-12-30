/**
 * ACCOUNTS CONTROLLER - MEUMU ONLINE
 * Gerenciamento completo de contas (AdminCP)
 */

const { poolMU, poolWEB } = require('../config/database');
const { validateRequired } = require('../utils/validators');
const bcrypt = require('bcryptjs');

/**
 * Buscar conta por username (AdminCP)
 * GET /api/admin/accounts/search?username=xxx
 */
exports.searchAccount = async (req, res, next) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username é obrigatório'
      });
    }

    const [accounts] = await poolMU.query(`
      SELECT 
        guid,
        account as username,
        email,
        admin_level,
        cash,
        created_at,
        last_login
      FROM accounts
      WHERE account LIKE ?
      LIMIT 20
    `, [`%${username}%`]);

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter detalhes completos da conta
 * GET /api/admin/accounts/:username
 */
exports.getAccountDetails = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Buscar conta
    const [accounts] = await poolMU.query(`
      SELECT 
        guid,
        account as username,
        email,
        admin_level,
        cash,
        created_at,
        last_login,
        banned,
        ban_reason
      FROM accounts
      WHERE account = ?
    `, [username]);

    if (accounts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    const account = accounts[0];

    // Buscar personagens da conta
    const [characters] = await poolMU.query(`
      SELECT 
        name,
        race as class,
        level,
        level_master,
        level_majestic,
        reset,
        online
      FROM character_info
      WHERE account_id = ?
    `, [account.guid]);

    account.characters = characters;

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar contas do mesmo IP
 * GET /api/admin/accounts/from-ip?ip=xxx
 */
exports.getAccountsFromIP = async (req, res, next) => {
  try {
    const { ip } = req.query;

    if (!ip) {
      return res.status(400).json({
        success: false,
        error: 'IP é obrigatório'
      });
    }

    // Nota: Esta query depende de ter um campo 'last_ip' na tabela accounts
    // Se não existir, retornar array vazio
    const [accounts] = await poolMU.query(`
      SELECT 
        account as username,
        email,
        created_at,
        last_login
      FROM accounts
      WHERE last_ip = ?
      ORDER BY last_login DESC
      LIMIT 50
    `, [ip]);

    res.json({
      success: true,
      data: accounts,
      count: accounts.length
    });
  } catch (error) {
    // Se coluna last_ip não existir, retornar array vazio
    console.error('Erro ao buscar contas por IP:', error);
    res.json({
      success: true,
      data: [],
      count: 0,
      message: 'Funcionalidade de IP tracking não disponível'
    });
  }
};

/**
 * Listar contas online
 * GET /api/admin/accounts/online
 */
exports.getOnlineAccounts = async (req, res, next) => {
  try {
    const [accounts] = await poolMU.query(`
      SELECT DISTINCT
        a.account as username,
        a.email,
        a.last_login,
        c.name as characterName,
        c.level
      FROM accounts a
      INNER JOIN character_info c ON c.account_id = a.guid
      WHERE c.online = 1
      ORDER BY c.name ASC
    `);

    res.json({
      success: true,
      data: accounts,
      count: accounts.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar novos registros
 * GET /api/admin/accounts/new-registrations?days=7
 */
exports.getNewRegistrations = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const [accounts] = await poolMU.query(`
      SELECT 
        account as username,
        email,
        created_at
      FROM accounts
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY created_at DESC
      LIMIT 100
    `, [days]);

    res.json({
      success: true,
      data: accounts,
      count: accounts.length,
      period: `Últimos ${days} dias`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualizar email da conta
 * PUT /api/admin/accounts/:username/email
 */
exports.updateAccountEmail = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { email } = req.body;

    const validation = validateRequired({ email });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const [result] = await poolMU.query(`
      UPDATE accounts
      SET email = ?
      WHERE account = ?
    `, [email, username]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Email atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resetar senha da conta
 * PUT /api/admin/accounts/:username/password
 */
exports.resetAccountPassword = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { newPassword } = req.body;

    const validation = validateRequired({ newPassword });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await poolMU.query(`
      UPDATE accounts
      SET password = ?
      WHERE account = ?
    `, [hashedPassword, username]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Senha resetada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adicionar/remover cash da conta
 * PUT /api/admin/accounts/:username/cash
 */
exports.updateAccountCash = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { amount, operation } = req.body; // operation: 'add' ou 'remove'

    const validation = validateRequired({ amount, operation });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    if (!['add', 'remove'].includes(operation)) {
      return res.status(400).json({
        success: false,
        error: 'Operação inválida (add/remove)'
      });
    }

    const operator = operation === 'add' ? '+' : '-';

    const [result] = await poolMU.query(`
      UPDATE accounts
      SET cash = cash ${operator} ?
      WHERE account = ?
    `, [amount, username]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conta não encontrada'
      });
    }

    res.json({
      success: true,
      message: `Cash ${operation === 'add' ? 'adicionado' : 'removido'} com sucesso`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Estatísticas de contas
 * GET /api/admin/accounts/stats
 */
exports.getAccountStats = async (req, res, next) => {
  try {
    const [stats] = await poolMU.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week,
        SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as this_month,
        SUM(CASE WHEN banned = 1 THEN 1 ELSE 0 END) as banned
      FROM accounts
    `);

    const [onlineCount] = await poolMU.query(`
      SELECT COUNT(DISTINCT account_id) as online
      FROM character_info
      WHERE online = 1
    `);

    res.json({
      success: true,
      data: {
        ...stats[0],
        online: onlineCount[0].online
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Criar nova conta (AdminCP)
 * POST /api/admin/accounts/create
 */
exports.createAccount = async (req, res, next) => {
  try {
    const { username, password, email, adminLevel } = req.body;

    // Validações
    const validation = validateRequired({ username, password, email });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Validar tamanho do username
    if (username.length < 4 || username.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Username deve ter entre 4 e 10 caracteres'
      });
    }

    // Validar tamanho da senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Senha deve ter no mínimo 6 caracteres'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Verificar se username já existe
    const [existingAccount] = await poolMU.query(`
      SELECT account FROM accounts WHERE account = ?
    `, [username]);

    if (existingAccount.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Username já está em uso'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar conta
    await poolMU.query(`
      INSERT INTO accounts (
        account,
        password,
        email,
        admin_level,
        cash,
        created_at
      ) VALUES (?, ?, ?, ?, 0, NOW())
    `, [username, hashedPassword, email, adminLevel || 0]);

    res.json({
      success: true,
      message: 'Conta criada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};