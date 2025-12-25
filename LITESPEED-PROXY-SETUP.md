# 🚀 LITESPEED PROXY REVERSO - GUIA COMPLETO (CYBERPANEL)

## 🎯 **ARQUITETURA PROFISSIONAL COM LITESPEED:**

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO (INTERNET)                        │
│                 https://meumu.com/api                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (porta 443)
                         │ Cadeado Verde 🔒
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            OPENLITESPEED (PROXY REVERSO)                     │
│  • Gerencia SSL/TLS (via CyberPanel)                        │
│  • Valida certificados Let's Encrypt                        │
│  • Rate limiting integrado                                   │
│  • Headers de segurança                                      │
│  • Cache nativo LSCache                                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (interno, seguro)
                         │ extProcessor → 127.0.0.1:3001
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

## ⚠️ **IMPORTANTE - CYBERPANEL:**

```
❌ NGINX     = Incompatível com CyberPanel
❌ APACHE    = Incompatível com CyberPanel
✅ LITESPEED = Core do CyberPanel (não pode desativar!)
```

**CyberPanel foi construído para rodar exclusivamente sobre OpenLiteSpeed.**

Se você desativar o LiteSpeed, o CyberPanel para de funcionar!

---

## ✅ **VANTAGENS DO LITESPEED:**

### **1. 🚀 Performance Superior**
- ✅ **Event-driven** (como Nginx, mas mais rápido)
- ✅ **LSCache** nativo (cache de página inteira)
- ✅ **HTTP/3 QUIC** suportado
- ✅ **Menos uso de memória** que Apache
- ✅ **Compatível com .htaccess** (migração fácil)

### **2. 🔒 Segurança Integrada**
- ✅ **ModSecurity** integrado
- ✅ **Anti-DDoS** nativo
- ✅ **Rate limiting** por IP/URL
- ✅ **Let's Encrypt** via CyberPanel (1 clique)

