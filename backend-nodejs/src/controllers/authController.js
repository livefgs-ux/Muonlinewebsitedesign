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
    
    // ========================================================================
    // COMPATIBILIDADE DUAL: Season 6 (memb___id) E Season 19 (account)
    // ========================================================================
    
    // Primeiro tentar estrutura Season 19 (account, password, guid)
    let sql = `SELECT account as username, password as pwd, guid as id, email, blocked 
               FROM ${tables.accounts} 
               WHERE account = ?`;
    
    let result = await executeQuery(sql, [username]);
    
    // Se não encontrou, tentar estrutura Season 6 (memb___id, memb__pwd)
    if (!result.success || result.data.length === 0) {
      console.log('🔄 Tentando estrutura Season 6 (memb___id)...');
      sql = `SELECT memb___id as username, memb__pwd as pwd, memb___id as id, mail_addr as email, bloc_code as blocked 
             FROM ${tables.accounts} 
             WHERE memb___id = ?`;
      
      result = await executeQuery(sql, [username]);
    }
    
    if (!result.success || result.data.length === 0) {
      console.log(`❌ Usuário não encontrado: ${username}`);
      return errorResponse(res, 'Usuário ou senha incorretos', 401);
    }
    
    const account = result.data[0];
    console.log(`✅ Usuário encontrado: ${account.username}`);
    console.log(`🔑 Hash da senha no banco: ${account.pwd ? account.pwd.substring(0, 10) + '...' : 'VAZIO!'}`);
    
    // Verificar se a conta está bloqueada
    // Season 6: bloc_code === '1', Season 19: blocked === 1
    const isBlocked = account.blocked === '1' || account.blocked === 1;
    if (isBlocked) {
      console.log(`🚫 Conta bloqueada: ${username}`);
      return errorResponse(res, 'Conta bloqueada. Entre em contato com o suporte.', 403);
    }
    
    // Comparar senha
    const passwordMatch = await comparePassword(password, account.pwd);
    
    if (!passwordMatch) {
      console.log(`❌ Senha incorreta para: ${username}`);
      console.log(`🔍 DEBUG - Senha enviada: ${password.substring(0, 3)}...`);
      console.log(`🔍 DEBUG - Hash no banco: ${account.pwd}`);
      return errorResponse(res, 'Usuário ou senha incorretos', 401);
    }
    
    console.log(`✅ Senha correta para: ${username}`);
    
    // Verificar se é admin (ctl1_code >= 8 no Season 6)
    // No Season 19, pode usar outro campo - ajustar conforme necessário
    const isAdmin = false; // Ajustar conforme estrutura do Season 19
    console.log(`👤 Tipo de conta: ${isAdmin ? 'ADMIN' : 'USUÁRIO'}`);
    
    // Gerar token JWT
    const token = generateToken({
      accountId: account.username,
      email: account.email || '',
      isAdmin
    });
    
    console.log(`✅ Login bem-sucedido: ${username}\n`);
    
    return successResponse(res, {
      token,
      user: {
        username: account.username,
        accountId: account.username,
        email: account.email || '',
        isAdmin
      }
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
    
    console.log(`\n📝 Tentativa de registro: ${username}`);
    
    // Sanitizar username
    const cleanUsername = sanitizeUsername(username);
    
    // ========================================================================
    // DETECTAR ESTRUTURA DA TABELA (Season 6 vs Season 19)
    // ========================================================================
    
    // Verificar qual estrutura de tabela temos
    const checkStructureSql = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tables.accounts}'
      AND COLUMN_NAME IN ('account', 'memb___id')
      LIMIT 1
    `;
    
    const structureResult = await executeQuery(checkStructureSql);
    const isSeason19 = structureResult.success && 
                       structureResult.data.length > 0 && 
                       structureResult.data[0].COLUMN_NAME === 'account';
    
    console.log(`🔍 Estrutura detectada: ${isSeason19 ? 'Season 19' : 'Season 6'}`);
    
    // ========================================================================
    // VERIFICAR SE USUÁRIO JÁ EXISTE
    // ========================================================================
    
    let checkSql, insertSql, insertParams;
    
    if (isSeason19) {
      // Season 19: Verificar coluna 'account'
      checkSql = `SELECT account FROM ${tables.accounts} WHERE account = ?`;
    } else {
      // Season 6: Verificar coluna 'memb___id'
      checkSql = `SELECT memb___id FROM ${tables.accounts} WHERE memb___id = ?`;
    }
    
    const checkResult = await executeQuery(checkSql, [cleanUsername]);
    
    if (!checkResult.success) {
      console.error('❌ Erro ao verificar usuário existente');
      return errorResponse(res, 'Erro ao verificar usuário', 500);
    }
    
    if (checkResult.data.length > 0) {
      console.log(`⚠️  Username já existe: ${cleanUsername}`);
      return errorResponse(res, 'Username já existe', 409);
    }
    
    // ========================================================================
    // VERIFICAR SE EMAIL JÁ EXISTE
    // ========================================================================
    
    const emailColumn = isSeason19 ? 'email' : 'mail_addr';
    const checkEmailSql = `SELECT ${emailColumn} FROM ${tables.accounts} WHERE ${emailColumn} = ?`;
    const checkEmailResult = await executeQuery(checkEmailSql, [email]);
    
    if (checkEmailResult.data.length > 0) {
      console.log(`⚠️  Email já cadastrado: ${email}`);
      return errorResponse(res, 'Email já cadastrado', 409);
    }
    
    // ========================================================================
    // GERAR HASH DA SENHA (MD5 para MU Online)
    // ========================================================================
    
    // MU Online usa MD5 por padrão
    const { hashPasswordMD5 } = require('../utils/helpers');
    const hashedPassword = hashPasswordMD5(password);
    
    console.log(`🔐 Senha hashada em MD5: ${hashedPassword}`);
    
    // ========================================================================
    // INSERIR NOVA CONTA - COMPATÍVEL COM SEASON 19
    // ========================================================================
    
    if (isSeason19) {
      // ========================================================================
      // SEASON 19: Estrutura simplificada
      // ========================================================================
      insertSql = `
        INSERT INTO ${tables.accounts} 
        (account, password, email, created_at, blocked, vip_level, cash_credits)
        VALUES (?, ?, ?, NOW(), 0, 0, 0)
      `;
      
      insertParams = [
        cleanUsername,     // account
        hashedPassword,    // password (MD5)
        email             // email
      ];
      
    } else {
      // ========================================================================
      // SEASON 6: Estrutura complexa (memb___id, memb__pwd, etc.)
      // ========================================================================
      const currentDate = formatDateForMySQL();
      
      insertSql = `
        INSERT INTO ${tables.accounts} 
        (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, 
         addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, fpas_answ, 
         job__code, appl_days, modi_days, out__days, true_days, mail_chek, 
         bloc_code, ctl1_code, AccountLevel, AccountExpireDate, CashCredits)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      insertParams = [
        cleanUsername,                    // memb___id
        hashedPassword,                   // memb__pwd (MD5)
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
      ];
    }
    
    // ========================================================================
    // EXECUTAR INSERT
    // ========================================================================
    
    console.log(`💾 Inserindo conta no banco: ${cleanUsername}`);
    const insertResult = await executeQuery(insertSql, insertParams);
    
    if (!insertResult.success) {
      console.error('❌ Erro ao inserir conta:', insertResult.error);
      return errorResponse(res, 'Erro ao criar conta', 500);
    }
    
    console.log(`✅ Conta criada com sucesso: ${cleanUsername}`);
    
    // ========================================================================
    // GERAR TOKEN JWT
    // ========================================================================
    
    const token = generateToken({
      accountId: cleanUsername,
      email: email,
      isAdmin: false
    });
    
    console.log(`✅ Registro completo: ${cleanUsername}\n`);
    
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
      user: {
        username: req.user.accountId,
        accountId: req.user.accountId,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      }
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