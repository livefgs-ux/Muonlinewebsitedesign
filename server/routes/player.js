// Rotas do painel do jogador (protegidas por autenticação)
import express from "express";
import pool from "../config/database.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ===== MIDDLEWARE: Todas as rotas deste arquivo requerem autenticação =====
router.use(verifyToken);

// ===== LISTAR PERSONAGENS DA CONTA =====
router.get("/characters", async (req, res) => {
  try {
    const username = req.user.username;

    const [characters] = await pool.query(
      `SELECT 
        Name,
        cLevel,
        Class,
        Experience,
        LevelUpPoint,
        Strength,
        Dexterity,
        Vitality,
        Energy,
        Leadership,
        Resets,
        MasterResets,
        Money,
        PkLevel,
        CtlCode
      FROM Character
      WHERE AccountID = ?
      ORDER BY cLevel DESC`,
      [username]
    );

    // Mapeia classes do MU Online
    const classNames = {
      0: 'Dark Wizard', 1: 'Soul Master', 2: 'Grand Master',
      16: 'Dark Knight', 17: 'Blade Knight', 18: 'Blade Master',
      32: 'Fairy Elf', 33: 'Muse Elf', 34: 'High Elf',
      48: 'Magic Gladiator', 50: 'Duel Master',
      64: 'Dark Lord', 66: 'Lord Emperor',
      80: 'Summoner', 81: 'Bloody Summoner', 82: 'Dimension Master',
      96: 'Rage Fighter', 98: 'Fist Master',
      112: 'Grow Lancer', 114: 'Mirage Lancer'
    };

    // Formata dados dos personagens
    const formattedCharacters = characters.map(char => ({
      name: char.Name,
      level: char.cLevel,
      class: classNames[char.Class] || 'Unknown',
      classCode: char.Class,
      experience: char.Experience,
      pointsAvailable: char.LevelUpPoint,
      stats: {
        strength: char.Strength,
        dexterity: char.Dexterity,
        vitality: char.Vitality,
        energy: char.Energy,
        leadership: char.Leadership || 0
      },
      resets: char.Resets || 0,
      masterResets: char.MasterResets || 0,
      zen: char.Money || 0,
      pkLevel: char.PkLevel || 0,
      status: char.CtlCode === 1 ? 'online' : 'offline'
    }));

    res.json({
      success: true,
      account: username,
      characters: formattedCharacters,
      totalCharacters: formattedCharacters.length
    });

  } catch (err) {
    console.error("Erro ao buscar personagens:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar personagens."
    });
  }
});

// ===== BUSCAR DADOS DE UM PERSONAGEM ESPECÍFICO =====
router.get("/character/:name", async (req, res) => {
  try {
    const username = req.user.username;
    const characterName = req.params.name;

    const [rows] = await pool.query(
      `SELECT 
        Name, cLevel, Class, Experience, LevelUpPoint,
        Strength, Dexterity, Vitality, Energy, Leadership,
        Resets, MasterResets, Money, PkLevel, CtlCode,
        MasterLevel, MasterPoint
      FROM Character
      WHERE AccountID = ? AND Name = ?`,
      [username, characterName]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Personagem não encontrado ou não pertence a esta conta."
      });
    }

    const char = rows[0];

    res.json({
      success: true,
      character: {
        name: char.Name,
        level: char.cLevel,
        masterLevel: char.MasterLevel || 0,
        class: char.Class,
        experience: char.Experience,
        pointsAvailable: char.LevelUpPoint,
        masterPoints: char.MasterPoint || 0,
        stats: {
          strength: char.Strength,
          dexterity: char.Dexterity,
          vitality: char.Vitality,
          energy: char.Energy,
          leadership: char.Leadership || 0
        },
        resets: char.Resets || 0,
        masterResets: char.MasterResets || 0,
        zen: char.Money || 0,
        pkLevel: char.PkLevel || 0,
        status: char.CtlCode === 1 ? 'online' : 'offline'
      }
    });

  } catch (err) {
    console.error("Erro ao buscar personagem:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar dados do personagem."
    });
  }
});

// ===== DISTRIBUIR PONTOS DE ATRIBUTO =====
router.post("/character/:name/add-stats", async (req, res) => {
  try {
    const username = req.user.username;
    const characterName = req.params.name;
    const { strength, dexterity, vitality, energy, leadership } = req.body;

    // Calcula total de pontos sendo adicionados
    const totalPoints = (strength || 0) + (dexterity || 0) + (vitality || 0) + 
                       (energy || 0) + (leadership || 0);

    if (totalPoints <= 0) {
      return res.status(400).json({
        success: false,
        error: "Você precisa distribuir pelo menos 1 ponto."
      });
    }

    // Busca personagem e verifica pontos disponíveis
    const [rows] = await pool.query(
      `SELECT LevelUpPoint, CtlCode 
       FROM Character 
       WHERE AccountID = ? AND Name = ?`,
      [username, characterName]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Personagem não encontrado."
      });
    }

    const char = rows[0];

    // Verifica se personagem está offline (não pode distribuir pontos online)
    if (char.CtlCode === 1) {
      return res.status(403).json({
        success: false,
        error: "Você não pode distribuir pontos enquanto o personagem está online."
      });
    }

    // Verifica se tem pontos suficientes
    if (char.LevelUpPoint < totalPoints) {
      return res.status(400).json({
        success: false,
        error: `Pontos insuficientes. Você tem ${char.LevelUpPoint} pontos disponíveis.`
      });
    }

    // Atualiza os atributos
    await pool.query(
      `UPDATE Character 
       SET Strength = Strength + ?,
           Dexterity = Dexterity + ?,
           Vitality = Vitality + ?,
           Energy = Energy + ?,
           Leadership = Leadership + ?,
           LevelUpPoint = LevelUpPoint - ?
       WHERE AccountID = ? AND Name = ?`,
      [
        strength || 0,
        dexterity || 0,
        vitality || 0,
        energy || 0,
        leadership || 0,
        totalPoints,
        username,
        characterName
      ]
    );

    console.log(`📊 Pontos distribuídos - Char: ${characterName}, Account: ${username}, Total: ${totalPoints}`);

    res.json({
      success: true,
      message: `${totalPoints} ponto(s) distribuído(s) com sucesso!`,
      pointsAdded: {
        strength: strength || 0,
        dexterity: dexterity || 0,
        vitality: vitality || 0,
        energy: energy || 0,
        leadership: leadership || 0
      }
    });

  } catch (err) {
    console.error("Erro ao adicionar pontos:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao distribuir pontos."
    });
  }
});

