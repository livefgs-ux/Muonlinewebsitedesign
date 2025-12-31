# 🆘 TROUBLESHOOTING - ERROS COMUNS V620

**Data**: 31 de Dezembro de 2025, 19:00 CET (UTC+1)  
**Versão**: 620  

---

## 🚨 PROBLEMA 1: DISTRIBUIR PONTOS - HTTP 500

### Erro no Console

```
PUT https://meumu.com/api/characters/AgoraVai/points 500 (Internal Server Error)
```

### Causa

**Permissões do MySQL/MariaDB** - O usuário `webuser` não tem permissão `UPDATE` no banco `muonline`.

Este é o problema **crítico** documentado na **V619**!

---

### ✅ SOLUÇÃO (OBRIGATÓRIA)

**Você PRECISA executar o script SQL de permissões!**

#### Opção 1: Via MySQL CLI

```bash
# 1. Login como root
mysql -u root -p

# 2. Executar script
source /caminho/para/backend-nodejs/scripts/fix-mysql-permissions.sql

# 3. Verificar
SHOW GRANTS FOR 'webuser'@'localhost';

# 4. Sair
exit;

# 5. Reiniciar backend
pm2 restart all
```

---

#### Opção 2: Via phpMyAdmin

```
1. Login no phpMyAdmin como root
2. Aba "SQL"
3. Copiar conteúdo de: /backend-nodejs/scripts/fix-mysql-permissions.sql
4. Colar no campo SQL
5. Clicar "Executar"
6. Via SSH: pm2 restart all
```

---

#### Opção 3: Comando Manual

```sql
-- Login como root
mysql -u root -p

-- Executar estas permissões
REVOKE ALL PRIVILEGES ON *.* FROM 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.character_info TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_INFO TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.MEMB_STAT TO 'webuser'@'localhost';
GRANT SELECT, UPDATE ON muonline.warehouse TO 'webuser'@'localhost';
GRANT SELECT ON muonline.Character TO 'webuser'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON meuweb.* TO 'webuser'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW GRANTS FOR 'webuser'@'localhost';

-- Sair
exit;
```

```bash
# Reiniciar backend
pm2 restart all
```

---

### 🧪 Teste Após Correção

```
1. Ir para Dashboard → Distribuir Pontos
2. Selecionar personagem "AgoraVai"
3. Adicionar STR +10
4. Clicar "Confirmar Distribuição"

✅ RESULTADO ESPERADO:
   Frontend: Toast verde "Pontos distribuídos com sucesso!"
   Backend Log: "✅ Pontos distribuídos com sucesso para AgoraVai"
   Status HTTP: 200 OK

❌ SE AINDA FALHAR:
   Verifique: SHOW GRANTS FOR 'webuser'@'localhost';
   Deve ter: GRANT SELECT, UPDATE ON `muonline`.`character_info`
```

---

---

## 🚨 PROBLEMA 2: TROCAR SENHA - HTTP 401 (Unauthorized)

### Erro no Console

```
PUT https://meumu.com/api/auth/update-password 401 (Unauthorized)
```

### Causa

**Token JWT inválido, expirado ou não enviado**

Possíveis causas:
1. Token expirou (padrão: 7 dias)
2. Token não está no sessionStorage
3. Frontend não está enviando Authorization header
4. Backend não está reconhecendo o token

---

### ✅ SOLUÇÃO RÁPIDA

#### 1. Verificar Token no Browser

```javascript
// Abra Console (F12) e digite:
console.log('Token:', sessionStorage.getItem('auth_token'));

// ✅ CORRETO:
// Deve retornar algo como: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// ❌ ERRADO:
// null ou undefined → Token não existe!
```

---

#### 2. Se Token = `null`, faça Logout e Login novamente

```
1. Clicar em "Logout" no Dashboard
2. Voltar para tela de Login
3. Fazer login novamente com suas credenciais
4. Ir para Dashboard → Conta → Trocar Senha
5. Tentar trocar senha novamente

✅ DEVE FUNCIONAR agora!
```

---

#### 3. Verificar Headers na Requisição

**Abrir DevTools (F12) → Aba Network**

```
1. Ir para Dashboard → Conta → Trocar Senha
2. Preencher: Senha Atual + Nova Senha + Confirmar
3. Clicar "Alterar Senha"
4. No DevTools → Network → Clicar na requisição "update-password"
5. Aba "Headers" → Verificar "Request Headers"

✅ CORRETO:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Content-Type: application/json

❌ ERRADO:
   Authorization: (não existe ou vazio)
   → Frontend não enviou token!
```

---

