# 🚀 SOLUÇÃO RÁPIDA - CYBERPANEL

## 🎯 **SEU PROBLEMA:**

```
❌ API Error [/server/info]: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**TRADUÇÃO:** O servidor está retornando HTML do React em vez de conectar ao backend Node.js.

---

## ✅ **SOLUÇÃO EM 1 COMANDO:**

```bash
chmod +x configurar-cyberpanel.sh
./configurar-cyberpanel.sh
```

**O script vai fazer TUDO automaticamente!**

---

## 📋 **OU FAÇA MANUALMENTE (5 minutos):**

### **1️⃣ Iniciar Backend Node.js**

```bash
cd /home/meumu.com/public_html/backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend
pm2 save
```

**Testar:**
```bash
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok"}
```

---

### **2️⃣ Configurar Proxy no CyberPanel**

**Via Interface Web:**

1. Acesse: `https://seu-ip:8090`
2. Vá: **Websites → List Websites → meumu.com**
3. Click: **"Rewrite Rules"**
4. Cole:

```apache
# Proxy para API
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]

# React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ /index.html [L]
```

5. **Save**

---

**OU via SSH:**

```bash
sudo nano /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf
```

**Adicione ANTES de `</virtualHost>`:**

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

**Salvar e sair:** `Ctrl+O`, Enter, `Ctrl+X`

---

### **3️⃣ Configurar Document Root**

**Via CyberPanel:**

1. **Websites → List Websites → meumu.com**
2. **Document Root:** Mudar para `/home/meumu.com/public_html/dist`
3. **Save**

**OU via SSH:**

```bash
sudo nano /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf
```

**Mudar:**
```xml
docRoot                   /home/meumu.com/public_html/dist
```

---

### **4️⃣ Reiniciar OpenLiteSpeed**

```bash
sudo systemctl restart lsws
```

---

### **5️⃣ Testar**

```bash
# Backend direto
curl http://localhost:3001/api/health
# ✅ Deve retornar: {"status":"ok"}

# Backend via proxy
curl http://meumu.com/api/health
# ✅ Deve retornar: {"status":"ok"}
# ❌ Se retornar HTML → Proxy não configurado!
```

---

## 🎮 **TESTAR NO NAVEGADOR:**

1. **Limpar cache:**
   ```
   Ctrl + Shift + R
   ```

2. **Acessar:**
   ```
   http://meumu.com
   ```

3. **Abrir console (F12):**
   - ❌ **ANTES:** `GET /api/server/info 404`
   - ✅ **AGORA:** Sem erros 404!
   - ✅ Rankings carregam!

---

## 🔧 **ESTRUTURA CORRETA:**

```
CyberPanel/OpenLiteSpeed
│
├─ VirtualHost: meumu.com
│  ├─ Document Root: /home/meumu.com/public_html/dist
│  ├─ Proxy Context: /api/ → http://127.0.0.1:3001
│  └─ Rewrite Rules: React Router
│
├─ Frontend (React)
│  └─ Porta: 80/443 (via OpenLiteSpeed)
│
├─ Backend (Node.js)
│  └─ Porta: 3001 (PM2)
│
└─ Database (MySQL)
   └─ Porta: 3306
```

---

## 🚨 **SE NÃO FUNCIONAR:**

### **Verificar logs:**

```bash
# Backend
pm2 logs meumu-backend

# OpenLiteSpeed
sudo tail -f /usr/local/lsws/logs/error.log
```

### **Verificar configuração:**

```bash
# Document Root
grep "docRoot" /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf

# Proxy
grep -A5 "type>proxy" /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf

# Backend rodando
pm2 status
netstat -tuln | grep 3001
```

---

## 📞 **ENVIE ISSO SE TIVER ERRO:**

```bash
echo "=== BACKEND ==="
pm2 status
curl http://localhost:3001/api/health

echo "=== PROXY ==="
curl -I http://meumu.com/api/health

echo "=== CONFIG ==="
grep -E "docRoot|type>proxy" /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf

echo "=== OPENLITESPEED ==="
sudo systemctl status lsws
```

---

## 🎯 **EXECUTE AGORA:**

```bash
chmod +x configurar-cyberpanel.sh
./configurar-cyberpanel.sh
```

**2 minutos e está pronto!** 🚀🎮
