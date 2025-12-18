// Rotas de Autenticação - MU Online
import express from 'express';
import db from '../config/database.js';
import crypto from 'crypto';

const router = express.Router();

// Função para hash de senha (ajustar conforme o MU Online usa)
// MU Online geralmente usa MD5 ou SHA256
function hashPassword(password) {
  // Ajuste conforme seu servidor MU Online
  // Alguns usam MD5, outros SHA256, outros SHA1
  return crypto.createHash('md5').update(password).digest('hex').toUpperCase();
}

// POST /api/auth/login - Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e password são obrigatórios'
      });
    }

    // Hash da senha (ajustar conforme seu MU)
    const hashedPassword = hashPassword(password);

    // Buscar usuário na tabela MEMB_INFO
    const [users] = await db.query(
      `SELECT 
        memb___id as username,
        memb_name as name,
        mail_addr as email,
        bloc_code as blocked,
        ctl1_code as adminLevel,
        AccountLevel as accountLevel
      FROM MEMB_INFO 
      WHERE memb___id = ? AND memb__pwd = ?`,
      [username, hashedPassword]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha incorretos'
      });
    }

    const user = users[0];

    // Verificar se a conta está bloqueada
    if (user.blocked === 1) {
      return res.status(403).json({
        success: false,
        message: 'Conta bloqueada. Entre em contato com o suporte.'
      });
    }

    // Verificar privilégios de admin
    // Ajustar conforme a estrutura do seu banco
    // Alguns servidores usam ctl1_code >= 8 para admin
    // Outros usam AccountLevel >= 2
    const isAdmin = user.adminLevel >= 8 || user.accountLevel >= 2;

    // Buscar personagens do usuário
    const [characters] = await db.query(
      `SELECT 
        Name as name,
        cLevel as level,
        Class as class,
        resets,
        Money as zen
      FROM Character 
      WHERE AccountID = ?
      ORDER BY cLevel DESC`,
      [username]
    );

    // Retornar dados do usuário
    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
          isAdmin: isAdmin,
          adminLevel: user.adminLevel || 0,
          accountLevel: user.accountLevel || 0
        },
        characters: characters,
        // Token simples (em produção use JWT)
        token: Buffer.from(`${username}:${Date.now()}`).toString('base64')
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar login',
      error: error.message
    });
  }
});

// POST /api/auth/register - Registro de nova conta
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Validações
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password e email são obrigatórios'
      });
    }

    // Verificar se username já existe
    const [existingUser] = await db.query(
      'SELECT memb___id FROM MEMB_INFO WHERE memb___id = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username já está em uso'
      });
    }

    // Hash da senha
    const hashedPassword = hashPassword(password);

    // Inserir nova conta
    await db.query(
      `INSERT INTO MEMB_INFO 
      (memb___id, memb__pwd, memb_name, mail_addr, bloc_code, ctl1_code, AccountLevel) 
      VALUES (?, ?, ?, ?, 0, 0, 0)`,
      [username, hashedPassword, name || username, email]
    );

    res.json({
      success: true,
      message: 'Conta criada com sucesso!',
      data: {
        username: username
      }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conta',
      error: error.message
    });
  }
});

// GET /api/auth/verify - Verificar se usuário é admin
router.get('/verify', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório'
      });
    }

    // Buscar dados do usuário
    const [users] = await db.query(
      `SELECT 
        ctl1_code as adminLevel,
        AccountLevel as accountLevel,
        bloc_code as blocked
      FROM MEMB_INFO 
      WHERE memb___id = ?`,
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = users[0];
    const isAdmin = user.adminLevel >= 8 || user.accountLevel >= 2;

    res.json({
      success: true,
      data: {
        isAdmin: isAdmin,
        adminLevel: user.adminLevel || 0,
        accountLevel: user.accountLevel || 0,
        blocked: user.blocked === 1
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar privilégios',
      error: error.message
    });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

export default router;
