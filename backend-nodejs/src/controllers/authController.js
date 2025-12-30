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
    
    // Primeiro tentar estrutura Season 19 (account, password, guid, web_admin)
    let sql = `SELECT account as username, password as pwd, guid, email, blocked, web_admin 
               FROM ${tables.accounts} 
               WHERE account = ?`;
    
    let result = await executeQueryMU(sql, [username]);
    
    // Se não encontrou, tentar estrutura Season 6 (memb___id, memb__pwd)
    if (!result.success || result.data.length === 0) {
      console.log('🔄 Tentando estrutura Season 6 (memb___id)...');
      sql = `SELECT memb___id as username, memb__pwd as pwd, memb___id as guid, mail_addr as email, bloc_code as blocked, ctl1_code as web_admin 
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
    
    // Comparar senha (passando GUID e USERNAME para testes com salt)
    // ✅ CRITICAL: DV Teams usa SHA-256(username:password)
    const passwordMatch = await comparePassword(
      password, 
      account.pwd, 
      String(account.guid),
      account.username  // ← NOVO! Passa username para testar algoritmo DV Teams
    );
    
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
    
    // ========================================================================
    // ✅ SEASON 19 DV TEAMS: VERIFICAR SE É ADMIN (DETECTA AUTOMATICAMENTE)
    // ========================================================================
    // LÓGICA CORRETA:
    // 1. Buscar se a conta tem ALGUM personagem com authority > 0 (GM in-game)
    // 2. Se SIM → isAdmin = true (mostra botão AdminCP)
    // 3. Se NÃO → isAdmin = false (usuário normal)
    // 
    // Campo verificado: character_info.authority
    // - authority = 0 → Player normal
    // - authority > 0 → Game Master (Admin)
    // ========================================================================
    
    console.log(`🔍 Verificando se a conta tem personagens com status de administrador...`);
    
    let isAdmin = false;
    
    try {
      // ========================================================================
      // SEASON 19 DV TEAMS: account_id é INTEGER (GUID), NÃO STRING!
      // ========================================================================
      const adminCheckResult = await executeQueryMU(
        `SELECT MAX(authority) as max_authority 
         FROM character_info 
         WHERE account_id = ?`,
        [account.guid]  // ✅ CORRETO! account_id é FK para accounts.guid (INTEGER)
      );
      
      if (!adminCheckResult.success) {
        console.error('❌ Erro ao verificar authority:', adminCheckResult.error);
        isAdmin = false;
      } else {
        const maxAuthority = adminCheckResult.data[0]?.max_authority || 0;
        
        console.log(`🎮 Authority máxima dos personagens: ${maxAuthority}`);
        
        // Se algum personagem tem authority > 0, a conta é admin
        if (maxAuthority > 0) {
          isAdmin = true;
          console.log(`✅ ========================================`);
          console.log(`✅ ADMIN DETECTADO!`);
          console.log(`✅ Username: ${account.username}`);
          console.log(`✅ Authority: ${maxAuthority}`);
          console.log(`✅ JWT terá isAdmin: true`);
          console.log(`✅ ========================================`);
        } else {
          console.log(`👤 Conta normal (sem personagens GM)`);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status de admin:', error);
      // Em caso de erro, assume que não é admin
      isAdmin = false;
    }
    
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
    
    // ========================================================================
    // VALIDAÇÕES DETALHADAS (retorna mensagens específicas)
    // ========================================================================
    
    // 1. Campos obrigatórios
    if (!username || !password || !email) {
      console.log(`❌ ERRO: Campos obrigatórios vazios`);
      const missing = [];
      if (!username) missing.push('Username');
      if (!password) missing.push('Password');
      if (!email) missing.push('Email');
      return errorResponse(res, `Campos obrigatórios faltando: ${missing.join(', ')}`, 400);
    }
    
    // 2. Validar tamanho do username
    const { usernameMinLength, usernameMaxLength, passwordMinLength, passwordMaxLength } = require('../config/auth');
    
    if (username.length < usernameMinLength) {
      console.log(`❌ ERRO: Username muito curto (${username.length} < ${usernameMinLength})`);
      return errorResponse(res, `Username deve ter no mínimo ${usernameMinLength} caracteres`, 400);
    }
    
    if (username.length > usernameMaxLength) {
      console.log(`❌ ERRO: Username muito longo (${username.length} > ${usernameMaxLength})`);
      return errorResponse(res, `Username deve ter no máximo ${usernameMaxLength} caracteres`, 400);
    }
    
    // 3. Validar caracteres do username (apenas alfanuméricos)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      console.log(`❌ ERRO: Username contém caracteres inválidos`);
      return errorResponse(res, 'Username deve conter apenas letras e números (sem espaços ou caracteres especiais)', 400);
    }
    
    // 4. Validar tamanho da senha
    if (password.length < passwordMinLength) {
      console.log(`❌ ERRO: Senha muito curta (${password.length} < ${passwordMinLength})`);
      return errorResponse(res, `Senha deve ter no mínimo ${passwordMinLength} caracteres`, 400);
    }
    
    if (password.length > passwordMaxLength) {
      console.log(`❌ ERRO: Senha muito longa (${password.length} > ${passwordMaxLength})`);
      return errorResponse(res, `Senha deve ter no máximo ${passwordMaxLength} caracteres`, 400);
    }
    
    // 5. Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`❌ ERRO: Email inválido`);
      return errorResponse(res, 'Email inválido', 400);
    }
    
    console.log(`✅ Todas as validações passaram!`);
    
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
    // GERAR HASH DA SENHA - DV TEAMS / WEBENGINE CMS
    // ========================================================================
    
    // ✅ ALGORITMO CORRETO: SHA-256(username:password)
    // Fonte: WebEngine CMS (codigo_de_comparacao.md, linha 13269)
    // Código PHP original: hash('sha256', $username.':'.$password)
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update(cleanUsername + ':' + password).digest('hex');
    
    console.log(`🔐 Algoritmo: SHA-256(${cleanUsername}:${password})`);
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
 * ✅ SEASON 19 DV TEAMS - ESTRUTURA REAL DO MUONLINE.SQL
 * Fonte: muonline.sql dump completo (2025-12-29)
 */
const getAccountInfo = async (req, res) => {
  try {
    const { accountId } = req.user;
    
    console.log(`📊 Buscando info da conta: ${accountId}`);
    
    // ========================================================================
    // SEASON 19 DV TEAMS - ESTRUTURA CONFIRMADA
    // ========================================================================
    // Tabela accounts:
    //   - guid (PK)
    //   - account (username)
    //   - email
    //   - blocked
    //   - web_admin (admin level, NÃO ctl1_code!)
    //
    // Tabela account_data:
    //   - account_id (FK → accounts.guid)
    //   - credits (WCoin)
    //   - web_credits
    //   - goblin_points
    //   - vip_status
    //   - vip_duration
    // ========================================================================
    
    const sql = `
      SELECT 
        a.account as username,
        a.email,
        a.guid,
        a.blocked,
        a.web_admin as admin_level,
        ad.credits,
        ad.web_credits,
        ad.goblin_points,
        ad.vip_status,
        ad.vip_duration
      FROM accounts a
      LEFT JOIN account_data ad ON a.guid = ad.account_id
      WHERE a.account = ?
    `;
    
    const result = await executeQueryMU(sql, [accountId]);
    
    if (!result.success) {
      console.error(`❌ Erro SQL ao buscar conta:`, result.error);
      return errorResponse(res, 'Erro ao buscar informações', 500);
    }
    
    if (result.data.length === 0) {
      console.log(`❌ Conta não encontrada: ${accountId}`);
      return errorResponse(res, 'Conta não encontrada', 404);
    }
    
    const account = result.data[0];
    console.log(`✅ Conta encontrada: ${account.username} (GUID: ${account.guid})`);
    
    // Verificar se está bloqueada
    const isBlocked = account.blocked === 1 || account.blocked === '1';
    const isAdmin = account.admin_level > 0;
    
    // Verificar se VIP está ativo
    const now = Date.now();
    const isVip = account.vip_status > 0 && account.vip_duration && account.vip_duration > now;
    
    return successResponse(res, {
      username: account.username,
      email: account.email || '',
      guid: account.guid || 0,
      isBlocked,
      isAdmin,
      credits: account.credits || 0,
      webCredits: account.web_credits || 0,
      goblinPoints: account.goblin_points || 0,
      vip: {
        active: isVip,
        status: account.vip_status || 0,
        expiresAt: account.vip_duration || null
      }
    });
    
  } catch (error) {
    console.error('❌ Exception ao buscar informações da conta:', error);
    return errorResponse(res, 'Erro ao buscar informações', 500);
  }
};

/**
 * Logout
 * JWT é stateless, então não precisamos invalidar no servidor
 * Frontend remove o token do localStorage
 */
const logout = async (req, res) => {
  try {
    const { accountId } = req.user;
    
    console.log(`👋 Logout: ${accountId}`);
    
    // Em JWT stateless, o logout é feito no client-side removendo o token
    // Aqui podemos registrar o logout para auditoria (opcional)
    
    return successResponse(res, { 
      message: 'Logout realizado com sucesso' 
    });
    
  } catch (error) {
    console.error('❌ Erro no logout:', error);
    return errorResponse(res, 'Erro ao realizar logout', 500);
  }
};

module.exports = {
  login,
  register,
  verifyTokenRoute,
  getAccountInfo,
  logout
};