### 🔍 Debugging Avançado

#### Verificar Backend Logs

```bash
# Ver logs do backend
tail -f backend-nodejs/logs/server.log

# Fazer request de trocar senha
# O log deve mostrar:

✅ CORRETO:
🔐 ========================================
🔐 UPDATE PASSWORD REQUEST
🔐 ========================================
📝 AccountId: abc123-def456-...
✅ Conta encontrada: jogador123
✅ Senha atual verificada
✅ Senha atualizada com sucesso
PUT /api/auth/update-password 200 XX.XXX ms

❌ SE APARECER:
⚠️ Token inválido ou expirado
PUT /api/auth/update-password 401 X.XXX ms
→ Token está inválido!

OU:

⚠️ Token não fornecido
PUT /api/auth/update-password 401 X.XXX ms
→ Frontend não enviou token!
```

---

### 🛠️ Correção Permanente (Se token sempre expira rápido)

**Verificar expiração do JWT no backend**

```bash
# Editar .env.production
nano backend-nodejs/.env.production
```

```env
# Procurar por:
JWT_EXPIRES_IN=7d

# Se estiver diferente, alterar para:
JWT_EXPIRES_IN=7d  # 7 dias

# Ou aumentar para:
JWT_EXPIRES_IN=30d  # 30 dias (mais tempo logado)
```

```bash
# Reiniciar backend
pm2 restart all
```

---

---

## 🧪 CHECKLIST DE DIAGNÓSTICO COMPLETO

### Problema 1: Distribuir Pontos (500)

- [ ] Executei script SQL `fix-mysql-permissions.sql`?
- [ ] Verifiquei: `SHOW GRANTS FOR 'webuser'@'localhost';`
- [ ] Permissões incluem: `GRANT SELECT, UPDATE ON muonline.character_info`?
- [ ] Reiniciei backend: `pm2 restart all`?
- [ ] Testei distribuir pontos novamente?
- [ ] Backend log mostra: `✅ Pontos distribuídos com sucesso`?

**Se todas as respostas forem SIM → Problema resolvido!**

---

### Problema 2: Trocar Senha (401)

- [ ] Verifiquei: `sessionStorage.getItem('auth_token')` retorna algo?
- [ ] Fiz logout e login novamente?
- [ ] Token aparece no Request Headers (Authorization: Bearer ...)?
- [ ] Backend log mostra qual erro específico?
- [ ] Expiração do JWT está configurada (JWT_EXPIRES_IN=7d)?
- [ ] Testei trocar senha novamente após novo login?

**Se todas as respostas forem SIM → Problema resolvido!**

---

---

## 📋 RESUMO DE AÇÕES

| Problema | Solução Rápida | Tempo |
|----------|----------------|-------|
| **Distribuir Pontos (500)** | Executar `fix-mysql-permissions.sql` + `pm2 restart all` | ~2 min |
| **Trocar Senha (401)** | Fazer Logout → Login novamente | ~30 seg |

---

---

## 🚨 SE AINDA NÃO FUNCIONAR

### Distribuir Pontos (500)

```bash
# Verificar se backend está usando webuser
cat backend-nodejs/.env.production | grep DB_USER

# Deve mostrar:
DB_USER=webuser  # ✅ CORRETO

# Se mostrar:
DB_USER=root  # ❌ ERRADO (nunca usar root!)

# Corrigir:
nano backend-nodejs/.env.production
# Alterar: DB_USER=root → DB_USER=webuser
# Salvar (Ctrl+X, Y, Enter)
pm2 restart all
```

---

### Trocar Senha (401)

```bash
# Verificar backend está rodando
pm2 list

# Deve mostrar:
│ backend │ online │ ...

# Se estiver stopped:
pm2 restart backend

# Verificar logs em tempo real:
pm2 logs backend --lines 50

# Tentar trocar senha e observar logs
```

---

---

## 📞 SUPORTE

**Se nenhuma solução funcionou**, forneça:

1. **Console do Browser (F12)**:
   ```
   Copie TODOS os erros vermelhos
   ```

2. **Backend Logs**:
   ```bash
   tail -100 backend-nodejs/logs/server.log
   ```

3. **Permissões MySQL**:
   ```sql
   SHOW GRANTS FOR 'webuser'@'localhost';
   ```

4. **Variáveis de Ambiente**:
   ```bash
   cat backend-nodejs/.env.production | grep -E 'DB_USER|JWT_'
   ```

---

**MeuMU Online** - Dark Medieval Fantasy Theme  
**Troubleshooting Guide V620** - 2025-12-31 19:00 CET
