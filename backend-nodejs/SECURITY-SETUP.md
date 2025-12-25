# 🔐 CONFIGURAÇÃO DE SEGURANÇA - USUÁRIO MySQL WEBUSER

## ✅ O QUE FOI IMPLEMENTADO

### **1. Novo Usuário MySQL Seguro**
- **Usuário:** `webuser`
- **Senha:** `@meusite123@`
- **Permissões Limitadas:**
  - ✅ **Database `muonline`:** SELECT (READ-ONLY)
  - ✅ **Database `webmu`:** SELECT, INSERT, UPDATE, DELETE (READ+WRITE)
  - ❌ **SEM permissões perigosas:** DROP, CREATE, ALTER, GRANT

### **2. Arquivo .env.production Corrigido**
- ✅ `NODE_ENV=production` (modo seguro)
- ✅ `FRONTEND_URL=https://meumu.com` (HTTPS obrigatório)
- ✅ `ALLOWED_ORIGINS=https://meumu.com` (sem localhost)
- ✅ `DB_USER=webuser` (usuário limitado)
- ✅ `DB_PASSWORD=@meusite123@` (senha real, não placeholder)

### **3. Proteções Automáticas no install.sh**
- ✅ Mata TODOS os processos Node.js (duplicação)
- ✅ Verifica porta 3001 livre (EADDRINUSE)
- ✅ Valida .env sem placeholders
- ✅ Testa MySQL antes de iniciar
- ✅ **Cria usuário `webuser` automaticamente**

---

## 📋 COMO USAR

### **OPÇÃO 1: Instalação Automática (RECOMENDADO)**

```bash
cd /home/meumu.com/public_html
./install.sh
# Escolher opção 1 (Instalação Completa)
```

O script automaticamente:
1. Cria usuário `webuser` no MySQL
2. Configura `.env` com credenciais corretas
3. Valida tudo antes de iniciar

---

### **OPÇÃO 2: Criação Manual do Usuário**

Se precisar criar o usuário manualmente:

```bash
# Via linha de comando:
mysql -u root -p@mysql123@ < /home/meumu.com/public_html/backend-nodejs/database/00_create_webuser.sql

# Via MySQL CLI:
mysql -u root -p@mysql123@
source /home/meumu.com/public_html/backend-nodejs/database/00_create_webuser.sql
```

---

## 🔍 VERIFICAR SE USUÁRIO FOI CRIADO

```bash
# Verificar se usuário existe
mysql -u root -p@mysql123@ -e "SELECT User, Host FROM mysql.user WHERE User = 'webuser';"

# Testar login com webuser
mysql -u webuser -p@meusite123@ -e "SELECT 1;"

# Verificar permissões
mysql -u root -p@mysql123@ -e "SHOW GRANTS FOR 'webuser'@'localhost';"
```

**Resultado esperado:**
```
GRANT SELECT ON `muonline`.* TO 'webuser'@'localhost'
GRANT SELECT, INSERT, UPDATE, DELETE ON `webmu`.* TO 'webuser'@'localhost'
```

---

## ⚙️ ARQUIVO .ENV.PRODUCTION

Local: `/home/meumu.com/public_html/backend-nodejs/.env.production`

### **Configurações Críticas:**

```bash
# AMBIENTE (CRÍTICO!)
NODE_ENV=production  # ← production = segurança máxima

# SERVIDOR
FRONTEND_URL=https://meumu.com  # ← HTTPS obrigatório
ALLOWED_ORIGINS=https://meumu.com  # ← Sem localhost

# DATABASE SEGURO
DB_USER=webuser  # ← Usuário limitado
DB_PASSWORD=@meusite123@  # ← Senha real

# JWT E SESSION (TROCAR ANTES DE ABRIR PARA PÚBLICO!)
JWT_SECRET=mEuMu_OnL1nE_jWt_K3y_2o24_pr0ducT10n_4a8b9c7d2e5f6g1h3i
SESSION_SECRET=mEuMu_s3ss10n_k3y_7x9y2z4a6b8c
```

---

## 🔒 SEGURANÇA - PRINCÍPIO DE MENOR PRIVILÉGIO

### **Por que usar `webuser` ao invés de `root`?**

| Aspecto | **root** ❌ | **webuser** ✅ |
|---------|-------------|----------------|
| **Permissões** | Acesso total ao MySQL | Apenas SELECT em `muonline`, CRUD em `webmu` |
| **Risco** | Se comprometido = acesso total | Se comprometido = danos limitados |
| **Servidor MU** | Pode alterar dados do servidor | **NÃO pode alterar** (READ-ONLY) |
| **Dropar tabelas** | Pode dropar databases | **NÃO pode** dropar |
| **Criar databases** | Pode criar qualquer coisa | **NÃO pode** criar |
| **Segurança** | Alto risco | Risco reduzido |

### **O que `webuser` NÃO pode fazer:**
❌ Dropar databases ou tabelas  
❌ Alterar estrutura (ALTER TABLE)  
❌ Criar databases  
❌ Dar permissões a outros usuários  
❌ **Alterar dados do servidor MU**  

### **O que `webuser` PODE fazer:**
✅ Ler dados do servidor MU (rankings, personagens)  
✅ Gerenciar dados do website (contas, notícias, logs)  
✅ Inserir, atualizar, deletar em `webmu`  

