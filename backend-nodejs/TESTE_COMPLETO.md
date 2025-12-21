# 🧪 TESTE COMPLETO - Backend MeuMU Online

**Objetivo:** Verificar se todos os 18 endpoints estão funcionando corretamente  
**Tempo estimado:** 10-15 minutos  
**Pré-requisito:** Backend rodando (`npm start`)

---

## ✅ PRÉ-REQUISITOS

Antes de começar os testes:

```bash
# 1. Backend deve estar rodando
npm start

# 2. Verificar se está rodando
curl http://localhost:3001/health

# 3. Ter um usuário no banco
# (vamos usar um existente ou criar via /api/auth/register)
```

---

## 🎯 TESTE 1: Health Check

**Objetivo:** Verificar se API está funcionando

```bash
curl http://localhost:3001/health
```

**Resultado esperado:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "MeuMU Online API está funcionando!",
  "database": "connected",
  "timestamp": "2024-12-21T...",
  "uptime": 123.456
}
```

**Checklist:**
- [ ] `success: true`
- [ ] `status: "healthy"`
- [ ] `database: "connected"`
- [ ] HTTP Status 200

---

## 🎯 TESTE 2: Root Endpoint

**Objetivo:** Verificar lista de endpoints

```bash
curl http://localhost:3001/
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "MeuMU Online API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "rankings": "/api/rankings",
    "characters": "/api/characters",
    ...
  }
}
```

**Checklist:**
- [ ] Lista de endpoints presente
- [ ] Versão da API mostrada
- [ ] HTTP Status 200

---

## 🎯 TESTE 3: Server Info

**Objetivo:** Informações do servidor

```bash
curl http://localhost:3001/api/server/info
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "name": "MeuMU Online",
    "version": "Season 19-2-3 - Épico",
    "rates": {
      "exp": "1000x",
      "drop": "50%"
    },
    "limits": {
      "maxReset": 500,
      "maxGrandReset": 50
    }
  }
}
```

**Checklist:**
- [ ] Nome do servidor correto
- [ ] Versão correta
- [ ] Rates configuradas
- [ ] HTTP Status 200

---

## 🎯 TESTE 4: Server Stats (Dados Reais)

**Objetivo:** Estatísticas do banco de dados

```bash
curl http://localhost:3001/api/server/stats
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "totalAccounts": 150,
    "totalCharacters": 320,
    "playersOnline": 5,
    "totalGuilds": 12,
    "topReset": {
      "Name": "PlayerName",
      "ResetCount": 250
    },
    "lastUpdate": "2024-12-21T..."
  }
}
```

**Checklist:**
- [ ] Números fazem sentido (não são 0 se há dados no banco)
- [ ] `totalAccounts` > 0
- [ ] `totalCharacters` >= 0
- [ ] HTTP Status 200

**⚠️ Se retornar tudo 0:**
- Verifique se o banco tem dados
- Verifique se as tabelas existem (MEMB_INFO, Character, Guild)
- Verifique conexão com banco

---

## 🎯 TESTE 5: Rankings - Top Resets

**Objetivo:** Ranking de resets

```bash
curl "http://localhost:3001/api/rankings/resets?limit=10"
```

**Resultado esperado:**
```json
{
  "success": true,
  "rankings": [
    {
      "position": 1,
      "name": "PlayerName",
      "class": "DarkKnight",
      "level": 400,
      "resetCount": 250,
      "grandResetCount": 10
    },
    ...
  ],
  "total": 320
}
```

**Checklist:**
- [ ] Array de rankings
- [ ] Ordenado por resets (decrescente)
- [ ] Campos presentes: name, class, level, resetCount
- [ ] HTTP Status 200

---

## 🎯 TESTE 6: Rankings - Top Level

```bash
curl "http://localhost:3001/api/rankings/level?limit=10"
```

**Resultado esperado:**
```json
{
  "success": true,
  "rankings": [
    {
      "position": 1,
      "name": "PlayerName",
      "class": "DarkKnight",
      "level": 400,
      ...
    }
  ]
}
```

**Checklist:**
- [ ] Ordenado por level (decrescente)
- [ ] HTTP Status 200

---

## 🎯 TESTE 7: Rankings - Top PK

```bash
curl "http://localhost:3001/api/rankings/pk?limit=10"
```

**Resultado esperado:**
```json
{
  "success": true,
  "rankings": [
    {
      "position": 1,
      "name": "PlayerName",
      "pkLevel": 5,
      "pkCount": 150,
      ...
    }
  ]
}
```

**Checklist:**
- [ ] Ordenado por PK (decrescente)
- [ ] HTTP Status 200

---

## 🎯 TESTE 8: Rankings - Top Guilds

```bash
curl "http://localhost:3001/api/rankings/guilds?limit=10"
```

**Resultado esperado:**
```json
{
  "success": true,
  "rankings": [
    {
      "position": 1,
      "name": "GuildName",
      "master": "MasterName",
      "score": 5000,
      "memberCount": 50
    }
  ]
}
```

**Checklist:**
- [ ] Lista de guilds
- [ ] Campos: name, master, score, memberCount
- [ ] HTTP Status 200

---

## 🎯 TESTE 9: Autenticação - Registro (Criar conta de teste)

**⚠️ IMPORTANTE:** Vamos criar uma conta de teste para os próximos testes

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testeapi",
    "password": "Teste@123",
    "email": "teste@meumu.com",
    "personalId": "12345678901"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso!",
  "data": {
    "accountId": "testeapi"
  }
}
```

