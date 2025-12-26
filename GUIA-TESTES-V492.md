# 🧪 GUIA DE TESTES - VERSÃO 492

## 🎯 OBJETIVO

Verificar que o site está **100% SEM MOCKS** e funcionando com dados reais do banco de dados.

---

## 📋 PRÉ-REQUISITOS

```bash
# 1. Backend rodando
cd /home/meumu.com/public_html/backend-nodejs
pm2 status meumu-backend
# OU
ps aux | grep node | grep server.js

# 2. Frontend buildado
ls -la /home/meumu.com/public_html/dist

# 3. MySQL rodando
systemctl status mariadb

# 4. Porta 3001 acessível
curl http://localhost:3001/health
```

---

## ✅ TESTE 1: VALIDAÇÃO DE SENHA FORTE

### **Objetivo:** Verificar que senhas fracas são BLOQUEADAS

### **Comandos:**

```bash
# 1.1 - Testar senha SEM maiúscula (DEVE FALHAR)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste001",
    "email": "teste001@test.com",
    "password": "senha123!"
  }'

# ✅ RESULTADO ESPERADO:
# {
#   "success": false,
#   "error": "Senha muito fraca. Faltam: 1 letra maiúscula"
# }
```

```bash
# 1.2 - Testar senha COM SEQUÊNCIA "123" (DEVE FALHAR)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste002",
    "email": "teste002@test.com",
    "password": "Pass123!abc"
  }'

# ✅ RESULTADO ESPERADO:
# {
#   "success": false,
#   "error": "A senha não pode conter sequências óbvias (abc, 123)..."
# }
```

```bash
# 1.3 - Testar senha COM REPETIÇÃO "aaa" (DEVE FALHAR)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste003",
    "email": "teste003@test.com",
    "password": "Passaaa1!"
  }'

# ✅ RESULTADO ESPERADO:
# {
#   "success": false,
#   "error": "A senha não pode conter sequências óbvias... ou caracteres repetidos (aaa, 111)."
# }
```

```bash
# 1.4 - Testar senha FORTE VÁLIDA (DEVE PASSAR)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste004",
    "email": "teste004@test.com",
    "password": "Pass@1x9Z"
  }'

# ✅ RESULTADO ESPERADO:
# {
#   "success": true,
#   "message": "Conta criada com sucesso",
#   "data": {
#     "token": "eyJhbGc...",
#     "user": {
#       "username": "teste004",
#       ...
#     }
#   }
# }
```

---

## ✅ TESTE 2: LOGIN E DASHBOARD SEM MOCKS

### **Objetivo:** Verificar que dashboard mostra dados REAIS do banco

### **Passo a Passo:**

1. **Abra o navegador:**
   ```
   http://meumu.com
   OU
   http://localhost:3001 (desenvolvimento)
   ```

2. **Faça Login:**
   - Use uma conta REAL do banco de dados
   - **NÃO deve aceitar:** "SoulMageX", "SaulNoob", "testuser" (mocks antigos)

3. **Clique em "Dashboard"**

4. **VERIFICAR - O que DEVE aparecer:**

   ✅ **Aba "Minha Conta":**
   ```
   Nome de Usuário: [SEU USERNAME DO BANCO]
   Email: [SEU EMAIL DO BANCO]
   Status: Ativa (se não bloqueado)
   Data de Criação: [DATA REAL DO BANCO]
   VIP Level: [VALOR REAL DO BANCO]
   ```

   ✅ **Cards de Estatísticas:**
   ```
   WCoin: [VALOR REAL - cashCredits do banco]
   VIP Level: [VALOR REAL - AccountLevel do banco]
   Personagens: [QUANTIDADE REAL de chars na Character table]
   ```

   ✅ **Aba "Personagens":**
   - Lista seus personagens REAIS do banco
   - Nome, Classe, Level, Resets corretos
   - Status Online/Offline correto
   - Guild correto

5. **VERIFICAR - O que NÃO DEVE aparecer:**

   ❌ **MOCKS ANTIGOS (SE APARECER, ALGO ESTÁ ERRADO!):**
   ```
   ❌ Username: "SoulMageX"
   ❌ Email: "player@meumu.com"
   ❌ WCoin: 2150 (valor fixo)
   ❌ Personagem: "DarkKnightX" (se você não tem esse char)
   ❌ Personagem: "ElfArcher" (se você não tem esse char)
   ❌ Guild: "Phoenix" (se você não está nessa guild)
   ❌ Location: "Noria" se personagem está em outro mapa
   ```

---

## ✅ TESTE 3: DISTRIBUIR PONTOS (INTEGRAÇÃO REAL)

### **Objetivo:** Verificar que pontos são salvos no banco de dados

### **Passo a Passo:**

1. **No Dashboard, vá para aba "Personagens"**
2. **Selecione um personagem que tenha pontos disponíveis**
3. **Vá para aba "Distribuir Pontos"**

