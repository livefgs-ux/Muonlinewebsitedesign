# 🚨 ERRO CORS + MIXED CONTENT - SOLUÇÃO CIRÚRGICA

## ❌ **O ERRO (Console DevTools):**

```javascript
Access to fetch at 'http://meumu.com:3001/api/rankings/guilds' 
from origin 'https://meumu.com:3001' has been blocked by CORS policy

GET http://meumu.com:3001/api/rankings/guilds net::ERR_FAILED

Error: Erro ao buscar ranking de guild
Error: Erro ao buscar ranking de PK
Error: Erro ao buscar estatísticas
```

---

## 🔬 **ANÁLISE CIRÚRGICA:**

### **Problema: MIXED CONTENT + CORS**

| Componente | Estado Atual | Esperado |
|------------|--------------|----------|
| **Frontend carregou via** | `https://meumu.com:3001` | ✅ |
| **Backend API** | `http://meumu.com:3001/api/...` | ❌ HTTP |
| **Navegador BLOQUEIA** | HTTPS → HTTP | 🚫 Mixed Content Security |

---

## 🎯 **POR QUE ACONTECE:**

### **1. Mixed Content Security (Segurança do Navegador)**

O navegador **bloqueia automaticamente** qualquer tentativa de uma página HTTPS carregar conteúdo HTTP.

**Motivo:** Evitar que atacantes interceptem dados em páginas "seguras".

```
Página HTTPS (cadeado verde 🔒)
  ↓
  ↓ Tenta fazer request HTTP (sem cadeado)
  ↓
  ↓ BLOQUEADO pelo navegador 🚫
  ↓
  ❌ Mixed Content Error
```

### **2. CORS adicional**

Além do Mixed Content, há também erro de CORS porque:
- **Origin do frontend:** `https://meumu.com:3001`
- **Origin do backend:** `http://meumu.com:3001`
- Protocolos diferentes = Origins diferentes!

---

## 💊 **SOLUÇÕES:**

### **🎯 SOLUÇÃO A: DESENVOLVIMENTO (HTTP EM TUDO) - RECOMENDADO AGORA**

**Mais simples para testes, sem precisar configurar SSL na porta 3001.**

#### **1. Corrigir Backend `.env`:**

```bash
cd /home/meumu.com/public_html/backend-nodejs
nano .env

# Alterar para:
NODE_ENV=development
FRONTEND_URL=http://meumu.com:3001
ALLOWED_ORIGINS=http://meumu.com:3001,http://localhost:3001
```

#### **2. Corrigir Frontend `.env`:**

```bash
cd /home/meumu.com/public_html
nano .env

# Alterar para:
VITE_API_URL=http://meumu.com:3001/api
```

#### **3. Rebuild Frontend:**

```bash
npm run build
```

#### **4. Reiniciar Backend:**

```bash
cd backend-nodejs
pkill -f "node.*server.js"
npm start
```

#### **5. Acessar via HTTP (sem 's'):**

```
http://meumu.com:3001
     ^^^^ SEM 's'
```

---

### **🎯 SOLUÇÃO B: PRODUÇÃO (PROXY REVERSO) - IDEAL PARA PÚBLICO**

**Usa HTTPS mas sem expor porta 3001 diretamente.**

#### **Arquitetura:**

```
Internet (usuário)
  ↓ https://meumu.com (porta 443)
  ↓
OpenLiteSpeed / Nginx (com SSL)
  ↓ proxy reverso
  ↓ http://127.0.0.1:3001 (interno, seguro)
  ↓
Backend Node.js
```

#### **Vantagens:**
- ✅ HTTPS para usuário final
- ✅ Porta 3001 não exposta
- ✅ SSL gerenciado pelo OpenLiteSpeed
- ✅ WAF e rate limiting no proxy
- ✅ Sem Mixed Content (tudo via HTTPS externo)

#### **Configuração (OpenLiteSpeed):**

```apache
# Context: /api/
External App: meumu-backend
  Address: http://127.0.0.1:3001
  Connection Timeout: 60s
  
Rewrite Rules:
  RewriteEngine On
  RewriteRule ^/api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]
```

---

## 🛠️ **CORREÇÃO AUTOMÁTICA (install.sh):**

O `install.sh` agora **automaticamente:**

### **Etapa [5/10] - Build Frontend:**

```bash
# Detecta se .env tem HTTPS
if grep -q "https://" ".env"; then
    echo "⚠️  .env do frontend tem HTTPS! Corrigindo para HTTP..."
    sed -i 's|https://|http://|g' .env
    echo "✅ .env corrigido (HTTP)"
fi
```

### **Resultado:**

```
✅ VITE_API_URL=http://meumu.com:3001/api
   ^^^^ HTTP (sem 's')
```

---

## 📊 **COMPARAÇÃO: ANTES vs DEPOIS**

