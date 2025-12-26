/**
 * Controller de Autenticação
 */

const { executeQuery } = require('../config/database');
const { tables } = require('../config/auth');
const { 
  hashPassword, 
  comparePassword, 
  generateToken,
  sanitizeUsername,
  formatDateForMySQL,
  successResponse,
  errorResponse
} = require('../utils/helpers');

/**
 * Login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`\n🔐 Tentativa de login: ${username}`);
    
    // Buscar usuário no banco
    const sql = `SELECT memb___id, memb__pwd, mail_addr, bloc_code, ctl1_code 
                 FROM ${tables.accounts} 
                 WHERE memb___id = ?`;
    
    const result = await executeQuery(sql, [username]);
    
    if (!result.success || result.data.length === 0) {
      console.log(`❌ Usuário não encontrado: ${username}`);
      return errorResponse(res, 'Usuário ou senha incorretos', 401);
    }
    
    const account = result.data[0];
    console.log(`✅ Usuário encontrado: ${account.memb___id}`);
    console.log(`🔑 Hash da senha no banco: ${account.memb__pwd.substring(0, 10)}...`);
    
    // Verificar se a conta está bloqueada
    if (account.bloc_code === '1') {
      console.log(`🚫 Conta bloqueada: ${username}`);
      return errorResponse(res, 'Conta bloqueada. Entre em contato com o suporte.', 403);
    }
    
    // Comparar senha
    const passwordMatch = await comparePassword(password, account.memb__pwd);
    
    if (!passwordMatch) {
      console.log(`❌ Senha incorreta para: ${username}`);
      return errorResponse(res, 'Usuário ou senha incorretos', 401);
    }
    
    console.log(`✅ Senha correta para: ${username}`);
    
    // Verificar se é admin (ctl1_code = 8 ou superior)
    const isAdmin = account.ctl1_code >= 8;
    console.log(`👤 Tipo de conta: ${isAdmin ? 'ADMIN' : 'USUÁRIO'}`);
    
    // Gerar token JWT
    const token = generateToken({
      accountId: account.memb___id,
      email: account.mail_addr,
      isAdmin
    });
    
    console.log(`✅ Login bem-sucedido: ${username}\n`);
    
    return successResponse(res, {
      token,
      accountId: account.memb___id,
      email: account.mail_addr,
      isAdmin
    }, 'Login realizado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return errorResponse(res, 'Erro ao realizar login', 500);
  }
};

/**
 * Registro
 */
const register = async (req, res) => {
  try {
    const { username, password, email, personalId } = req.body;
    
    // Sanitizar username
    const cleanUsername = sanitizeUsername(username);
    
    // Verificar se o username já existe
    const checkSql = `SELECT memb___id FROM ${tables.accounts} WHERE memb___id = ?`;
    const checkResult = await executeQuery(checkSql, [cleanUsername]);
    
    if (!checkResult.success) {
      return errorResponse(res, 'Erro ao verificar usuário', 500);
    }
    
    if (checkResult.data.length > 0) {
      return errorResponse(res, 'Username já existe', 409);
    }
    
    // Verificar se o email já existe
    const checkEmailSql = `SELECT mail_addr FROM ${tables.accounts} WHERE mail_addr = ?`;
    const checkEmailResult = await executeQuery(checkEmailSql, [email]);
    
    if (checkEmailResult.data.length > 0) {
      return errorResponse(res, 'Email já cadastrado', 409);
    }
    
    // Hash da senha
    const hashedPassword = await hashPassword(password);
    
    // Inserir no banco
    const insertSql = `
      INSERT INTO ${tables.accounts} 
      (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, 
       addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, fpas_answ, 
       job__code, appl_days, modi_days, out__days, true_days, mail_chek, 
       bloc_code, ctl1_code, AccountLevel, AccountExpireDate, CashCredits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const currentDate = formatDateForMySQL();
    
    const insertResult = await executeQuery(insertSql, [
      cleanUsername,                    // memb___id
      hashedPassword,                   // memb__pwd
      cleanUsername,                    // memb_name
      personalId || '0000000000000',    // sno__numb
      '000000',                         // post_code
      'N/A',                            // addr_info
      'N/A',                            // addr_deta
      '000-0000-0000',                  // tel__numb
      '000-0000-0000',                  // phon_numb
      email,                            // mail_addr
      '',                               // fpas_ques
      '',                               // fpas_answ
      '',                               // job__code
      currentDate,                      // appl_days
      currentDate,                      // modi_days
      currentDate,                      // out__days
      currentDate,                      // true_days
      '1',                              // mail_chek
      '0',                              // bloc_code (0 = não bloqueado)
      '0',                              // ctl1_code (0 = usuário normal)
      '0',                              // AccountLevel
      null,                             // AccountExpireDate
      0                                 // CashCredits
    ]);
    
    if (!insertResult.success) {
      return errorResponse(res, 'Erro ao criar conta', 500);
    }
    
    // Gerar token JWT
    const token = generateToken({
      accountId: cleanUsername,
      email: email,
      isAdmin: false
    });
    
    return successResponse(res, {
      token,
      accountId: cleanUsername,
      email: email,
      isAdmin: false
    }, 'Conta criada com sucesso', 201);
    
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    return errorResponse(res, 'Erro ao criar conta', 500);
  }
};

/**
 * Verificar token
 */
const verifyTokenRoute = async (req, res) => {
  try {
    // Se chegou aqui, o token já foi verificado pelo middleware
    return successResponse(res, {
      accountId: req.user.accountId,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }, 'Token válido');
    
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    return errorResponse(res, 'Erro ao verificar token', 500);
  }
};

/**
 * Obter informações da conta
 */
const getAccountInfo = async (req, res) => {
  try {
    const { accountId } = req.user;
    
    const sql = `
      SELECT 
        memb___id,
        memb_name,
        mail_addr,
        appl_days,
        AccountLevel,
        CashCredits,
        bloc_code,
        ctl1_code
      FROM ${tables.accounts}
      WHERE memb___id = ?
    `;
    
    const result = await executeQuery(sql, [accountId]);
    
    if (!result.success || result.data.length === 0) {
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    const account = result.data[0];
    
    return successResponse(res, {
      accountId: account.memb___id,
      name: account.memb_name,
      email: account.mail_addr,
      createdAt: account.appl_days,
      vipLevel: account.AccountLevel,
      cashCredits: account.CashCredits,
      isBlocked: account.bloc_code === '1',
      isAdmin: account.ctl1_code >= 8
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar informações da conta:', error);
    return errorResponse(res, 'Erro ao buscar informações', 500);
  }
};

module.exports = {
  login,
  register,
  verifyTokenRoute,
  getAccountInfo
};