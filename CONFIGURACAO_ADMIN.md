# 🔐 Configuração de Privilégios de Administrador

## Sistema de Autenticação e Admin

O site MeuMU Online possui um sistema de autenticação integrado que verifica os privilégios de administrador diretamente no banco de dados MySQL do servidor.

---

## Como Funciona

### 1. Login
Quando um usuário faz login, o sistema:
- ✅ Consulta a tabela `MEMB_INFO` do banco de dados
- ✅ Verifica username e senha (hash MD5)
- ✅ Checa os campos `ctl1_code` e `AccountLevel`
- ✅ Determina automaticamente se o usuário é admin

### 2. Privilégios de Admin
Um usuário é considerado **Administrador** se:
```sql
ctl1_code >= 8  OU  AccountLevel >= 2
```

### 3. Acesso ao AdminCP
- ✅ Apenas usuários com privilégios de admin podem acessar o AdminCP
- ✅ A verificação é feita em tempo real no banco de dados
- ✅ Se a conta não for admin, o acesso é negado automaticamente

---

## Como Configurar um Admin

### Opção 1: Usando SQL (Recomendado)

Conecte ao banco de dados MySQL e execute:

```sql
-- Método 1: Usando ctl1_code (tradicional)
UPDATE MEMB_INFO 
SET ctl1_code = 8 
WHERE memb___id = 'NOME_DO_USUARIO';

-- Método 2: Usando AccountLevel
UPDATE MEMB_INFO 
SET AccountLevel = 2 
WHERE memb___id = 'NOME_DO_USUARIO';

-- Método 3: Configurar ambos (mais seguro)
UPDATE MEMB_INFO 
SET ctl1_code = 8, AccountLevel = 2 
WHERE memb___id = 'NOME_DO_USUARIO';
```

### Opção 2: Usando Cliente MySQL

```bash
# Conecte ao MySQL
mysql -h 23.321.231.227 -u root -p
# Digite a senha: 123123123

# Selecione o banco
USE muonline;

# Configure o admin
UPDATE MEMB_INFO 
SET ctl1_code = 8 
WHERE memb___id = 'SeuUsername';

# Verifique
SELECT memb___id, ctl1_code, AccountLevel 
FROM MEMB_INFO 
WHERE memb___id = 'SeuUsername';
```

### Opção 3: Durante Registro de Conta

Você pode criar uma conta admin direto:

```sql
INSERT INTO MEMB_INFO 
(memb___id, memb__pwd, memb_name, mail_addr, bloc_code, ctl1_code, AccountLevel) 
VALUES 
('admin', MD5('senha123'), 'Administrador', 'admin@meumuonline.com', 0, 8, 2);
```

---

## Níveis de Privilégio

### ctl1_code (Código de Controle)
| Valor | Descrição |
|-------|-----------|
| 0-7   | Usuário Normal |
| 8     | Game Master (GM) |
| 9-15  | Administrador |

### AccountLevel
| Valor | Descrição |
|-------|-----------|
| 0     | Usuário Normal |
| 1     | VIP/Premium |
| 2     | Administrador |
| 3+    | Super Admin |

---

## Estrutura da Tabela MEMB_INFO

Campos importantes para autenticação:

```sql
memb___id      -- Username da conta
memb__pwd      -- Senha (hash MD5 em uppercase)
memb_name      -- Nome do jogador
mail_addr      -- Email da conta
bloc_code      -- 0 = Ativo, 1 = Bloqueado
ctl1_code      -- Nível de controle/admin
AccountLevel   -- Nível da conta
```

---

## Verificar Admin Via API

### Endpoint: GET /api/auth/verify

```bash
curl "http://localhost:3001/api/auth/verify?username=USUARIO"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "isAdmin": true,
    "adminLevel": 8,
    "accountLevel": 2,
    "blocked": false
  }
}
```

---

## Login via API

### Endpoint: POST /api/auth/login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "senha123"
  }'
