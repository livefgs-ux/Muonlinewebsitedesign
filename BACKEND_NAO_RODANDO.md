# 🚨 BACKEND NÃO ESTÁ RODANDO!

## ✅ **BOA NOTÍCIA:**

O erro MIME type foi **RESOLVIDO!** 🎉

- ✅ React buildado corretamente
- ✅ Apache servindo da pasta /dist
- ✅ Frontend funcionando perfeitamente!

---

## ❌ **PROBLEMA ATUAL:**

```
GET https://meumu.com/api/server/info 404 (Not Found)
GET https://meumu.com/api/rankings/resets 404 (Not Found)
GET https://meumu.com/api/rankings/pk 404 (Not Found)
```

**Causa:** O backend Node.js **NÃO ESTÁ RODANDO!**

---

## 🎯 **SOLUÇÃO RÁPIDA:**

### **Opção 1: Script Automático (Recomendado)**

```bash
chmod +x iniciar-backend.sh
./iniciar-backend.sh
```

O script vai:
- ✅ Verificar Node.js
- ✅ Instalar dependências do backend
- ✅ Perguntar como iniciar (PM2 ou Node)
- ✅ Iniciar backend
- ✅ Testar se está funcionando

---

### **Opção 2: Manual Rápido**

```bash
# 1. Ir para pasta do backend
cd backend-nodejs

# 2. Instalar dependências
npm install

# 3. Iniciar (escolha A ou B)

# A) PM2 (Recomendado - roda em background)
pm2 start src/server.js --name meumu-backend
pm2 save

# B) Node Standalone (simples - mantém terminal aberto)
npm start
```

---

## 🔍 **VERIFICAR SE ESTÁ FUNCIONANDO:**

### **1. Testar endpoint de saúde:**

```bash
curl http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{"status":"ok"}
```

---

### **2. Ver logs do backend:**

**Se usou PM2:**
```bash
pm2 logs meumu-backend
```

**Se usou Node standalone:**
Os logs aparecem no terminal onde você executou `npm start`

---

### **3. Verificar se a porta 3001 está em uso:**

```bash
netstat -tuln | grep 3001
```

**Deve mostrar:**
```
tcp        0      0 0.0.0.0:3001            0.0.0.0:*               LISTEN
```

---

## 🌐 **TESTAR NO NAVEGADOR:**

Depois de iniciar o backend:

1. **Limpe o cache:**
   ```
   Ctrl + Shift + R
   ```

2. **Acesse o site:**
   ```
   http://meumu.com
   ```

3. **Verifique o console (F12):**
   - ❌ **ANTES:** `GET /api/server/info 404`
   - ✅ **AGORA:** Sem erros 404 em /api/*

---

## 🔧 **COMANDOS ÚTEIS:**

### **PM2:**

| Comando | Descrição |
|---------|-----------|
| `pm2 status` | Ver status de todos os processos |
| `pm2 logs meumu-backend` | Ver logs em tempo real |
| `pm2 restart meumu-backend` | Reiniciar backend |
| `pm2 stop meumu-backend` | Parar backend |
| `pm2 delete meumu-backend` | Remover do PM2 |
| `pm2 save` | Salvar lista de processos |
| `pm2 startup` | Iniciar no boot do servidor |

---

### **Node Standalone:**

| Ação | Comando |
|------|---------|
| Iniciar | `npm start` |
| Parar | `Ctrl + C` |
| Ver logs | Aparecem no terminal |

---

## 🐛 **ERROS COMUNS:**

### **Erro 1: "EADDRINUSE: address already in use :::3001"**

**Causa:** Já tem algo rodando na porta 3001

**Solução:**
```bash
# Encontrar o processo
lsof -i :3001

# Matar o processo
kill -9 <PID>

# Ou mudar a porta no .env
nano backend-nodejs/.env
# PORT=3002
```

---

### **Erro 2: "Cannot find module 'express'"**

**Causa:** Dependências não instaladas

**Solução:**
```bash
cd backend-nodejs
rm -rf node_modules package-lock.json
npm install
```

---

### **Erro 3: "Access denied for user"**

**Causa:** Credenciais do MySQL erradas no .env

**Solução:**
```bash
nano backend-nodejs/.env

# Verifique:
DB_MU_HOST=localhost
DB_MU_PORT=3306
DB_MU_USER=root
DB_MU_PASSWORD=sua_senha_aqui
DB_MU_NAME=muonline
```

---

### **Erro 4: Backend inicia mas API retorna erro 500**

**Causa:** Problema de conexão com MySQL

**Solução:**
```bash
# Testar conexão MySQL
mysql -u root -p muonline

# Ver logs do backend
pm2 logs meumu-backend

# Verificar credenciais no .env
cat backend-nodejs/.env
```

---

## 📊 **ARQUITETURA:**

```
┌──────────────┐
│   Frontend   │  → React (porta 80/443 via Apache)
│  (meumu.com) │
└──────┬───────┘
       │
       │ HTTP Requests
       │ /api/*
       ▼
┌──────────────┐
│   Backend    │  → Node.js (porta 3001)
│ (localhost)  │
└──────┬───────┘
       │
       │ SQL Queries
       ▼
┌──────────────┐
│    MySQL     │  → MariaDB (porta 3306)
│ (muonline +  │
│   webmu)     │
└──────────────┘
```

---

## ✅ **CHECKLIST COMPLETO:**

Após executar o script, verifique:

- [ ] Node.js instalado: `node --version`
- [ ] Backend com dependências: `ls backend-nodejs/node_modules`
- [ ] Arquivo .env existe: `cat backend-nodejs/.env`
- [ ] Backend rodando: `pm2 status` ou `ps aux | grep node`
- [ ] Porta 3001 em uso: `netstat -tuln | grep 3001`
- [ ] Endpoint responde: `curl http://localhost:3001/api/health`
- [ ] Site sem erros 404 em /api/*
- [ ] Rankings carregam dados do MySQL

---

## 🎮 **APÓS TUDO FUNCIONAR:**

### **1. Configurar proxy reverso (opcional mas recomendado):**

Em vez de acessar `http://meumu.com:3001/api`, use proxy no Apache:

```apache
# /etc/apache2/sites-available/meumu.conf

<VirtualHost *:80>
    ServerName meumu.com
    DocumentRoot /home/meumu.com/public_html/dist
    
    # Proxy para backend
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    # ... resto da config
</VirtualHost>
```

**Habilitar módulos:**
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

---

### **2. Configurar SSL (HTTPS):**

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d meumu.com -d www.meumu.com
```

---

### **3. Segurança final:**

```bash
# Deletar instalador
rm -rf install/

# Proteger arquivos
chmod 640 config.php
chmod 640 backend-nodejs/.env

# Configurar firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 📞 **AINDA COM PROBLEMAS?**

Execute e me envie a saída:

```bash
echo "=== NODE/NPM ==="
node --version
npm --version

echo "=== BACKEND STATUS ==="
pm2 status

echo "=== PORTA 3001 ==="
netstat -tuln | grep 3001

echo "=== TESTE API ==="
curl http://localhost:3001/api/health

echo "=== LOGS PM2 (últimas 50 linhas) ==="
pm2 logs meumu-backend --lines 50 --nostream
```

---

**MeuMU Online v3.0.0**  
**Guia de Inicialização do Backend**  
**© 2024-2025 MeuMU Team**

**🚀 Execute o script e em 2 minutos está tudo funcionando! 🚀**
