/**
 * Controller de Autenticação
 * ✅ SEASON 19 DV TEAMS - ESTRUTURA CORRETA
 */

const { executeQueryMU, executeQueryWEB } = require('../config/database');
const { tables, columns } = require('../config/auth');
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
    let sql = `SELECT account as username, password as pwd, guid, email, blocked 
               FROM ${tables.accounts} 
               WHERE account = ?`;
    
    let result = await executeQueryMU(sql, [username]);
    
    // Se não encontrou, tentar estrutura Season 6 (memb___id, memb__pwd)
    if (!result.success || result.data.length === 0) {
      console.log('🔄 Tentando estrutura Season 6 (memb___id)...');
      sql = `SELECT memb___id as username, memb__pwd as pwd, memb___id as guid, mail_addr as email, bloc_code as blocked 
             FROM ${tables.accounts} 
             WHERE memb___id = ?`;
      
      result = await executeQueryMU(sql, [username]);
    }
    
    if (!result.success || result.data.length === 0) {
      console.log(`❌ Usuário não encontrado: ${username}`);
      return errorResponse(res, 'Usuário ou senha incorretos', 401);
    }
    
    const account = result.data[0];
    console.log(`✅ Usuário encontrado: ${account.username}`);
    
    // ✅ SEGURANÇA: Logs sensíveis apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔑 GUID: ${account.guid}`);
      console.log(`🔑 Hash da senha no banco: ${account.pwd ? account.pwd.substring(0, 10) + '...' : 'VAZIO!'}`);
    }
    
    // Verificar se a conta está bloqueada
    // Season 6: bloc_code === '1', Season 19: blocked === 1
    const isBlocked = account.blocked === '1' || account.blocked === 1;
    if (isBlocked) {
      console.log(`🚫 Conta bloqueada: ${username}`);
      return errorResponse(res, 'Conta bloqueada. Entre em contato com o suporte.', 403);
    }
    
    // Comparar senha (passando GUID para testes com salt)
    const passwordMatch = await comparePassword(password, account.pwd, String(account.guid));
    
    if (!passwordMatch) {
      console.log(`❌ Senha incorreta para: ${username}`);
      
      // ✅ SEGURANÇA: Debug detalhado APENAS em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 DEBUG - Senha enviada (primeiros 3 chars): ${password.substring(0, 3)}...`);
        console.log(`🔍 DEBUG - Tamanho senha enviada: ${password.length}`);
        console.log(`🔍 DEBUG - Hash no banco: ${account.pwd}`);
        console.log(`🔍 DEBUG - Tamanho hash: ${account.pwd.length}`);
        
        // TESTE: Tentar MD5 manualmente
        const crypto = require('crypto');
        const testMD5 = crypto.createHash('md5').update(password).digest('hex');
        console.log(`🔍 DEBUG - MD5 da senha enviada: ${testMD5}`);
        console.log(`🔍 DEBUG - Hash no banco (lowercase): ${account.pwd.toLowerCase()}`);
        console.log(`🔍 DEBUG - Senhas coincidem (case insensitive)? ${testMD5.toLowerCase() === account.pwd.toLowerCase()}`);
        console.log(`🔍 DEBUG - Senhas coincidem (case sensitive)? ${testMD5 === account.pwd}`);
        
        // TESTE: Verificar se hash tem espaços ou caracteres estranhos
        const hashTrimmed = account.pwd.trim();
        console.log(`🔍 DEBUG - Hash sem espaços: ${hashTrimmed}`);
        console.log(`🔍 DEBUG - Hash mudou após trim? ${hashTrimmed !== account.pwd}`);
        console.log(`🔍 DEBUG - Coincidem após trim? ${testMD5.toLowerCase() === hashTrimmed.toLowerCase()}`);
      }
      
      return errorResponse(res, 'Usuário ou senha incorretos', 401);
    }
    
    console.log(`✅ Senha correta para: ${username}`);
    
    // ========================================================================
    // ⚠️ MIGRAÇÃO AUTOMÁTICA DESABILITADA!
    // ========================================================================
    // MOTIVO: MU Online Season 19 EXIGE SHA-256 no banco de dados.
    //         Se migrarmos para bcrypt, o JOGO não consegue validar a senha!
    // 
    // REGRA DE OURO: O site deve usar o MESMO algoritmo que o servidor do jogo.
    // 
    // ❌ NÃO MIGRAR: SHA-256 → bcrypt (quebra compatibilidade com o jogo)
    // ✅ MANTER: SHA-256 (site E jogo funcionam)
    // 
    // Se precisar de bcrypt no futuro, seria necessário:
    // 1) Modificar o servidor do jogo para aceitar bcrypt (impossível em Season 19)
    // 2) Usar dual-hash (site=bcrypt, jogo=SHA-256) - complexo demais
    // 3) Aceitar que SHA-256 é suficiente para jogos (padrão da indústria)
    // ========================================================================
    
    console.log(`🔐 Mantendo hash SHA-256 (compatibilidade com servidor MU)`);
    
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
    
    console.log(`\n📝 ========================================`);
    console.log(`📝 TENTATIVA DE REGISTRO`);
    console.log(`📝 ========================================`);
    console.log(`📝 Username: ${username}`);
    console.log(`📝 Email: ${email}`);
    console.log(`📝 Senha (tamanho): ${password ? password.length : 0} caracteres`);
    console.log(`📝 Personal ID: ${personalId || 'N/A'}`);
    
    // Validações básicas
    if (!username || !password || !email) {
      console.log(`❌ ERRO: Campos obrigatórios vazios`);
      console.log(`   Username: ${username ? 'OK' : 'VAZIO'}`);
      console.log(`   Password: ${password ? 'OK' : 'VAZIO'}`);
      console.log(`   Email: ${email ? 'OK' : 'VAZIO'}`);
      return errorResponse(res, 'Username, password e email são obrigatórios', 400);
    }
    
    // Sanitizar username
    const cleanUsername = sanitizeUsername(username);
    console.log(`✅ Username sanitizado: ${cleanUsername}`);
    
    // ========================================================================
    // DETECTAR ESTRUTURA DA TABELA (Season 6 vs Season 19)
    // ========================================================================
    
    console.log(`🔍 Detectando estrutura da tabela '${tables.accounts}'...`);
    
    // ✅ CORREÇÃO SQL INJECTION: Usar prepared statement
    const checkStructureSql = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = ?
      AND COLUMN_NAME IN ('account', 'memb___id')
      LIMIT 1
    `;
    
    const structureResult = await executeQueryMU(checkStructureSql, [tables.accounts]);
    const isSeason19 = structureResult.success && 
                       structureResult.data.length > 0 && 
                       structureResult.data[0].COLUMN_NAME === 'account';
    
    console.log(`📊 Estrutura detectada: ${isSeason19 ? 'Season 19 (account)' : 'Season 6 (memb___id)'}`);
    
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
    
    console.log(`🔍 Verificando se username já existe...`);
    const checkResult = await executeQueryMU(checkSql, [cleanUsername]);
    
    if (!checkResult.success) {
      console.error('❌ ERRO SQL ao verificar usuário:', checkResult.error);
      // ✅ MENSAGEM GENÉRICA (anti-enumeração)
      return errorResponse(res, 'Erro ao processar registro. Tente novamente.', 500);
    }
    
    if (checkResult.data.length > 0) {
      console.log(`⚠️  Username já existe: ${cleanUsername}`);
      // ✅ MENSAGEM GENÉRICA (anti-enumeração)
      return errorResponse(res, 'Erro ao criar conta. Verifique os dados e tente novamente.', 400);
    }
    
    console.log(`✅ Username disponível`);
    
    // ========================================================================
    // VERIFICAR SE EMAIL JÁ EXISTE
    // ========================================================================
    
    const emailColumn = isSeason19 ? 'email' : 'mail_addr';
    const checkEmailSql = `SELECT ${emailColumn} FROM ${tables.accounts} WHERE ${emailColumn} = ?`;
    
    console.log(`🔍 Verificando se email já existe...`);
    const checkEmailResult = await executeQueryMU(checkEmailSql, [email]);
    
    if (checkEmailResult.data.length > 0) {
      console.log(`⚠️  Email já cadastrado: ${email}`);
      // ✅ MENSAGEM GENÉRICA (anti-enumeração)
      return errorResponse(res, 'Erro ao criar conta. Verifique os dados e tente novamente.', 400);
    }
    
    console.log(`✅ Email disponível`);
    
    // ========================================================================
    // GERAR HASH DA SENHA (SHA-256 para MU Online Season 19)
    // ========================================================================
    
    // MU Online Season 19 usa SHA-256
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    console.log(`🔐 Senha hashada em SHA-256: ${hashedPassword}`);
    console.log(`🔐 Tamanho do hash: ${hashedPassword.length} caracteres (deve ser 64)`);
    
    // ========================================================================
    // INSERIR NOVA CONTA - COMPATÍVEL COM SEASON 19
    // ========================================================================
    
    if (isSeason19) {
      // ========================================================================
      // SEASON 19: APENAS CAMPOS ESSENCIAIS (Regra de Ouro)
      // ========================================================================
      // 🎯 REGRA DE OURO: Nunca adapte o banco para o código errado.
      //    Sempre adapte o código ao banco do servidor.
      // 
      // ✅ INSERIMOS APENAS: account, password, email
      // ❌ NÃO inserimos: blocked, vip_level, cash_credits, etc.
      // ❌ NÃO criamos personagem (character_info) - isso é feito no client!
      // ========================================================================
      
      console.log(`💾 Preparando INSERT para Season 19 (APENAS ESSENCIAIS)...`);
      
      // ✅ CORREÇÃO SQL INJECTION: Usar prepared statement para verificar colunas
      const checkColumnsSql = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
        AND COLUMN_NAME IN ('created_at', 'guid')
      `;
      
      const columnsResult = await executeQueryMU(checkColumnsSql, [tables.accounts]);
      const hasCreatedAt = columnsResult.data.some(row => row.COLUMN_NAME === 'created_at');
      const hasGuid = columnsResult.data.some(row => row.COLUMN_NAME === 'guid');
      
      console.log(`📊 Colunas detectadas: created_at=${hasCreatedAt}, guid=${hasGuid}`);
      
      // Montar INSERT apenas com colunas que SABEMOS que existem
      const columns = ['account', 'password', 'email'];
      const values = ['?', '?', '?'];
      const params = [cleanUsername, hashedPassword, email];
      
      if (hasCreatedAt) {
        columns.push('created_at');
        values.push('NOW()');
      }
      
      insertSql = `
        INSERT INTO ${tables.accounts} 
        (${columns.join(', ')})
        VALUES (${values.join(', ')})
      `;
      
      insertParams = params;
      
      console.log(`📝 INSERT SQL: ${insertSql}`);
      console.log(`📝 Parâmetros: [${cleanUsername}, ${hashedPassword.substring(0, 8)}..., ${email}]`);
      console.log(`✅ REGRA DE OURO: Inserindo APENAS campos essenciais (sem forçar colunas extras)`);
      
    } else {
      // ========================================================================
      // SEASON 6: Estrutura complexa (memb___id, memb__pwd, etc.)
      // ========================================================================
      console.log(`💾 Preparando INSERT para Season 6...`);
      
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
      
      console.log(`📝 INSERT SQL (Season 6 - 23 colunas)`);
    }
    
    // ========================================================================
    // EXECUTAR INSERT
    // ========================================================================
    
    console.log(`💾 Executando INSERT no banco...`);
    const insertResult = await executeQueryMU(insertSql, insertParams);
    
    if (!insertResult.success) {
      console.error('❌ ========================================');
      console.error('❌ ERRO SQL AO INSERIR CONTA');
      console.error('❌ ========================================');
      console.error('❌ Mensagem:', insertResult.error);
      console.error('❌ SQL:', insertSql);
      console.error('❌ ========================================');
      
      // Retornar mensagem de erro mais específica
      const errorMsg = insertResult.error?.message || insertResult.error || 'Erro desconhecido';
      return errorResponse(res, `Erro ao criar conta: ${errorMsg}`, 500);
    }
    
    console.log(`✅ Conta inserida no banco com sucesso!`);
    console.log(`✅ Insert ID: ${insertResult.data?.insertId || 'N/A'}`);
    
    // ========================================================================
    // GERAR TOKEN JWT
    // ========================================================================
    
    console.log(`🔑 Gerando token JWT...`);
    
    const token = generateToken({
      accountId: cleanUsername,
      email: email,
      isAdmin: false
    });
    
    console.log(`✅ Token gerado com sucesso`);
    console.log(`✅ ========================================`);
    console.log(`✅ REGISTRO COMPLETO: ${cleanUsername}`);
    console.log(`✅ ========================================\n`);
    
    return successResponse(res, {
      token,
      user: {
        username: cleanUsername,
        accountId: cleanUsername,
        email: email,
        isAdmin: false
      }
    }, 'Conta criada com sucesso', 201);
    
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ EXCEPTION NO REGISTRO');
    console.error('❌ ========================================');
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
    console.error('❌ ========================================\n');
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
    
    const result = await executeQueryMU(sql, [accountId]);
    
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