```

**Resposta (Admin):**
```json
{
  "success": true,
  "data": {
    "user": {
      "username": "admin",
      "name": "Administrador",
      "email": "admin@meumuonline.com",
      "isAdmin": true,
      "adminLevel": 8,
      "accountLevel": 2
    },
    "characters": [
      {
        "name": "MeuChar",
        "level": 400,
        "class": 0,
        "resets": 5,
        "zen": 1000000
      }
    ],
    "token": "..."
  }
}
```

---

## Segurança

### Hash de Senha
O MU Online geralmente usa **MD5** para senhas:
- Senha é convertida para MD5
- Hash é armazenado em **UPPERCASE**
- Exemplo: `senha123` → `482C811DA5D5B4BC6D497FFA98491E38`

### Ajustar Hash (se necessário)
Se seu servidor usa outro método de hash, edite o arquivo:
`/server/routes/auth.js` na função `hashPassword()`:

```javascript
// MD5 (padrão)
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex').toUpperCase();
}

// SHA256 (alternativo)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex').toUpperCase();
}

// SHA1 (alternativo)
function hashPassword(password) {
  return crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
}
```

---

## Proteção de Rotas no Frontend

### AdminCP Protegido

O AdminCP só é acessível para admins:

```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Rota protegida - requer admin
<ProtectedRoute requireAdmin={true}>
  <AdminCP />
</ProtectedRoute>

// Rota protegida - só requer login
<ProtectedRoute>
  <MinhaConta />
</ProtectedRoute>
```

---

## Testando o Sistema

### 1. Criar conta admin
```sql
UPDATE MEMB_INFO SET ctl1_code = 8 WHERE memb___id = 'testadmin';
```

### 2. Fazer login no site
- Acesse: `http://localhost:5173/login`
- Use as credenciais da conta

### 3. Verificar acesso ao AdminCP
- Se for admin: AdminCP aparecerá no menu
- Se não for admin: Acesso negado ao tentar acessar

---

## Troubleshooting

### "Usuário ou senha incorretos"
- ✅ Verifique se a conta existe: `SELECT * FROM MEMB_INFO WHERE memb___id = 'usuario'`
- ✅ Verifique o hash da senha: `SELECT memb__pwd FROM MEMB_INFO WHERE memb___id = 'usuario'`
- ✅ Teste o hash manualmente: `echo -n "senha" | md5sum`

### "Privilégios insuficientes"
- ✅ Verifique ctl1_code: `SELECT ctl1_code FROM MEMB_INFO WHERE memb___id = 'usuario'`
- ✅ Deve ser >= 8 para admin
- ✅ Configure: `UPDATE MEMB_INFO SET ctl1_code = 8 WHERE memb___id = 'usuario'`

### "Conta bloqueada"
- ✅ Verifique bloc_code: `SELECT bloc_code FROM MEMB_INFO WHERE memb___id = 'usuario'`
- ✅ Desbloqueie: `UPDATE MEMB_INFO SET bloc_code = 0 WHERE memb___id = 'usuario'`

---

## Scripts SQL Úteis

### Listar todos os admins
```sql
SELECT memb___id, memb_name, ctl1_code, AccountLevel 
FROM MEMB_INFO 
WHERE ctl1_code >= 8 OR AccountLevel >= 2;
```

### Promover usuário a admin
```sql
UPDATE MEMB_INFO 
SET ctl1_code = 8, AccountLevel = 2 
WHERE memb___id = 'USUARIO';
```

### Remover privilégios de admin
```sql
UPDATE MEMB_INFO 
SET ctl1_code = 0, AccountLevel = 0 
WHERE memb___id = 'USUARIO';
```

### Criar nova conta admin
```sql
INSERT INTO MEMB_INFO 
(memb___id, memb__pwd, memb_name, mail_addr, bloc_code, ctl1_code, AccountLevel) 
VALUES 
('admin', MD5('admin123'), 'Admin', 'admin@mu.com', 0, 8, 2);
```

---

## ⚔️ MeuMU Online - Sistema de Autenticação

**Conectando jogadores ao banco de dados real do servidor!**