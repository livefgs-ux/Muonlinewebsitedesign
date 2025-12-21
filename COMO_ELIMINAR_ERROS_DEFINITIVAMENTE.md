# 🛠️ COMO ELIMINAR OS ERROS DEFINITIVAMENTE

**Data**: 21/12/2024  
**Status**: ⚠️ AÇÃO NECESSÁRIA NA VPS

---

## ⚠️ **SITUAÇÃO ATUAL**

Você está vendo estes erros:

```
❌ [GET /rankings/pk]: Error ECONNREFUSED
❌ [GET /rankings/guilds]: Error ECONNREFUSED
❌ [GET /rankings/resets]: Error ECONNREFUSED
```

---

## 🔍 **POR QUE ESSES ERROS APARECEM?**

### **Explicação Simples:**

Imagine que você tem:
- 🏠 **Uma casa** (VPS Linux)
- 🚪 **Uma porta** (Backend Node.js - porta 3001)
- 👤 **Um visitante** (Frontend tentando acessar)

**O problema:**
- ❌ A **porta está FECHADA** (backend não está rodando)
- ❌ O **visitante bate na porta** (frontend tenta chamar a API)
- ❌ **Ninguém atende** (ECONNREFUSED)

---

## ✅ **SOLUÇÃO: ABRIR A PORTA (INICIAR O BACKEND)**

### **📋 CHECKLIST COMPLETO:**

#### **☑️ Etapa 1: Verificar se tudo está pronto**

No seu computador (onde está rodando o Figma Make):

```bash
# Verificar se o backend Node.js foi criado
ls -la backend-nodejs/

# Deve mostrar:
# ✅ src/
# ✅ package.json
# ✅ ecosystem.config.js
# ✅ .env.example
```

#### **☑️ Etapa 2: Fazer upload para a VPS**

Use **FileZilla**, **WinSCP**, ou **SCP**:

```bash
# Via SCP (Linux/Mac)
scp -r backend-nodejs/ usuario@IP_VPS:/var/www/meumu-backend/

# Via FileZilla (Windows)
# 1. Conectar na VPS
# 2. Arrastar pasta backend-nodejs/ para /var/www/
# 3. Renomear para meumu-backend
```

#### **☑️ Etapa 3: Conectar via SSH na VPS**

```bash
ssh usuario@IP_VPS
```

#### **☑️ Etapa 4: Instalar Node.js (se não tiver)**

```bash
# Verificar se já tem Node.js
node --version
npm --version

# Se não tiver, instalar:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2
```

#### **☑️ Etapa 5: Configurar o backend**

```bash
cd /var/www/meumu-backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env
nano .env
```

**Preencher o .env:**

```env
# PORTA DO SERVIDOR
PORT=3001

# BANCO DE DADOS MARIADB
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_MARIADB_AQUI
DB_NAME=MuOnline

# JWT SECRET (gerar novo com: openssl rand -base64 64)
JWT_SECRET=COLAR_RESULTADO_AQUI

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://seusite.com

# AMBIENTE
NODE_ENV=production
```

**Gerar JWT Secret:**

```bash
openssl rand -base64 64
# Copiar o resultado e colar no .env
```

**Salvar e sair do nano:**
- Pressione `CTRL + X`
- Pressione `Y`
- Pressione `ENTER`

#### **☑️ Etapa 6: Criar tabela de notícias**

```bash
mysql -u root -p
```

Digite a senha do MariaDB, depois:

```sql
USE MuOnline;

CREATE TABLE IF NOT EXISTS website_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('update', 'event', 'maintenance', 'announcement') DEFAULT 'announcement',
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  author VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  views INT DEFAULT 0,
  published BOOLEAN DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SHOW TABLES LIKE 'website_news';
-- Deve mostrar a tabela criada

EXIT;
```

#### **☑️ Etapa 7: INICIAR O BACKEND**

```bash
cd /var/www/meumu-backend

# Iniciar com PM2
pm2 start ecosystem.config.js

# Verificar status
pm2 status

# Deve mostrar:
# ┌─────┬─────────────┬─────────┬─────────┐
# │ id  │ name        │ status  │ restart │
# ├─────┼─────────────┼─────────┼─────────┤
# │ 0   │ meumu-api   │ online  │ 0       │
# └─────┴─────────────┴─────────┴─────────┘

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
# Copiar e executar o comando que aparecer
```

#### **☑️ Etapa 8: TESTAR SE FUNCIONOU**

```bash
# Teste 1: Health check
curl http://localhost:3001/health

# Resposta esperada:
# {"status":"ok","timestamp":"2024-12-21T..."}

# Teste 2: Rankings
curl http://localhost:3001/api/rankings/resets?limit=3

# Resposta esperada:
# {"success":true,"data":[...]}

# Teste 3: Ver logs
pm2 logs meumu-api

# Deve mostrar:
# ✅ Servidor rodando na porta 3001
# ✅ Conexão com banco de dados estabelecida
```

