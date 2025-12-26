# 🔒 SOLUÇÃO DEFINITIVA: MIXED CONTENT + HTTPS

**Data:** 26 de dezembro de 2024  
**Problema:** Site em HTTPS bloqueando chamadas HTTP (Mixed Content)  
**Erro 429:** Rate limit muito agressivo  
**Erro 400:** Registro falhando  

---

## 🎯 **PROBLEMAS IDENTIFICADOS**

### **1. Mixed Content (ERRO CRÍTICO)**
```
Mixed Content: The page at 'https://meumu.com/' was loaded over HTTPS,
but requested an insecure resource 'http://meumu.com:3001/api/server/info'.
This request has been blocked; the content must be served over HTTPS.
```

**Causa:** Frontend buildado com `VITE_API_URL=http://meumu.com:3001/api` mas site rodando em HTTPS.

**Solução:** Usar `VITE_API_URL=https://meumu.com/api` (sem porta, através do proxy).

---

### **2. Rate Limit Muito Agressivo (429)**
```
POST http://meumu.com:3001/api/auth/login 429 (Too Many Requests)
```

**Causa:** `RATE_LIMIT_MAX_REQUESTS=100` bloqueou IP após poucos testes.

**Solução:** Aumentar para `RATE_LIMIT_MAX_REQUESTS=500` no .env.

---

### **3. Erro no Registro (400)**
```
POST http://meumu.com:3001/api/auth/register 400 (Bad Request)
```

**Possível causa:** Coluna inexistente ou validação falhando.

**Solução:** Logs detalhados já implementados no authController.

---

## 🚀 **SOLUÇÃO RÁPIDA (3 PASSOS)**

### **Passo 1: Executar Script de Configuração HTTPS**

```bash
cd /home/meumu.com/public_html

# Tornar executável
chmod +x configurar-https.sh

# Executar
bash configurar-https.sh
```

Este script faz:
- ✅ Configura `.env` do frontend com HTTPS
- ✅ Configura `.env` do backend com rate limit aumentado
- ✅ Rebuilda frontend com HTTPS
- ✅ Reinicia backend
- ✅ Testa HTTP e HTTPS

---

### **Passo 2: Configurar Proxy Reverso no LiteSpeed**

**Opção A: Via Script Automático (Recomendado)**

```bash
cd /home/meumu.com/public_html

# Se o arquivo existir:
sudo bash setup-litespeed-proxy.sh
```

**Opção B: Via CyberPanel (Manual)**

1. Acesse: `https://meumu.com:8090`
2. Login com credenciais do CyberPanel
3. **Websites** → **meumu.com** → **Manage** → **vHost Conf**
4. Adicione ANTES do `</VirtualHost>`:

```apache
# ═══════════════════════════════════════════════════════════════
# PROXY REVERSO PARA BACKEND NODE.JS
# ═══════════════════════════════════════════════════════════════

# Redirecionar /api/* para http://localhost:3001/api/*
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyRequests Off
    
    # Timeout longo para uploads/downloads
    ProxyTimeout 300
    
    # Backend Node.js (porta 3001)
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    # Headers de segurança
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
    
    # Logs para debug
    CustomLog /usr/local/lsws/logs/proxy_access.log combined
    ErrorLog /usr/local/lsws/logs/proxy_error.log
</IfModule>

# CORS Headers (permitir requisições do frontend)
<IfModule mod_headers.c>
    # Durante desenvolvimento, permitir todas as origens
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header set Access-Control-Allow-Credentials "true"
    
    # Preflight (OPTIONS)
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

5. Salvar e reiniciar LiteSpeed:

```bash
sudo systemctl restart lsws
```

---

### **Passo 3: Limpar Rate Limit e Testar**

```bash
# Reiniciar backend (limpa rate limit)
pm2 restart meumu-backend

# Limpar cache do navegador
# Pressione: CTRL + SHIFT + DELETE
# Marque: Cache e Cookies
# Período: Tudo
# Limpar dados

# Testar
curl -s https://meumu.com/api/health | python3 -m json.tool
```

**Resultado esperado:**
```json
{
  "success": true,
  "status": "ok",
  "message": "API is running",
  "timestamp": "2024-12-26T...",
  "database": "connected"
}
```

---

## 🔧 **CONFIGURAÇÃO MANUAL (PASSO A PASSO)**

### **1. Configurar Frontend**

```bash
cd /home/meumu.com/public_html

# Criar .env correto
cat > .env << 'EOF'
# URL da API Backend (HTTPS através do proxy)
VITE_API_URL=https://meumu.com/api
EOF

# Rebuild
npm run build
```

---

### **2. Configurar Backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Editar .env
nano .env
```

**Altere estas linhas:**

```env
# AMBIENTE
NODE_ENV=production

# FRONTEND (HTTPS)
FRONTEND_URL=https://meumu.com

# RATE LIMIT (MAIS PERMISSIVO)
RATE_LIMIT_MAX_REQUESTS=500
RATE_LIMIT_API_MAX=500
RATE_LIMIT_AUTH_MAX=20

# CORS (PERMITIR HTTPS)
ALLOWED_ORIGINS=https://meumu.com,http://meumu.com,http://meumu.com:3001
```

Salvar: `CTRL+O` → `ENTER` → `CTRL+X`

---

### **3. Reiniciar Backend**

