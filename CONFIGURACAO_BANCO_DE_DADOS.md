# 🔧 Guia de Configuração do Banco de Dados - MeuMU Online Backend

**Data:** 21 de Dezembro de 2024  
**Problema:** Backend não consegue conectar ao MariaDB

---

## 📋 Checklist de Diagnóstico Rápido

Execute estes comandos no servidor para diagnosticar:

```bash
# 1. Verificar se MariaDB está rodando
systemctl status mariadb
# ou
systemctl status mysql

# 2. Verificar se a porta 3306 está aberta
netstat -tuln | grep 3306
# ou
ss -tuln | grep 3306

# 3. Testar conexão manual
mysql -u root -p -h 127.0.0.1
# Digite a senha quando solicitado

# 4. Verificar se arquivo .env existe
ls -la /home/meumu.com/public_html/backend-nodejs/.env

# 5. Verificar permissões do arquivo .env
cat /home/meumu.com/public_html/backend-nodejs/.env
```

---

## 🚀 Passo a Passo de Configuração

### **PASSO 1: Criar o Arquivo .env**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Copiar o exemplo
cp .env.example .env

# Editar o arquivo
nano .env
# ou
vim .env
```

### **PASSO 2: Configurar Credenciais do Banco**

Edite o arquivo `.env` com suas credenciais reais:

```env
# ================================================
# BANCO DE DADOS
# ================================================
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=muonline

# ================================================
# SEGURANÇA JWT
# ================================================
JWT_SECRET=GERE_UMA_CHAVE_SECRETA_FORTE_AQUI
JWT_EXPIRES_IN=7d

# ================================================
# SERVIDOR
# ================================================
PORT=3001
NODE_ENV=production

# ================================================
# CORS
# ================================================
CORS_ORIGIN=https://meumu.com,https://www.meumu.com
```

### **PASSO 3: Gerar Chave JWT Secreta**

```bash
# Gerar uma chave aleatória forte
openssl rand -base64 64

# Copie o resultado e cole no JWT_SECRET no arquivo .env
```

### **PASSO 4: Verificar Serviço MariaDB**

```bash
# Verificar status
systemctl status mariadb

# Se não estiver rodando, iniciar
systemctl start mariadb

# Habilitar para iniciar com o sistema
systemctl enable mariadb

# Reiniciar se necessário
systemctl restart mariadb
```

### **PASSO 5: Verificar Credenciais do Banco**

```bash
# Tentar conectar manualmente
mysql -u root -p -h 127.0.0.1

# Se conectou com sucesso, verificar databases
SHOW DATABASES;

# Verificar se database MuOnline existe
USE MuOnline;

# Verificar tabelas
SHOW TABLES;

# Sair
EXIT;
```

### **PASSO 6: Testar Backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Iniciar servidor
npm start

# Você deve ver:
# ✅ Conectado ao MariaDB com sucesso!
# 📊 Database: MuOnline
# 🚀 Servidor rodando na porta 3001
```

---

## 🔍 Problemas Comuns e Soluções

### **Problema 1: ECONNREFUSED ::1:3306**

**Causa:** Node.js está tentando conectar via IPv6 ao invés de IPv4

**Solução:**
```javascript
// ✅ JÁ CORRIGIDO no database.js
const pool = mysql.createPool({
  host: '127.0.0.1',  // IPv4 explícito
  family: 4,          // Forçar IPv4
  // ...
});
```

**No .env:**
```env
# ✅ Use 127.0.0.1 ao invés de localhost
DB_HOST=127.0.0.1

# ❌ NÃO use localhost (pode resolver para ::1 no IPv6)
DB_HOST=localhost
```

---

### **Problema 2: Access Denied for User**

**Erro:**
```
ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

**Solução:**

```bash
# 1. Entrar no MariaDB como root
sudo mysql -u root

# 2. Verificar usuários
SELECT User, Host FROM mysql.user;

# 3. Criar/Atualizar usuário root para 127.0.0.1
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;

# 4. Ou atualizar senha do root existente
ALTER USER 'root'@'localhost' IDENTIFIED BY 'sua_senha';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY 'sua_senha';

