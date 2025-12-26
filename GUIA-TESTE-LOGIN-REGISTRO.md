# 🔧 GUIA COMPLETO: TESTE DE LOGIN E REGISTRO

**Data:** 26 de dezembro de 2024  
**Problemas:** Erro 401 (Login) + Erro 400 (Registro)

---

## ✅ **PASSO 1: ATUALIZAR CÓDIGO NO SERVIDOR**

```bash
cd /home/meumu.com/public_html

# Se você usa Git:
git pull origin main

# Se não usa Git, faça upload manual dos arquivos:
# - /backend-nodejs/src/controllers/authController.js
# - /backend-nodejs/src/controllers/rankingsController.js
```

---

## ✅ **PASSO 2: EXECUTAR SQL DE DIAGNÓSTICO**

```bash
# Copiar script SQL para o servidor
mysql -u root -p@mysql123@ < /home/meumu.com/public_html/DIAGNOSTICO-E-CORRECAO-LOGIN.sql

# OU executar linha por linha:
mysql -u root -p@mysql123@ muonline
```

Depois execute as queries do arquivo `DIAGNOSTICO-E-CORRECAO-LOGIN.sql` **uma por vez** para ver os resultados.

---

## ✅ **PASSO 3: CRIAR CONTA DE TESTE NO MYSQL**

Execute esta query no MariaDB:

```sql
USE muonline;

-- Deletar conta de teste se já existir
DELETE FROM accounts WHERE memb___id = 'testefab';

-- Criar conta de teste
-- Username: testefab
-- Senha: senha123
-- MD5: e10adc3949ba59abbe56e057f20f883e

INSERT INTO accounts (
    memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, 
    addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, fpas_answ, 
    job__code, appl_days, modi_days, out__days, true_days, mail_chek, 
    bloc_code, ctl1_code, AccountLevel, AccountExpireDate, CashCredits
) VALUES (
    'testefab', 'e10adc3949ba59abbe56e057f20f883e', 'testefab', '0000000000000',
    '000000', 'N/A', 'N/A', '000-0000-0000', '000-0000-0000', 
    'testefab@meumu.com', '', '', '', NOW(), NOW(), NOW(), NOW(), '1',
    '0', '0', '0', NULL, 0
);

-- Verificar se foi criada
SELECT memb___id, memb__pwd, CHAR_LENGTH(memb__pwd) as tamanho, mail_addr, bloc_code 
FROM accounts 
WHERE memb___id = 'testefab';
```

**Resultado esperado:**
```
+----------+----------------------------------+---------+---------------------+-----------+
| memb___id| memb__pwd                        | tamanho | mail_addr           | bloc_code |
+----------+----------------------------------+---------+---------------------+-----------+
| testefab | e10adc3949ba59abbe56e057f20f883e | 32      | testefab@meumu.com  | 0         |
+----------+----------------------------------+---------+---------------------+-----------+
```

✅ **Se `tamanho = 32` → Senha em MD5 correta!**

---

## ✅ **PASSO 4: REINICIAR BACKEND**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# MATAR TODOS OS PROCESSOS NODE.JS
pkill -9 -f node
pkill -9 -f nodemon

# Aguardar 3 segundos
sleep 3

# Verificar se porta 3001 está livre
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Iniciar servidor
pm2 delete all 2>/dev/null
pm2 start src/server.js --name meumu-backend --log logs/server.log
pm2 save

# Aguardar servidor inicializar
sleep 5

