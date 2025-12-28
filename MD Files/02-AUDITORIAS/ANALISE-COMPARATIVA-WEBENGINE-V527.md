# 🔍 ANÁLISE COMPARATIVA - WEBENGINE CMS vs MEUMU ONLINE
**Versão:** 527  
**Data:** 2025-12-28  
**Objetivo:** Identificar diferenças arquiteturais e resolver problemas de autenticação

---

## 📊 **1. CONEXÃO AO BANCO DE DADOS**

### **WEBENGINE CMS (PHP - Connection.php)**
```php
class Connection {
    public static function Database($database='') {
        switch($database) {
            case 'MuOnline':
                $db = new dB(
                    self::_config('SQL_DB_HOST'), 
                    self::_config('SQL_DB_PORT'), 
                    self::_config('SQL_DB_NAME'),  // Nome do database
                    self::_config('SQL_DB_USER'), 
                    self::_config('SQL_DB_PASS')
                );
                return $db;
                
            case 'Me_MuOnline':  // Database secundário (WebEngine data)
                if(!self::_config('SQL_USE_2_DB')) {
                    return self::Database('MuOnline');  // Fallback
                }
                $db = new dB(
                    self::_config('SQL_DB_HOST'), 
                    self::_config('SQL_DB_PORT'), 
                    self::_config('SQL_DB_2_NAME'),  // Database diferente!
                    self::_config('SQL_DB_USER'), 
                    self::_config('SQL_DB_PASS')
                );
                return $db;
        }
    }
}
```

**✅ CARACTERÍSTICAS:**
- Usa **uma conexão para dois databases** (switch case)
- Connection reutilizável: `Connection::Database('MuOnline')`
- Fallback automático: Se `SQL_USE_2_DB` = false, usa apenas MuOnline
- **Configurações centralizadas** via função `webengineConfigs()`

---

### **NOSSO SISTEMA (Node.js - database.js)**
```javascript
// POOL MUONLINE (Database do Servidor MU)
const poolMU = mysql.createPool({
  host: process.env.DB_MU_HOST,
  port: process.env.DB_MU_PORT,
  database: process.env.DB_MU_NAME,  // 'muonline'
  // ...
});

// POOL MEUWEB (Database do Site)
const poolWEB = mysql.createPool({
  host: process.env.DB_WEB_HOST,
  port: process.env.DB_WEB_PORT,
  database: process.env.DB_WEB_NAME,  // 'meuweb'
  // ...
});
```

**✅ CARACTERÍSTICAS:**
- **Dois pools separados** (um para cada database)
- Conexões permanentes (connection pooling)
- Funções dedicadas: `executeQueryMU()` e `executeQueryWEB()`

---

### 🔍 **DIFERENÇA CRÍTICA #1: ESTRATÉGIA DE CONEXÃO**

| Aspecto | WebEngine CMS | Nosso Sistema |
|---------|---------------|---------------|
| **Conexões** | 1 conexão + switch database | 2 pools separados |
| **Vantagem** | Simples, centralizada | Performance (pools dedicados) |
| **Desvantagem** | Overhead ao trocar database | Mais complexo |
| **Risco** | Se conexão cair, perde tudo | Se um pool falhar, outro funciona |

**⚠️ PROBLEMA IDENTIFICADO:**
```javascript
// NOSSO CÓDIGO - Linha 109 (database.js)
const executeQueryMU = async (sql, params = []) => {
  try {
    const [rows] = await poolMU.execute(sql, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ Erro na query MU:', error.message);
    return { success: false, error: error.message };  // ⚠️ NÃO lança exceção!
  }
};
```

**✅ WEBENGINE FAZ DIFERENTE:**
```php
if($db->dead) {
    if(self::_config('error_reporting')) {
        throw new Exception($db->error);  // ✅ LANÇA exceção!
    }
    throw new Exception('Connection to database failed');
}
```

**🎯 PROBLEMA:** Nosso código **engole erros silenciosamente**!

---

## 🔐 **2. AUTENTICAÇÃO E LOGIN**

### **WEBENGINE CMS - Lógica de Login**

❌ **NÃO TEM CÓDIGO DE LOGIN NO ARQUIVO DE COMPARAÇÃO!**
- O código fornecido contém apenas:
  - AdminCP (bloquear IPs, configurações)
  - Rankings (atualizar cache)
  - Downloads (CRUD)
  - UserCP (menu do usuário)