# 5. Aplicar mudanças
FLUSH PRIVILEGES;

# 6. Sair
EXIT;

# 7. Testar conexão
mysql -u root -p -h 127.0.0.1
```

---

### **Problema 3: Database Não Existe**

**Erro:**
```
ER_BAD_DB_ERROR: Unknown database 'MuOnline'
```

**Solução:**

```bash
# 1. Entrar no MariaDB
mysql -u root -p -h 127.0.0.1

# 2. Criar database
CREATE DATABASE IF NOT EXISTS MuOnline 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

# 3. Verificar
SHOW DATABASES;

# 4. Usar o database
USE MuOnline;

# 5. Importar schema se necessário
SOURCE /caminho/para/schema.sql;

# 6. Sair
EXIT;
```

**Ou via linha de comando:**

```bash
# Criar database
mysql -u root -p -h 127.0.0.1 -e "CREATE DATABASE IF NOT EXISTS MuOnline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importar schema
mysql -u root -p -h 127.0.0.1 MuOnline < /home/meumu.com/public_html/backend-nodejs/database/schema.sql
```

---

### **Problema 4: MariaDB Não Aceita Conexões de Rede**

**Erro:**
```
Can't connect to MySQL server on '127.0.0.1'
```

**Solução:**

```bash
# 1. Verificar arquivo de configuração
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
# ou
sudo nano /etc/my.cnf

# 2. Procurar por bind-address e comentar/alterar:
[mysqld]
# bind-address = 127.0.0.1  # Certifique-se que está assim ou comentado
skip-networking = 0           # Certifique-se que NÃO está habilitado

# 3. Reiniciar MariaDB
sudo systemctl restart mariadb

# 4. Verificar se porta está aberta
netstat -tuln | grep 3306
```

---

### **Problema 5: Firewall Bloqueando Porta 3306**

```bash
# Verificar firewall
sudo ufw status

# Permitir porta 3306 localmente (se necessário)
sudo ufw allow from 127.0.0.1 to any port 3306

# Recarregar firewall
sudo ufw reload
```

---

### **Problema 6: Arquivo .env Não Carrega**

**Solução:**

```bash
# 1. Verificar se arquivo existe
ls -la /home/meumu.com/public_html/backend-nodejs/.env

# 2. Verificar permissões
chmod 600 /home/meumu.com/public_html/backend-nodejs/.env

# 3. Verificar conteúdo (sem espaços extras)
cat .env

