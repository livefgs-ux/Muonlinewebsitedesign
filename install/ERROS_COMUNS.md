# 🛠️ Erros Comuns do Instalador - MeuMU Online

## ❌ **ERRO: "Erro ao revogar banco de mudar dependências npm"**

### **Causa:**
O instalador tentou executar `npm install` automaticamente mas falhou.

### **Solução:**
**NÃO É UM ERRO CRÍTICO!** O instalador foi atualizado para criar apenas os arquivos de configuração. O backend precisa ser iniciado manualmente.

**Passos:**
1. Termine a instalação normalmente
2. Após concluir, execute no terminal:

```bash
cd backend-nodejs
npm install
npm start
```

**OU com PM2:**
```bash
cd backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend
pm2 save
```

---

## ❌ **ERRO: "Tabela accounts não encontrada"**

### **Causa:**
Você selecionou o database errado no Step 3.

### **Solução:**
1. Volte para o Step 3 (clique em "🔄 Reiniciar")
2. Verifique qual é o database correto do seu servidor MU
3. Geralmente é `muonline` ou `MuOnline`
4. Teste a conexão antes de continuar

**Como verificar:**
```sql
SHOW DATABASES;
USE muonline;
SHOW TABLES LIKE 'accounts';
```

---

## ❌ **ERRO: "Sem permissão de escrita"**

### **Causa:**
O servidor web não tem permissão para criar arquivos.

### **Solução Linux/VPS:**
```bash
# Dar permissão total
chmod -R 775 .
chown -R www-data:www-data .

# OU para usuário específico
chown -R seu_usuario:www-data .
```

### **Solução Windows:**
1. Clique direito na pasta do projeto
2. Propriedades → Segurança
3. Adicione permissão "Modificar" para "Usuários"

---

## ❌ **ERRO: "Database webmu não pode ser criado"**

### **Causa:**
O usuário MySQL não tem permissão para criar databases.

### **Solução:**
```sql
-- Conecte como root
mysql -u root -p

-- Dê permissões ao usuário
GRANT ALL PRIVILEGES ON *.* TO 'seu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

**OU crie a database manualmente:**
```sql
CREATE DATABASE webmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## ❌ **ERRO: "Backend não inicia"**

### **Causa:**
Node.js não instalado, porta 3001 ocupada ou dependências faltando.

### **Solução 1 - Verificar Node.js:**
```bash
node --version  # Deve ser 18+
npm --version
```

### **Solução 2 - Instalar dependências:**
```bash
cd backend-nodejs
rm -rf node_modules package-lock.json
npm install
```

### **Solução 3 - Verificar porta:**
```bash
# Linux/Mac
lsof -i :3001

# Windows
netstat -ano | findstr :3001

# Matar processo se necessário
kill -9 PID
```

### **Solução 4 - Verificar .env:**
```bash
cd backend-nodejs
cat .env  # Deve existir e ter as configurações corretas
```

---

## ❌ **ERRO: "Instalação já concluída"**

### **Causa:**
O instalador detectou que o arquivo `.env` já existe.

### **Solução:**
Se você quer reinstalar:
```
http://seudominio.com/install?force=1
```

**ATENÇÃO:** Isso vai **sobrescrever** os arquivos existentes!

---

## ❌ **ERRO: "PDO Connection failed"**

### **Causa:**
Dados de conexão incorretos ou MySQL não está rodando.

### **Solução 1 - Verificar MySQL:**
```bash
# Linux
systemctl status mysql
systemctl start mysql

# Windows
Serviços → MySQL → Iniciar
```

### **Solução 2 - Testar conexão:**
```bash
mysql -h localhost -P 3306 -u root -p
```

### **Solução 3 - Verificar bind-address:**
```bash
# Editar my.cnf ou my.ini
bind-address = 0.0.0.0
```

---

## ⚠️ **AVISO: "Requisitos não atendidos"**

### **PHP < 8.1:**
```bash
# Ubuntu/Debian
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.1

# CentOS/Rocky
sudo dnf install php81
```

### **Extensões faltando:**
```bash
# Ubuntu/Debian
sudo apt install php8.1-mysql php8.1-curl php8.1-gd php8.1-xml php8.1-mbstring

# CentOS/Rocky
sudo dnf install php81-php-mysqlnd php81-php-curl php81-php-gd php81-php-xml
```

---

## 🔍 **LOGS ÚTEIS:**

### **Backend Node.js:**
```bash
# PM2
pm2 logs meumu-backend

# Standalone
cd backend-nodejs
npm start  # Ver logs no terminal
```

### **PHP:**
```bash
# Linux
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# Windows
C:\xampp\apache\logs\error.log
```

### **MySQL:**
```bash
# Linux
tail -f /var/log/mysql/error.log

# Windows
C:\xampp\mysql\data\*.err
```

---

## 💡 **DICAS:**

### **1. Testar conexão MySQL:**
```php
<?php
$dsn = "mysql:host=localhost;port=3306;dbname=muonline";
$pdo = new PDO($dsn, 'root', 'senha');
echo "Conexão OK!";
?>
```

### **2. Verificar portas:**
```bash
# MySQL
netstat -tulpn | grep 3306

# Backend
netstat -tulpn | grep 3001
```

### **3. Limpar cache do instalador:**
```php
<?php
session_start();
$_SESSION = array();
session_destroy();
echo "Sessão limpa!";
?>
```

---

## 📞 **SUPORTE:**

Se nenhuma dessas soluções funcionou:

1. **Capture os logs:**
   - Screenshot do erro
   - Console do navegador (F12)
   - Logs do PHP
   - Logs do MySQL

2. **Informações do sistema:**
   - PHP version: `php -v`
   - Node version: `node -v`
   - MySQL version: `mysql --version`
   - Sistema operacional

3. **Envie para análise:**
   - Discord da comunidade
   - GitHub Issues
   - Email de suporte

---

## ✅ **CHECKLIST DE INSTALAÇÃO:**

- [ ] PHP 8.1+ instalado
- [ ] Node.js 18+ instalado
- [ ] MySQL/MariaDB rodando
- [ ] Database MU existe e tem tabela `accounts`
- [ ] Permissões de escrita OK
- [ ] Porta 3001 disponível
- [ ] Firewall liberado (se necessário)
- [ ] DNS/Host configurado corretamente

---

**MeuMU Online v2.0.0**  
Season 19-2-3 Épico  
© 2024-2025 MeuMU Team