**🔍 PRECISO DO CÓDIGO:**
- `/includes/classes/login.class.php` (ou similar)
- `/modules/login.php`
- Lógica de hash de senha

---

### **NOSSO SISTEMA - authController.js**

```javascript
// Login - Linha 20
const login = async (req, res) => {
  const { username, password } = req.body;
  
  // TENTA Season 19 (account, password, guid)
  let sql = `SELECT account, password, guid, email, blocked 
             FROM ${tables.accounts} 
             WHERE account = ?`;
  let result = await executeQuery(sql, [username]);
  
  // Se falhar, tenta Season 6 (memb___id, memb__pwd)
  if (!result.success || result.data.length === 0) {
    sql = `SELECT memb___id, memb__pwd, mail_addr 
           FROM ${tables.accounts} 
           WHERE memb___id = ?`;
    result = await executeQuery(sql, [username]);
  }
  
  // Comparar senha
  const passwordMatch = await comparePassword(
    password, 
    account.pwd, 
    String(account.guid)
  );
  
  // Gerar JWT token
  const token = generateToken({ accountId, email, isAdmin });
}
```

**✅ CARACTERÍSTICAS:**
- **Dual Season compatibility** (6 e 19)
- **SHA-256** para Season 19 (compatível com servidor MU)
- **JWT tokens** (stateless)
- **Logs detalhados** em desenvolvimento

---

### 🔍 **DIFERENÇA CRÍTICA #2: ESTRUTURA DA TABELA**

**NOSSO CÓDIGO ASSUME:**
- Season 19: `account`, `password`, `guid`, `email`, `blocked`
- Season 6: `memb___id`, `memb__pwd`, `mail_addr`, `bloc_code`

**⚠️ MAS E SE A TABELA FOR DIFERENTE?**

**🎯 PROBLEMA POTENCIAL:**
```javascript
// authController.js - Linha 31
let sql = `SELECT account as username, password as pwd, guid, email, blocked 
           FROM ${tables.accounts} 
           WHERE account = ?`;
```

**❌ SE A COLUNA `account` NÃO EXISTIR → ERRO SQL!**
**❌ SE A COLUNA `guid` NÃO EXISTIR → ERRO SQL!**

---

## 📊 **3. SISTEMA DE RANKINGS**

### **WEBENGINE CMS - Rankings Cron**
```php
// cron_master_rankings.php
$Rankings = new Rankings();
loadModuleConfigs('rankings');

if(mconfig('active')) {
    if(mconfig('rankings_enable_master')) {
        $Rankings->UpdateRankingCache('master');
    }
}

updateCronLastRun($file_name);
```

**✅ CARACTERÍSTICAS:**
- **Cache system** (atualiza via cron)
- **Configurações modulares** (XML configs)
- **UpdateRankingCache()** - atualiza dados pré-processados

---

### **NOSSO SISTEMA - rankingsController.js**

```javascript
const getTopPlayers = async (req, res) => {
  const sql = `
    SELECT Name, cLevel, Class, CtlCode, PkLevel, AccountID
    FROM Character
    ORDER BY cLevel DESC, Experience DESC
    LIMIT ?
  `;
  const result = await executeQueryMU(sql, [limit]);
  // ...
};
```

**✅ CARACTERÍSTICAS:**
- **Real-time queries** (sem cache)
- **Direto no banco** (Character table)

---

### 🔍 **DIFERENÇA CRÍTICA #3: CACHE vs REAL-TIME**

| Aspecto | WebEngine CMS | Nosso Sistema |
|---------|---------------|---------------|
| **Estratégia** | Cache (cron updates) | Real-time queries |
| **Performance** | ⚡ Rápido (serve cache) | 🐌 Mais lento (query a cada request) |
| **Atualização** | ⏰ Cron job (ex: 5 min) | 🔄 Sempre atualizado |
| **Carga no DB** | 🟢 Baixa | 🔴 Alta |

**🎯 RECOMENDAÇÃO:** Implementar cache no nosso sistema!

---

## 📥 **4. SISTEMA DE DOWNLOADS**

