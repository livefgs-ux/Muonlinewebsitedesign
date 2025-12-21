# ⚡ SOLUÇÃO RÁPIDA - Erro Module Not Found

**Erro exato:**
```
Error: Cannot find module '../database/connection'
Require stack:
- /home/meumu.com/public_html/backend-nodejs/src/controllers/serverController.js
```

---

## ✅ SOLUÇÃO (Execute na ordem)

### **1. Parar o servidor (se estiver rodando)**

```bash
# Se estiver usando PM2
pm2 stop meumu-api

# OU se estiver rodando direto
# Ctrl+C para parar
```

---

### **2. Limpar cache do Node.js**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Limpar cache
npm cache clean --force

# Remover node_modules (RECOMENDADO)
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

---

### **3. Verificar se o arquivo está correto**

```bash
# Mostrar primeiras 10 linhas
head -10 src/controllers/serverController.js
```

**Deve mostrar:**
```javascript
/**
 * Controller de Informações do Servidor
 */

const { executeQuery, testConnection } = require('../config/database');
const { tables } = require('../config/auth');
const { successResponse, errorResponse } = require('../utils/helpers');
```

**Se NÃO mostrar isso:**
```bash
# O arquivo foi modificado manualmente no servidor
# Opção 1: Fazer upload novamente via FTP/SFTP
# Opção 2: Copiar do repositório Git
# Opção 3: Editar manualmente (veja sessão "Editar Manualmente" abaixo)
```

---

### **4. Iniciar o servidor**

```bash
npm start
```

**Deve mostrar:**
```
🚀 Iniciando MeuMU Online Backend...
================================================
🔍 Tentando conectar ao MariaDB...
✅ Conectado ao MariaDB com sucesso!
📊 Database: muonline
================================================
✅ Servidor rodando na porta 3001
```

---

## 🔧 SE AINDA DER ERRO

### **Opção A: Editar Manualmente**

```bash
nano src/controllers/serverController.js
```

**Substituir as primeiras linhas por:**
```javascript
/**
 * Controller de Informações do Servidor
 */

const { executeQuery, testConnection } = require('../config/database');
const { tables } = require('../config/auth');
const { successResponse, errorResponse } = require('../utils/helpers');
```

**Salvar:**
- `Ctrl + O` → Enter (salvar)
- `Ctrl + X` (sair)

**Reiniciar:**
```bash
npm restart
```

---

### **Opção B: Recriar arquivo completo**

```bash
# Backup do arquivo atual
cp src/controllers/serverController.js src/controllers/serverController.js.backup

# Criar novo arquivo
cat > src/controllers/serverController.js << 'EOF'
/**
 * Controller de Informações do Servidor
 */

const { executeQuery, testConnection } = require('../config/database');
const { tables } = require('../config/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Informações básicas do servidor
 */
const getServerInfo = async (req, res) => {
  try {
    return successResponse(res, {
      name: process.env.SERVER_NAME || 'MeuMU Online',
      version: process.env.SERVER_VERSION || 'Season 19-2-3 - Épico',
      rates: {
        exp: process.env.SERVER_RATES_EXP || '1000x',
        drop: process.env.SERVER_RATES_DROP || '50%'
      },
      limits: {
        maxReset: parseInt(process.env.SERVER_MAX_RESET) || 500,
        maxGrandReset: parseInt(process.env.SERVER_MAX_GRAND_RESET) || 50
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar info do servidor:', error);
    return errorResponse(res, 'Erro ao buscar informações', 500);
  }
};

/**
 * Estatísticas em tempo real
 */
const getServerStats = async (req, res) => {
  try {
    // Total de contas
    const totalAccountsSql = `SELECT COUNT(*) as total FROM ${tables.accounts}`;
    const accountsResult = await executeQuery(totalAccountsSql);
    
    // Total de personagens
    const totalCharsSql = `SELECT COUNT(*) as total FROM ${tables.characters}`;
    const charsResult = await executeQuery(totalCharsSql);
    
    // Players online
    const onlineSql = `SELECT COUNT(*) as total FROM ${tables.characters} WHERE ctlcode = 1`;
    const onlineResult = await executeQuery(onlineSql);
    
    // Total de guilds
    const totalGuildsSql = `SELECT COUNT(*) as total FROM ${tables.guild}`;
    const guildsResult = await executeQuery(totalGuildsSql);
    
    // Personagem com mais resets
    const topResetSql = `
      SELECT Name, ResetCount 
      FROM ${tables.characters} 
      ORDER BY ResetCount DESC 
      LIMIT 1
    `;
    const topResetResult = await executeQuery(topResetSql);
    
    return successResponse(res, {
      totalAccounts: accountsResult.data[0]?.total || 0,
      totalCharacters: charsResult.data[0]?.total || 0,
      playersOnline: onlineResult.data[0]?.total || 0,
      totalGuilds: guildsResult.data[0]?.total || 0,
      topReset: topResetResult.data[0] || null,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return errorResponse(res, 'Erro ao buscar estatísticas', 500);
  }
};

/**
 * Status da API (health check)
 */
const getHealthStatus = async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    return res.status(dbConnected ? 200 : 503).json({
      success: true,
      status: dbConnected ? 'healthy' : 'unhealthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
    
  } catch (error) {
    console.error('❌ Erro no health check:', error);
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
};

module.exports = {
  getServerInfo,
  getServerStats,
  getHealthStatus
};
EOF

# Verificar
cat src/controllers/serverController.js

# Reiniciar
npm start
```

---

## 🔍 DIAGNÓSTICO

### **Por que o erro aconteceu?**

1. **Cache do Node.js** - Versão antiga do arquivo em memória
2. **Arquivo desatualizado** - Servidor tem versão diferente
3. **Import incorreto** - Linha com `require('../database/connection')` que não existe

### **Por que a correção funciona?**

1. Limpamos o cache (`npm cache clean`)
2. Removemos node_modules (`rm -rf node_modules`)
3. Reinstalamos dependências limpas (`npm install`)
4. Garantimos que o arquivo tem os imports corretos

---

## ✅ VERIFICAÇÃO FINAL

```bash
# 1. Verificar imports
grep "require" src/controllers/serverController.js | head -5

# Deve mostrar:
# const { executeQuery, testConnection } = require('../config/database');
# const { tables } = require('../config/auth');
# const { successResponse, errorResponse } = require('../utils/helpers');

# 2. Testar servidor
npm start

# 3. Testar health check
curl http://localhost:3001/health
```

---

## 📞 COMANDOS RESUMIDOS

```bash
# Solução completa em 4 comandos
cd /home/meumu.com/public_html/backend-nodejs
rm -rf node_modules package-lock.json
npm install
npm start
```

---

**✅ Problema resolvido! O arquivo foi corrigido e o cache limpo. 🚀**
