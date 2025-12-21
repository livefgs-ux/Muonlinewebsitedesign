# 🔧 TROUBLESHOOTING - MeuMU Online

Guia de solução de problemas comuns.

---

## 🗄️ PROBLEMAS COM BANCO DE DADOS

### Erro: Access denied for user 'root'@'localhost'

**Causa:** Senha incorreta ou usuário sem permissões.

**Solução:**
```bash
# Resetar senha do root
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha';
FLUSH PRIVILEGES;
exit;

# Testar
mysql -u root -p
```

---

### Erro: Unknown database 'webmu'

**Causa:** Banco webmu não foi criado.

**Solução:**
```bash
mysql -u root -p << EOF
CREATE DATABASE webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# Importar tabelas
cd backend-nodejs/database
for f in *.sql; do mysql -u root -p webmu < $f; done
```

---

### Erro: Table doesn't exist

**Causa:** Tabelas não foram importadas.

**Solução:**
```bash
cd backend-nodejs/database
mysql -u root -p webmu < 01_create_news.sql
mysql -u root -p webmu < 02_create_events.sql
# ... e assim por diante
```

---

## ⚙️ PROBLEMAS COM NODE.JS / PM2

### Erro: Port 3001 already in use

**Causa:** Outra aplicação usando a porta 3001.

**Solução:**
```bash
# Ver processo
lsof -i :3001

# Matar processo
kill -9 <PID>

# OU usar porta diferente
# Edite backend-nodejs/.env:
PORT=3002
```

---

### PM2: Application not found

**Causa:** Aplicação não foi iniciada ou foi deletada.

**Solução:**
```bash
# Listar processos
pm2 list

# Iniciar novamente
cd /var/www/meumuonline
pm2 start backend-nodejs/src/server.js --name meumuonline-api

# Salvar
pm2 save
```

---

### Erro: Cannot find module 'express'

**Causa:** Dependências não instaladas.

**Solução:**
```bash
cd backend-nodejs
rm -rf node_modules package-lock.json
npm install
```

---

## 🌐 PROBLEMAS COM NGINX

### Erro: 502 Bad Gateway

**Causa:** Backend não está rodando ou Nginx não consegue conectar.

**Solução:**
```bash
# Verificar se backend está rodando
pm2 status

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar se porta 3001 está aberta
netstat -tulpn | grep 3001

# Reiniciar serviços
pm2 restart meumuonline-api
sudo systemctl restart nginx
```

---

### Erro: 404 Not Found em /api

**Causa:** Proxy reverso não configurado corretamente.

**Solução:**
```bash
# Verificar configuração
sudo nano /etc/nginx/sites-available/meumuonline

# Deve conter:
location /api {
    proxy_pass http://localhost:3001;
    ...
}

# Testar e reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

---

### Site não carrega CSS/JS

**Causa:** Path incorreto ou permissões.

**Solução:**
```bash
# Verificar se build existe
ls -la /var/www/meumuonline/dist

# Build novamente
cd /var/www/meumuonline
npm run build

# Permissões
sudo chown -R www-data:www-data /var/www/meumuonline/dist
sudo chmod -R 755 /var/www/meumuonline/dist
```

---

## 🔒 PROBLEMAS COM SSL

### Certbot: Could not resolve domain

**Causa:** DNS não está apontando para o servidor.

**Solução:**
```bash
# Verificar DNS
nslookup seudominio.com

# Aguarde propagação DNS (até 48h)
# Tente novamente depois
```

---

### SSL certificate has expired

**Causa:** Certificado expirou (90 dias).

**Solução:**
```bash
# Renovar manualmente
sudo certbot renew

# Verificar renovação automática
sudo certbot renew --dry-run

# Verificar cron
sudo systemctl status certbot.timer
```

---

## 🔥 PROBLEMAS DE PERFORMANCE

### Site muito lento

**Causa:** Banco de dados não otimizado ou servidor sobrecarregado.

**Solução:**
```bash
# Verificar uso de recursos
htop

# Otimizar MySQL
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
# Adicionar:
innodb_buffer_pool_size = 1G
query_cache_size = 64M