**Checklist:**
- [ ] Conta criada com sucesso
- [ ] HTTP Status 201

**❌ Se der erro "conta já existe":**
- Tudo bem! Use uma conta existente no próximo teste
- Ou use outro username: `testeapi2`, `testeapi3`, etc

---

## 🎯 TESTE 10: Autenticação - Login

**Objetivo:** Fazer login e obter token JWT

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testeapi",
    "password": "Teste@123"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accountId": "testeapi",
    "email": "teste@meumu.com"
  }
}
```

**⚠️ IMPORTANTE:** Copie o `token` retornado! Vamos usar nos próximos testes.

**Checklist:**
- [ ] Login bem-sucedido
- [ ] Token JWT retornado
- [ ] accountId correto
- [ ] HTTP Status 200

**Variável de ambiente (facilita testes):**
```bash
# Cole o token aqui (substituir XXX pelo token real)
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXX"
```

---

## 🎯 TESTE 11: Autenticação - Verificar Token

**Objetivo:** Validar se o token está funcionando

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "success": true,
  "valid": true,
  "data": {
    "accountId": "testeapi"
  }
}
```

**Checklist:**
- [ ] Token válido
- [ ] accountId retornado
- [ ] HTTP Status 200

---

## 🎯 TESTE 12: Autenticação - Info da Conta

**Objetivo:** Obter informações da conta logada

```bash
curl http://localhost:3001/api/auth/account \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "accountId": "testeapi",
    "email": "teste@meumu.com",
    "name": "testeapi",
    "memberPoints": 0,
    "createdAt": "2024-12-21T..."
  }
}
```

**Checklist:**
- [ ] Dados da conta retornados
- [ ] Email correto
- [ ] HTTP Status 200

---

## 🎯 TESTE 13: Personagens - Listar

**Objetivo:** Listar personagens da conta

```bash
curl http://localhost:3001/api/characters \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "success": true,
  "characters": [
    {
      "name": "CharName",
      "class": "DarkKnight",
      "level": 150,
      "resetCount": 5,
      "strength": 500,
      "agility": 300,
      ...
    }
  ]
}
```

**Checklist:**
- [ ] Lista de personagens (pode ser vazia se conta nova)
- [ ] Campos corretos se houver personagens
- [ ] HTTP Status 200

**⚠️ Se retornar array vazio:**
- Normal se a conta não tem personagens
- Crie um personagem no jogo ou use outra conta nos próximos testes

---

