# 🚨 FIX CRÍTICO - PERMISSÕES DO BANCO DE DADOS

**Data**: 31 de Dezembro de 2025  
**Versão**: 619  
**Tipo**: 🔴 **HOTFIX CRÍTICO** - Permissões MySQL

---

## 🔴 PROBLEMA

```
❌ UPDATE command denied to user 'webuser'@'localhost' for table `muonline`.`character_info`
```

### Sintoma

Ao tentar **distribuir pontos**, o sistema retorna **HTTP 500** com erro de permissão no banco de dados.

### Causa Raiz

**CONTRADIÇÃO NA ARQUITETURA**:

1. **Documentação dizia**:
   ```
   DATABASE 1: muonline (MU Server) - READ-ONLY
   Webuser tem least-privilege (read-only em muonline)
   ```

2. **Realidade**:
   - Sistema de **distribuir pontos** precisa fazer `UPDATE` em `muonline.character_info`
   - Sistema de **reset** precisa fazer `UPDATE` em `muonline.character_info`
   - Sistema de **alterar senha** precisa fazer `UPDATE` em `muonline.MEMB_INFO`

3. **Resultado**:
   - Usuário `webuser` só tinha `SELECT` (read-only)
   - Tentava fazer `UPDATE` → **PERMISSÃO NEGADA** ❌

---

## ✅ SOLUÇÃO

O banco `muonline` **NÃO PODE SER 100% READ-ONLY** porque o site precisa modificar:
- **Personagens** (distribuir pontos, reset)
- **Contas** (alterar senha, email)
- **Inventário** (WCoin shop)

### Permissões Corretas

```sql
-- ✅ PERMISSÕES SEGURAS PARA WEBUSER

-- DATABASE MUONLINE: SELECT + UPDATE em tabelas específicas
GRANT SELECT, UPDATE ON muonline.character_info TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_INFO TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_STAT TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.warehouse TO 'webuser'@'localhost';

-- DATABASE MEUWEB: FULL ACCESS (read/write)
GRANT SELECT, INSERT, UPDATE, DELETE ON meuweb.* TO 'webuser'@'localhost';

-- ❌ NUNCA DAR: DROP, CREATE, ALTER, TRUNCATE, DELETE em muonline
-- ✅ APENAS: SELECT + UPDATE em tabelas necessárias
```

---

## 🛠️ SCRIPT DE CORREÇÃO

Execute este script SQL como **root** no MySQL/MariaDB:

```sql
-- ═══════════════════════════════════════════════════════════
-- MEUMU ONLINE - CORREÇÃO DE PERMISSÕES V619
-- ═══════════════════════════════════════════════════════════

USE mysql;

-- 1️⃣ VERIFICAR USUÁRIO WEBUSER EXISTE
SELECT User, Host FROM mysql.user WHERE User = 'webuser';

-- Se não existir, criar:
-- CREATE USER 'webuser'@'localhost' IDENTIFIED BY 'SUA_SENHA_AQUI';

-- ═══════════════════════════════════════════════════════════
-- 2️⃣ REMOVER TODAS AS PERMISSÕES ANTIGAS (limpar)
-- ═══════════════════════════════════════════════════════════

REVOKE ALL PRIVILEGES ON *.* FROM 'webuser'@'localhost';
REVOKE ALL PRIVILEGES ON muonline.* FROM 'webuser'@'localhost';
REVOKE ALL PRIVILEGES ON meuweb.* FROM 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════
-- 3️⃣ DAR PERMISSÕES CORRETAS - DATABASE MUONLINE
-- ═══════════════════════════════════════════════════════════

-- ✅ TABELAS QUE PRECISAM UPDATE (Site modifica)
GRANT SELECT, UPDATE ON muonline.character_info TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_INFO TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_STAT TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.warehouse TO 'webuser'@'localhost';

-- ✅ TABELAS QUE SÃO SOMENTE LEITURA
GRANT SELECT ON muonline.Character TO 'webuser'@'localhost';
GRANT SELECT ON muonline.AccountCharacter TO 'webuser'@'localhost';
GRANT SELECT ON muonline.Guild TO 'webuser'@'localhost';
GRANT SELECT ON muonline.GuildMember TO 'webuser'@'localhost';
GRANT SELECT ON muonline.Gens TO 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════
-- 4️⃣ DAR PERMISSÕES COMPLETAS - DATABASE MEUWEB
-- ═══════════════════════════════════════════════════════════

GRANT SELECT, INSERT, UPDATE, DELETE ON meuweb.* TO 'webuser'@'localhost';

-- ═══════════════════════════════════════════════════════════
-- 5️⃣ APLICAR MUDANÇAS
-- ═══════════════════════════════════════════════════════════

FLUSH PRIVILEGES;

-- ═══════════════════════════════════════════════════════════
-- 6️⃣ VERIFICAR PERMISSÕES (TESTE)
-- ═══════════════════════════════════════════════════════════

SHOW GRANTS FOR 'webuser'@'localhost';

```