### **3. 🎯 CyberPanel Integration**
- ✅ **Interface gráfica** para tudo
- ✅ **1-Click SSL** (Let's Encrypt)
- ✅ **DNS, Email, FTP** gerenciados
- ✅ **Backups** automáticos

---

## 📋 **PASSO A PASSO COMPLETO:**

### **🔧 MÉTODO 1: VIA CYBERPANEL (RECOMENDADO - MAIS FÁCIL)**

#### **Etapa 1: Acessar CyberPanel**

```
https://meumu.com:8090
```

**Login:**
- **Username:** admin
- **Password:** (senha que você configurou)

---

#### **Etapa 2: Gerenciar Website**

```
1. Menu lateral → Websites
2. List Websites
3. Localizar "meumu.com"
4. Clicar em "Manage"
```

---

#### **Etapa 3: Editar vHost Configuration**

```
1. Na página de gerenciamento, procurar:
   "vHost Conf" ou "Configuration"
   
2. Clicar para editar
```

Você verá um arquivo parecido com:

```apache
docRoot                   /home/meumu.com/public_html
vhDomain                  meumu.com
vhAliases                 www.meumu.com
enableGzip                1

# ... mais configurações ...
```

---

#### **Etapa 4: Adicionar Configuração de Proxy**

**Cole ESTE BLOCO no final do arquivo (antes do último `}`):**

```apache
# ════════════════════════════════════════════════════════════════
# MEUMU ONLINE - PROXY REVERSO PARA BACKEND NODE.JS
# ════════════════════════════════════════════════════════════════

extProcessor meumu-api {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                100
  env                     NODE_ENV=production
  initTimeout             60
  retryTimeout            0
  pcKeepAliveTimeout      60
  respBuffer              0
  autoStart               0
  notes                   MeuMU Online Backend API (Node.js)
}

context /api/ {
  type                    proxy
  handler                 meumu-api
  addDefaultCharset       off
  enableRewrite           1
  
  extraHeaders            <<<END_extraHeaders
Access-Control-Allow-Origin https://meumu.com
Access-Control-Allow-Methods GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers Authorization, Content-Type, X-Requested-With
Access-Control-Allow-Credentials true
  END_extraHeaders
}

# ════════════════════════════════════════════════════════════════
```

---

#### **Etapa 5: Ajustar DocumentRoot**

**Procure a linha:**
```apache
docRoot                   /home/meumu.com/public_html
```

**Altere para:**
```apache
docRoot                   /home/meumu.com/public_html/dist
```

**Motivo:** Frontend buildado fica na pasta `dist/`

---

#### **Etapa 6: Configurar Rewrite para SPA (React Router)**

**Procure a seção `rewrite` ou adicione:**

```apache
context / {
  location                /home/meumu.com/public_html/dist
  allowBrowse             1
  indexFiles              index.html
  
  rewrite {
    enable                1
    autoLoadHtaccess      1
    
    rules                 <<<END_rules
# React Router - SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]
    END_rules
  }
}
```

---

#### **Etapa 7: Salvar e Reiniciar**

```
1. Clicar em "Save" (no final da página)
2. CyberPanel vai mostrar: "Configuration saved successfully"
3. Voltar para "Manage"
4. Clicar em "Graceful Restart LiteSpeed"
```

**OU reiniciar manualmente:**

```bash
sudo /usr/local/lsws/bin/lswsctrl restart
```

---

### **🔧 MÉTODO 2: VIA SCRIPT AUTOMÁTICO**

```bash
cd /home/meumu.com/public_html

# Tornar executável
chmod +x setup-litespeed-proxy.sh

# Executar como root
sudo ./setup-litespeed-proxy.sh
```

**O script vai:**
- ✅ Detectar LiteSpeed
- ✅ Localizar vHost
- ✅ Fazer backup
- ✅ Adicionar configuração de proxy
- ✅ Ajustar DocumentRoot
- ✅ Reiniciar LiteSpeed

---

### **🔧 MÉTODO 3: MANUAL (LINHA DE COMANDO)**

```bash
# 1. Localizar vHost
VHOST_CONF="/usr/local/lsws/conf/vhosts/meumu.com/vhost.conf"

# 2. Backup
sudo cp "$VHOST_CONF" "$VHOST_CONF.backup.$(date +%Y%m%d_%H%M%S)"

# 3. Editar
sudo nano "$VHOST_CONF"

# 4. Adicionar configuração de /litespeed-proxy-config.conf

# 5. Reiniciar
sudo /usr/local/lsws/bin/lswsctrl restart
```

---

## 🔐 **CONFIGURAR SSL (LET'S ENCRYPT):**

### **Via CyberPanel (1 clique):**

```
1. CyberPanel → Websites → List Websites
2. Manage (meumu.com)
3. Manage SSL
4. Issue SSL
5. Selecionar "Let's Encrypt"
6. Marcar: meumu.com e www.meumu.com
7. Issue Now
```

**Pronto! SSL configurado automaticamente! 🔒**

---

### **Via CLI (se preferir):**

```bash
# CyberPanel usa script próprio
/usr/local/CyberCP/bin/cyberpanel issueSSL --domainName meumu.com
```

---

## ⚙️ **CONFIGURAR BACKEND E FRONTEND:**

### **1. Backend (.env):**

```bash
cd /home/meumu.com/public_html/backend-nodejs
cp .env.production .env
nano .env
```

**Verificar:**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://meumu.com
ALLOWED_ORIGINS=https://meumu.com,https://www.meumu.com
```

---

### **2. Frontend (.env):**

```bash
cd /home/meumu.com/public_html
echo 'VITE_API_URL=https://meumu.com/api' > .env
```

---

### **3. Build Frontend:**

```bash
npm run build

# Verificar se dist/ foi criada
ls -la dist/
```

---

### **4. Iniciar Backend:**

```bash
cd backend-nodejs
pkill -f node
npm start

# OU com PM2:
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup
```

**Deve mostrar:**
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

## 🔍 **TESTAR CONFIGURAÇÃO:**

### **1. Testar LiteSpeed (frontend):**

```bash
curl -I https://meumu.com

# Esperado:
HTTP/2 200
server: LiteSpeed
content-type: text/html
```

---

### **2. Testar API (proxy):**

```bash
curl https://meumu.com/api/health

# Esperado:
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  ...
}
```

---

### **3. Testar no navegador:**

```
https://meumu.com