### **WEBENGINE CMS - Downloads**
```php
function getDownloadsList() {
    $db = config('SQL_USE_2_DB') 
        ? Connection::Database('Me_MuOnline')  // Database secundário
        : Connection::Database('MuOnline');     // Database primário
        
    $result = $db->query_fetch(
        "SELECT * FROM ".WEBENGINE_DOWNLOADS." 
         ORDER BY download_type ASC, download_id ASC"
    );
    return $result;
}

function addDownload($title, $description, $link, $size, $type) {
    // Validações
    if(!check_value($title)) return;
    if(strlen($title) > 100) return;
    
    // Insert
    $db->query("INSERT INTO ".WEBENGINE_DOWNLOADS."...");
    
    // Atualizar cache
    @updateDownloadsCache();
}

function updateDownloadsCache() {
    $downloadsData = $db->query_fetch(...);
    $cacheData = encodeCache($downloadsData);
    updateCacheFile('downloads.cache', $cacheData);
}
```

**✅ CARACTERÍSTICAS:**
- **Tabela própria** (`WEBENGINE_DOWNLOADS`)
- **Cache automático** após CRUD
- **Dual database aware** (usa database correto)

---

### **NOSSO SISTEMA**
❌ **AINDA NÃO IMPLEMENTADO** (deletamos na versão 527)

---

## 🔍 **5. PLAYERS ONLINE - CRITICAL!**

### **WEBENGINE CMS - Online Characters Cron**
```php
// cron_online_characters.php
$query = "SELECT `Name` 
          FROM `Character` 
          WHERE `ConnectStat` = 1";  // ✅ CAMPO CORRETO!

$onlineCharactersList = $mu->query_fetch($query);

// Remove duplicados
foreach($onlineCharactersList as $data) {
    if(in_array($data['Name'], $result)) continue;
    $result[] = $data['Name'];
}

// Salvar em cache
$cacheData = encodeCache($result);
updateCacheFile('online_characters.cache', $cacheData);
```

**✅ WEBENGINE USA:** `ConnectStat = 1` (campo padrão MU Online)

---

### **NOSSO SISTEMA - serverController.js**

❌ **PRECISO VERIFICAR O CÓDIGO!**

---

## 🚨 **6. PROBLEMAS IDENTIFICADOS NO NOSSO SISTEMA**

### **PROBLEMA #1: ERROS SILENCIOSOS**
```javascript
// database.js - executeQueryMU()
catch (error) {
    console.error('❌ Erro:', error.message);
    return { success: false, error: error.message };  // ⚠️ NÃO lança!
}
```

**🔧 SOLUÇÃO:**
```javascript
catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;  // ✅ Propagar exceção!
}
```

---

### **PROBLEMA #2: ESTRUTURA DA TABELA NÃO VERIFICADA**
```javascript
// authController.js - assume que coluna existe
let sql = `SELECT account, password, guid...`;  // ❌ E se não existir?
```

**🔧 SOLUÇÃO:**
```javascript
// ANTES de fazer query, verificar estrutura
const checkStructureSql = `
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = ? AND COLUMN_NAME = ?
`;
```

---

### **PROBLEMA #3: FALTA DE CACHE**
```javascript
// rankingsController.js - query direta
const sql = `SELECT ... FROM Character ORDER BY cLevel...`;
// ❌ Toda request faz query no banco!
```

**🔧 SOLUÇÃO:**
```javascript
// Implementar sistema de cache (Redis ou arquivo)
const cachedRankings = await getCache('rankings');
if (cachedRankings && !isExpired(cachedRankings)) {
    return cachedRankings;
}
// Senão, buscar do banco e cachear
```

---

### **PROBLEMA #4: CONNECTION POOLING INCORRETO?**

**WEBENGINE:**
- 1 conexão, troca database via `USE database_name`

**NÓS:**
- 2 pools separados (mais correto, mas...?)

**⚠️ PERGUNTA:** 
- As credenciais no `.env` estão CORRETAS?
- Os pools estão sendo inicializados ANTES das rotas?

---

## 📋 **7. CHECKLIST DE DIAGNÓSTICO**

### **A. VERIFICAR BANCO DE DADOS**

```sql
-- 1. Databases existem?
SHOW DATABASES;

-- 2. Estrutura da tabela MEMB_INFO (ou accounts)
DESCRIBE MEMB_INFO;
-- OU
DESCRIBE accounts;

-- 3. Usuário tem permissões?
SHOW GRANTS FOR 'usuario_web'@'localhost';

-- 4. Teste de conexão
SELECT 1;
```

---

### **B. VERIFICAR .ENV**

```bash
# Credenciais corretas?
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=usuario_web
DB_MU_PASSWORD=senha_correta  # ⚠️ SEM espaços!
DB_MU_NAME=muonline           # ⚠️ Case-sensitive no Linux!

DB_WEB_HOST=127.0.0.1
DB_WEB_NAME=meuweb            # ⚠️ Database existe?
```