# Testar se está rodando
curl http://localhost:3001/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2024-12-26T...",
  "database": "connected"
}
```

---

## ✅ **PASSO 5: MONITORAR LOGS EM TEMPO REAL**

Abra um terminal separado e deixe os logs rodando:

```bash
pm2 logs meumu-backend --lines 100
```

Deixe este terminal aberto para ver os logs em tempo real enquanto testa.

---

## ✅ **PASSO 6: TESTAR REGISTRO VIA SITE**

### **6.1 - Acessar o site:**
```
http://meumu.com:3001
```

### **6.2 - Clicar em "CRIAR CONTA"**

### **6.3 - Preencher formulário:**
- **Username:** `fabricio`
- **Email:** `fabricio@meumu.com`
- **Senha:** `senha123`
- **Confirmar Senha:** `senha123`

### **6.4 - Clicar em "Criar Conta"**

### **6.5 - Verificar logs (no terminal com pm2 logs):**

**Logs esperados em caso de SUCESSO:**
```
📝 ========================================
📝 TENTATIVA DE REGISTRO
📝 ========================================
📝 Username: fabricio
📝 Email: fabricio@meumu.com
📝 Senha (tamanho): 8 caracteres
📝 Personal ID: N/A
✅ Username sanitizado: fabricio
🔍 Detectando estrutura da tabela 'accounts'...
📊 Estrutura detectada: Season 6 (memb___id)
🔍 Verificando se username já existe...
✅ Username disponível
🔍 Verificando se email já existe...
✅ Email disponível
🔐 Senha hashada em MD5: e10adc3949ba59abbe56e057f20f883e
🔐 Tamanho do hash: 32 caracteres (deve ser 32)
💾 Preparando INSERT para Season 6...
💾 Executando INSERT no banco...
✅ Conta inserida no banco com sucesso!
✅ Insert ID: 123
🔑 Gerando token JWT...
✅ Token gerado com sucesso
✅ ========================================
✅ REGISTRO COMPLETO: fabricio
✅ ========================================
```

**Logs esperados em caso de ERRO:**
```
❌ ========================================
❌ ERRO SQL AO INSERIR CONTA
❌ ========================================
❌ Mensagem: Error: Unknown column 'xxx' in 'INSERT INTO'
❌ SQL: INSERT INTO accounts ...
❌ ========================================
```

---

## ✅ **PASSO 7: VERIFICAR NO BANCO SE CONTA FOI CRIADA**

```bash
mysql -u root -p@mysql123@ muonline -e \
  "SELECT memb___id, memb__pwd, CHAR_LENGTH(memb__pwd), mail_addr FROM accounts WHERE memb___id='fabricio';"
```

**Resultado esperado:**
```
+----------+----------------------------------+-------------------------+---------------------+
| memb___id| memb__pwd                        | CHAR_LENGTH(memb__pwd)  | mail_addr           |
+----------+----------------------------------+-------------------------+---------------------+
| fabricio | e10adc3949ba59abbe56e057f20f883e | 32                      | fabricio@meumu.com  |
+----------+----------------------------------+-------------------------+---------------------+
```

✅ **Se aparecer → Conta criada com sucesso!**

---

## ✅ **PASSO 8: TESTAR LOGIN VIA SITE**

### **8.1 - No site, clicar em "Login"**

### **8.2 - Preencher:**
- **Username:** `fabricio` (ou `testefab`)
- **Senha:** `senha123`

### **8.3 - Clicar em "Entrar"**

### **8.4 - Verificar logs:**

**Logs esperados em caso de SUCESSO:**
```
🔐 Tentativa de login: fabricio
✅ Usuário encontrado: fabricio
🔑 Hash da senha no banco: e10adc3949...
🔐 Detectado hash MD5
✅ Senha correta para: fabricio
✅ Login bem-sucedido: fabricio
```

**Logs esperados em caso de ERRO 401:**
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
🔍 DEBUG - Senhas coincidem? true  ← SE APARECER true = BUG NO comparePassword
```

---

## ✅ **PASSO 9: TESTAR LOGIN VIA CURL (DEBUG)**

```bash
# Teste de registro
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testcurl",
    "password": "senha123",
    "email": "testcurl@meumu.com"
  }'

# Teste de login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testefab",
    "password": "senha123"
  }'
```