# 4. Testar variáveis manualmente
node -e "require('dotenv').config(); console.log(process.env.DB_HOST);"
```

---

## 🧪 Script de Teste de Conexão

Crie um arquivo de teste para diagnosticar:

```bash
# Criar script de teste
nano /home/meumu.com/public_html/backend-nodejs/test-db-connection.js
```

**Conteúdo do `test-db-connection.js`:**

```javascript
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testando Conexão com MariaDB...\n');
  
  // Mostrar configurações
  console.log('📋 Configurações:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || '127.0.0.1'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || 3306}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'root'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '****' : '(vazia)'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'MuOnline'}`);
  console.log('');

  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'MuOnline',
    family: 4
  };

  try {
    console.log('⏳ Tentando conectar...');
    const connection = await mysql.createConnection(config);
    console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n');

    // Testar query
    console.log('🔍 Testando query...');
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log(`✅ MariaDB Version: ${rows[0].version}\n`);

    // Listar databases
    console.log('📊 Databases disponíveis:');
    const [databases] = await connection.execute('SHOW DATABASES');
    databases.forEach(db => {
      console.log(`   - ${db.Database}`);
    });

    await connection.end();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO NA CONEXÃO:');
    console.error(`   Código: ${error.code}`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   SQL State: ${error.sqlState || 'N/A'}`);
    console.error('\n💡 Dicas:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   - MariaDB não está rodando ou não aceita conexões');
      console.error('   - Verifique: systemctl status mariadb');
      console.error('   - Inicie: systemctl start mariadb');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   - Usuário ou senha incorretos');
      console.error('   - Verifique as credenciais no arquivo .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   - Database não existe');
      console.error('   - Crie com: CREATE DATABASE MuOnline;');
    }
    
    process.exit(1);
  }
}

testConnection();
```

**Executar teste:**

```bash
cd /home/meumu.com/public_html/backend-nodejs
node test-db-connection.js
```

---

## 📊 Verificação Final

Depois de configurar, execute:

```bash
# 1. Testar conexão manual
mysql -u root -p -h 127.0.0.1 -e "USE MuOnline; SHOW TABLES;"

# 2. Testar script de conexão
node test-db-connection.js

# 3. Iniciar backend
npm start

# 4. Verificar logs
tail -f logs/app.log
```

**Resultado esperado:**

```
🔍 Tentando conectar ao MariaDB...
   Host: 127.0.0.1
   Port: 3306
   User: root
   Database: MuOnline
✅ Conectado ao MariaDB com sucesso!
📊 Database: MuOnline
🚀 Servidor rodando na porta 3001
```

---

## 🔐 Segurança do Arquivo .env

```bash
# Restringir permissões do .env
chmod 600 /home/meumu.com/public_html/backend-nodejs/.env

# Garantir que não seja versionado
echo ".env" >> /home/meumu.com/public_html/backend-nodejs/.gitignore

# Owner correto
chown www-data:www-data /home/meumu.com/public_html/backend-nodejs/.env
# ou
chown seu_usuario:seu_usuario /home/meumu.com/public_html/backend-nodejs/.env
```

---

## 📝 Exemplo de .env Completo

```env
# ================================================
# SERVIDOR
# ================================================
PORT=3001
NODE_ENV=production

# ================================================
# BANCO DE DADOS
# ================================================
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_forte_aqui
DB_NAME=MuOnline
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# ================================================
# SEGURANÇA JWT
# ================================================
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9K1BQHBzTWU
JWT_EXPIRES_IN=7d

# ================================================
# CORS
# ================================================
CORS_ORIGIN=https://meumu.com,https://www.meumu.com,http://localhost:5173

# ================================================
# RATE LIMITING
# ================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## ✅ Checklist Final

- [ ] MariaDB está rodando (`systemctl status mariadb`)
- [ ] Porta 3306 está aberta (`netstat -tuln | grep 3306`)
- [ ] Arquivo `.env` existe e está configurado
- [ ] Credenciais do banco estão corretas
- [ ] Database `MuOnline` existe
- [ ] Usuário tem permissão para acessar o banco
- [ ] Chave JWT foi gerada
- [ ] Conexão manual funciona (`mysql -u root -p -h 127.0.0.1`)
- [ ] Script de teste funciona (`node test-db-connection.js`)
- [ ] Backend inicia sem erros (`npm start`)

---

## 🆘 Se Nada Funcionar

### Opção 1: Resetar Senha do Root do MariaDB

```bash
# 1. Parar MariaDB
sudo systemctl stop mariadb

# 2. Iniciar em modo seguro
sudo mysqld_safe --skip-grant-tables &

# 3. Conectar sem senha
mysql -u root

# 4. Resetar senha
USE mysql;
UPDATE user SET password=PASSWORD('nova_senha') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;

# 5. Matar processo safe mode
sudo killall mysqld_safe

# 6. Iniciar MariaDB normalmente
sudo systemctl start mariadb

# 7. Testar nova senha
mysql -u root -p -h 127.0.0.1
```

### Opção 2: Reinstalar MariaDB (CUIDADO: Perde dados!)

```bash
# Backup dos dados primeiro!
mysqldump --all-databases > /backup/all-databases.sql

# Remover e reinstalar
sudo apt-get remove --purge mariadb-server mariadb-client
sudo apt-get autoremove
sudo apt-get autoclean
sudo apt-get install mariadb-server mariadb-client

# Configurar novamente
sudo mysql_secure_installation

# Restaurar dados
mysql -u root -p < /backup/all-databases.sql
```

---

**Configuração completa! Siga os passos acima e seu backend conectará ao banco. 🚀**