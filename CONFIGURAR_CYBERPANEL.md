# 🚀 MeuMU Online - Configurar CyberPanel/OpenLiteSpeed

## 🎯 **SEU ERRO:**

```
❌ API Error [/server/info]: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**CAUSA:** O CyberPanel/OpenLiteSpeed está retornando o HTML do React para as requisições `/api/*` em vez de fazer proxy para o backend Node.js na porta 3001.

---

## ✅ **SOLUÇÃO EM 3 PASSOS:**

### **PASSO 1: Iniciar Backend Node.js**

```bash
# Ir para pasta do projeto
cd /home/meumu.com/public_html

# Ir para backend
cd backend-nodejs

# Instalar dependências
npm install

# Iniciar com PM2 (recomendado)
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup

# OU iniciar standalone
# npm start
```

**Verificar se está rodando:**
```bash
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok"}
```

---

### **PASSO 2: Configurar Proxy Reverso no CyberPanel**

#### **Opção A: Via Interface Web (Recomendado)**

1. **Acesse o CyberPanel:**
   ```
   https://seu-ip:8090
   ```

2. **Vá para:** 
   ```
   Websites → List Websites → meumu.com
   ```

3. **Clique em:** 
   ```
   "Rewrite Rules"
   ```

4. **Cole estas regras:**
   ```apache
   # MeuMU Online - Proxy Reverso para Backend Node.js
   
   # Proxy para API (Backend Node.js na porta 3001)
   RewriteCond %{REQUEST_URI} ^/api/
   RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]
   
   # React Router - Redirecionar tudo para index.html
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_URI} !^/api/
   RewriteRule ^ /index.html [L]
   ```

5. **Salvar**

---

#### **Opção B: Via SSH (Manual)**

**Editar o arquivo de configuração do vhost:**

```bash
# Encontrar o arquivo de config (substitua meumu.com pelo seu domínio)
sudo nano /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf
```

**Adicionar dentro do `<VirtualHost>` ou `<context>`:**

```xml
<context>
  <type>proxy</type>
  <uri>/api/</uri>
  <handler>http://127.0.0.1:3001</handler>
  <addDefaultCharset>off</addDefaultCharset>
</context>
```

**Salvar e reiniciar OpenLiteSpeed:**

```bash
sudo systemctl restart lsws
```

---

### **PASSO 3: Configurar Rewrite Rules (OpenLiteSpeed)**

O CyberPanel usa OpenLiteSpeed, então precisa de `.htaccess` **OU** configuração no painel.

**Criar/Editar `/home/meumu.com/public_html/dist/.htaccess`:**

```apache
# MeuMU Online - OpenLiteSpeed Configuration

<IfModule LiteSpeed>
    RewriteEngine On
    RewriteBase /
    
    # Proxy para Backend Node.js
    RewriteCond %{REQUEST_URI} ^/api/
    RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]
    
    # React Router - Redirecionar para index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteRule ^ index.html [L]
</IfModule>

# Segurança
Options -Indexes

# MIME Types
AddType application/javascript .js .mjs
AddType text/css .css
AddType application/json .json

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 🔧 **CONFIGURAÇÃO COMPLETA NO CYBERPANEL:**

### **1. Document Root:**

No CyberPanel, configure:

```
Document Root: /home/meumu.com/public_html/dist
```

**Como fazer:**
1. CyberPanel → Websites → List Websites
2. Click em "meumu.com"
3. Document Root → Mudar para `/home/meumu.com/public_html/dist`
4. Save

---

### **2. Enable Proxy (Importante!):**

No OpenLiteSpeed, você precisa habilitar o módulo de proxy.

**Via SSH:**

```bash
# Editar configuração principal
sudo nano /usr/local/lsws/conf/httpd_config.xml
```

**Procurar por `<modules>` e adicionar:**

```xml
<module name="mod_proxy">
  <param>1</param>
</module>
```

**Reiniciar:**

```bash
sudo systemctl restart lsws
```

---

### **3. Alternativa: Proxy Context (Mais Robusto)**

**Via CyberPanel:**

1. Websites → List Websites → meumu.com
2. Click "vHost Conf"
3. Adicionar **ANTES** de `</virtualHost>`:

```xml
<context>
  <type>proxy</type>
  <uri>/api/</uri>
  <handler>http://127.0.0.1:3001</handler>
  <addDefaultCharset>off</addDefaultCharset>
</context>

<context>
  <location>/</location>
  <allowBrowse>1</allowBrowse>
  <rewrite>
    <enable>1</enable>
    <rules>
    # Backend API Proxy
    RewriteCond %{REQUEST_URI} ^/api/
    RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]
    
    # React Router
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteRule ^ /index.html [L]
    </rules>
  </rewrite>
</context>
```

4. Graceful Restart OpenLiteSpeed

---

## 🧪 **TESTAR:**

### **1. Backend direto:**

```bash
curl http://localhost:3001/api/health
```

**Esperado:**
```json
{"status":"ok"}
```

---

### **2. Backend via proxy:**

```bash
curl http://meumu.com/api/health
```

**Esperado:**
```json
{"status":"ok"}
```

**Se retornar HTML (`<!DOCTYPE...`)** → Proxy não está funcionando!

---

### **3. Frontend:**

```bash
curl http://meumu.com
```

**Esperado:** HTML do React

---

## 🚨 **TROUBLESHOOTING:**

### **Problema 1: Proxy retorna HTML do React**

**Causa:** Rewrite rules aplicando antes do proxy

**Solução:** Colocar regras de proxy **ANTES** das regras do React no `.htaccess`

```apache
# PRIMEIRO: Proxy
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]

# DEPOIS: React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

### **Problema 2: 502 Bad Gateway**

**Causa:** Backend não está rodando

**Solução:**
```bash
pm2 restart meumu-backend
# OU
cd backend-nodejs && npm start
```

---

### **Problema 3: CORS Error**

**Causa:** Backend não está enviando headers CORS

**Solução:** Já está configurado no backend (`backend-nodejs/src/server.js`)

Se persistir, adicionar no OpenLiteSpeed:

```xml
<context>
  <type>proxy</type>
  <uri>/api/</uri>
  <handler>http://127.0.0.1:3001</handler>
  <addDefaultCharset>off</addDefaultCharset>
  <extraHeaders>
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
    Access-Control-Allow-Headers: Content-Type, Authorization
  </extraHeaders>
</context>
```

---

## 📋 **CHECKLIST FINAL:**

- [ ] Backend Node.js rodando na porta 3001
- [ ] `curl http://localhost:3001/api/health` retorna JSON
- [ ] Document Root = `/home/meumu.com/public_html/dist`
- [ ] Proxy configurado no CyberPanel/OpenLiteSpeed
- [ ] Rewrite rules no `.htaccess` ou vHost conf
- [ ] OpenLiteSpeed reiniciado
- [ ] `curl http://meumu.com/api/health` retorna JSON (não HTML!)
- [ ] Site funciona: `http://meumu.com`
- [ ] Console sem erros 404 em `/api/*`

---

## 🎯 **CONFIGURAÇÃO IDEAL (COPY-PASTE):**

### **Arquivo: `/usr/local/lsws/conf/vhosts/meumu.com/vhost.conf`**

```xml
docRoot                   /home/meumu.com/public_html/dist

<context>
  <type>proxy</type>
  <uri>/api/</uri>
  <handler>http://127.0.0.1:3001</handler>
  <addDefaultCharset>off</addDefaultCharset>
</context>

<context>
  <location>/</location>
  <allowBrowse>1</allowBrowse>
  <rewrite>
    <enable>1</enable>
    <base>/</base>
    <rules>
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteRule ^ /index.html [L]
    </rules>
  </rewrite>
</context>
```

**Depois:**
```bash
sudo systemctl restart lsws
```

---

## 📞 **AINDA COM PROBLEMA?**

Execute e me envie:

```bash
echo "=== BACKEND STATUS ==="
pm2 status
curl http://localhost:3001/api/health

echo "=== PROXY TEST ==="
curl -I http://meumu.com/api/health

echo "=== DOCUMENT ROOT ==="
grep -r "docRoot" /usr/local/lsws/conf/vhosts/meumu.com/

echo "=== OPENLITESPEED STATUS ==="
sudo systemctl status lsws
```

---

**MeuMU Online v3.0.0**  
**Guia CyberPanel/OpenLiteSpeed**  
**© 2024-2025 MeuMU Team**
