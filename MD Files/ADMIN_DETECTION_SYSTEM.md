# 🔐 SISTEMA DE DETECÇÃO DE ADMIN - DOCUMENTAÇÃO TÉCNICA

**Projeto:** MeuMU Online  
**Data:** 2025-12-30  
**Versão:** V573+  
**Autor:** Sistema de Documentação Técnica

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Regra de Ouro](#regra-de-ouro)
4. [Como Funciona](#como-funciona)
5. [Erro Crítico Corrigido](#erro-crítico-corrigido)
6. [Arquivos Afetados](#arquivos-afetados)
7. [Validação e Testes](#validação-e-testes)
8. [Troubleshooting](#troubleshooting)
9. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 VISÃO GERAL

O sistema de detecção de admin do site **MeuMU Online** funciona de forma **100% AUTOMÁTICA** baseado no status de Game Master (GM) definido **DENTRO DO JOGO**.

### Princípio Fundamental

**QUEM TEM ADMIN NO JOGO, É ADMIN NO SITE. SEM EXCEÇÕES.**

- ✅ **NÃO** existe coluna `web_admin` usada para controle de acesso
- ✅ **NÃO** existe configuração manual de admin no site
- ✅ A detecção é feita pela coluna `authority` na tabela `character_info`
- ✅ Se **QUALQUER** personagem da conta tiver `authority > 0`, a conta **É ADMIN**

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabela: `accounts` (Season 19 DV Teams)

```sql
CREATE TABLE `accounts` (
  `guid` INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `account` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `blocked` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME,
  -- Outras colunas...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Campos importantes:**
- `guid`: **INTEGER** (Primary Key, Auto-Increment)
- `account`: **STRING** (Username único)

---

### Tabela: `character_info` (Season 19 DV Teams)

```sql
CREATE TABLE `character_info` (
  `name` VARCHAR(50) PRIMARY KEY,
  `account_id` INT(10) UNSIGNED NOT NULL,  -- ⚠️ CRITICAL: É INTEGER (FK para accounts.guid)!
  `authority` TINYINT(3) UNSIGNED DEFAULT 0,
  `race` TINYINT(3) UNSIGNED,
  `level` INT(11),
  `online` TINYINT(4),
  -- Outras colunas...
  FOREIGN KEY (`account_id`) REFERENCES `accounts`(`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Campos importantes:**
- `account_id`: **INTEGER** (Foreign Key → `accounts.guid`)
- `authority`: **TINYINT** (0 = Player, 1-8 = Game Master/Admin)
- `name`: **STRING** (Nome do personagem)

---

### Tabela: `accounts_status` (Controle de Sessão)

```sql
CREATE TABLE `accounts_status` (
  `account_id` INT(10) UNSIGNED PRIMARY KEY,  -- FK para accounts.guid
  `online` TINYINT(4),
  `last_ip` VARCHAR(16),
  `current_server` SMALLINT(5) UNSIGNED,
  -- Outras colunas...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Observação:**
- Esta tabela **NÃO** é usada para detecção de admin
- É apenas para controle de sessão online/offline

---

## ⚠️ REGRA DE OURO

```
╔═══════════════════════════════════════════════════════════════╗
║  character_info.account_id é INTEGER (GUID), NÃO STRING!      ║
╚═══════════════════════════════════════════════════════════════╝

❌ NUNCA FAZER:
WHERE account_id = 'admin'  -- Compara INTEGER com STRING → Falha!

✅ SEMPRE FAZER:
1. Buscar GUID: SELECT guid FROM accounts WHERE account = 'admin'
2. Usar GUID:   WHERE account_id = 171  -- Compara INTEGER com INTEGER → Sucesso!
```

---

## 🔄 COMO FUNCIONA

### Fluxo Completo de Detecção (Login)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO FAZ LOGIN                                        │
│    Username: "admin"                                        │
│    Password: "123456"                                       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. BACKEND: authController.js (linha 32-36)                │
│    Query: SELECT guid, account, password FROM accounts     │
│           WHERE account = 'admin'                           │
│                                                             │
│    Resultado:                                               │
│    - account.username = 'admin'                             │
│    - account.guid = 171  ← GUID (INTEGER)                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. VERIFICAR SENHA (linha 72-77)                           │
│    ✅ Senha correta → Continua                              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. VERIFICAR AUTHORITY (linha 149-154)                     │
│    Query: SELECT MAX(authority) as max_authority           │
│           FROM character_info                               │
│           WHERE account_id = ?                              │
│    Parâmetro: [account.guid]  ← Passa 171 (INTEGER)        │
│                                                             │
│    Query real executada:                                    │
│    SELECT MAX(authority) FROM character_info                │
│    WHERE account_id = 171                                   │
│                                                             │
│    Resultado:                                               │
│    - max_authority = 8  (se tiver personagem GM)            │
│    - max_authority = 0  (se não tiver GM)                   │
│    - max_authority = NULL (se não tiver personagens)        │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DEFINIR isAdmin (linha 165-175)                         │
│    if (maxAuthority > 0) {                                  │
│      isAdmin = true;  ✅ É ADMIN!                           │
│      console.log('✅ ADMIN DETECTADO!');                    │
│    } else {                                                 │
│      isAdmin = false; ❌ NÃO é admin                        │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. GERAR JWT (linha 184-189)                               │
│    const token = generateToken({                            │
│      accountId: 'admin',                                    │
│      email: 'admin@gmail.com',                              │
│      isAdmin: true  ← INCLUI NO TOKEN                       │
│    });                                                      │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. FRONTEND LÊ O TOKEN                                      │
│    PlayerContext.tsx decodifica o JWT                       │
│    Extrai: { accountId: 'admin', isAdmin: true }            │
│                                                             │
│    Console mostra:                                          │
│    ✅ Usuário autenticado: admin Admin: true                │
│                                                             │
│    Dashboard renderiza:                                     │
│    - Aba "Admin Control Panel" ✅ APARECE                   │
└─────────────────────────────────────────────────────────────┘
```

---

## ❌ ERRO CRÍTICO CORRIGIDO

### Problema Original (Antes da V573)

**authController.js (linha 152) - ERRADO:**
```javascript
const adminCheckResult = await executeQueryMU(
  `SELECT MAX(authority) as max_authority 
   FROM character_info 
   WHERE account_id = ?`,
  [account.username]  // ❌ ERRO! Passa 'admin' (STRING)
);
```

**Query executada:**
```sql
SELECT MAX(authority) FROM character_info WHERE account_id = 'admin';
-- Compara: 171 (INTEGER) = 'admin' (STRING) → FALSO!
-- Resultado: Nenhum personagem encontrado!
-- max_authority = NULL → isAdmin = false
```

**Consequência:**
- ❌ Admin não era detectado
- ❌ AdminCP não aparecia
- ❌ Personagens não carregavam
- ❌ Site mostrava "servidor offline" mesmo estando online

---

### Solução Implementada (V573)

**authController.js (linha 152) - CORRETO:**
```javascript
const adminCheckResult = await executeQueryMU(
  `SELECT MAX(authority) as max_authority 
   FROM character_info 
   WHERE account_id = ?`,
  [account.guid]  // ✅ CORRETO! Passa 171 (INTEGER)
);
```

**Query executada:**
```sql
SELECT MAX(authority) FROM character_info WHERE account_id = 171;
-- Compara: 171 (INTEGER) = 171 (INTEGER) → VERDADEIRO!
-- Resultado: Personagem encontrado!
-- max_authority = 8 → isAdmin = true ✅
```

---

## 📁 ARQUIVOS AFETADOS

### 1. `/backend-nodejs/src/controllers/authController.js`

**Linha 149-154:**
```javascript
const adminCheckResult = await executeQueryMU(
  `SELECT MAX(authority) as max_authority 
   FROM character_info 
   WHERE account_id = ?`,
  [account.guid]  // ✅ USAR GUID (INTEGER)
);
```

**Status:** ✅ CORRIGIDO

---

### 2. `/backend-nodejs/src/controllers/charactersController.js`

**Problema:** Todas as funções recebem `accountId` (STRING) do JWT, mas precisam usar `GUID` (INTEGER) nas queries.

**Solução:** Helper function `getAccountGuid()`

**Linha 11-22:**
```javascript
/**
 * Helper: Buscar GUID da conta a partir do username
 */
const getAccountGuid = async (accountUsername) => {
  const sql = `SELECT guid FROM accounts WHERE account = ?`;
  const result = await executeQueryMU(sql, [accountUsername]);
  
  if (!result.success || result.data.length === 0) {
    return null;
  }
  
  return result.data[0].guid;
};
```

**Funções corrigidas:**
- ✅ `getAccountCharacters()` (linha 49)
- ✅ `getCharacterDetails()` (linha 177)
- ✅ `distributePoints()` (linha 289)
- ✅ `resetCharacter()` (linha 363)

**Todas agora fazem:**
```javascript
// 1. Buscar GUID primeiro
const accountGuid = await getAccountGuid(accountId);

if (!accountGuid) {
  return errorResponse(res, 'Conta não encontrada', 404);
}

// 2. Usar GUID nas queries
const result = await executeQueryMU(sql, [name, accountGuid]);
```

**Status:** ✅ CORRIGIDO

---

### 3. `/backend-nodejs/src/controllers/accountsController.js`

**Linha 92-93:**
```javascript
WHERE account_id = ?
`, [account.guid]);  // ✅ JÁ ESTAVA CORRETO
```

**Status:** ✅ OK (não precisou correção)

---

### 4. `/backend-nodejs/src/controllers/bansController.js`

**Linha 139-140:**
```javascript
WHERE account_id = ?
`, [accounts[0].guid]);  // ✅ JÁ ESTAVA CORRETO
```

**Status:** ✅ OK (não precisou correção)

---

## ✅ VALIDAÇÃO E TESTES

### Teste 1: Verificar Estrutura do Banco

```sql
-- 1. Ver estrutura da tabela character_info
DESCRIBE character_info;

-- Verificar:
-- account_id | int(10) unsigned | NO | ... ← Deve ser INTEGER!

-- 2. Ver personagens e seus account_id
SELECT 
    account_id,
    name,
    authority
FROM character_info
WHERE authority > 0
LIMIT 5;

-- Resultado esperado:
-- +------------+----------+-----------+
-- | account_id | name     | authority |
-- +------------+----------+-----------+
-- |        171 | MeuMuzin |         2 |  ← account_id é NÚMERO!
-- +------------+----------+-----------+
```

---

### Teste 2: Verificar GUID da Conta

```sql
-- Buscar GUID da conta "admin"
SELECT 
    account,
    guid
FROM accounts
WHERE account = 'admin';

-- Resultado esperado:
-- +---------+------+
-- | account | guid |
-- +---------+------+
-- | admin   | 171  |  ← GUID (INTEGER)
-- +---------+------+
```

---

### Teste 3: Verificar Relação Account → Character

```sql
-- Ver relação completa
SELECT 
    a.account,
    a.guid,
    c.name,
    c.account_id,
    c.authority
FROM accounts a
LEFT JOIN character_info c ON a.guid = c.account_id
WHERE a.account = 'admin';

-- Resultado esperado:
-- +---------+------+----------+------------+-----------+
-- | account | guid | name     | account_id | authority |
-- +---------+------+----------+------------+-----------+
-- | admin   | 171  | MeuMuzin |        171 |         2 |
-- +---------+------+----------+------------+-----------+
--              ↑                      ↑
--              └──────────────────────┘ DEVEM SER IGUAIS!
```

---

### Teste 4: Simular Query do Backend

```sql
-- Exatamente como o backend faz (authController.js linha 150)
SELECT MAX(authority) as max_authority
FROM character_info
WHERE account_id = 171;  -- GUID da conta "admin"

-- Resultado esperado:
-- +---------------+
-- | max_authority |
-- +---------------+
-- |             2 |  ← Se > 0, é admin!
-- +---------------+

-- Se retornar NULL ou 0 → NÃO é admin
```

---

### Teste 5: Logs do Backend (Login)

**Executar:**
```bash
pm2 logs backend --lines 0
```

**Fazer login com conta admin no site.**

**Logs esperados:**
```
🔐 Tentativa de login: admin
✅ Usuário encontrado: admin
✅ Senha correta para: admin
🔍 Verificando se a conta tem personagens com status de administrador...
🎮 Authority máxima dos personagens: 2  ← Deve ser > 0
✅ ========================================
✅ ADMIN DETECTADO!
✅ Username: admin
✅ Authority: 2
✅ JWT terá isAdmin: true
✅ ========================================
✅ Login bem-sucedido: admin
```

**Se os logs mostrarem:**
```
🎮 Authority máxima dos personagens: 0
👤 Conta normal (sem personagens GM)
```

**→ Problema: Personagem não tem authority, ou query está errada!**

---

### Teste 6: Console do Navegador

**Fazer login no site → Abrir console (F12)**

**Console esperado:**
```javascript
✅ Usuário autenticado: admin Admin: true  ← DEVE SER TRUE!
```

**Se aparecer `Admin: false`:**
- ❌ JWT não contém `isAdmin: true`
- ❌ Backend não detectou authority
- ❌ Verificar logs do backend

---

### Teste 7: Dashboard AdminCP

**Depois do login:**
1. Ir para **Dashboard**
2. Verificar se há aba **"Admin Control Panel"**

**Se NÃO aparecer:**
- ❌ `isAdmin: false` no JWT
- ❌ Verificar console (Teste 6)
- ❌ Verificar logs do backend (Teste 5)

---

## 🔧 TROUBLESHOOTING

### Problema 1: "Admin não é detectado"

**Sintomas:**
- ❌ Console mostra `Admin: false`
- ❌ AdminCP não aparece
- ❌ Logs mostram `Authority: 0` ou `Conta normal`

**Diagnóstico:**

```sql
-- 1. Verificar se personagem existe e tem authority
SELECT 
    account_id,
    name,
    authority
FROM character_info
WHERE account_id = (SELECT guid FROM accounts WHERE account = 'admin');

-- Se retornar VAZIO:
--   → Personagem não existe! Criar no jogo.

-- Se authority = 0:
--   → Personagem não é GM! Dar authority no jogo.
```

**Solução:**

```sql
-- Dar authority 8 ao personagem
UPDATE character_info
SET authority = 8
WHERE name = 'MeuMuzin' AND account_id = 171;

-- Verificar
SELECT name, authority FROM character_info WHERE name = 'MeuMuzin';
```

**Depois:**
1. Fazer **LOGOUT** do site
2. Fazer **LOGIN** novamente
3. Console deve mostrar `Admin: true`

---

### Problema 2: "account_id está em MAIÚSCULO"

**Sintomas:**
- ❌ Query retorna vazio
- ❌ Logs mostram `Nenhum personagem encontrado`

**Diagnóstico:**

```sql
-- Ver como está gravado no banco
SELECT account_id, name FROM character_info LIMIT 5;

-- Se aparecer:
-- +------------+------+
-- | account_id | name |
-- +------------+------+
-- | ADMIN      | ...  |  ← EM MAIÚSCULO (ERRADO se for FK para GUID!)
-- +------------+------+
```

**⚠️ ATENÇÃO:** Se `account_id` for STRING em vez de INTEGER, sua estrutura de banco está **COMPLETAMENTE DIFERENTE** do esperado!

**Neste caso:**
- Você tem Season 6 ou versão customizada
- Precisa adaptar **TODAS** as queries
- NÃO é compatível com Season 19 DV Teams

---

### Problema 3: "Personagens não aparecem no Dashboard"

**Sintomas:**
- ✅ Login funciona
- ✅ Admin detectado (`Admin: true`)
- ❌ Aba "Personagens" vazia
- ❌ Console mostra erro 500 ou "Erro ao buscar personagens"

**Diagnóstico:**

```bash
# Ver logs do backend
pm2 logs backend --lines 50 | grep "BUSCANDO PERSONAGENS" -A 20
```

**Procurar por:**
```
📊 BUSCANDO PERSONAGENS
📊 Account ID (do JWT): admin
✅ GUID da conta encontrado: 171  ← DEVE APARECER!
📊 Parâmetros: [171] (GUID INTEGER)  ← DEVE SER NÚMERO, NÃO STRING!
```

**Se logs mostrarem:**
```
📊 Parâmetros: [admin] (GUID INTEGER)  ← ERRADO! É STRING!
```

**→ `charactersController.js` NÃO foi corrigido!**

**Solução:**
```bash
# Verificar se helper existe
grep -n "getAccountGuid" /backend-nodejs/src/controllers/charactersController.js

# Deve retornar:
# 11:const getAccountGuid = async (accountUsername) => {
# 49:    const accountGuid = await getAccountGuid(accountId);
# ...

# Se NÃO aparecer, aplicar correção!
```

---

### Problema 4: "Backend não reiniciou após correção"

**Sintomas:**
- ✅ Código corrigido
- ❌ Comportamento continua igual

**Solução:**

```bash
# 1. Reiniciar backend
pm2 restart backend

# 2. Verificar se está rodando
pm2 status

# Deve mostrar:
# ┌────┬────────────┬─────────┐
# │ id │ name       │ status  │
# ├────┼────────────┼─────────┤
# │ 0  │ backend    │ online  │  ← DEVE SER "online"
# └────┴────────────┴─────────┘

# 3. Ver logs em tempo real
pm2 logs backend --lines 0

# 4. Fazer login no site
# Logs devem aparecer imediatamente!
```

---

### Problema 5: "Frontend não atualizou"

**Sintomas:**
- ✅ Backend corrigido
- ✅ Backend reiniciado
- ❌ Console ainda mostra `Admin: false`

**Solução:**

```bash
# 1. Build do frontend
cd /home/meumu.com/public_html
npm run build

# Aguardar:
# ✓ built in X.XXs

# 2. Verificar data do build
ls -lh dist/index.html

# Deve ser HOJE e APÓS a correção!
# -rw-r--r-- 1 user user 439 Dec 30 10:XX dist/index.html
#                                ^^^^^^^ ← Hora atual

# 3. Limpar cache do navegador
# Ctrl + Shift + Delete → Limpar tudo

# 4. Fazer login novamente
```

---

## 📝 EXEMPLOS PRÁTICOS

### Exemplo 1: Criar Nova Conta Admin do Zero

```sql
-- 1. Criar conta no banco
INSERT INTO accounts (account, password, email, created_at)
VALUES (
    'NovoAdmin',
    '6d8bf5dc8219cb5b0a8c1b5eaab11759b2ef32e922132843eaa1a9e56e2d9a4e',
    'novoadmin@test.com',
    NOW()
);
-- Senha: NovoAdmin:123456 (hash SHA-256)

-- 2. Ver GUID gerado
SELECT guid FROM accounts WHERE account = 'NovoAdmin';
-- Supondo que retornou: 172

-- 3. Criar personagem GM para esta conta
INSERT INTO character_info (
    account_id,
    name,
    authority,
    race,
    level
) VALUES (
    172,  -- GUID da conta "NovoAdmin"
    'GMNovo',
    8,  -- Authority 8 (Game Master)
    0,  -- Dark Wizard
    1   -- Level 1
);

-- 4. Verificar
SELECT 
    a.account,
    a.guid,
    c.name,
    c.authority
FROM accounts a
LEFT JOIN character_info c ON a.guid = c.account_id
WHERE a.account = 'NovoAdmin';

-- Resultado:
-- +-----------+------+--------+-----------+
-- | account   | guid | name   | authority |
-- +-----------+------+--------+-----------+
-- | NovoAdmin | 172  | GMNovo |         8 |
-- +-----------+------+--------+-----------+

-- 5. Fazer login no site com "NovoAdmin" / "123456"
-- ✅ Deve detectar como admin!
```

---

### Exemplo 2: Remover Admin de uma Conta

```sql
-- 1. Ver personagens da conta
SELECT 
    name,
    authority
FROM character_info
WHERE account_id = (SELECT guid FROM accounts WHERE account = 'NovoAdmin');

-- 2. Remover authority de TODOS os personagens
UPDATE character_info
SET authority = 0
WHERE account_id = (SELECT guid FROM accounts WHERE account = 'NovoAdmin');

-- 3. Verificar
SELECT name, authority FROM character_info
WHERE account_id = (SELECT guid FROM accounts WHERE account = 'NovoAdmin');

-- Resultado:
-- +--------+-----------+
-- | name   | authority |
-- +--------+-----------+
-- | GMNovo |         0 |  ← Agora é player normal
-- +--------+-----------+

-- 4. Fazer LOGOUT e LOGIN no site
-- ✅ Agora NÃO é mais admin (Admin: false)
```

---

### Exemplo 3: Dar Admin para Conta Existente

```sql
-- Cenário: Conta "PlayerNormal" existe mas não é admin

-- 1. Verificar GUID da conta
SELECT guid FROM accounts WHERE account = 'PlayerNormal';
-- Retorna: 180

-- 2. Verificar personagens existentes
SELECT name, authority FROM character_info WHERE account_id = 180;
-- +----------+-----------+
-- | name     | authority |
-- +----------+-----------+
-- | Guerreiro|         0 |  ← Player normal
-- +----------+-----------+

-- 3. Dar authority 8 ao personagem
UPDATE character_info
SET authority = 8
WHERE name = 'Guerreiro' AND account_id = 180;

-- 4. Verificar
SELECT name, authority FROM character_info WHERE account_id = 180;
-- +----------+-----------+
-- | name     | authority |
-- +----------+-----------+
-- | Guerreiro|         8 |  ← Agora é GM!
-- +----------+-----------+

-- 5. Fazer LOGOUT e LOGIN no site com "PlayerNormal"
-- ✅ Agora É admin (Admin: true)
```

---

## 🔍 QUERIES ÚTEIS PARA DEBUG

### Ver TODAS as contas e seus personagens

```sql
SELECT 
    a.account,
    a.guid,
    c.name as character_name,
    c.authority,
    CASE 
        WHEN c.authority > 0 THEN 'ADMIN ✅'
        ELSE 'Normal'
    END as role
FROM accounts a
LEFT JOIN character_info c ON a.guid = c.account_id
ORDER BY c.authority DESC, a.account ASC
LIMIT 20;
```

---

### Ver apenas contas ADMIN

```sql
SELECT DISTINCT
    a.account,
    a.guid,
    MAX(c.authority) as max_authority
FROM accounts a
INNER JOIN character_info c ON a.guid = c.account_id
WHERE c.authority > 0
GROUP BY a.account, a.guid
ORDER BY max_authority DESC;
```

---

### Ver contas SEM personagens

```sql
SELECT 
    a.account,
    a.guid,
    a.email
FROM accounts a
LEFT JOIN character_info c ON a.guid = c.account_id
WHERE c.name IS NULL;
```

---

### Contar personagens por conta

```sql
SELECT 
    a.account,
    COUNT(c.name) as total_chars,
    SUM(CASE WHEN c.authority > 0 THEN 1 ELSE 0 END) as admin_chars
FROM accounts a
LEFT JOIN character_info c ON a.guid = c.account_id
GROUP BY a.account
HAVING total_chars > 0
ORDER BY admin_chars DESC, total_chars DESC;
```

---

## 📌 CHECKLIST DE DEPLOY

Antes de considerar a correção completa:

- [ ] ✅ `authController.js` usa `[account.guid]` na query de authority
- [ ] ✅ `charactersController.js` tem função `getAccountGuid()`
- [ ] ✅ Todas as 4 funções de `charactersController.js` usam `getAccountGuid()`
- [ ] ✅ Backend reiniciado (`pm2 restart backend`)
- [ ] ✅ Frontend buildado (`npm run build`)
- [ ] ✅ Teste de login com conta admin funciona
- [ ] ✅ Console mostra `Admin: true`
- [ ] ✅ AdminCP aparece no Dashboard
- [ ] ✅ Personagens carregam corretamente
- [ ] ✅ Teste com conta normal (não-admin) funciona
- [ ] ✅ Console mostra `Admin: false` para conta normal
- [ ] ✅ AdminCP NÃO aparece para conta normal
- [ ] ✅ Documentação atualizada (este arquivo)

---

## 🎯 CONCLUSÃO

O sistema de detecção de admin é **SIMPLES** mas **CRÍTICO**:

1. ✅ **SEMPRE** usa `account.guid` (INTEGER) para buscar em `character_info`
2. ✅ **NUNCA** usa `account.username` (STRING) em `WHERE account_id = ?`
3. ✅ **DETECÇÃO AUTOMÁTICA** baseada em `MAX(authority) > 0`
4. ✅ **SEM CONFIGURAÇÃO MANUAL** - tudo vem do jogo

**Se este documento for seguido, NÃO HAVERÁ ERROS de detecção de admin no futuro.** 🎯

---

**FIM DO DOCUMENTO**

*Última atualização: 2025-12-30 (V573)*
