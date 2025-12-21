# 🎮 MeuMU Online - Configurar Proxy via CyberPanel GUI

## 🎯 **PROBLEMA:**

```
curl http://meumu.com/api/server/health
❌ Retorna: HTML 404 (OpenLiteSpeed)

curl http://localhost:3001/api/server/health  
✅ Retorna: JSON {"success":true,"status":"healthy"}
```

**Backend funciona, mas proxy não!**

---

## ✅ **SOLUÇÃO PASSO A PASSO:**

### **1️⃣ Acesse o CyberPanel**

```bash
# Descubra o IP do servidor
hostname -I
# Exemplo: 192.168.1.100
```

**No navegador, acesse:**
```
https://192.168.1.100:8090
```

**Login:**
- Usuário: `admin`
- Senha: (a que você configurou no CyberPanel)

---

### **2️⃣ Navegue até o Website**

1. No menu lateral esquerdo, clique em **"Websites"**
2. Clique em **"List Websites"**
3. Encontre **`meumu.com`** na lista
4. Clique no botão **"Manage"** ao lado de `meumu.com`

---

### **3️⃣ Configure o Document Root**

1. Na página de gerenciamento, localize **"Document Root"**
2. Altere de:
   ```
   /home/meumu.com/public_html
   ```
   Para:
   ```
   /home/meumu.com/public_html/dist
   ```
3. Clique em **"Save Changes"** ou **"Modify"**

---

### **4️⃣ Configure Rewrite Rules**

1. No menu lateral esquerdo (ainda na página de `meumu.com`), clique em **"Rewrite Rules"**
2. Você verá um campo de texto grande
3. **APAGUE TODO O CONTEÚDO** existente
4. **Cole exatamente isso:**

```apache
RewriteEngine On

# Proxy para Backend Node.js na porta 3001
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]

# React Router - Redirecionar tudo para index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ /index.html [L]
```

5. Clique em **"Save Rewrite Rules"**

---

### **5️⃣ Ativar Módulo Proxy (IMPORTANTE!)**

No **terminal do servidor**, execute:

```bash
# Verificar se módulo proxy está ativo
sudo /usr/local/lsws/bin/lshttpd -m

# Se não aparecer "mod_proxy", ativar:
sudo sed -i '/module cache/a module mod_proxy' /usr/local/lsws/conf/httpd_config.conf

# Reiniciar OpenLiteSpeed
sudo systemctl restart lsws
```

---

### **6️⃣ Verificar Permissões**

```bash
# Dar permissões corretas
sudo chown -R nobody:nogroup /home/meumu.com/public_html/dist
sudo chmod -R 755 /home/meumu.com/public_html/dist

# Garantir que backend está rodando
pm2 status
pm2 restart meumu-backend
```

---

### **7️⃣ Testar**

```bash
# Aguardar 5 segundos
sleep 5

# Teste 1: Backend direto
curl http://localhost:3001/api/server/health
# ✅ Deve retornar JSON

# Teste 2: Via domínio (proxy)
curl http://meumu.com/api/server/health
# ✅ Deve retornar JSON (NÃO HTML!)
```

---

## 🔧 **SE AINDA NÃO FUNCIONAR:**

### **Opção A: Configurar via vhost.conf direto**

```bash
sudo nano /usr/local/lsws/conf/vhosts/meumu.com/vhost.conf
```

**Encontre a seção `<virtualHost>` e adicione ANTES de `</virtualHost>`:**

```xml
  <context uri="/api/">
    <type>proxy</type>
    <handler>http://127.0.0.1:3001</handler>
    <addDefaultCharset>off</addDefaultCharset>
  </context>

  <rewrite>
    <enable>1</enable>
    <rules>
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ /index.html [L]
    </rules>
  </rewrite>
```

**Salvar (`Ctrl+O`, `Enter`, `Ctrl+X`) e reiniciar:**

```bash
sudo systemctl restart lsws
```

---

### **Opção B: Usar Nginx em vez de OpenLiteSpeed**

Se OpenLiteSpeed continuar com problemas de proxy:

```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx -y

# Parar OpenLiteSpeed
sudo systemctl stop lsws
sudo systemctl disable lsws

# Configurar Nginx
sudo nano /etc/nginx/sites-available/meumu.com
```

**Cole:**

```nginx
server {
    listen 80;
    server_name meumu.com www.meumu.com;
    
    root /home/meumu.com/public_html/dist;
    index index.html;

    # Proxy para Backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Ativar e reiniciar:**

```bash
sudo ln -s /etc/nginx/sites-available/meumu.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 **CHECKLIST DE VERIFICAÇÃO:**

- [ ] Backend rodando: `pm2 status` → `meumu-backend` online
- [ ] Porta 3001 aberta: `netstat -tuln | grep 3001`
- [ ] Backend responde: `curl http://localhost:3001/api/server/health`
- [ ] Módulo proxy ativo no OpenLiteSpeed
- [ ] Rewrite rules salvas no CyberPanel
- [ ] Document Root aponta para `/dist`
- [ ] OpenLiteSpeed reiniciado: `sudo systemctl restart lsws`
- [ ] Proxy funciona: `curl http://meumu.com/api/server/health` retorna JSON

---

## 🎯 **TESTE FINAL:**

```bash
# Se tudo estiver correto, estes 3 comandos devem retornar JSON:

# 1. Backend direto
curl http://localhost:3001/api/server/health

# 2. Backend via 127.0.0.1
curl http://127.0.0.1:3001/api/server/health

# 3. Proxy via domínio
curl http://meumu.com/api/server/health
```

**Se o #3 retornar HTML 404 → Problema no proxy do OpenLiteSpeed**  
**Se o #3 retornar JSON → SUCESSO! ✅**

---

**MeuMU Online v3.0.0**  
**Configuração via CyberPanel GUI**  
**© 2024-2025 MeuMU Team**