---

## 🎯 **RESULTADO ESPERADO**

### **ANTES (com erros):**

```
Frontend → http://localhost:3001/api/rankings/resets
           ↓
           ❌ ECONNREFUSED (porta fechada)
```

### **DEPOIS (sem erros):**

```
Frontend → http://localhost:3001/api/rankings/resets
           ↓
           ✅ Backend Node.js
           ↓
           ✅ MariaDB
           ↓
           ✅ Dados retornados
```

---

## 📊 **COMO VERIFICAR SE OS ERROS SUMIRAM**

### **1. Ver logs do PM2:**

```bash
pm2 logs meumu-api --lines 50
```

**Deve mostrar:**
```
✅ [GET /api/rankings/resets] 200 - 45ms
✅ [GET /api/rankings/pk] 200 - 38ms
✅ [GET /api/rankings/guilds] 200 - 42ms
```

### **2. Acessar o site:**

Abra o navegador e acesse:
```
https://seusite.com
```

**Vá para a seção Rankings:**
- ✅ Deve carregar dados reais
- ✅ Não deve mostrar erros
- ✅ Deve aparecer os Top 10

---

## 🆘 **TROUBLESHOOTING**

### **❌ Erro: "Cannot find module"**

```bash
cd /var/www/meumu-backend
npm install
pm2 restart meumu-api
```

### **❌ Erro: "EADDRINUSE: address already in use"**

Porta 3001 já está sendo usada:

```bash
# Ver o que está usando a porta
sudo lsof -i :3001

# Matar o processo
sudo kill -9 PID_DO_PROCESSO

# Ou usar outra porta no .env
nano .env
# Mudar PORT=3001 para PORT=3002
pm2 restart meumu-api
```

### **❌ Erro: "Access denied for user 'root'@'localhost'"**

Senha do MariaDB incorreta no .env:

```bash
nano .env
# Corrigir DB_PASSWORD
pm2 restart meumu-api
```

### **❌ Erro: "Unknown database 'MuOnline'"**

Banco não existe:

```bash
mysql -u root -p -e "SHOW DATABASES;"
# Verificar o nome exato do banco

nano .env
# Corrigir DB_NAME
pm2 restart meumu-api
```

### **❌ Erro: "Table 'MuOnline.website_news' doesn't exist"**

Criar a tabela:

```bash
mysql -u root -p < /var/www/meumu-backend/database/schema.sql
# Ou executar manualmente o CREATE TABLE acima
```

---

## 📱 **COMANDOS ÚTEIS PM2**

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs meumu-api

# Reiniciar
pm2 restart meumu-api

# Parar
pm2 stop meumu-api

# Iniciar
pm2 start meumu-api

# Remover
pm2 delete meumu-api

# Monitorar recursos
pm2 monit
```

---

## 🔒 **SEGURANÇA ADICIONAL (OPCIONAL)**

### **1. Configurar Firewall:**

```bash
# Permitir apenas localhost acessar porta 3001
sudo ufw allow from 127.0.0.1 to any port 3001

# Se usar Nginx como proxy reverso
sudo ufw allow 'Nginx Full'
```

### **2. Configurar Nginx como Proxy Reverso:**

```bash
sudo nano /etc/nginx/sites-available/default
```

Adicionar:

```nginx
location /api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ **CONCLUSÃO**

### **Resumo:**

1. ✅ **Backend criado** - Código completo em `/backend-nodejs/`
2. ⚠️ **Aguardando upload** - Copiar para VPS
3. ⚠️ **Aguardando instalação** - `npm install`
4. ⚠️ **Aguardando configuração** - Criar `.env`
5. ⚠️ **Aguardando inicialização** - `pm2 start`

### **Quando você completar todos os passos:**

- ✅ Erros ECONNREFUSED **DESAPARECEM**
- ✅ Rankings mostram **DADOS REAIS**
- ✅ Login/Auth **FUNCIONA**
- ✅ Área do jogador **FUNCIONA**
- ✅ AdminCP **FUNCIONA**

---

## 📚 **DOCUMENTAÇÃO COMPLETA**

Leia também:

1. 📄 `/MIGRACAO_SUPABASE_PARA_NODEJS.md` - Detalhes da migração
2. 📄 `/backend-nodejs/README.md` - Documentação do backend
3. 📄 `/backend-nodejs/INSTALL_QUICKSTART.md` - Guia rápido
4. 📄 `/BACKEND_NAO_DISPONIVEL.md` - Explicação dos erros
5. 📄 `/supabase/SUPABASE_DESATIVADO.md` - Por que removemos Supabase

---

**🎮 Siga todos os passos acima e os erros desaparecerão completamente!**

**⏱️ Tempo estimado: 15-30 minutos**

**🔧 Dificuldade: Intermediária**

**💰 Custo: R$ 0,00 (grátis)**
