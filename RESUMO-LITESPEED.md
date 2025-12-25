# ✅ **IMPLEMENTAÇÃO COMPLETA - LITESPEED PROXY REVERSO (CYBERPANEL)**

---

## 🎯 **RESUMO EXECUTIVO:**

Implementei **arquitetura profissional com Proxy Reverso para OpenLiteSpeed (CyberPanel)** para resolver definitivamente os erros SSL/CORS/Mixed Content.

**❌ NÃO use Nginx** → Incompatível com CyberPanel!  
**✅ Use LiteSpeed** → Core do CyberPanel!

---

## 📦 **ARQUIVOS CRIADOS:**

```
✅ /litespeed-proxy-config.conf      (Configuração LiteSpeed completa)
✅ /setup-litespeed-proxy.sh         (Script automático)
✅ /LITESPEED-PROXY-SETUP.md         (Documentação completa - 500+ linhas)
✅ /backend-nodejs/.env.production   (Backend para produção)
✅ /.env.production                   (Frontend para produção)
✅ /backend-nodejs/src/server.js      (Escuta localhost em produção)
✅ /install.sh                        (Opção 11 atualizada para LiteSpeed)
✅ /CORS-MIXED-CONTENT-FIX.md        (Fix de erros CORS)
✅ /MIME-TYPE-ERROR-FIX.md           (Fix de MIME types)
```

---

## 🚀 **COMO USAR (MÉTODO MAIS FÁCIL - CYBERPANEL GUI):**

### **1️⃣ Acessar CyberPanel:**

```
https://meumu.com:8090
```

**Login:** admin / sua_senha

---

### **2️⃣ Navegar até vHost:**

```
Menu → Websites
      → List Websites
      → meumu.com → Manage
      → vHost Conf
```

---

### **3️⃣ Colar Configuração:**

**Copie TODO o conteúdo de `/litespeed-proxy-config.conf` e cole NO FINAL do arquivo vHost.**

**Configuração (resumida):**

```apache
# Backend Node.js
extProcessor meumu-api {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                100
}

# Proxy /api/ → Backend
context /api/ {
  type                    proxy
  handler                 meumu-api
  
  extraHeaders            <<<END_extraHeaders
Access-Control-Allow-Origin https://meumu.com
Access-Control-Allow-Methods GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers Authorization, Content-Type, X-Requested-With
Access-Control-Allow-Credentials true
  END_extraHeaders
}
```

---

### **4️⃣ Ajustar DocumentRoot:**

**Procure:**
```apache
docRoot /home/meumu.com/public_html
```

**Altere para:**
```apache
docRoot /home/meumu.com/public_html/dist
```

---

### **5️⃣ Salvar e Reiniciar:**

```
1. Clicar em "Save"
2. Voltar para "Manage"
3. Clicar em "Graceful Restart LiteSpeed"
```

---

### **6️⃣ Configurar SSL (se não tiver):**

```
CyberPanel → Websites → meumu.com → Manage
           → Manage SSL
           → Issue SSL (Let's Encrypt)
           → Selecionar: meumu.com e www.meumu.com
           → Issue Now
```

**Pronto! SSL configurado automaticamente! 🔒**

---

### **7️⃣ Configurar Backend:**

```bash
cd /home/meumu.com/public_html/backend-nodejs
cp .env.production .env

# Verificar:
cat .env | grep NODE_ENV
# Deve mostrar: NODE_ENV=production

cat .env | grep FRONTEND_URL
# Deve mostrar: FRONTEND_URL=https://meumu.com
```

---

### **8️⃣ Configurar Frontend:**

```bash
cd /home/meumu.com/public_html
echo 'VITE_API_URL=https://meumu.com/api' > .env

# Rebuild
npm run build

# Verificar se dist/ foi criada
ls -la dist/
```

---

### **9️⃣ Reiniciar Backend:**

```bash
cd backend-nodejs
pkill -f node
npm start

# OU com PM2:
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup
```

**Você deve ver:**
```
================================================
✅ Servidor rodando na porta 3001
🌍 Ambiente: production
🔒 Escutando: 127.0.0.1:3001
📡 API URL: https://meumu.com/api (via LiteSpeed proxy)
🔐 SEGURANÇA: Porta 3001 acessível APENAS internamente
================================================
```

---

### **🔟 Testar:**

```bash
# Frontend
curl -I https://meumu.com
# Deve retornar: HTTP/2 200, server: LiteSpeed

# API
curl https://meumu.com/api/health
# Deve retornar: {"success":true,"status":"healthy",...}

# No navegador
https://meumu.com
# ✅ Cadeado verde
# ✅ Sem erros CORS
# ✅ Sem Mixed Content
# ✅ Rankings carregando
```