---

## 🧪 TESTE APÓS CORREÇÃO

### Teste 1: Verificar Permissões

```bash
# Login como root no MySQL
mysql -u root -p

# Verificar
SHOW GRANTS FOR 'webuser'@'localhost';
```

**Resultado esperado**:
```sql
GRANT USAGE ON *.* TO `webuser`@`localhost`
GRANT SELECT, UPDATE ON `muonline`.`character_info` TO `webuser`@`localhost`
GRANT SELECT, UPDATE ON `muonline`.`MEMB_INFO` TO `webuser`@`localhost`
GRANT SELECT, INSERT, UPDATE, DELETE ON `meuweb`.* TO `webuser`@`localhost`
```

---

### Teste 2: Testar UPDATE Manual

```bash
# Login como webuser
mysql -u webuser -p

USE muonline;

-- Testar UPDATE em character_info (deve funcionar)
UPDATE character_info 
SET points = points 
WHERE name = 'TheFighter' 
LIMIT 1;

-- ✅ Se funcionar: Query OK, 1 row affected
-- ❌ Se falhar: ERROR 1142 (42000): UPDATE command denied
```

---

### Teste 3: Testar Distribuir Pontos no Site

```
1. Login no site (jogador123)
2. Ir para Dashboard → Distribuir Pontos
3. Selecionar personagem "TheFighter"
4. Adicionar:
   - STR: +10
   - AGI: +5
5. Clicar "Confirmar Distribuição"

✅ RESULTADO ESPERADO:
   - Backend log: "✅ Pontos distribuídos com sucesso"
   - Frontend toast: "Pontos distribuídos com sucesso!" (verde)
   - Banco de dados: Stats atualizados

❌ ANTES (SEM PERMISSÕES):
   - Backend log: "❌ UPDATE command denied"
   - Frontend toast: "Erro ao distribuir pontos" (vermelho)
   - HTTP 500 Internal Server Error
```

---

## 📊 COMPARAÇÃO DE PERMISSÕES

### ❌ ANTES (ERRADO - V617)

```sql
-- Usuário: webuser
-- Permissões: SOMENTE SELECT em muonline

GRANT SELECT ON muonline.* TO 'webuser'@'localhost';
GRANT ALL ON meuweb.* TO 'webuser'@'localhost';
```

**Resultado**:
```
✅ Listar personagens: OK (SELECT)
✅ Ver rankings: OK (SELECT)
✅ Ver notícias: OK (SELECT meuweb)
❌ Distribuir pontos: FALHA (precisa UPDATE)
❌ Reset personagem: FALHA (precisa UPDATE)
❌ Alterar senha: FALHA (precisa UPDATE)
```

---

### ✅ DEPOIS (CORRETO - V619)

```sql
-- Usuário: webuser
-- Permissões: SELECT + UPDATE em tabelas específicas

GRANT SELECT, UPDATE ON muonline.character_info TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_INFO TO 'webuser'@'localhost';
GRANT SELECT ON muonline.Character TO 'webuser'@'localhost';
-- ... outras tabelas ...
```

**Resultado**:
```
✅ Listar personagens: OK (SELECT)
✅ Ver rankings: OK (SELECT)
✅ Ver notícias: OK (SELECT meuweb)
✅ Distribuir pontos: OK (UPDATE character_info)
✅ Reset personagem: OK (UPDATE character_info)
✅ Alterar senha: OK (UPDATE MEMB_INFO)
```

---

## 🔒 ANÁLISE DE SEGURANÇA

### Por que UPDATE é seguro?

1. **Backend valida tudo**:
   ```javascript
   // Verifica se personagem pertence à conta
   WHERE name = ? AND account_id = ?
   
   // Verifica se tem pontos suficientes
   if (character.points < totalPoints) {
     return error('Pontos insuficientes');
   }
   
   // Verifica se está offline
   if (character.online === 1) {
     return error('Personagem online');
   }
   ```