### **❌ ANTES (ERRO):**

```javascript
// Frontend carregou via:
https://meumu.com:3001

// Tentou chamar API:
fetch('http://meumu.com:3001/api/rankings/guilds')
       ^^^^ HTTP

// Resultado:
🚫 BLOCKED by Mixed Content Policy
❌ CORS error
```

### **✅ DEPOIS (FUNCIONANDO):**

```javascript
// Frontend carregou via:
http://meumu.com:3001

// Chama API:
fetch('http://meumu.com:3001/api/rankings/guilds')
       ^^^^ HTTP (mesmo protocolo)

// Resultado:
✅ Request OK
✅ Rankings carregam
```

---

## 🔍 **COMO VERIFICAR SE ESTÁ CORRETO:**

### **1. Verificar Frontend `.env`:**

```bash
cat /home/meumu.com/public_html/.env

# Esperado:
VITE_API_URL=http://meumu.com:3001/api
```

### **2. Verificar Backend `.env`:**

```bash
cat /home/meumu.com/public_html/backend-nodejs/.env

# Esperado:
NODE_ENV=development
FRONTEND_URL=http://meumu.com:3001
ALLOWED_ORIGINS=http://meumu.com:3001,http://localhost:3001
```

### **3. Acessar site via HTTP:**

```
http://meumu.com:3001
     ^^^^ SEM 's'
```

### **4. Abrir DevTools Console:**

```javascript
// NÃO pode ter:
❌ Mixed Content
❌ CORS error
❌ ERR_FAILED

// Deve ter:
✅ GET http://meumu.com:3001/api/... 200 OK
✅ Rankings carregando
```

---

## 🚀 **PASSO A PASSO COMPLETO:**

### **Via install.sh (RECOMENDADO):**

```bash
cd /home/meumu.com/public_html

# 1. Reiniciar servidor (aplica .env correto)
./install.sh
# Escolher: 5 (Reiniciar Servidor)

# 2. Se erro persistir, rebuild frontend
./install.sh
# Escolher: 4 (Build Frontend)
# → Vai detectar HTTPS e corrigir automaticamente

# 3. Acessar site
http://meumu.com:3001
```

---

### **Manual (se preferir):**

```bash
cd /home/meumu.com/public_html

# 1. Corrigir frontend .env
nano .env
# Alterar para: VITE_API_URL=http://meumu.com:3001/api

# 2. Corrigir backend .env
nano backend-nodejs/.env
# Alterar para:
# NODE_ENV=development
# FRONTEND_URL=http://meumu.com:3001
# ALLOWED_ORIGINS=http://meumu.com:3001

# 3. Rebuild frontend
npm run build

# 4. Reiniciar backend
cd backend-nodejs
pkill -f "node.*server.js"
npm start

# 5. Testar
curl http://localhost:3001/health
```

---

## ⚠️ **IMPORTANTE - DESENVOLVIMENTO vs PRODUÇÃO:**

### **DESENVOLVIMENTO (Porta 3001 exposta):**

```
✅ Usar HTTP em tudo
✅ FRONTEND_URL=http://meumu.com:3001
✅ VITE_API_URL=http://meumu.com:3001/api
✅ NODE_ENV=development
```

### **PRODUÇÃO (Proxy reverso):**

```
✅ Frontend via HTTPS (meumu.com)
✅ Proxy interno para 127.0.0.1:3001
✅ Porta 3001 NÃO exposta
✅ NODE_ENV=production
✅ Firewall bloqueando 3001 externamente
```

---

## 📝 **CHECKLIST:**

✅ **Backend `.env` com HTTP:**
```bash
FRONTEND_URL=http://meumu.com:3001
ALLOWED_ORIGINS=http://meumu.com:3001
```

✅ **Frontend `.env` com HTTP:**
```bash
VITE_API_URL=http://meumu.com:3001/api
```

✅ **Rebuild frontend:**
```bash
npm run build
```

✅ **Reiniciar backend:**
```bash
pkill -f node; npm start
```

✅ **Acessar via HTTP:**
```
http://meumu.com:3001 (sem 's')
```

✅ **Console sem erros:**
```
Sem Mixed Content
Sem CORS error
✅ API funcionando
```

---

## 🔧 **TROUBLESHOOTING:**

### **Erro persiste após correção:**

```bash
# 1. Limpar cache do navegador (Ctrl+Shift+Delete)

# 2. Hard refresh (Ctrl+Shift+R)

# 3. Verificar se backend reiniciou:
curl http://localhost:3001/health

# 4. Ver logs:
tail -f backend-nodejs/logs/server.log

# 5. Verificar se porta 3001 está HTTP (não HTTPS):
curl -I http://meumu.com:3001
```

---

**✅ Problema CORS + Mixed Content resolvido com protocolo uniforme (HTTP)!** 🎉