4. **VERIFICAR:**
   ```
   ✅ Pontos Disponíveis: [VALOR REAL do LevelUpPoint no banco]
   ✅ STR Atual: [VALOR REAL do Strength no banco]
   ✅ AGI Atual: [VALOR REAL do Dexterity no banco]
   ✅ VIT Atual: [VALOR REAL do Vitality no banco]
   ✅ ENE Atual: [VALOR REAL do Energy no banco]
   ```

5. **Adicione alguns pontos (ex: +5 STR)**
6. **Clique em "Aplicar Pontos"**

7. **VERIFICAR NO BANCO:**
   ```sql
   -- No MySQL/MariaDB:
   SELECT Name, Strength, LevelUpPoint 
   FROM Character 
   WHERE Name = 'SEU_PERSONAGEM';
   
   -- ✅ DEVE MOSTRAR:
   -- Strength aumentado em 5
   -- LevelUpPoint diminuído em 5
   ```

8. **Recarregar página:**
   - Dashboard deve mostrar novos valores
   - Pontos devem persistir (não voltar ao estado anterior)

---

## ✅ TESTE 4: RESET DE PERSONAGEM (INTEGRAÇÃO REAL)

### **⚠️ ATENÇÃO:** Este teste MODIFICA o personagem no banco!

### **Passo a Passo:**

1. **Use um personagem de TESTE (level 400)**
2. **Vá para aba "Reset"**

3. **VERIFICAR Requisitos:**
   ```
   ✅ Level Atual: 400 (verde)
   ✅ Resets Atuais: [VALOR REAL]
   ✅ Botão "Fazer Reset" habilitado
   ```

4. **Se level < 400:**
   ```
   ❌ Botão desabilitado: "Level Insuficiente"
   ```

5. **Clique em "Fazer Reset"**
6. **Confirme no popup**

7. **VERIFICAR NO BANCO:**
   ```sql
   -- No MySQL/MariaDB:
   SELECT Name, cLevel, Resets 
   FROM Character 
   WHERE Name = 'SEU_PERSONAGEM';
   
   -- ✅ DEVE MOSTRAR:
   -- cLevel = 1 (voltou ao level 1)
   -- Resets = [VALOR ANTERIOR + 1]
   ```

---

## ✅ TESTE 5: ANTI-ENUMERAÇÃO DE USUÁRIOS

### **Objetivo:** Verificar que mensagens de erro NÃO expõem se usuário existe

### **Comandos:**

```bash
# 5.1 - Tentar registrar username que JÁ EXISTE
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "novo@email.com",
    "password": "Pass@1x9Z"
  }'

# ✅ RESULTADO ESPERADO (MENSAGEM GENÉRICA):
# {
#   "success": false,
#   "error": "Erro ao criar conta. Verifique os dados e tente novamente."
# }

# ❌ NÃO DEVE MOSTRAR:
# "Username já existe"  (expõe enumeração)
```

```bash
# 5.2 - Tentar registrar email que JÁ EXISTE
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "novousuario",
    "email": "admin@meumu.com",
    "password": "Pass@1x9Z"
  }'

# ✅ RESULTADO ESPERADO (MENSAGEM GENÉRICA):
# {
#   "success": false,
#   "error": "Erro ao criar conta. Verifique os dados e tente novamente."
# }

# ❌ NÃO DEVE MOSTRAR:
# "Email já cadastrado"  (expõe enumeração)
```

---

## ✅ TESTE 6: SQL INJECTION (SEGURANÇA)

### **Objetivo:** Verificar que prepared statements bloqueiam SQL injection

### **Comandos:**

```bash
# 6.1 - Tentar SQL injection no username
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin\" OR 1=1--",
    "email": "hack@test.com",
    "password": "Pass@1x9Z"
  }'

# ✅ RESULTADO ESPERADO:
# {
#   "success": false,
#   "error": "Erro ao criar conta..."
# }
# OU registro normal (tratado como username literal)

# ❌ NÃO DEVE:
# - Executar comando SQL malicioso
# - Retornar erro SQL exposto
# - Permitir bypass de autenticação
```

```bash
# 6.2 - Tentar SQL injection no login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin\" OR \"1\"=\"1",
    "password": "anything"
  }'

# ✅ RESULTADO ESPERADO:
# {
#   "success": false,
#   "error": "Usuário ou senha incorretos"
# }

# ❌ NÃO DEVE:
# - Fazer login sem senha correta
# - Retornar todos os usuários
# - Executar comando SQL malicioso
```

---

## ✅ TESTE 7: XSS PROTECTION

### **Objetivo:** Verificar que Content Security Policy bloqueia scripts maliciosos

### **Passo a Passo:**

1. **Abra o Console do Navegador (F12)**
2. **Vá para aba "Network"**
3. **Recarregue a página**
4. **Clique em qualquer requisição e veja os Headers**