---

## 📊 COMPARAÇÃO: DESENVOLVIMENTO vs PRODUÇÃO

| Configuração | **DESENVOLVIMENTO** 🛠️ | **PRODUÇÃO** 🚀 |
|--------------|------------------------|----------------|
| **NODE_ENV** | `development` | `production` |
| **FRONTEND_URL** | `http://meumu.com:3001` | `https://meumu.com` |
| **ALLOWED_ORIGINS** | `http://localhost:3001` permitido | **Apenas HTTPS** |
| **DB_USER** | `root` (OK temporariamente) | **`webuser`** (obrigatório) |
| **Porta 3001** | Exposta | **Via proxy reverso** |
| **HTTPS** | Opcional | **Obrigatório** |
| **Logs** | Verbosos (debug) | Reduzidos (info) |

---

## 🎯 CHECKLIST ANTES DE ABRIR PARA PÚBLICO

✅ **1. Usuário MySQL seguro criado**
```bash
mysql -u webuser -p@meusite123@ -e "SELECT 1;"
```

✅ **2. .env.production configurado**
```bash
grep "NODE_ENV=production" /home/meumu.com/public_html/backend-nodejs/.env
grep "DB_USER=webuser" /home/meumu.com/public_html/backend-nodejs/.env
```

✅ **3. JWT e SESSION SECRET trocados**
```bash
# Gerar novos secrets:
openssl rand -base64 64  # Para JWT_SECRET
openssl rand -base64 64  # Para SESSION_SECRET
```

✅ **4. HTTPS configurado no OpenLiteSpeed**
```bash
# Verificar SSL ativo
curl -I https://meumu.com
```

✅ **5. Porta 3001 NÃO exposta diretamente**
```bash
# Acesso APENAS via proxy reverso
# Internet → 443 (OpenLiteSpeed) → 127.0.0.1:3001
```

✅ **6. Firewall configurado**
```bash
# Bloquear porta 3001 externamente
iptables -A INPUT -p tcp --dport 3001 ! -s 127.0.0.1 -j DROP
```

✅ **7. Backups automáticos configurados**

✅ **8. Logs de segurança monitorados**
```bash
tail -f /home/meumu.com/public_html/backend-nodejs/logs/security/*.log
```

---

## ⚠️ PROBLEMAS COMUNS

### **1. Erro "Access denied for user 'webuser'@'localhost'"**

**Causa:** Usuário não foi criado ou senha está errada.

**Solução:**
```bash
# Recriar usuário
mysql -u root -p@mysql123@ < /home/meumu.com/public_html/backend-nodejs/database/00_create_webuser.sql
```

---

### **2. Backend roda em "modo instalação"**

**Causa:** `NODE_ENV=development` no .env

**Solução:**
```bash
# Editar .env
nano /home/meumu.com/public_html/backend-nodejs/.env

# Alterar para:
NODE_ENV=production
```

---

### **3. CORS error no frontend**

**Causa:** `ALLOWED_ORIGINS` incorreto

**Solução:**
```bash
# Para desenvolvimento:
ALLOWED_ORIGINS=http://meumu.com:3001

# Para produção:
ALLOWED_ORIGINS=https://meumu.com
```

---

### **4. /health retorna 503**

**Causa:** MySQL não conectado ou credenciais erradas

**Solução:**
```bash
# Verificar conexão
mysql -u webuser -p@meusite123@ -e "SELECT 1;"

# Verificar .env
grep DB_ /home/meumu.com/public_html/backend-nodejs/.env
```

---

## 📝 COMANDOS ÚTEIS

### **Testar conexão MySQL:**
```bash
mysql -u webuser -p@meusite123@ -e "SELECT 1;"
```

### **Ver permissões do webuser:**
```bash
mysql -u root -p@mysql123@ -e "SHOW GRANTS FOR 'webuser'@'localhost';"
```

### **Resetar senha do webuser:**
```bash
mysql -u root -p@mysql123@ -e "ALTER USER 'webuser'@'localhost' IDENTIFIED BY '@nova_senha@';"
```

### **Remover usuário webuser:**
```bash
mysql -u root -p@mysql123@ -e "DROP USER 'webuser'@'localhost';"
mysql -u root -p@mysql123@ -e "DROP USER 'webuser'@'127.0.0.1';"
mysql -u root -p@mysql123@ -e "FLUSH PRIVILEGES;"
```

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Executar instalação completa: `./install.sh` → Opção 1
2. ✅ Verificar usuário criado: `mysql -u webuser -p@meusite123@`
3. ✅ Testar health: `curl http://localhost:3001/health`
4. ✅ Configurar HTTPS no OpenLiteSpeed
5. ✅ Trocar JWT_SECRET e SESSION_SECRET
6. ✅ Configurar firewall para bloquear porta 3001
7. ✅ Configurar backups automáticos

---

## 📞 SUPORTE

**Se precisar de ajuda:**
1. Verificar logs: `tail -f /home/meumu.com/public_html/backend-nodejs/logs/server.log`
2. Health check: `./install.sh` → Opção 8
3. Ver permissões MySQL: `SHOW GRANTS FOR 'webuser'@'localhost';`

---

**✅ Sistema de segurança implementado com sucesso!** 🎉
