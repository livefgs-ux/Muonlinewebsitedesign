// Rotas de autenticação seguras (Login, Registro, Logout)
import express from "express";
import cookieParser from "cookie-parser";
import pool from "../config/database.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { generateToken, verifyToken } from "../middleware/auth.js";
import { validateInput } from "../middleware/security.js";

const router = express.Router();
router.use(cookieParser());

// ===== REGISTRO DE NOVA CONTA =====
router.post("/register", async (req, res) => {
  try {
    let { username, password, email } = req.body;

    // Decodifica os valores que foram escapados pelo middleware de segurança
    username = username?.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
    password = password?.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
    email = email?.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');

    // Validações de entrada
    if (!username || !password || !email) {
      return res.status(400).json({ 
        success: false,
        error: "Campos obrigatórios: username, password e email." 
      });
    }

    // Valida username
    const usernameValidation = validateInput(username, 'username');
    if (!usernameValidation.valid) {
      return res.status(400).json({ 
        success: false,
        error: usernameValidation.error 
      });
    }

    // Valida senha
    const passwordValidation = validateInput(password, 'password');
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false,
        error: passwordValidation.error 
      });
    }

    // Valida email
    const emailValidation = validateInput(email, 'email');
    if (!emailValidation.valid) {
      return res.status(400).json({ 
        success: false,
        error: emailValidation.error 
      });
    }

    // Verifica se username já existe
    const [existingUser] = await pool.query(
      "SELECT memb___id FROM MEMB_INFO WHERE memb___id = ?", 
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: "Este username já está em uso. Escolha outro." 
      });
    }

    // Verifica se email já existe
    const [existingEmail] = await pool.query(
      "SELECT mail_addr FROM MEMB_INFO WHERE mail_addr = ?", 
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: "Este email já está cadastrado." 
      });
    }

    // Gera hash seguro da senha
    const hashedPassword = await hashPassword(password);

    // Insere nova conta no banco de dados
    await pool.query(
      `INSERT INTO MEMB_INFO 
       (memb___id, memb__pwd, memb_name, mail_addr, bloc_code, ctl1_code) 
       VALUES (?, ?, ?, ?, 0, 0)`,
      [username, hashedPassword, username, email]
    );

    console.log(`✅ Nova conta criada: ${username} (${email})`);

    res.json({ 
      success: true, 
      message: "Conta registrada com sucesso! Você já pode fazer login." 
    });

  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao criar conta. Tente novamente." 
    });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    // Decodifica valores escapados
    username = username?.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
    password = password?.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Username e senha são obrigatórios." 
      });
    }

    // Busca dados do usuário no banco
    const [rows] = await pool.query(
      `SELECT memb___id, memb__pwd, mail_addr, bloc_code, ctl1_code 
       FROM MEMB_INFO 
       WHERE memb___id = ?`,
      [username]
    );

    if (rows.length === 0) {
      // Retorna mensagem genérica para não revelar se usuário existe
      return res.status(401).json({ 
        success: false,
        error: "Username ou senha incorretos." 
      });
    }

    const user = rows[0];

    // Verifica se conta está bloqueada
    if (user.bloc_code === 1) {
      return res.status(403).json({ 
        success: false,
        error: "Conta bloqueada. Entre em contato com a administração." 
      });
    }

    // Verifica a senha
    const isPasswordValid = await verifyPassword(password, user.memb__pwd);

    if (!isPasswordValid) {
      console.warn(`❌ Tentativa de login falha - User: ${username}, IP: ${req.ip}`);
      return res.status(401).json({ 
        success: false,
        error: "Username ou senha incorretos." 
      });
    }

    // Captura IP e User-Agent para segurança
    const ip = req.ip || req.connection.remoteAddress;
    const ua = req.headers["user-agent"] || '';

    // Determina role do usuário (admin_role no MU pode ser diferente dependendo do servidor)
    const role = user.ctl1_code >= 1 ? 'admin' : 'user';

    // Gera token JWT
    const token = generateToken({
      username: user.memb___id,
      accountId: user.memb___id, // Pode usar memb_guid se disponível
      role: role,
      ip: ip,
      ua: ua
    });

    // Define cookie seguro com o token
    res.cookie("token", token, {
      httpOnly: true, // Não acessível via JavaScript (previne XSS)
      sameSite: "strict", // Previne CSRF
      secure: process.env.SSL_ENABLED === "true", // Apenas HTTPS em produção
      maxAge: 12 * 60 * 60 * 1000, // 12 horas
    });

    console.log(`✅ Login bem-sucedido - User: ${username}, IP: ${ip}, Role: ${role}`);

    res.json({ 
      success: true, 
      message: "Login efetuado com sucesso!",
      user: {
        username: user.memb___id,
        email: user.mail_addr,
        role: role
      }
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao efetuar login. Tente novamente." 
    });
  }
});

// ===== LOGOUT =====
router.post("/logout", (req, res) => {
  try {
    // Remove o cookie do token
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.SSL_ENABLED === "true"
    });

    console.log(`🔒 Logout efetuado - IP: ${req.ip}`);

    res.json({ 
      success: true, 
      message: "Logout efetuado com sucesso." 
    });

  } catch (err) {
    console.error("Erro no logout:", err);
    res.status(500).json({ 
      success: false,
      error: "Erro ao efetuar logout." 
    });
  }
});

// ===== VERIFICAR SESSÃO =====
// Rota protegida que verifica se o usuário está autenticado
router.get("/verify", verifyToken, async (req, res) => {
  try {
    // Se passou pelo middleware verifyToken, o usuário está autenticado
    const username = req.user.username;

    // Busca dados atualizados do usuário
    const [rows] = await pool.query(
      `SELECT memb___id, mail_addr, bloc_code, ctl1_code 
       FROM MEMB_INFO 
       WHERE memb___id = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Usuário não encontrado." 
      });
    }

    const user = rows[0];

    // Verifica se conta foi bloqueada após o login
    if (user.bloc_code === 1) {
      res.clearCookie("token");
      return res.status(403).json({ 
        success: false,
        error: "Conta bloqueada." 
      });
    }

    const role = user.ctl1_code >= 1 ? 'admin' : 'user';

    res.json({ 
      success: true,
      authenticated: true,
      user: {
        username: user.memb___id,
        email: user.mail_addr,
        role: role
      }
    });

  } catch (err) {
    console.error("Erro ao verificar sessão:", err);
    res.status(500).json({ 
      success: false,
      error: "Erro ao verificar autenticação." 
    });
  }
});

export default router;
