# 🔧 CORREÇÃO DOS ERROS 500 (GUILDS) E 401 (LOGIN)

**Data:** 26 de dezembro de 2024  
**Problemas:** Erro 500 no ranking de guilds + Erro 401 no login

---

## ✅ **O QUE FOI CORRIGIDO NO CÓDIGO**

### **1. Ranking de Guilds (Erro 500)**
✅ **Detecção automática de colunas** - O backend agora detecta automaticamente quais colunas existem na tabela `guild_list`
✅ **Fallbacks inteligentes** - Se uma coluna não existir, usa valor padrão
✅ **Array vazio em vez de erro** - Se não houver guilds, retorna `[]` em vez de erro 500

**Arquivo modificado:** `/backend-nodejs/src/controllers/rankingsController.js`

### **2. Login (Erro 401)**
✅ **DEBUG detalhado** - Agora mostra logs completos da comparação de senha
✅ **MD5 manual** - Testa MD5 diretamente se a comparação falhar
✅ **Logs de tamanho** - Verifica se hash tem 32 caracteres (MD5 válido)

**Arquivo modificado:** `/backend-nodejs/src/controllers/authController.js`

---

## 🚀 **PASSOS PARA RESOLVER**

### **PASSO 1: Atualizar o código no servidor**

Se você fez clone do repositório, faça:

```bash
cd /home/meumu.com/public_html
git pull origin main
```

Se não tem git, faça upload dos arquivos modificados via FTP/SFTP.

---

### **PASSO 2: Executar SQL de correção**

Copie o arquivo `/SQL-FIX-GUILDS-LOGIN.sql` para o servidor e execute:

```bash
# Método 1: Via arquivo
mysql -u root -p@mysql123@ < /home/meumu.com/public_html/SQL-FIX-GUILDS-LOGIN.sql

# Método 2: Linha por linha (mais seguro)
mysql -u root -p@mysql123@ muonline
```

Depois execute **APENAS AS LINHAS NECESSÁRIAS**:

```sql
USE muonline;

-- 1️⃣ CORRIGIR GUILDS (adicionar colunas se não existirem)
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS member_count INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS emblem VARBINARY(32) DEFAULT NULL;

-- 2️⃣ VERIFICAR ESTRUTURA DE ACCOUNTS
DESCRIBE accounts;

-- 3️⃣ VER SE HÁ CONTAS
SELECT account, password, email, blocked FROM accounts LIMIT 5;

-- 4️⃣ CRIAR CONTA DE TESTE (senha: "senha123")
INSERT INTO accounts (account, password, email, created_at, blocked, vip_level, cash_credits)
VALUES ('testefab', 'e10adc3949ba59abbe56e057f20f883e', 'teste@meumu.com', NOW(), 0, 0, 0)
ON DUPLICATE KEY UPDATE password = 'e10adc3949ba59abbe56e057f20f883e';
```

---

### **PASSO 3: Reiniciar o backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs
pm2 restart all
```

---

### **PASSO 4: Verificar logs**

```bash
pm2 logs meumu-api --lines 100
```

**Procure por:**
- ✅ `🔍 Colunas disponíveis em guild:` - Deve mostrar as colunas da tabela
- ✅ `📊 SQL Guilds:` - Deve mostrar a query gerada
- ✅ `🔐 Tentativa de login:` - Deve aparecer quando você tentar logar

---

### **PASSO 5: Testar LOGIN**

#### **5.1 - Criar conta via SITE**

1. Acesse http://meumu.com:3001
2. Clique em "CRIAR CONTA"
3. Preencha:
   - **Username:** `fabricio`
   - **Email:** `fabricio@meumu.com`
   - **Senha:** `senha123`
4. Clique em "Registrar"

#### **5.2 - Verificar se foi criada no banco**

```bash
mysql -u root -p@mysql123@ muonline -e \
  "SELECT account, password, email FROM accounts WHERE account='fabricio';"
