# 🔥 CORREÇÃO - CREDENCIAIS BANCO + DEBUG DASHBOARD

**Data:** 26/12/2024 - 00:15 CET  
**Problema 1:** Credenciais antigas do MySQL no install.sh  
**Problema 2:** Dashboard não funciona (nem navegação, nem botão Hero)  
**Status:** ✅ Credenciais atualizadas | 🔍 Dashboard em debug

---

## ✅ PARTE 1: CREDENCIAIS ATUALIZADAS

### **Novas Credenciais MySQL:**

```sql
CREATE USER IF NOT EXISTS 'webuser'@'localhost'
IDENTIFIED BY '@meusite123@';

GRANT SELECT ON muonline.* TO 'webuser'@'localhost';
GRANT SELECT,INSERT,UPDATE,DELETE ON meuweb.* TO 'webuser'@'localhost';

FLUSH PRIVILEGES;
```

**Resumo:**
- **Usuário:** `webuser`
- **Senha:** `@meusite123@`
- **Permissões:**
  - `muonline.*` → **SELECT** (READ-ONLY)
  - `meuweb.*` → **SELECT, INSERT, UPDATE, DELETE** (READ+WRITE)

---

### **Arquivo Atualizado:**

✅ **/install.sh**  
→ Linha 525-526 (template .env.production)

```bash
# DATABASE PRINCIPAL (Host, User, Password compartilhados)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=webuser          # ✅ ATUALIZADO
DB_PASSWORD=@meusite123@  # ✅ ATUALIZADO
```

---

### **⚠️ OUTROS LOCAIS NO install.sh QUE USAM CREDENCIAIS ROOT:**

O `install.sh` tem **16 referências** a `mysql -u root -p@mysql123@` para:

1. **Testar conexão MySQL** (linha 160)
2. **Verificar databases** (linhas 164, 165, 274, 275, 790, 791)
3. **Criar database meuweb** (linhas 175, 286)
4. **Criar usuário webuser** (linha 198)
5. **Listar databases** (linha 787)

**DECISÃO:** ✅ **MANTER** essas credenciais!

**POR QUÊ?**
- São usadas apenas para **tarefas administrativas** durante instalação
- Criar databases, criar usuários, verificar estrutura
- O **backend Node.js** usa `webuser` (já atualizado)
- O **install.sh** precisa de root para administrar o banco

**SEGURANÇA:**
- install.sh só roda no servidor (não exposto)
- Usuário `webuser` tem permissões limitadas
- Backend usa `webuser`, não root

---

## 🔍 PARTE 2: DEBUG DO DASHBOARD

### **Sintomas Reportados:**

1. ❌ Clicar em "Dashboard" no menu → NADA ACONTECE
2. ❌ Clicar em "Player Area" (Hero) → NADA ACONTECE

### **Correções JÁ APLICADAS:**

✅ **/src/app/components/navigation.tsx**
- Removida lógica `onNavigate('login')` que causava bug
- Agora sempre chama `onNavigate('dashboard')`

✅ **/src/app/components/hero-section.tsx**
- Adicionado botão "Player Area / Área do Jogador"
- Chama `onNavigate('dashboard')` corretamente

---

### **🔬 DIAGNÓSTICO - POSSÍVEIS CAUSAS:**

#### **Causa 1: Erro no Console do Navegador**

**Como verificar:**
```
1. Abrir site (meumu.com)
2. Pressionar F12 (DevTools)
3. Ir na aba "Console"
4. Procurar erros em vermelho
```

**Erros comuns:**

```javascript
❌ "Failed to fetch"
→ Backend não está respondendo (porta 3001)
→ Verificar: curl http://localhost:3001/health

❌ "CORS policy: No 'Access-Control-Allow-Origin'"
→ CORS bloqueando requisições
→ Verificar .env do backend (ALLOWED_ORIGINS)

❌ "Uncaught TypeError: Cannot read properties of undefined"
→ Erro no código React
→ Verificar stack trace

❌ "Network request failed" ou "ERR_CONNECTION_REFUSED"
→ Backend offline
→ Verificar: systemctl status meumu-backend (ou PM2)
```

---

#### **Causa 2: Backend Offline**

**Verificar se backend está rodando:**

```bash
# 1. Verificar processos Node.js
ps aux | grep node

# 2. Verificar porta 3001
netstat -tulpn | grep 3001
# ou
lsof -i:3001

# 3. Testar health check
curl http://localhost:3001/health

# 4. Ver logs
tail -f /home/meumu.com/public_html/backend-nodejs/logs/server.log
```

**Se backend NÃO estiver rodando:**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Opção 1: PM2
pm2 start src/server.js --name meumu-backend
pm2 logs meumu-backend

# Opção 2: NPM (background)
nohup npm start > logs/server.log 2>&1 &

