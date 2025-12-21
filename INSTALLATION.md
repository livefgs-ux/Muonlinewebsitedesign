# 📘 GUIA COMPLETO DE INSTALAÇÃO - MeuMU Online CMS

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Servidor:** Season 19-2-3 Épico  

---

## 📋 ÍNDICE

1. [Requisitos do Sistema](#requisitos)
2. [Preparação do Ambiente](#preparacao)
3. [Instalação Passo a Passo](#instalacao)
4. [Configuração do Backend](#backend)
5. [Configuração do Frontend](#frontend)
6. [Instalador Visual](#instalador)
7. [Configurações Avançadas](#avancado)
8. [Troubleshooting](#troubleshooting)
9. [Segurança](#seguranca)
10. [Backup e Recuperação](#backup)

---

## 🖥️ REQUISITOS DO SISTEMA <a name="requisitos"></a>

### Servidor / VPS

- **Sistema Operacional:** Linux (Ubuntu 20.04+ recomendado) ou Windows Server 2019+
- **RAM:** Mínimo 2GB, Recomendado 4GB+
- **Disco:** Mínimo 10GB livres
- **Processador:** 2 cores ou mais
- **Rede:** IP fixo, porta 80/443 abertas

### Software Necessário

#### Obrigatórios:
- **Node.js:** 18.x ou superior
- **MySQL/MariaDB:** 5.7+ / 10.3+
- **npm ou yarn:** Gerenciador de pacotes

#### Opcionais (Recomendados):
- **PM2:** Gerenciador de processos Node.js
- **Nginx:** Proxy reverso e servidor web
- **Certbot:** Certificados SSL gratuitos (Let's Encrypt)
- **Git:** Controle de versão

### Banco de Dados Mu Online

- Banco **MuOnline** já existente e funcionando
- Tabelas principais: `MEMB_INFO`, `Character`, `Guild`, etc.
- Usuário MySQL com permissões: SELECT, INSERT, UPDATE, DELETE, CREATE

---

## 🛠️ PREPARAÇÃO DO AMBIENTE <a name="preparacao"></a>

### 1. Atualizar Sistema (Linux)

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Node.js

```bash
# Usar NodeSource para versão mais recente
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version  # Deve mostrar v18.x.x ou superior
npm --version
```

### 3. Instalar MySQL/MariaDB

```bash
# MariaDB (recomendado)
sudo apt install -y mariadb-server mariadb-client

# Iniciar serviço
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Configuração segura
sudo mysql_secure_installation
```

### 4. Instalar PM2 (Gerenciador de Processos)

```bash
sudo npm install -g pm2

# Configurar PM2 para iniciar no boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### 5. Instalar Nginx (Opcional, mas recomendado)

```bash
sudo apt install -y nginx

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📦 INSTALAÇÃO PASSO A PASSO <a name="instalacao"></a>

### PASSO 1: Download dos Arquivos

```bash
# Criar diretório do projeto
cd /var/www
sudo mkdir meumuonline
sudo chown -R $USER:$USER meumuonline
cd meumuonline

# Se usando Git
git clone https://github.com/seu-repo/meumuonline.git .

# OU fazer upload manual via FTP/SCP
```

### PASSO 2: Instalar Dependências

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend-nodejs
npm install
cd ..
```

### PASSO 3: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp backend-nodejs/.env.example backend-nodejs/.env

# Editar configurações
nano backend-nodejs/.env
```

**Conteúdo do `.env`:**

```env
# ===================================
# CONFIGURAÇÕES DO BANCO DE DADOS
# ===================================
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME_MUONLINE=MuOnline
DB_NAME_WEBMU=webmu

# ===================================
# CONFIGURAÇÕES DO SERVIDOR
# ===================================
NODE_ENV=production
PORT=3001

# ===================================
# SEGURANÇA
# ===================================
JWT_SECRET=gere_uma_chave_secreta_forte_aqui
ENCRYPTION_KEY=outra_chave_secreta_diferente

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===================================
# CORS
# ===================================
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com

# ===================================
# UPLOAD
# ===================================
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/meumuonline/uploads
```

### PASSO 4: Criar Banco de Dados WebMU

```bash
# Conectar ao MySQL
mysql -u root -p

# Executar comandos SQL
CREATE DATABASE IF NOT EXISTS webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE webmu;

# Importar estrutura (executar cada arquivo SQL da pasta database/)
SOURCE /var/www/meumuonline/backend-nodejs/database/01_create_news.sql;
SOURCE /var/www/meumuonline/backend-nodejs/database/02_create_events.sql;
SOURCE /var/www/meumuonline/backend-nodejs/database/03_create_wcoin_history.sql;
SOURCE /var/www/meumuonline/backend-nodejs/database/04_create_character_stats_history.sql;
SOURCE /var/www/meumuonline/backend-nodejs/database/05_create_admin_access.sql;
SOURCE /var/www/meumuonline/backend-nodejs/database/06_create_admin_logs.sql;

# Sair
exit;
```

### PASSO 5: Build do Frontend

```bash
# Build de produção
npm run build

# Arquivos compilados estarão em /dist
```

### PASSO 6: Iniciar Backend

```bash
# Teste manual primeiro
cd backend-nodejs
npm start

# Se tudo funcionar, usar PM2
pm2 start src/server.js --name meumuonline-api
pm2 save
```

### PASSO 7: Configurar Nginx (Proxy Reverso)

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/meumuonline
```

**Conteúdo do arquivo:**

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Frontend (arquivos estáticos)
    root /var/www/meumuonline/dist;
    index index.html;

    # Configuração para SPA (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API (proxy para Node.js)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload de arquivos
    location /uploads {
        alias /var/www/meumuonline/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Ativar site:**

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/meumuonline /etc/nginx/sites-enabled/

# Remover site padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### PASSO 8: Configurar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL gratuito
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática (já configurado por padrão)
sudo certbot renew --dry-run
```

---

## 🎨 INSTALADOR VISUAL <a name="instalador"></a>

Após configurar o servidor, acesse:

```
https://seudominio.com/install
```

### Etapa 1: Banco de Dados

1. Preencha as informações de conexão MySQL
2. Clique em **"Testar Conexão"**
3. Aguarde confirmação de sucesso ✅
4. Clique em **"Próxima Etapa"**

### Etapa 2: Conta Admin

1. Defina seu usuário administrativo
2. Digite um email válido
3. Crie uma senha forte (mínimo 6 caracteres)
4. Confirme a senha
5. Clique em **"Próxima Etapa"**

### Etapa 3: Confirmação

1. Revise todas as configurações
2. Clique em **"Instalar Agora"**
3. Aguarde a conclusão (1-2 minutos)
4. ✅ **Instalação Concluída!**

### Acesso ao Sistema

- **Site Principal:** https://seudominio.com
- **Painel Admin:** https://seudominio.com/admin
- **API Health Check:** https://seudominio.com/api/health

---

## ⚙️ CONFIGURAÇÕES AVANÇADAS <a name="avancado"></a>

### 1. Configurar Logs Rotacionais

```bash
# Instalar logrotate (geralmente já vem instalado)
sudo apt install logrotate

# Criar configuração
sudo nano /etc/logrotate.d/meumuonline
```

**Conteúdo:**

```
/var/www/meumuonline/backend-nodejs/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reload meumuonline-api > /dev/null
    endscript
}
```

### 2. Configurar Firewall (UFW)

```bash
# Instalar UFW
sudo apt install -y ufw

# Permitir SSH (IMPORTANTE!)
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

### 3. Monitoramento com PM2

```bash
# Ver logs em tempo real
pm2 logs meumuonline-api

# Monitorar recursos
pm2 monit

# Listar processos
pm2 list

# Reiniciar aplicação
pm2 restart meumuonline-api

# Parar aplicação
pm2 stop meumuonline-api
```

### 4. Otimização de Performance

**MySQL/MariaDB:**

```bash
# Editar configuração
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Adicionar/modificar:

```ini
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
query_cache_type = 1
query_cache_size = 64M
```

Reiniciar:

```bash
sudo systemctl restart mariadb
```

---

## 🔍 TROUBLESHOOTING <a name="troubleshooting"></a>

### Problema: Erro ao conectar no banco de dados

**Solução:**

```bash
# Verificar se MySQL está rodando
sudo systemctl status mariadb

# Ver logs do MySQL
sudo tail -f /var/log/mysql/error.log

# Testar conexão manual
mysql -h localhost -u root -p
```

### Problema: API não responde

**Solução:**

```bash
# Ver logs do PM2
pm2 logs meumuonline-api --lines 100

# Verificar se porta 3001 está aberta
sudo netstat -tulpn | grep 3001

# Reiniciar aplicação
pm2 restart meumuonline-api
```

### Problema: Site não carrega (404)

**Solução:**

```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar permissões
ls -la /var/www/meumuonline/dist
```

### Problema: SSL não funciona

**Solução:**

```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar configuração SSL
sudo certbot certificates

# Testar renovação automática
sudo certbot renew --dry-run
```

---

## 🔒 SEGURANÇA <a name="seguranca"></a>

### Checklist de Segurança

- [ ] Alterar senha padrão do root do MySQL
- [ ] Criar usuário MySQL específico (não usar root)
- [ ] Configurar firewall (UFW/iptables)
- [ ] Habilitar SSL/HTTPS obrigatório
- [ ] Configurar rate limiting no Nginx
- [ ] Desabilitar listagem de diretórios
- [ ] Manter sistema atualizado
- [ ] Fazer backups regulares
- [ ] Usar senhas fortes (16+ caracteres)
- [ ] Habilitar logs de segurança

### Hardening do MySQL

```sql
-- Remover usuários anônimos
DELETE FROM mysql.user WHERE User='';

-- Desabilitar login root remoto
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Aplicar mudanças
FLUSH PRIVILEGES;
```

### Configurar Fail2Ban (Proteção contra Brute Force)

```bash
# Instalar
sudo apt install -y fail2ban

# Copiar configuração
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar
sudo nano /etc/fail2ban/jail.local
```

Adicionar:

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
```

Reiniciar:

```bash
sudo systemctl restart fail2ban
```

---

## 💾 BACKUP E RECUPERAÇÃO <a name="backup"></a>

### Script de Backup Automático

```bash
# Criar script
sudo nano /usr/local/bin/backup-meumuonline.sh
```

**Conteúdo:**

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/var/backups/meumuonline"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=7

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup do banco webmu
mysqldump -u root -p"$DB_PASSWORD" webmu | gzip > $BACKUP_DIR/webmu_$DATE.sql.gz

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/meumuonline

# Remover backups antigos
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup concluído: $DATE"
```

**Tornar executável:**

```bash
sudo chmod +x /usr/local/bin/backup-meumuonline.sh
```

**Agendar com Cron (diário às 3h):**

```bash
sudo crontab -e
```

Adicionar:

```
0 3 * * * /usr/local/bin/backup-meumuonline.sh >> /var/log/backup-meumuonline.log 2>&1
```

### Restaurar Backup

```bash
# Restaurar banco de dados
gunzip < /var/backups/meumuonline/webmu_2024-12-21_03-00-00.sql.gz | mysql -u root -p webmu

# Restaurar arquivos
tar -xzf /var/backups/meumuonline/files_2024-12-21_03-00-00.tar.gz -C /
```

---

## 📞 SUPORTE E DOCUMENTAÇÃO ADICIONAL

- **Documentação API:** https://seudominio.com/api/docs
- **GitHub Issues:** https://github.com/seu-repo/meumuonline/issues
- **Discord:** https://discord.gg/seu-servidor

---

## ✅ CONCLUSÃO

Parabéns! Seu servidor MeuMU Online está instalado e configurado. 🎉

**Próximos Passos:**

1. Acessar o painel admin e configurar eventos
2. Adicionar notícias no site
3. Configurar pacotes de WCoin
4. Testar sistema de registro e login
5. Fazer backup inicial

**Manutenção Recomendada:**

- Atualizar sistema semanalmente
- Verificar logs diariamente
- Fazer backup antes de qualquer atualização
- Monitorar uso de recursos (RAM, CPU, Disco)

---

**Desenvolvido com ❤️ para a comunidade Mu Online**

**Versão:** 1.0.0 | **Data:** Dezembro 2024