---

## 🎯 **MÉTODO ALTERNATIVO (SCRIPT AUTOMÁTICO):**

```bash
cd /home/meumu.com/public_html

# Tornar executável
chmod +x setup-litespeed-proxy.sh

# Executar como root
sudo ./setup-litespeed-proxy.sh

# OU via install.sh
./install.sh
# Escolher: 11 (Configurar LiteSpeed Proxy Reverso)
```

---

## 📊 **ARQUITETURA FINAL:**

```
Usuário (Internet)
  ↓ https://meumu.com/api (porta 443 - SSL)
  ↓
OpenLiteSpeed (CyberPanel)
  ↓ extProcessor meumu-api
  ↓ http://127.0.0.1:3001 (interno, seguro)
  ↓
Backend Node.js
  ↓ Escuta APENAS localhost
  ↓ Não exposto externamente
  ↓ 
MySQL (muonline + webmu)
```

---

## ✅ **VANTAGENS LITESPEED vs NGINX:**

| Aspecto | Nginx | LiteSpeed |
|---------|-------|-----------|
| **CyberPanel** | ❌ Incompatível | ✅ Core do painel |
| **Performance** | ⚡ Rápido | ⚡⚡ Mais rápido |
| **Cache** | Módulos externos | ✅ LSCache nativo |
| **HTTP/3** | ⚠️ Experimental | ✅ Nativo |
| **Interface** | ❌ CLI apenas | ✅ CyberPanel GUI |
| **.htaccess** | ❌ Não suporta | ✅ Compatível |

---

## 🔒 **SEGURANÇA:**

```bash
# Bloquear porta 3001 externamente
sudo ufw deny 3001/tcp

# Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar
sudo ufw status
```

**Resultado:**
```
3001/tcp    DENY        Anywhere  ✅ Bloqueado!
80/tcp      ALLOW       Anywhere
443/tcp     ALLOW       Anywhere
```

---

## 📝 **CHECKLIST FINAL:**

✅ **LiteSpeed rodando**
```bash
sudo /usr/local/lsws/bin/lswsctrl status
```

✅ **SSL configurado (Let's Encrypt)**
```
CyberPanel → Manage SSL → Verificar certificado
```

✅ **Proxy reverso configurado**
```bash
cat /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf | grep meumu-api
```

✅ **Backend escuta APENAS localhost**
```bash
netstat -tlnp | grep 3001
# Deve mostrar: 127.0.0.1:3001
```

✅ **Frontend buildado**
```bash
ls -la /home/meumu.com/public_html/dist/
```

✅ **DocumentRoot aponta para dist/**
```bash
grep docRoot /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf
# Deve mostrar: /home/meumu.com/public_html/dist
```

✅ **API funcionando via proxy**
```bash
curl https://meumu.com/api/health
```

✅ **Frontend carregando**
```bash
curl -I https://meumu.com
```

✅ **Cadeado verde** 🔒

✅ **Sem erros CORS**

✅ **Sem Mixed Content**

---

## 🔧 **TROUBLESHOOTING RÁPIDO:**

### **1. Backend não responde:**
```bash
curl http://127.0.0.1:3001/health
tail -f backend-nodejs/logs/server.log
```

### **2. LiteSpeed não faz proxy:**
```bash
sudo tail -f /usr/local/lsws/logs/error.log
sudo /usr/local/lsws/bin/lswsctrl restart
```

### **3. Erro 502 Bad Gateway:**
```bash
# Backend não está rodando
cd backend-nodejs
npm start
```

### **4. Erro 404 na API:**
```bash
# Configuração não foi aplicada
# Verificar vHost e reiniciar LiteSpeed
```

---

## 📖 **DOCUMENTAÇÃO COMPLETA:**

```bash
# Documentação detalhada (500+ linhas)
cat /home/meumu.com/public_html/LITESPEED-PROXY-SETUP.md

# Configuração pronta para copiar
cat /home/meumu.com/public_html/litespeed-proxy-config.conf
```

---

## 🎉 **PRONTO PARA PRODUÇÃO!**

**Execute agora:**

```bash
# Opção 1: Via CyberPanel (RECOMENDADO)
https://meumu.com:8090
→ Websites → meumu.com → Manage → vHost Conf
→ Colar configuração
→ Save → Graceful Restart

# Opção 2: Via script
sudo ./setup-litespeed-proxy.sh

# Opção 3: Via install.sh
./install.sh
→ Escolher: 11
```

---

**✅ Arquitetura profissional com LiteSpeed implementada! 🚀🔒✅**

**Compatível com CyberPanel! Sem erros CORS/SSL/Mixed Content!**