## 🎯 TESTE 14: Personagens - Detalhes

**⚠️ Pule se não tem personagens**

```bash
# Substitua CHAR_NAME pelo nome de um personagem real
curl http://localhost:3001/api/characters/CHAR_NAME \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "success": true,
  "character": {
    "name": "CHAR_NAME",
    "class": "DarkKnight",
    "level": 150,
    "strength": 500,
    "agility": 300,
    "vitality": 200,
    "energy": 100,
    "command": 0,
    "levelUpPoints": 50,
    "resetCount": 5,
    ...
  }
}
```

**Checklist:**
- [ ] Detalhes completos do personagem
- [ ] Stats corretos
- [ ] HTTP Status 200

---

## 🎯 TESTE 15: WCoin - Saldo

**Objetivo:** Verificar saldo de WCoin

```bash
curl http://localhost:3001/api/wcoin/balance \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "success": true,
  "balance": {
    "wcoin": 0,
    "goblinPoints": 0
  }
}
```

**Checklist:**
- [ ] Saldo retornado (pode ser 0)
- [ ] HTTP Status 200

---

## 🎯 TESTE 16: Eventos - Listar

**Objetivo:** Listar eventos ativos

```bash
curl http://localhost:3001/api/events
```

**Resultado esperado:**
```json
{
  "success": true,
  "events": [
    {
      "name": "Blood Castle",
      "nextTime": "2024-12-21T14:00:00Z",
      "duration": 15,
      "minLevel": 15
    },
    ...
  ]
}
```

**Checklist:**
- [ ] Lista de eventos
- [ ] Horários configurados
- [ ] HTTP Status 200

---

## 🎯 TESTE 17: Notícias - Listar

**Objetivo:** Listar notícias

```bash
curl http://localhost:3001/api/news
```

**Resultado esperado:**
```json
{
  "success": true,
  "news": [
    {
      "id": 1,
      "title": "Bem-vindo ao MeuMU Online!",
      "content": "...",
      "category": "announcement",
      "author": "Admin",
      "createdAt": "2024-12-21T...",
      "views": 100
    }
  ],
  "total": 1
}
```

**Checklist:**
- [ ] Lista de notícias (pode estar vazia)
- [ ] HTTP Status 200

---

## 🎯 TESTE 18: Sandbox - Teste de Banco

**Objetivo:** Testar conexão direta com banco

```bash
curl http://localhost:3001/api/sandbox/test-db
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Conexão com banco funcionando!",
  "data": {
    "totalAccounts": 150,
    "firstAccount": {
      "memb___id": "admin",
      "mail_addr": "admin@meumu.com"
    }
  }
}
```

**Checklist:**
- [ ] Conexão OK
- [ ] Dados do banco retornados
- [ ] HTTP Status 200

---

## 🎯 TESTE 19: Erro 404 (Rota não existe)

**Objetivo:** Testar tratamento de erro

```bash
curl http://localhost:3001/api/rota-inexistente
```

**Resultado esperado:**
```json
{
  "success": false,
  "error": "Rota não encontrada",
  "path": "/api/rota-inexistente"
}
```

**Checklist:**
- [ ] Retorna 404
- [ ] Mensagem de erro clara
- [ ] HTTP Status 404

---

## 🎯 TESTE 20: Rate Limiting

**Objetivo:** Testar proteção contra abuso

```bash
# Fazer 110 requisições rápidas (limite é 100)
for i in {1..110}; do
  curl -s http://localhost:3001/api/server/info > /dev/null
  echo "Requisição $i"
done

# Após isso, testar:
curl http://localhost:3001/api/server/info
```

**Resultado esperado (após exceder limite):**
```json
{
  "success": false,
  "error": "Muitas requisições. Tente novamente mais tarde."
}
```

**Checklist:**
- [ ] Bloqueio após 100 requisições
- [ ] HTTP Status 429
- [ ] Mensagem de erro adequada

**⚠️ Aguarde 15 minutos para limite resetar**

---

## 📊 RESUMO DOS TESTES

