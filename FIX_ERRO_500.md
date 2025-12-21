# 🔴 ERRO 500 - Guia de Resolução

## 📋 **O QUE ACONTECEU:**

```bash
curl https://meumu.com/api/server/info
# Retorna: 500 Internal Server Error
```

**Causa:** O proxy reverso está configurado mas falhando.

---

## ✅ **SOLUÇÃO RÁPIDA (1 COMANDO):**

```bash
cd /home/meumu.com/public_html
chmod +x fix-api-500.sh
bash fix-api-500.sh
```

**O script faz:**
1. ✅ Verifica se backend está rodando
2. ✅ Inicia backend se necessário
3. ✅ Configura proxy reverso (via PHP)
4. ✅ Testa todos os endpoints
5. ✅ Mostra diagnóstico completo

---

## 🔧 **SOLUÇÃO MANUAL (Passo a passo):**

### **PASSO 1: Iniciar Backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs
pm2 start src/server.js --name meumu-backend
pm2 save
```

**Testar:**
```bash
curl http://localhost:3001/health
```

**Deve retornar:**
```json
{"status":"ok","message":"MeuMU API is running","database":"connected"}
```

---

### **PASSO 2: Copiar Arquivos**

Os arquivos já foram criados:
- `.htaccess` - Regras de rewrite
- `api-proxy.php` - Proxy PHP (alternativa ao mod_proxy)

**Copiar para a raiz do site:**
```bash
cd /home/meumu.com/public_html

# Verificar se existem
ls -la .htaccess api-proxy.php

# Se não existirem, baixe novamente do projeto
```

---

### **PASSO 3: Configurar Permissões**

```bash
cd /home/meumu.com/public_html
chmod 644 .htaccess
chmod 644 api-proxy.php
```

---

### **PASSO 4: Reiniciar Servidor Web**

```bash
# LiteSpeed
sudo systemctl restart lsws

# OU Apache
sudo systemctl restart apache2
```

---

### **PASSO 5: Testar**

```bash
# Teste 1: Backend direto
curl http://localhost:3001/api/server/info

# Teste 2: Proxy público
curl https://meumu.com/api/server/info

# Ambos devem retornar JSON (não HTML)
```

---

## 🐛 **TROUBLESHOOTING:**

### **Erro: Backend não responde**

```bash
# Ver logs
pm2 logs meumu-backend --lines 50

# Verificar se está rodando
pm2 status

# Reiniciar
pm2 restart meumu-backend
```

---

### **Erro: Ainda dá 500**

**Opção 1: Habilitar mod_proxy (Apache)**

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**Opção 2: Usar proxy PHP** (já configurado)

O arquivo `api-proxy.php` já está criado e funcionará automaticamente.

---

### **Erro: "Backend não disponível"**

Verifique o `.env` do backend:

```bash
cat backend-nodejs/.env

# Deve ter:
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=MuOnline
```

Teste conexão MySQL:

```bash
mysql -u seu_usuario -p -h localhost MuOnline -e "SELECT COUNT(*) FROM MEMB_INFO"
```

---

### **Erro: CORS**

Se aparecer erro de CORS no console do navegador, o `api-proxy.php` já está configurado para tratar isso.

Se ainda assim houver erro, adicione ao `backend-nodejs/src/server.js`:

```javascript
// Logo após const app = express();
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

Depois:
```bash
pm2 restart meumu-backend
```

---

## 📊 **VERIFICAÇÃO FINAL:**

### **Checklist:**

- [ ] `pm2 status` mostra `meumu-backend` online
- [ ] `curl http://localhost:3001/health` retorna JSON
- [ ] `curl https://meumu.com/api/server/info` retorna JSON (não HTML)
- [ ] Arquivo `.htaccess` existe na raiz
- [ ] Arquivo `api-proxy.php` existe na raiz
- [ ] `https://meumu.com` carrega normalmente

### **Se tudo estiver OK:**

```bash
curl https://meumu.com/api/server/info | python3 -m json.tool

# Deve retornar:
{
  "success": true,
  "data": {
    "name": "MeuMU Online",
    "version": "Season 19-2-3",
    ...
  }
}
```

---

## 🚀 **DEPLOY COMPLETO (após resolver):**

```bash
cd /home/meumu.com/public_html
bash deploy-production.sh
```

Isso vai:
1. ✅ Build do frontend com proxy correto
2. ✅ Copiar para raiz
3. ✅ Configurar tudo
4. ✅ Reiniciar servidor

---

## 📞 **LOGS PARA DEBUG:**

```bash
# Backend
pm2 logs meumu-backend --lines 100

# LiteSpeed
tail -f /usr/local/lsws/logs/error.log

# Apache
tail -f /var/log/apache2/error.log

# PHP
tail -f /var/log/php-fpm/error.log
```

---

## 🎯 **TESTE COMPLETO:**

Execute este comando para testar tudo:

```bash
echo "=== Backend ===" && \
curl -s http://localhost:3001/health | python3 -m json.tool && \
echo -e "\n=== Proxy ===" && \
curl -s https://meumu.com/api/server/info | python3 -m json.tool && \
echo -e "\n=== Frontend ===" && \
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://meumu.com
```

**Resultado esperado:**
```
=== Backend ===
{
  "status": "ok",
  "message": "MeuMU API is running",
  "database": "connected"
}

=== Proxy ===
{
  "success": true,
  "data": {
    "name": "MeuMU Online",
    ...
  }
}

=== Frontend ===
HTTP 200
```

---

**✅ Execute `bash fix-api-500.sh` e cole aqui o resultado!**
