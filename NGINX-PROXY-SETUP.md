# 🚀 PROXY REVERSO NGINX - GUIA COMPLETO

## 🎯 **ARQUITETURA PROFISSIONAL:**

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO (INTERNET)                        │
│                 https://meumu.com/api                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (porta 443)
                         │ Cadeado Verde 🔒
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (PROXY REVERSO)                     │
│  • Gerencia SSL/TLS                                          │
│  • Valida certificados                                       │
│  • Rate limiting adicional                                   │
│  • WAF (opcional)                                            │
│  • Headers de segurança                                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (interno, seguro)
                         │ proxy_pass → 127.0.0.1:3001
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND NODE.JS (PORTA 3001)                    │
│  • Escuta APENAS localhost (127.0.0.1)                      │
│  • Não precisa gerenciar SSL                                 │
│  • Não exposto externamente                                  │
│  • Focado em lógica de negócio                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ **VANTAGENS DO PROXY REVERSO:**

### **1. 🔒 Segurança Máxima**
- ✅ Porta 3001 **NÃO exposta** para internet
- ✅ SSL gerenciado pelo Nginx (mais maduro)
- ✅ Backend sem responsabilidade de certificados
- ✅ WAF e rate limiting no Nginx
- ✅ Headers de segurança no proxy

### **2. 🚀 Performance**
- ✅ Nginx serve assets estáticos (dist/)
- ✅ Backend apenas processa lógica
- ✅ Cache de assets no Nginx
- ✅ Gzip/Brotli no Nginx

### **3. 🎯 Escalabilidade**
- ✅ Load balancing fácil (múltiplos backends)
- ✅ Zero downtime deploys
- ✅ Health checks no Nginx
- ✅ Failover automático

### **4. 🔧 Manutenção**
- ✅ Renovação SSL via Certbot (automático)
- ✅ Backend não precisa reiniciar para SSL
- ✅ Logs centralizados no Nginx
- ✅ Monitoramento simplificado

---

## 📋 **PASSO A PASSO COMPLETO:**

### **🔧 ETAPA 1: INSTALAR NGINX**

```bash
# Atualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Verificar instalação
nginx -v

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

---

### **🔐 ETAPA 2: CONFIGURAR SSL (CERTBOT)**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL (automático via Nginx)
sudo certbot --nginx -d meumu.com -d www.meumu.com

# Certbot vai:
# 1. Validar domínio
# 2. Gerar certificados
# 3. Configurar Nginx
# 4. Agendar renovação automática

# Testar renovação
sudo certbot renew --dry-run

# Certificados ficam em:
# /etc/letsencrypt/live/meumu.com/fullchain.pem
# /etc/letsencrypt/live/meumu.com/privkey.pem
```

---

### **⚙️ ETAPA 3: CONFIGURAR PROXY REVERSO (AUTOMÁTICO)**

```bash
cd /home/meumu.com/public_html

# Script automático (RECOMENDADO)
sudo ./setup-nginx-proxy.sh

# Vai configurar:
# ✅ Proxy reverso para porta 3001
# ✅ HTTPS com SSL
# ✅ CORS headers
# ✅ Cache de assets
# ✅ Redirecionamento HTTP → HTTPS
# ✅ Segurança (bloquear .env, .log, etc)
```

---

### **⚙️ ETAPA 3 (MANUAL - se preferir):**

```bash
# 1. Editar configuração do Nginx
sudo nano /etc/nginx/sites-available/meumu.com

# 2. Copiar conteúdo de /nginx-proxy-config.conf
# (já está pronto no repositório)

# 3. Criar symlink
sudo ln -sf /etc/nginx/sites-available/meumu.com /etc/nginx/sites-enabled/

# 4. Testar configuração
sudo nginx -t

# 5. Reiniciar Nginx
sudo systemctl restart nginx

# 6. Verificar logs (se houver erro)
sudo tail -f /var/log/nginx/error.log
```

---

### **🔧 ETAPA 4: CONFIGURAR BACKEND (NODE.JS)**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# 1. Copiar .env de produção
cp .env.production .env

# 2. Editar se necessário
nano .env

# Verificar configurações críticas:
NODE_ENV=production                    # ← IMPORTANTE!
FRONTEND_URL=https://meumu.com         # ← Sem porta!
ALLOWED_ORIGINS=https://meumu.com      # ← HTTPS!
PORT=3001                              # ← Localhost apenas
```

**Conteúdo do `.env` (resumido):**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://meumu.com
ALLOWED_ORIGINS=https://meumu.com,https://www.meumu.com

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=webuser
DB_PASSWORD=@meusite123@
DB_NAME_MUONLINE=muonline
DB_NAME_WEBMU=webmu

JWT_SECRET=sua_chave_secreta_aqui
SESSION_SECRET=sua_chave_secreta_aqui
```

---

### **⚛️ ETAPA 5: CONFIGURAR FRONTEND (REACT/VITE)**

```bash
cd /home/meumu.com/public_html

# 1. Criar .env do frontend
echo 'VITE_API_URL=https://meumu.com/api' > .env

# 2. Buildar frontend
npm run build

# Verificar se pasta dist/ foi criada
ls -la dist/

# Deve conter:
# - index.html
# - assets/ (js, css, imagens)
```

---

### **🚀 ETAPA 6: INICIAR BACKEND**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Matar processos antigos
pkill -f "node.*server.js"

# Iniciar backend
npm start