### **Tabela de Resultados:**

| # | Teste | Status | HTTP | Observações |
|---|-------|--------|------|-------------|
| 1 | Health Check | ⬜ | 200 | |
| 2 | Root Endpoint | ⬜ | 200 | |
| 3 | Server Info | ⬜ | 200 | |
| 4 | Server Stats | ⬜ | 200 | Dados reais |
| 5 | Rankings - Resets | ⬜ | 200 | |
| 6 | Rankings - Level | ⬜ | 200 | |
| 7 | Rankings - PK | ⬜ | 200 | |
| 8 | Rankings - Guilds | ⬜ | 200 | |
| 9 | Auth - Register | ⬜ | 201 | |
| 10 | Auth - Login | ⬜ | 200 | Copiar token |
| 11 | Auth - Verify | ⬜ | 200 | |
| 12 | Auth - Account | ⬜ | 200 | |
| 13 | Characters - List | ⬜ | 200 | |
| 14 | Characters - Details | ⬜ | 200 | Se houver char |
| 15 | WCoin - Balance | ⬜ | 200 | |
| 16 | Events - List | ⬜ | 200 | |
| 17 | News - List | ⬜ | 200 | |
| 18 | Sandbox - Test DB | ⬜ | 200 | |
| 19 | Error 404 | ⬜ | 404 | |
| 20 | Rate Limiting | ⬜ | 429 | Após 100 req |

**Legenda:**
- ✅ Passou
- ❌ Falhou
- ⬜ Não testado
- ⚠️ Aviso/Observação

---

## 🔧 TROUBLESHOOTING

### **Problema: Todos os testes retornam erro de conexão**

```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Se não responder:
npm start

# Verificar logs
npm run logs
```

---

### **Problema: "Database: disconnected" no health check**

```bash
# Testar conexão com banco manualmente
node test-db-connection.js

# Verificar .env
cat .env | grep DB_

# Verificar se MariaDB está rodando
systemctl status mariadb
```

---

### **Problema: Stats retornam tudo 0**

**Causa:** Banco vazio ou tabelas com nomes diferentes

**Solução:**
```sql
-- Verificar se tabelas existem
SHOW TABLES LIKE 'MEMB_INFO';
SHOW TABLES LIKE 'Character';
SHOW TABLES LIKE 'Guild';

-- Se existirem, verificar dados
SELECT COUNT(*) FROM MEMB_INFO;
SELECT COUNT(*) FROM Character;
```

---

### **Problema: Rankings vazios**

**Normal se:**
- Banco novo sem personagens
- Todos os personagens têm 0 resets/pk

**Criar dados de teste:**
```sql
-- Inserir conta de teste
INSERT INTO MEMB_INFO (memb___id, memb__pwd, mail_addr, bloc_code, ctl1_code)
VALUES ('testeapi', '1234', 'teste@meumu.com', 0, 0);

-- Inserir personagem de teste (ajustar conforme schema)
INSERT INTO Character (AccountID, Name, cLevel, Class, ResetCount)
VALUES ('testeapi', 'TestChar', 400, 0, 100);
```

---

## ✅ CHECKLIST FINAL

Antes de considerar os testes concluídos:

- [ ] 18+ testes executados
- [ ] Health check funcionando
- [ ] Conexão com banco OK
- [ ] Rankings retornando dados (se houver)
- [ ] Autenticação funcionando (login + token)
- [ ] Endpoints protegidos exigem token
- [ ] Rate limiting ativo
- [ ] Erros retornam mensagens claras
- [ ] Sem erros críticos nos logs

---

## 📝 RELATÓRIO

**Data do teste:** ___/___/______  
**Versão do backend:** 1.0.0  
**Testes executados:** __ / 20  
**Testes bem-sucedidos:** __ / 20  
**Taxa de sucesso:** ___%

**Problemas encontrados:**
1. _______________
2. _______________
3. _______________

**Observações:**
_______________

---

**🎯 Testes completos! Backend 100% validado. 🚀**