sudo systemctl restart mariadb

# Habilitar cache no backend
# Já implementado automaticamente
```

---

### API demorando muito

**Causa:** Queries lentas ou sem índices.

**Solução:**
```bash
# Habilitar slow query log
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf

slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Verificar logs
sudo tail -f /var/log/mysql/slow.log

# Adicionar índices nas tabelas problemáticas
```

---

## 🚨 PROBLEMAS DE SEGURANÇA

### Rate limit sendo atingido constantemente

**Causa:** Muitas requisições legítimas ou ataque.

**Solução:**
```bash
# Aumentar limite
# Edite backend-nodejs/.env:
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_WINDOW_MS=900000

# Reiniciar
pm2 restart meumuonline-api

# Verificar IPs suspeitos nos logs
sudo tail -f backend-nodejs/logs/security.log
```

---

### Tentativas de SQL Injection

**Causa:** Ataque em andamento.

**Solução:**
```bash
# Verificar logs
sudo tail -f backend-nodejs/logs/security.log

# Bloquear IPs com Fail2Ban
sudo fail2ban-client status
sudo fail2ban-client set nginx-http-auth banip <IP>

# Executar Security Sandbox
# Acessar: /admin/security/sandbox
```

---

## 📊 PROBLEMAS COM LOGS

### Logs não estão sendo criados

**Causa:** Permissões ou diretório não existe.

**Solução:**
```bash
# Criar diretório
cd backend-nodejs
mkdir -p logs security/sandbox

# Permissões
chmod 755 logs security
chown -R $USER:$USER logs security

# Verificar se está gravando
tail -f logs/admin-actions.log
```

---

### Disco cheio por causa de logs

**Causa:** Logs não estão sendo rotacionados.

**Solução:**
```bash
# Configurar logrotate
sudo nano /etc/logrotate.d/meumuonline

/var/www/meumuonline/backend-nodejs/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 www-data www-data
}

# Testar
sudo logrotate -f /etc/logrotate.d/meumuonline
```

---

## 🎮 PROBLEMAS ESPECÍFICOS DO MU

### Rankings não atualizam

**Causa:** Cache ou problema de conexão com banco MuOnline.

**Solução:**
```bash
# Verificar conexão
mysql -h localhost -u root -p MuOnline -e "SELECT COUNT(*) FROM Character;"

# Limpar cache manualmente
rm backend-nodejs/cache/*.json

# Reiniciar backend
pm2 restart meumuonline-api
```

---

### WCoin não atualiza no jogo

**Causa:** Servidor de jogo não lê tabela atualizada.

**Solução:**
1. Verificar se a tabela MEMB_INFO está sendo atualizada:
```sql
SELECT memb___id, WCoinC, WCoinP FROM MEMB_INFO WHERE memb___id = 'conta';
```

2. Reiniciar servidor de jogo para recarregar

3. Verificar se o sistema usa tabela diferente (alguns servidores customizam)

---

### Personagens não aparecem

**Causa:** Nome da tabela ou colunas diferentes.

**Solução:**
```sql
-- Verificar estrutura
SHOW TABLES;
DESCRIBE Character;

-- Ajustar queries no backend se necessário
```

---

## 🔄 COMANDOS ÚTEIS PARA DEBUG

```bash
# Ver logs do backend
pm2 logs meumuonline-api --lines 100

# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Ver logs do MySQL
sudo tail -f /var/log/mysql/error.log

# Status de todos serviços
sudo systemctl status nginx
sudo systemctl status mariadb
pm2 status

# Testar conectividade
curl http://localhost:3001/health
curl http://localhost:3001/api/server/status

# Verificar portas abertas
sudo netstat -tulpn | grep LISTEN

# Uso de recursos
htop
df -h  # Disco
free -h  # RAM
```

---

## 📞 AINDA COM PROBLEMAS?

1. **Consulte documentação completa:** `INSTALLATION_GUIDE.md`
2. **Verifique issues no GitHub:** https://github.com/seu-repo/issues
3. **Discord:** https://discord.gg/meumuonline
4. **Email:** suporte@meumuonline.com

---

**Última atualização:** 21/12/2024