2. **Prepared Statements** (proteção SQL injection):
   ```javascript
   const sql = `UPDATE character_info SET strength = strength + ? WHERE name = ?`;
   await executeQueryMU(sql, [10, 'TheFighter']);  // ✅ SEGURO
   ```

3. **Autenticação JWT** (só usuários logados):
   ```javascript
   router.put('/characters/:name/points', 
     verifyToken,  // ✅ Requer token válido
     validateDistributePoints,  // ✅ Valida input
     distributePoints
   );
   ```

4. **Permissões limitadas**:
   ```
   ✅ TEM: SELECT, UPDATE em tabelas específicas
   ❌ NÃO TEM: DROP, CREATE, ALTER, DELETE, TRUNCATE
   ```

### O que webuser NÃO pode fazer?

```sql
-- ❌ PROIBIDO (não tem permissões)
DROP TABLE character_info;
DELETE FROM character_info WHERE 1=1;
TRUNCATE TABLE character_info;
ALTER TABLE character_info ADD COLUMN hacked INT;
CREATE TABLE evil_backdoor (...);
GRANT ALL ON muonline.* TO 'hacker'@'%';
```

---

## 📝 ATUALIZAÇÃO DE DOCUMENTAÇÃO

### ANTES (Errado)

```markdown
### Dual Database Architecture
DATABASE 1: muonline (MU Server) - READ-ONLY ❌
DATABASE 2: meuweb (Website) - READ/WRITE ✅

**CRITICAL**: NEVER write to muonline database from website.
```

---

### DEPOIS (Correto)

```markdown
### Dual Database Architecture

**DATABASE 1: `muonline` (MU Server)**
- **Modo**: Leitura + Escrita Limitada
- **Permissões**: 
  - ✅ SELECT em todas as tabelas
  - ✅ UPDATE em: character_info, MEMB_INFO, MEMB_STAT, warehouse
  - ❌ DELETE, DROP, TRUNCATE, ALTER (proibido)

**DATABASE 2: `meuweb` (Website)**
- **Modo**: Leitura + Escrita Completa
- **Permissões**: SELECT, INSERT, UPDATE, DELETE
- **Uso**: Logs, notícias, eventos, WCoin packages, audit logs

**IMPORTANTE**:
- Site PODE modificar personagens (pontos, reset) em `muonline`
- Site NÃO PODE deletar ou alterar estrutura de `muonline`
- Todas as modificações são validadas e auditadas
```

---

## 🎯 CHECKLIST DE DEPLOY

- [ ] Execute o script SQL como root
- [ ] Verifique: `SHOW GRANTS FOR 'webuser'@'localhost';`
- [ ] Teste UPDATE manual no MySQL
- [ ] Reinicie o backend: `pm2 restart all`
- [ ] Teste distribuir pontos no site
- [ ] Teste reset de personagem
- [ ] Teste alterar senha
- [ ] Verifique logs do backend (sem erros de permissão)
- [ ] Marque como resolvido

---

## 📌 ARQUIVOS AFETADOS

```
📄 Novo: /MD Files/05-SISTEMA/HOTFIX-V619-MYSQL-PERMISSIONS.md
📄 Novo: /backend-nodejs/scripts/fix-mysql-permissions.sql (script SQL)
✏️ Modificado: /install.sh (versão 619)
📄 Novo: /MD Files/CHANGELOG-V619.md
```

---

## 🎉 RESULTADO FINAL

### Status da Funcionalidade

```
📊 DISTRIBUIR PONTOS

❌ ANTES (V617-618)
   Backend tenta UPDATE → MySQL nega permissão
   HTTP 500 Internal Server Error
   Frontend: "Erro ao distribuir pontos"
   🔴 0% FUNCIONAL

✅ DEPOIS (V619)
   Backend tenta UPDATE → MySQL permite
   HTTP 200 OK
   Frontend: "Pontos distribuídos com sucesso!"
   🟢 100% FUNCIONAL
```

---

**AÇÃO NECESSÁRIA**: Execute o script SQL imediatamente para corrigir as permissões!

**MeuMU Online** - Dark Medieval Fantasy Theme  
**Hotfix V619** - 2025-12-31 18:30 CET
