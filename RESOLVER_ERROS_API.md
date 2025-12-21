# 🔴 RESOLVER ERROS DE API - Guia Rápido

## 🎯 **PROBLEMA ATUAL**

Erros no console do navegador:
```
GET http://localhost:3001/api/events net::ERR_CONNECTION_REFUSED
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Causa:** Backend Node.js não está rodando

---

## ✅ **SOLUÇÃO EM 3 PASSOS**

### **PASSO 1: Iniciar o Backend**

```bash
cd /home/meumu.com/public_html
chmod +x start-backend.sh
bash start-backend.sh
```

**O que o script faz:**
1. ✅ Verifica configuração (.env)
2. ✅ Instala dependências se necessário
3. ✅ Para processos antigos
4. ✅ Inicia backend com PM2
5. ✅ Testa se API está respondendo

**Saída esperada:**
```
✅ Backend iniciado!
✅ API respondendo:
{
  "status": "ok",
  "message": "MeuMU API is running",
  "database": "connected"
}
```

---

### **PASSO 2: Rebuild do Frontend (com proxy correto)**

```bash
cd /home/meumu.com/public_html
npm run build
```

**Importante:** O build agora usa `/api` (proxy reverso) ao invés de `http://localhost:3001/api` diretamente.

---

### **PASSO 3: Deploy Completo**

```bash
cd /home/meumu.com/public_html
chmod +x deploy-production.sh
bash deploy-production.sh
```

**O que o script faz:**
1. ✅ Build do frontend (produção)
2. ✅ Copia `/dist` para raiz
3. ✅ Cria `.htaccess` com proxy reverso
4. ✅ Remove arquivos de dev
5. ✅ Reinicia servidor web

---

## 🔍 **VERIFICAÇÃO**

### **1. Backend está rodando?**

```bash
pm2 status

# Deve mostrar:
# meumu-backend │ online │
```

### **2. API está respondendo?**

```bash
curl http://localhost:3001/health

# Deve retornar:
{"status":"ok","message":"MeuMU API is running","database":"connected"}
```

### **3. Proxy reverso funcionando?**

```bash
# Na VPS
curl https://meumu.com/api/server/stats

# Deve retornar JSON (não HTML)
```

### **4. Frontend correto?**

```bash
# Verificar index.html
grep "/assets/index-" /home/meumu.com/public_html/index.html

# Deve retornar:
<script type="module" crossorigin src="/assets/index-XXXXX.js"></script>
```

### **5. .htaccess existe?**

```bash
cat /home/meumu.com/public_html/.htaccess | grep -A 2 "Proxy"

# Deve mostrar:
# Proxy reverso para API
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```

---

## 🌐 **TESTAR NO NAVEGADOR**

### **1. Abrir site:**
```
https://meumu.com
```

### **2. Abrir console (F12):**

**✅ CORRETO (sem erros):**
```
✅ Nenhum erro de MIME type
✅ Nenhum ERR_CONNECTION_REFUSED
✅ Dados carregando normalmente
```

**❌ ERRADO (com erros):**
```
❌ GET http://localhost:3001/api/events net::ERR_CONNECTION_REFUSED
❌ Unexpected token '<', "<!DOCTYPE "...
```

### **3. Verificar Sources (F12 → Sources):**

**✅ CORRETO:**
```
/
├── (index)
├── assets/
│   ├── index-XXXXX.js
│   └── index-XXXXX.css
```

**❌ ERRADO:**
```
/
├── src/
├── main.tsx
└── vite.config.ts
```

---

## 🐛 **TROUBLESHOOTING**

### **Erro: Backend não inicia**

```bash
# Ver logs
pm2 logs meumu-backend

# Verificar .env
cat backend-nodejs/.env

# Testar conexão MySQL
cd backend-nodejs
node -e "const mysql = require('mysql2'); const conn = mysql.createConnection(require('dotenv').config().parsed); conn.connect(err => console.log(err || 'Connected'));"
```

---

### **Erro: Proxy não funciona**

```bash
# Verificar se módulos Apache estão habilitados
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2

# OU para LiteSpeed
sudo systemctl restart lsws
```

---

### **Erro: CORS**

Se aparecer erro de CORS, editar `backend-nodejs/src/server.js`:

```javascript
// Adicionar após const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://meumu.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

Depois reiniciar:
```bash
pm2 restart meumu-backend
```

---

### **Erro: 502 Bad Gateway**

**Causa:** Backend não está respondendo

**Solução:**
```bash
# Reiniciar backend
pm2 restart meumu-backend

# Verificar se está rodando
pm2 status

# Ver logs
pm2 logs meumu-backend --lines 50
```

---

## 📋 **CHECKLIST FINAL**

Antes de considerar resolvido:

- [ ] `pm2 status` mostra `meumu-backend` online
- [ ] `curl http://localhost:3001/health` retorna JSON
- [ ] `curl https://meumu.com/api/server/stats` retorna JSON (não HTML)
- [ ] `/home/meumu.com/public_html/index.html` contém `/assets/index-XXXXX.js`
- [ ] `/home/meumu.com/public_html/.htaccess` existe e tem proxy configurado
- [ ] `https://meumu.com` carrega sem erros no console
- [ ] F12 → Sources mostra apenas `/assets` (sem `/src`)

---

## 🚀 **COMANDOS RÁPIDOS**

```bash
# Tudo em um comando
cd /home/meumu.com/public_html && \
bash start-backend.sh && \
bash deploy-production.sh

# Verificar tudo
pm2 status && \
curl http://localhost:3001/health && \
curl https://meumu.com/api/server/stats | head -5 && \
grep "/assets/" index.html
```

---

## 📞 **AINDA COM PROBLEMAS?**

1. **Ver logs do backend:**
   ```bash
   pm2 logs meumu-backend --lines 100
   ```

2. **Ver logs do Apache/LiteSpeed:**
   ```bash
   # Apache
   tail -f /var/log/apache2/error.log
   
   # LiteSpeed
   tail -f /usr/local/lsws/logs/error.log
   ```

3. **Testar API manualmente:**
   ```bash
   # Listar endpoints disponíveis
   curl http://localhost:3001/api/server/info
   curl http://localhost:3001/api/server/stats
   curl http://localhost:3001/api/rankings/resets?limit=5
   curl http://localhost:3001/api/events
   ```

---

**✅ Seguindo estes passos, o site deve funcionar 100%!**