```

**Resultado esperado:**
```
+----------+----------------------------------+--------------------+
| account  | password                         | email              |
+----------+----------------------------------+--------------------+
| fabricio | e10adc3949ba59abbe56e057f20f883e | fabricio@meumu.com |
+----------+----------------------------------+--------------------+
```

✅ Se aparecer isso = conta criada com sucesso!

#### **5.3 - Fazer LOGIN**

1. No site, faça login com:
   - **Username:** `fabricio`
   - **Senha:** `senha123`

2. Verificar logs:
```bash
pm2 logs meumu-api --lines 50
```

**Logs esperados em caso de SUCESSO:**
```
🔐 Tentativa de login: fabricio
✅ Usuário encontrado: fabricio
🔑 Hash da senha no banco: e10adc3949...
🔐 Detectado hash MD5
✅ Senha correta para: fabricio
✅ Login bem-sucedido: fabricio
```

**Logs em caso de FALHA:**
```
🔐 Tentativa de login: fabricio
✅ Usuário encontrado: fabricio
🔑 Hash da senha no banco: e10adc3949...
🔐 Detectado hash MD5
❌ Senha incorreta para: fabricio
🔍 DEBUG - Senha enviada (primeiros 3 chars): sen...
🔍 DEBUG - Tamanho senha enviada: 8
🔍 DEBUG - Hash no banco: e10adc3949ba59abbe56e057f20f883e
🔍 DEBUG - Tamanho hash: 32
🔍 DEBUG - MD5 da senha enviada: e10adc3949ba59abbe56e057f20f883e
🔍 DEBUG - Senhas coincidem? true ← SE APARECER true MAS DER ERRO, É BUG NO comparePassword
```

---

### **PASSO 6: Testar RANKING DE GUILDS**

```bash
# Testar via curl
curl http://localhost:3001/api/rankings/guilds?limit=10
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": [
    {
      "position": 1,
      "name": "DragonKnights",
      "master": "GuildMaster1",
      "score": 1500,
      "members": 20,
      "emblem": null
    }
  ]
}
```

Ou, se não houver guilds:
```json
{
  "success": true,
  "data": []
}
```

---

## 🔍 **DIAGNÓSTICO DE PROBLEMAS**

### **Problema 1: Ranking de Guilds ainda dá erro 500**

**Solução:**
```bash
# Ver logs
pm2 logs meumu-api --lines 100 | grep -A 10 "ranking de guilds"

# Verificar se as colunas foram criadas
mysql -u root -p@mysql123@ muonline -e "DESCRIBE guild_list;"
```

Se as colunas `score`, `member_count`, `emblem` não aparecerem, execute os ALTER TABLE novamente.

---

### **Problema 2: Login continua dando 401**

**Causa 1: Senha no banco não está em MD5**

```bash
# Verificar hash
mysql -u root -p@mysql123@ muonline -e \
  "SELECT account, password, CHAR_LENGTH(password) FROM accounts WHERE account='fabricio';"
```

Se `CHAR_LENGTH` for diferente de 32, a senha não está em MD5.

**Solução:**
```sql
-- Atualizar senha para MD5 ("senha123" = "e10adc3949ba59abbe56e057f20f883e")
UPDATE accounts 
SET password = 'e10adc3949ba59abbe56e057f20f883e' 
WHERE account = 'fabricio';
```

**Causa 2: Logs mostram "Senhas coincidem? true" mas ainda dá 401**

Isso significa que o `comparePassword` está retornando `false` mesmo com senhas iguais.

**Solução:**
```bash
# Ver o código do comparePassword
cat /home/meumu.com/public_html/backend-nodejs/src/utils/helpers.js | grep -A 30 "comparePassword"
```

Certifique-se de que:
```javascript
if (cleanHash.length === 32 && /^[a-f0-9]+$/i.test(cleanHash)) {
  const md5Hash = hashPasswordMD5(password);
  return md5Hash.toLowerCase() === cleanHash.toLowerCase(); // ← DEVE RETORNAR TRUE
}
```

---

### **Problema 3: Conta não é criada via site**

**Verificar logs:**
```bash
pm2 logs meumu-api --lines 100 | grep -A 20 "Tentativa de registro"
```

**Possíveis erros:**
- `❌ Username já existe` - Use outro nome
- `❌ Email já cadastrado` - Use outro email
- `❌ Erro ao inserir conta` - Veja o erro SQL nos logs

---

## 📊 **RESUMO DOS ARQUIVOS MODIFICADOS**

| Arquivo | O que mudou |
|---------|-------------|
| `/backend-nodejs/src/controllers/rankingsController.js` | Detecção automática de colunas na tabela guild |
| `/backend-nodejs/src/controllers/authController.js` | Debug detalhado de MD5 no login |
| `/SQL-FIX-GUILDS-LOGIN.sql` | Script SQL para corrigir tabelas |
| `/CORRECAO-ERRO-500-401.md` | Este documento |

---

## ✅ **CHECKLIST**

Marque conforme você for testando:

- [ ] Git pull (ou upload de arquivos)
- [ ] Executar SQL de correção
- [ ] Reiniciar backend (pm2 restart all)
- [ ] Verificar logs
- [ ] Criar conta via site
- [ ] Verificar conta no banco
- [ ] Fazer login
- [ ] Testar ranking de guilds
- [ ] Tudo funcionando? 🎉

---

**Se ainda assim não funcionar, mande os logs completos:**
```bash
pm2 logs meumu-api --lines 200 > /tmp/logs-meumu.txt
cat /tmp/logs-meumu.txt
```

E copie a saída para análise.