# OU com PM2 (recomendado para produção):
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
📡 API URL: https://meumu.com/api (via Nginx proxy)
📊 Health Check: https://meumu.com/api/health
⚛️  Frontend: https://meumu.com
🔐 SEGURANÇA: Porta 3001 acessível APENAS internamente
================================================
```

---

### **🔍 ETAPA 7: TESTAR CONFIGURAÇÃO**

#### **1. Testar Nginx (serve frontend)**
```bash
curl -I https://meumu.com

# Esperado:
# HTTP/2 200
# content-type: text/html
# server: nginx
```

#### **2. Testar API (proxy para backend)**
```bash
curl https://meumu.com/api/health

# Esperado:
# {
#   "success": true,
#   "status": "healthy",
#   "database": "connected",
#   ...
# }
```

#### **3. Testar no navegador**
```
https://meumu.com

# DevTools Console:
✅ Sem erros CORS
✅ Sem Mixed Content
✅ Cadeado verde 🔒
✅ GET https://meumu.com/api/... 200 OK
```

---

### **🔒 ETAPA 8: FIREWALL (SEGURANÇA)**

```bash
# Bloquear porta 3001 externamente
sudo ufw deny 3001/tcp

# Permitir HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir SSH (se ainda não estiver)
sudo ufw allow 22/tcp

# Ativar firewall
sudo ufw enable

# Verificar regras
sudo ufw status verbose

# Esperado:
# 3001/tcp    DENY        Anywhere
# 80/tcp      ALLOW       Anywhere
# 443/tcp     ALLOW       Anywhere
```

**⚠️ IMPORTANTE:** Porta 3001 deve estar **BLOQUEADA** externamente!

---

## 📊 **COMPARAÇÃO: ANTES vs DEPOIS**

### **❌ ANTES (Porta 3001 exposta):**

```
Usuário → https://meumu.com:3001/api
           ↓
           Backend Node.js (gerencia SSL)
           ↓
           ❌ Porta 3001 exposta
           ❌ ERR_SSL_PROTOCOL_ERROR
           ❌ Backend gerencia certificados
           ❌ Mixed Content se erro
```

### **✅ DEPOIS (Proxy reverso):**

```
Usuário → https://meumu.com/api (443)
           ↓
           Nginx (gerencia SSL)
           ↓ proxy_pass
           http://127.0.0.1:3001/api (interno)
           ↓
           Backend Node.js
           ↓
           ✅ Porta 3001 interna
           ✅ SSL no Nginx (maduro)
           ✅ Cadeado verde
           ✅ Zero erros
```

---

## 🔧 **CONFIGURAÇÃO DO NGINX (RESUMIDA):**

```nginx
server {
    listen 443 ssl http2;
    server_name meumu.com;
    
    # SSL
    ssl_certificate /etc/letsencrypt/live/meumu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meumu.com/privkey.pem;
    
    # Frontend (assets estáticos)
    root /home/meumu.com/public_html/dist;
    
    # API (proxy reverso)
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SPA (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP → HTTPS
server {
    listen 80;
    server_name meumu.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🛠️ **TROUBLESHOOTING:**

### **1. Backend não responde:**
```bash
# Verificar se backend está rodando
curl http://127.0.0.1:3001/health

# Ver logs
tail -f backend-nodejs/logs/server.log

# Verificar se escuta localhost
netstat -tlnp | grep 3001
# Deve mostrar: 127.0.0.1:3001 (não 0.0.0.0:3001)
```

### **2. Nginx não faz proxy:**
```bash
# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t

# Reiniciar
sudo systemctl restart nginx
```

### **3. SSL não funciona:**
```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Testar SSL
curl -I https://meumu.com
```

### **4. Erro 502 Bad Gateway:**
```bash
# Backend não está rodando OU
# Nginx não consegue conectar em 127.0.0.1:3001

# Verificar:
curl http://127.0.0.1:3001/health

# Se não responder, iniciar backend:
cd backend-nodejs
npm start
```

---

## 📝 **CHECKLIST FINAL:**

✅ **Nginx instalado e rodando**
```bash
sudo systemctl status nginx
```

✅ **SSL configurado (Certbot)**
```bash
sudo certbot certificates
```

✅ **Proxy reverso configurado**
```bash
sudo nginx -t
cat /etc/nginx/sites-available/meumu.com
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

✅ **Firewall bloqueando porta 3001**
```bash
sudo ufw status | grep 3001
# Deve mostrar: 3001/tcp DENY
```

✅ **API funcionando via proxy**
```bash
curl https://meumu.com/api/health
```

✅ **Frontend carregando**
```bash
curl -I https://meumu.com
```

---

## 🎯 **RESUMO EXECUTIVO:**

```bash
# 1. Instalar Nginx + SSL
sudo apt install nginx certbot python3-certbot-nginx -y
sudo certbot --nginx -d meumu.com -d www.meumu.com

# 2. Configurar proxy (automático)
sudo ./setup-nginx-proxy.sh

# 3. Configurar backend
cd backend-nodejs
cp .env.production .env
# Editar: NODE_ENV=production, FRONTEND_URL=https://meumu.com

# 4. Configurar frontend
cd ..
echo 'VITE_API_URL=https://meumu.com/api' > .env
npm run build

# 5. Iniciar backend
cd backend-nodejs
npm start

# 6. Firewall
sudo ufw deny 3001/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 7. Testar
curl https://meumu.com/api/health
```

---

**✅ Proxy reverso configurado! Arquitetura profissional pronta! 🚀**