---

### **C. VERIFICAR LOGS DO BACKEND**

```bash
# Ver logs em tempo real
cd /var/www/meumu/backend-nodejs
pm2 logs meumu-backend --lines 100

# Procurar por:
# - "❌ Erro ao conectar database"
# - "❌ Erro na query"
# - "Connection refused"
# - "Access denied"
```

---

### **D. TESTE MANUAL DE CONEXÃO**

```javascript
// test-connection.js
const mysql = require('mysql2/promise');

async function testDB() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'usuario_web',
      password: 'senha',
      database: 'muonline'
    });
    
    console.log('✅ Conectado!');
    
    const [rows] = await conn.execute('SELECT * FROM MEMB_INFO LIMIT 1');
    console.log('✅ Query OK:', rows);
    
    await conn.end();
  } catch (err) {
    console.error('❌ ERRO:', err.message);
  }
}

testDB();
```

```bash
node test-connection.js
```

---

## 🎯 **8. PLANO DE AÇÃO**

### **ETAPA 1: DIAGNÓSTICO**
1. ✅ Verificar se MariaDB está rodando
2. ✅ Verificar se databases existem
3. ✅ Verificar estrutura das tabelas
4. ✅ Verificar permissões do usuário
5. ✅ Verificar logs do backend

### **ETAPA 2: CORREÇÕES**
1. ❌ Corrigir tratamento de erros (lançar exceções)
2. ❌ Adicionar verificação de estrutura da tabela
3. ❌ Implementar cache de rankings
4. ❌ Validar credenciais do .env

### **ETAPA 3: TESTES**
1. ❌ Teste de conexão manual
2. ❌ Teste de login
3. ❌ Teste de registro
4. ❌ Teste de rankings

---

## 🔍 **9. PRÓXIMOS PASSOS**

**O QUE VOCÊ PRECISA FAZER AGORA:**

1. **Executar os comandos SQL de diagnóstico:**
```bash
mysql -u root -p
```
```sql
SHOW DATABASES;
DESCRIBE MEMB_INFO;  -- OU DESCRIBE accounts;
SHOW GRANTS FOR 'seu_usuario'@'localhost';
```

2. **Verificar arquivo .env:**
```bash
cat /var/www/meumu/backend-nodejs/.env
# Verificar: senhas, nomes de databases, portas
```

3. **Ver logs do backend:**
```bash
pm2 logs meumu-backend --lines 50
```

4. **Me informar:**
   - Qual mensagem de erro EXATA você vê?
   - O login retorna 401? 500? Timeout?
   - A conexão ao banco está OK? (logs mostram "✅ Conectado"?)

---

## 📊 **10. RESUMO COMPARATIVO**

| Recurso | WebEngine CMS | Nosso Sistema | Status |
|---------|---------------|---------------|--------|
| **Conexão DB** | 1 conn + switch | 2 pools | ✅ OK |
| **Login** | (não visto) | JWT + SHA-256 | ⚠️ Verificar |
| **Rankings** | Cache (cron) | Real-time | ⚠️ Sem cache |
| **Downloads** | Completo | ❌ Não implementado | 🔴 Pendente |
| **Players Online** | Cache (cron) | Real-time | ⚠️ Verificar |
| **Error Handling** | throw Exception | return {success} | 🔴 Problema |
| **Cache System** | ✅ Completo | ❌ Inexistente | 🔴 Problema |

---

## ✅ **CONCLUSÃO**

**PRINCIPAIS DIFERENÇAS:**
1. ✅ **WebEngine usa cache pesado** → Nós fazemos queries real-time
2. ⚠️ **WebEngine lança exceções** → Nós engolimos erros
3. ⚠️ **WebEngine valida estrutura** → Nós assumimos colunas existem

**DIAGNÓSTICO:**
- 🔴 **Falta validar estrutura da tabela antes das queries**
- 🔴 **Falta implementar sistema de cache**
- 🔴 **Tratamento de erros muito permissivo** (não falha fast)

**PRÓXIMO PASSO:**
- 🎯 **Você precisa me fornecer os LOGS EXATOS do erro**
- 🎯 **Executar o teste de conexão manual**
- 🎯 **Verificar estrutura da tabela MEMB_INFO/accounts**

---

**Aguardando suas informações para continuar! 🚀**