DevTools Console:
✅ Sem erros CORS
✅ Sem Mixed Content
✅ Cadeado verde 🔒
✅ GET https://meumu.com/api/... 200 OK
```

---

## 🔧 **TROUBLESHOOTING:**

### **1. Backend não responde:**

```bash
# Verificar se backend está rodando
curl http://127.0.0.1:3001/health

# Ver logs
tail -f backend-nodejs/logs/server.log

# Verificar se escuta localhost
netstat -tlnp | grep 3001
# Deve mostrar: 127.0.0.1:3001
```

---

### **2. LiteSpeed não faz proxy:**

```bash
# Ver logs do LiteSpeed
sudo tail -f /usr/local/lsws/logs/error.log

# Verificar vHost
cat /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf | grep meumu-api

# Reiniciar
sudo /usr/local/lsws/bin/lswsctrl restart
```

---

### **3. Erro 502 Bad Gateway:**

**Causa:** Backend não está rodando OU LiteSpeed não consegue conectar

```bash
# Verificar backend
curl http://127.0.0.1:3001/health

# Se não responder, iniciar:
cd backend-nodejs
npm start

# Verificar logs do LiteSpeed
sudo tail -f /usr/local/lsws/logs/error.log
```

---

### **4. Erro 404 na API:**

**Causa:** Configuração de context /api/ não foi aplicada

```bash
# Verificar vHost
sudo nano /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf

# Procurar:
context /api/ {
  type                    proxy
  handler                 meumu-api
  ...
}

# Se não existir, adicionar e reiniciar LiteSpeed
```

---

## 📊 **COMPARAÇÃO: NGINX vs LITESPEED**

| Aspecto | Nginx | LiteSpeed |
|---------|-------|-----------|
| **CyberPanel** | ❌ Incompatível | ✅ Core do painel |
| **Performance** | ⚡ Rápido | ⚡⚡ Mais rápido |
| **Cache** | Módulos externos | ✅ LSCache nativo |
| **.htaccess** | ❌ Não suporta | ✅ Compatível |
| **HTTP/3** | ⚠️ Experimental | ✅ Nativo |
| **Interface** | ❌ CLI apenas | ✅ CyberPanel GUI |
| **Migração** | Difícil | ✅ Fácil (Apache-like) |

---

## 🎯 **CONFIGURAÇÃO LITESPEED (RESUMIDA):**

```apache
# External App (Backend)
extProcessor meumu-api {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                100
}

# Proxy /api/ → Backend
context /api/ {
  type                    proxy
  handler                 meumu-api
  addDefaultCharset       off
  
  extraHeaders            <<<END_extraHeaders
Access-Control-Allow-Origin https://meumu.com
  END_extraHeaders
}

# Frontend (SPA)
context / {
  location                /home/meumu.com/public_html/dist
  
  rewrite {
    enable                1
    rules                 <<<END_rules
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]
    END_rules
  }
}
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

---

## 🎉 **RESUMO EXECUTIVO:**

```bash
# 1. Configurar proxy via CyberPanel
https://meumu.com:8090
Websites → meumu.com → Manage → vHost Conf
# Colar configuração de /litespeed-proxy-config.conf

# 2. SSL (se ainda não tiver)
Manage SSL → Issue SSL (Let's Encrypt)

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

# 6. Testar
curl https://meumu.com/api/health
```

---

## 🚀 **EXTRAS - OTIMIZAÇÕES LITESPEED:**

### **LSCache (Cache de página inteira):**

```apache
# Adicionar no vHost
context / {
  enableExpires           1
  expiresDefault          A86400
  
  # LSCache
  cacheEngine {
    enabled               1
    storage {
      cacheStorePath      /home/meumu.com/lscache
    }
  }
}
```

### **HTTP/3 (QUIC):**

Já ativo por padrão no LiteSpeed! 🚀

---

**✅ Proxy reverso LiteSpeed configurado! Arquitetura profissional com CyberPanel! 🚀**