```bash
# Matar processos
pkill -9 -f node
sleep 3

# Reiniciar
pm2 delete meumu-backend 2>/dev/null
pm2 start src/server.js --name meumu-backend --log logs/server.log
pm2 save
```

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] Frontend `.env` aponta para `https://meumu.com/api`
- [ ] Frontend rebuilado (`npm run build`)
- [ ] Backend `.env` com `NODE_ENV=production`
- [ ] Backend `.env` com `RATE_LIMIT_MAX_REQUESTS=500`
- [ ] Backend `.env` com `ALLOWED_ORIGINS` incluindo HTTPS
- [ ] Backend reiniciado (`pm2 restart all`)
- [ ] Proxy reverso configurado no LiteSpeed
- [ ] LiteSpeed reiniciado (`sudo systemctl restart lsws`)
- [ ] Cache do navegador limpo (CTRL+SHIFT+DELETE)
- [ ] Teste HTTP: `curl http://localhost:3001/health` → OK
- [ ] Teste HTTPS: `curl https://meumu.com/api/health` → OK

---

## 🔍 **DIAGNÓSTICO DE PROBLEMAS**

### **Problema: Mixed Content ainda aparece**

**Verificar:**
```bash
# Frontend está usando HTTPS?
cat /home/meumu.com/public_html/.env
# Deve mostrar: VITE_API_URL=https://meumu.com/api

# Frontend foi rebuilado?
ls -la /home/meumu.com/public_html/dist/
# Deve ter timestamp recente
```

**Solução:**
```bash
cd /home/meumu.com/public_html
npm run build
# Limpar cache do navegador (CTRL+SHIFT+DELETE)
```

---

### **Problema: Proxy não funciona (404 em /api)**

**Verificar:**
```bash
# LiteSpeed está rodando?
sudo systemctl status lsws

# Proxy configurado?
sudo cat /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf | grep -A 10 "ProxyPass"
```

**Solução:**
```bash
# Reiniciar LiteSpeed
sudo systemctl restart lsws

# Ver logs
sudo tail -f /usr/local/lsws/logs/error.log
```

---

### **Problema: Erro 429 (Rate Limit)**

**Verificar:**
```bash
# Rate limit no .env
cat /home/meumu.com/public_html/backend-nodejs/.env | grep RATE_LIMIT
```

**Solução:**
```bash
# Editar .env
nano /home/meumu.com/public_html/backend-nodejs/.env

# Aumentar:
RATE_LIMIT_MAX_REQUESTS=500
RATE_LIMIT_AUTH_MAX=20

# Reiniciar
pm2 restart meumu-backend
```

---

### **Problema: Erro 400 no registro**

**Verificar logs:**
```bash
pm2 logs meumu-backend --lines 100 | grep -A 20 "TENTATIVA DE REGISTRO"
```

**Possíveis causas:**

1. **Coluna inexistente:**
   ```sql
   -- Adicionar colunas
   USE muonline;
   ALTER TABLE accounts ADD COLUMN IF NOT EXISTS blocked TINYINT DEFAULT 0;
   ALTER TABLE accounts ADD COLUMN IF NOT EXISTS vip_level INT DEFAULT 0;
   ALTER TABLE accounts ADD COLUMN IF NOT EXISTS cash_credits INT DEFAULT 0;
   ```

2. **Validação falhando:**
   - Ver logs para identificar campo inválido
   - Campos obrigatórios: `username`, `password`, `email`

---

## 📊 **TESTES COMPLETOS**

### **Teste 1: Health Check HTTP (Local)**
```bash
curl -s http://localhost:3001/health | python3 -m json.tool
```

**Esperado:**
```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

---

### **Teste 2: Health Check HTTPS (Proxy)**
```bash
curl -s -k https://meumu.com/api/health | python3 -m json.tool
```

**Esperado:**
```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

---

### **Teste 3: Registro via HTTPS**
```bash
curl -X POST https://meumu.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testehttps",
    "password": "senha123",
    "email": "testehttps@meumu.com"
  }' | python3 -m json.tool
```

**Esperado:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "username": "testehttps",
      "email": "testehttps@meumu.com"
    }
  }
}
```

---

### **Teste 4: Login via HTTPS**
```bash
curl -X POST https://meumu.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testefab",
    "password": "senha123"
  }' | python3 -m json.tool
```

**Esperado:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "username": "testefab"
    }
  }
}
```

---

## 🎉 **RESULTADO FINAL**

Após seguir todos os passos:

✅ **Frontend em HTTPS** → `https://meumu.com`  
✅ **API em HTTPS** → `https://meumu.com/api/*`  
✅ **Backend rodando** → `localhost:3001` (interno)  
✅ **Proxy funcionando** → LiteSpeed redireciona `/api` para porta 3001  
✅ **Sem Mixed Content** → Tudo em HTTPS  
✅ **Rate Limit ajustado** → 500 requests/min  
✅ **CORS configurado** → Permite HTTPS  

---

## 🆘 **SE AINDA NÃO FUNCIONAR**

Execute e envie a saída:

```bash
# 1. Status do backend
pm2 status

# 2. Logs do backend
pm2 logs meumu-backend --lines 50 --nostream

# 3. Teste HTTP local
curl -v http://localhost:3001/health

# 4. Teste HTTPS proxy
curl -v -k https://meumu.com/api/health

# 5. Frontend .env
cat /home/meumu.com/public_html/.env

# 6. Backend .env (sem senhas)
cat /home/meumu.com/public_html/backend-nodejs/.env | grep -v PASSWORD

# 7. LiteSpeed status
sudo systemctl status lsws

# 8. Proxy config
sudo cat /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf | grep -A 10 "ProxyPass"
```

Copie TODA a saída e me envie para análise.