5. **VERIFICAR Headers de Segurança:**
   ```
   ✅ Content-Security-Policy: present
   ✅ X-Content-Type-Options: nosniff
   ✅ X-Frame-Options: DENY
   ✅ Strict-Transport-Security: max-age=31536000
   ```

6. **Testar XSS no Console:**
   ```javascript
   // Cole no console do navegador:
   localStorage.setItem('test', '<script>alert("XSS")</script>');
   document.body.innerHTML = localStorage.getItem('test');
   ```

   **✅ RESULTADO ESPERADO:**
   - Script NÃO executa
   - CSP bloqueia com erro no console

---

## ✅ TESTE 8: RATE LIMITING

### **Objetivo:** Verificar que rate limiting bloqueia brute force

### **Comandos:**

```bash
# 8.1 - Fazer 6 tentativas de login em 1 minuto
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"teste","password":"errada"}';
  echo ""
done

# ✅ RESULTADO ESPERADO:
# Primeiras 5: {"success":false,"error":"Usuário ou senha incorretos"}
# 6ª tentativa: {
#   "success": false,
#   "error": "Muitas tentativas de login. Tente novamente em 15 minutos."
# }
```

```bash
# 8.2 - Fazer 4 registros em 1 hora
for i in {1..4}; do
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"teste$i\",\"email\":\"teste$i@test.com\",\"password\":\"Pass@1x9Z\"}";
  echo ""
done

# ✅ RESULTADO ESPERADO:
# Primeiras 3: sucesso
# 4ª tentativa: {
#   "success": false,
#   "error": "Muitos registros criados. Tente novamente em 1 hora."
# }
```

---

## 📊 CHECKLIST FINAL

### **✅ TESTES OBRIGATÓRIOS**

- [ ] Senha fraca BLOQUEADA
- [ ] Senha com sequência BLOQUEADA
- [ ] Senha forte ACEITA
- [ ] Dashboard mostra dados REAIS do banco
- [ ] NÃO aparece "SoulMageX", "2150 WCoin" ou outros mocks
- [ ] Personagens são os REAIS do banco
- [ ] Distribuir pontos SALVA no banco
- [ ] Reset MODIFICA personagem no banco
- [ ] Mensagens de erro NÃO expõem enumeração
- [ ] SQL injection BLOQUEADO
- [ ] XSS Protection ativa (CSP headers)
- [ ] Rate limiting funciona (5 login, 3 register)

### **⚠️ SINAIS DE PROBLEMA**

❌ **SE QUALQUER UM DESSES APARECER, ALGO ESTÁ ERRADO:**

- Username "SoulMageX" no dashboard
- WCoin fixo em "2150"
- Personagem "DarkKnightX" que não existe
- Email "player@meumu.com" ou "saul@muserver.com"
- Pontos distribuídos não salvam no banco
- Reset não modifica personagem
- Senha "123456" aceita no registro
- Mensagem "Username já existe" exposta
- SQL injection funciona
- Rate limiting não bloqueia após limites

---

## 🚨 TROUBLESHOOTING

### **Problema: Dashboard mostra dados fictícios**

```bash
# 1. Verificar se está usando o componente correto:
grep -r "dashboard-section" src/app/
# ✅ NÃO deve encontrar nada (arquivo foi deletado)

# 2. Verificar se PlayerDashboard está carregando:
grep -r "PlayerDashboard" src/app/App.tsx
# ✅ DEVE mostrar import do player/PlayerDashboard

# 3. Limpar cache e rebuild:
rm -rf dist/
npm run build
```

### **Problema: Validação de senha não funciona**

```bash
# Verificar se middleware está ativado:
grep "validatePasswordStrength" backend-nodejs/src/routes/auth.js
# ✅ DEVE estar DESCOMENTADO (sem //)

# Verificar logs do backend:
tail -f backend-nodejs/logs/server.log
# Procurar por: "🚫 Senha rejeitada"
```

### **Problema: Rate limiting não funciona**

```bash
# Verificar se express-rate-limit está instalado:
npm list express-rate-limit

# Verificar middlewares nas rotas:
grep "loginRateLimiter" backend-nodejs/src/routes/auth.js
grep "registerRateLimiter" backend-nodejs/src/routes/auth.js
```

---

## 📞 SUPORTE

Se TODOS os testes passarem:

**🎉 PARABÉNS! SITE 100% REAL - SEM MOCKS!**

Se algum teste FALHAR:

1. Verifique logs: `tail -f backend-nodejs/logs/server.log`
2. Teste endpoint direto: `curl http://localhost:3001/health`
3. Confirme MySQL rodando: `systemctl status mariadb`
4. Rebuild frontend: `npm run build`

---

**DATA DO TESTE:** _______________________  
**TESTADO POR:** _______________________  
**RESULTADO:** [ ] ✅ PASSOU  [ ] ❌ FALHOU  
**OBSERVAÇÕES:** _______________________