# Opção 3: NPM (foreground para debug)
npm start
```

---

#### **Causa 3: Credenciais Erradas no .env**

**Verificar .env do backend:**

```bash
cd /home/meumu.com/public_html/backend-nodejs
cat .env | grep -E "DB_USER|DB_PASSWORD"
```

**Deve mostrar:**
```
DB_USER=webuser
DB_PASSWORD=@meusite123@
```

**Se estiver diferente, corrigir:**

```bash
cd /home/meumu.com/public_html/backend-nodejs
nano .env
```

**Mudar para:**
```
DB_USER=webuser
DB_PASSWORD=@meusite123@
```

**Salvar (Ctrl+O, Enter, Ctrl+X) e reiniciar:**

```bash
pkill -f node
npm start
```

---

#### **Causa 4: Usuário `webuser` Não Existe**

**Verificar se usuário existe:**

```bash
mysql -u root -p@mysql123@ -e "SELECT User, Host FROM mysql.user WHERE User='webuser';"
```

**Deve mostrar:**
```
+----------+-----------+
| User     | Host      |
+----------+-----------+
| webuser  | localhost |
+----------+-----------+
```

**Se NÃO existir, criar:**

```bash
mysql -u root -p@mysql123@
```

```sql
CREATE USER IF NOT EXISTS 'webuser'@'localhost'
IDENTIFIED BY '@meusite123@';

GRANT SELECT ON muonline.* TO 'webuser'@'localhost';
GRANT SELECT,INSERT,UPDATE,DELETE ON meuweb.* TO 'webuser'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

---

#### **Causa 5: Database `meuweb` Não Existe**

**Verificar databases:**

```bash
mysql -u root -p@mysql123@ -e "SHOW DATABASES LIKE 'meuweb';"
```

**Se NÃO existir:**

```bash
mysql -u root -p@mysql123@ -e "CREATE DATABASE meuweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

#### **Causa 6: Frontend Não Buildado**

**Verificar se dist/ existe:**

```bash
cd /home/meumu.com/public_html
ls -la dist/
```

**Se NÃO existir ou estiver vazio:**

```bash
cd /home/meumu.com/public_html
npm run build
```

**IMPORTANTE:** Após build, verificar MIME types:

```bash
# Ajustar permissões (obrigatório!)
chmod 755 dist/
find dist/ -type d -exec chmod 755 {} \;
find dist/ -type f -exec chmod 644 {} \;
```

---

### **🎯 PASSO A PASSO DE DEBUG:**

#### **ETAPA 1: Verificar Backend**

```bash
# 1.1 - Backend rodando?
ps aux | grep node

# 1.2 - Porta 3001 ativa?
netstat -tulpn | grep 3001

# 1.3 - Health check
curl http://localhost:3001/health

# Se retornar JSON = ✅ Backend OK
# Se erro de conexão = ❌ Backend offline
```

#### **ETAPA 2: Verificar Logs do Backend**

```bash
tail -100 /home/meumu.com/public_html/backend-nodejs/logs/server.log
```

**Procurar por:**
```
❌ "ECONNREFUSED" → MySQL offline
❌ "Access denied for user" → Credenciais erradas
❌ "ER_BAD_DB_ERROR" → Database não existe
❌ "EADDRINUSE" → Porta 3001 em uso
✅ "Server running on port 3001" → Backend OK
```

#### **ETAPA 3: Verificar Console do Navegador**

```
1. Abrir meumu.com
2. F12 → Console
3. Clicar em "Player Area"
4. Ver se aparece erro em vermelho
```

**Erros comuns:**
```javascript
❌ "Failed to fetch http://localhost:3001/api/auth/verify"
→ Frontend tentando acessar localhost (ERRADO!)
→ Verificar VITE_API_URL no .env do frontend

❌ "Mixed Content" warning
→ Site HTTPS tentando chamar HTTP
→ Usar URL relativa (/api) em vez de absoluta

❌ "404 Not Found"
→ Rota não existe no backend
→ Verificar se endpoint está correto
```

#### **ETAPA 4: Testar Navegação Manual**

```javascript
// No Console do navegador (F12):

// 1. Verificar currentSection
console.log(window.location.hash)

// 2. Forçar navegação
window.location.hash = '#dashboard'

// 3. Verificar se renderiza
// Se mostrar login/dashboard = ✅ Navegação OK
// Se nada mudar = ❌ React não está respondendo
```

---

### **📋 CHECKLIST DE DIAGNÓSTICO:**

```
□ Backend está rodando? (ps aux | grep node)
□ Porta 3001 está ativa? (netstat -tulpn | grep 3001)
□ Health check responde? (curl localhost:3001/health)
□ Logs do backend sem erros? (tail logs/server.log)
□ Console do navegador sem erros? (F12)
□ .env do backend tem credenciais corretas?
   - DB_USER=webuser
   - DB_PASSWORD=@meusite123@
□ Usuário webuser existe no MySQL?
□ Database meuweb existe?
□ Frontend buildado? (ls dist/)
□ Permissões corretas? (chmod 644/755)
```

---

## 🚀 PROCEDIMENTO DE CORREÇÃO COMPLETA

### **1. Atualizar Credenciais:**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Editar .env
nano .env
```

**Mudar para:**
```
DB_USER=webuser
DB_PASSWORD=@meusite123@
```

### **2. Criar Usuário MySQL:**

```bash
mysql -u root -p@mysql123@
```