// ===== SISTEMA DE RESET =====
router.post("/character/:name/reset", async (req, res) => {
  try {
    const username = req.user.username;
    const characterName = req.params.name;

    // Configurações do sistema de reset (ajuste conforme seu servidor)
    const RESET_MIN_LEVEL = 400; // Nível mínimo para fazer reset
    const RESET_ZEN_COST = 10000000; // Custo em zen
    const RESET_POINTS_REWARD = 500; // Pontos ganhos por reset

    // Busca dados do personagem
    const [rows] = await pool.query(
      `SELECT cLevel, Money, Resets, CtlCode 
       FROM Character 
       WHERE AccountID = ? AND Name = ?`,
      [username, characterName]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Personagem não encontrado."
      });
    }

    const char = rows[0];

    // Verificações
    if (char.CtlCode === 1) {
      return res.status(403).json({
        success: false,
        error: "Você não pode fazer reset enquanto o personagem está online."
      });
    }

    if (char.cLevel < RESET_MIN_LEVEL) {
      return res.status(400).json({
        success: false,
        error: `Nível insuficiente. Você precisa estar no nível ${RESET_MIN_LEVEL} ou superior.`,
        required: RESET_MIN_LEVEL,
        current: char.cLevel
      });
    }

    if (char.Money < RESET_ZEN_COST) {
      return res.status(400).json({
        success: false,
        error: `Zen insuficiente. Você precisa de ${RESET_ZEN_COST.toLocaleString()} zen.`,
        required: RESET_ZEN_COST,
        current: char.Money
      });
    }

    // Executa o reset
    await pool.query(
      `UPDATE Character 
       SET cLevel = 1,
           Experience = 0,
           LevelUpPoint = LevelUpPoint + ?,
           Money = Money - ?,
           Resets = Resets + 1
       WHERE AccountID = ? AND Name = ?`,
      [RESET_POINTS_REWARD, RESET_ZEN_COST, username, characterName]
    );

    const newResetCount = (char.Resets || 0) + 1;

    console.log(`🔄 Reset realizado - Char: ${characterName}, Account: ${username}, Total Resets: ${newResetCount}`);

    res.json({
      success: true,
      message: "Reset realizado com sucesso!",
      reset: {
        newLevel: 1,
        totalResets: newResetCount,
        pointsEarned: RESET_POINTS_REWARD,
        zenSpent: RESET_ZEN_COST
      }
    });

  } catch (err) {
    console.error("Erro ao fazer reset:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao processar reset."
    });
  }
});

// ===== INFORMAÇÕES DA CONTA =====
router.get("/account-info", async (req, res) => {
  try {
    const username = req.user.username;

    const [accountInfo] = await pool.query(
      `SELECT memb___id, mail_addr, bloc_code, ctl1_code 
       FROM MEMB_INFO 
       WHERE memb___id = ?`,
      [username]
    );

    if (accountInfo.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Conta não encontrada."
      });
    }

    const account = accountInfo[0];

    res.json({
      success: true,
      account: {
        username: account.memb___id,
        email: account.mail_addr,
        status: account.bloc_code === 0 ? 'active' : 'blocked',
        role: account.ctl1_code >= 1 ? 'admin' : 'user'
      }
    });

  } catch (err) {
    console.error("Erro ao buscar informações da conta:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar informações da conta."
    });
  }
});

// ===== ESTATÍSTICAS DO JOGADOR =====
router.get("/stats", async (req, res) => {
  try {
    const username = req.user.username;

    // Mock data - futuramente buscar de tabelas reais
    const stats = {
      wcoin: 2150,
      goblinPoints: 800,
      zen: 15000000,
      vipLevel: 2,
      totalResets: 25,
      totalMasterResets: 3
    };

    res.json({
      success: true,
      stats
    });

  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar estatísticas."
    });
  }
});

// ===== HISTÓRICO DE ATIVIDADES =====
router.get("/activities", async (req, res) => {
  try {
    const username = req.user.username;
    const { limit = 20 } = req.query;

    // Mock data - futuramente buscar da tabela UserLogs
    const activities = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        action: 'Reset realizado no personagem SoulMageX',
        icon: '♻️',
        type: 'reset'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        action: '500 pontos adicionados',
        icon: '⚡',
        type: 'stats'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        action: 'Recebeu 1.000 WCoin por doação',
        icon: '💰',
        type: 'donation'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        action: 'Login efetuado com sucesso',
        icon: '✅',
        type: 'login'
      }
    ];

    res.json({
      success: true,
      activities: activities.slice(0, parseInt(limit)),
      total: activities.length
    });

  } catch (err) {
    console.error("Erro ao buscar atividades:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao carregar atividades."
    });
  }
});

export default router;