**Resultado esperado (LOGIN):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "testefab",
      "accountId": "testefab",
      "email": "testefab@meumu.com",
      "isAdmin": false
    }
  },
  "message": "Login realizado com sucesso"
}
```

---

## 🔍 **DIAGNÓSTICO DE PROBLEMAS**

### **Problema 1: Erro 400 no registro**

**Possíveis causas:**

1. **Coluna inexistente no banco**
   ```bash
   # Ver logs do backend
   pm2 logs meumu-backend --lines 50 | grep "Unknown column"
   ```
   
   Se aparecer `Unknown column 'xxx'`, adicione a coluna:
   ```sql
   ALTER TABLE accounts ADD COLUMN IF NOT EXISTS xxx VARCHAR(255);
   ```

2. **Dados inválidos**
   - Ver logs completos do registro
   - Verificar se todos os campos obrigatórios foram enviados

### **Problema 2: Erro 401 no login**

**Diagnóstico:**

```bash
# Ver logs do login
pm2 logs meumu-backend --lines 100 | grep -A 15 "Tentativa de login"
```

**Possíveis causas:**

1. **Senha no banco não está em MD5**
   ```sql
   SELECT memb___id, CHAR_LENGTH(memb__pwd) FROM accounts WHERE memb___id='fabricio';
   ```
   
   Se `CHAR_LENGTH ≠ 32`, atualizar:
   ```sql
   UPDATE accounts 
   SET memb__pwd = MD5('senha123') 
   WHERE memb___id = 'fabricio';
   ```

2. **Bug no comparePassword**
   - Se logs mostram `Senhas coincidem? true` mas dá 401
   - Problema na função `comparePassword` do helpers.js

3. **Usuário não existe**
   ```sql
   SELECT * FROM accounts WHERE memb___id = 'fabricio';
   ```

### **Problema 3: Erro 500 no ranking de guilds**

```bash
# Ver logs
pm2 logs meumu-backend --lines 100 | grep -A 10 "ranking de guilds"

# Executar SQL
mysql -u root -p@mysql123@ muonline
```

```sql
-- Adicionar colunas
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS member_count INT DEFAULT 0;
ALTER TABLE guild_list ADD COLUMN IF NOT EXISTS emblem VARBINARY(32) DEFAULT NULL;
```

---

## ✅ **CHECKLIST FINAL**

- [ ] Código atualizado no servidor
- [ ] SQL de correção executado
- [ ] Conta de teste criada no banco (`testefab`)
- [ ] Backend reiniciado (`pm2 restart all`)
- [ ] Logs monitorados (`pm2 logs`)
- [ ] Registro testado via site
- [ ] Conta verificada no banco
- [ ] Login testado via site
- [ ] Login testado via curl
- [ ] Tudo funcionando? 🎉

---

## 📊 **TABELA DE SENHAS MD5**

| Senha | Hash MD5 |
|-------|----------|
| `senha123` | `e10adc3949ba59abbe56e057f20f883e` |
| `123456` | `e10adc3949ba59abbe56e057f20f883e` |
| `admin` | `21232f297a57a5a743894a0e4a801fc3` |
| `password` | `5f4dcc3b5aa765d61d8327deb882cf99` |
| `muonline` | `7c6a180b36896a0a8c02787eeafb0e4c` |

**Gerar MD5 online:** https://www.md5hashgenerator.com/

---

## 🆘 **SE AINDA NÃO FUNCIONAR**

Envie os seguintes dados:

```bash
# 1. Logs completos
pm2 logs meumu-backend --lines 200 > /tmp/logs-backend.txt
cat /tmp/logs-backend.txt

# 2. Estrutura da tabela accounts
mysql -u root -p@mysql123@ muonline -e "DESCRIBE accounts;" > /tmp/estrutura-accounts.txt
cat /tmp/estrutura-accounts.txt

# 3. Conta de teste
mysql -u root -p@mysql123@ muonline -e \
  "SELECT memb___id, memb__pwd, CHAR_LENGTH(memb__pwd), mail_addr, bloc_code FROM accounts WHERE memb___id='testefab';" \
  > /tmp/conta-teste.txt
cat /tmp/conta-teste.txt

# 4. Status do backend
curl -s http://localhost:3001/health | python3 -m json.tool

# 5. Teste de login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testefab","password":"senha123"}' | python3 -m json.tool
```

Copie a saída de todos os comandos acima e me envie para análise.