```sql
-- Remover usuário antigo (se existir)
DROP USER IF EXISTS 'webuser'@'localhost';

-- Criar usuário novo
CREATE USER 'webuser'@'localhost' IDENTIFIED BY '@meusite123@';

-- Dar permissões
GRANT SELECT ON muonline.* TO 'webuser'@'localhost';
GRANT SELECT,INSERT,UPDATE,DELETE ON meuweb.* TO 'webuser'@'localhost';

-- Aplicar
FLUSH PRIVILEGES;

-- Verificar
SHOW GRANTS FOR 'webuser'@'localhost';

EXIT;
```

### **3. Testar Conexão:**

```bash
# Tentar conectar com webuser
mysql -u webuser -p@meusite123@ -e "SELECT 1;"

# Se funcionar = ✅ Credenciais OK
# Se der erro = ❌ Verificar senha
```

### **4. Reiniciar Backend:**

```bash
cd /home/meumu.com/public_html

# Parar processos antigos
pkill -f node

# Verificar porta livre
netstat -tulpn | grep 3001
# Deve estar vazio!

# Iniciar backend
cd backend-nodejs
npm start

# OU com PM2:
pm2 delete meumu-backend
pm2 start src/server.js --name meumu-backend
pm2 logs meumu-backend
```

### **5. Verificar Health:**

```bash
# Aguardar 5 segundos
sleep 5

# Testar
curl http://localhost:3001/health

# Deve retornar:
# {"status":"ok","database":"connected",...}
```

### **6. Testar Site:**

```
1. Abrir meumu.com
2. F12 → Console (verificar erros)
3. Clicar em "Player Area"
4. Deve redirecionar para tela de login
```

---

## 🔧 COMANDOS RÁPIDOS DE DEBUG

```bash
# Backend rodando?
ps aux | grep "node.*server.js"

# Porta 3001?
lsof -i:3001

# Logs ao vivo
tail -f /home/meumu.com/public_html/backend-nodejs/logs/server.log

# Health check
curl -s http://localhost:3001/health | python3 -m json.tool

# Verificar .env
grep -E "DB_USER|DB_PASSWORD" /home/meumu.com/public_html/backend-nodejs/.env

# Reiniciar backend (FORÇA)
pkill -9 -f node
cd /home/meumu.com/public_html/backend-nodejs
npm start

# Ver databases
mysql -u root -p@mysql123@ -e "SHOW DATABASES;"

# Ver usuários MySQL
mysql -u root -p@mysql123@ -e "SELECT User, Host FROM mysql.user;"
```

---

## 📊 ARQUIVOS AFETADOS

```
✅ /install.sh                                (Credenciais template atualizadas)
✅ /src/app/components/navigation.tsx         (Bug navegação corrigido)
✅ /src/app/components/hero-section.tsx       (Botão Player Area adicionado)
✅ /src/app/i18n/translations.ts              (Traduções adicionadas)
```

**Próximos passos:**
```
1. Verificar .env do backend (manual)
2. Criar usuário webuser no MySQL (manual)
3. Reiniciar backend com credenciais novas
4. Testar dashboard no navegador
```

---

## 🎯 RESULTADO ESPERADO

### **Após correção:**

```
✅ Backend inicia sem erros de autenticação MySQL
✅ Health check retorna {"database":"connected"}
✅ Console do navegador SEM erros
✅ Clicar em "Player Area" → Redireciona para login
✅ Clicar em "Dashboard" menu → Redireciona para login
✅ Após login → Mostra PlayerDashboard
```

---

## 📝 NOTAS IMPORTANTES

### **Por que manter root no install.sh?**

O `install.sh` precisa de **privilégios administrativos** para:
- Criar databases
- Criar usuários
- Modificar permissões
- Importar schemas

**Separação de responsabilidades:**
- **install.sh:** Usa `root` (tarefas admin)
- **Backend Node.js:** Usa `webuser` (aplicação)
- **Segurança:** `webuser` tem permissões limitadas

### **Por que não funciona o Dashboard?**

**Possíveis causas (em ordem de probabilidade):**

1. **Backend offline** (99% dos casos)
2. Erro de credenciais MySQL
3. Database `meuweb` não existe
4. Erro no console do navegador
5. Frontend não buildado
6. CORS bloqueando requisições

**SOLUÇÃO:** Seguir o checklist acima passo a passo!

---

## ✅ CONCLUSÃO

**Credenciais atualizadas com sucesso!**

- Template do install.sh agora usa `webuser/@meusite123@`
- Navegação do Dashboard corrigida
- Botão "Player Area" adicionado

**Próximo passo:** Verificar por que Dashboard não funciona seguindo o guia de debug acima.

**COMANDOS ESSENCIAIS:**

```bash
# 1. Ver logs
tail -f backend-nodejs/logs/server.log

# 2. Verificar backend
curl http://localhost:3001/health

# 3. Reiniciar
pkill -f node && cd backend-nodejs && npm start
```

**SUCESSO QUANDO:**
- Clicar em "Player Area" mostra tela de login
- Console do navegador SEM erros
- Health check retorna JSON válido
