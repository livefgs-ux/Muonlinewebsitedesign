# ⚙️ Configuração Rápida - MeuMU Online Backend

## 🚀 Quick Start

```bash
# 1. Criar arquivo .env
cp .env.example .env

# 2. Editar credenciais
nano .env

# 3. Testar conexão com banco
node test-db-connection.js

# 4. Iniciar servidor
npm start
```

---

## 📋 Checklist Essencial

### ✅ ANTES DE INICIAR

1. **MariaDB está rodando?**
   ```bash
   systemctl status mariadb
   # Se não: systemctl start mariadb
   ```

2. **Arquivo .env configurado?**
   ```bash
   ls -la .env
   # Se não existe: cp .env.example .env
   ```

3. **Credenciais corretas?**
   ```bash
   mysql -u root -p -h 127.0.0.1
   # Teste manual de conexão
   ```

4. **Database existe?**
   ```sql
   SHOW DATABASES;
   -- Deve listar 'MuOnline'
   ```

---

## 🔧 Configuração do .env

**Mínimo necessário:**

```env
# Banco de Dados
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=muonline

# Segurança JWT
JWT_SECRET=sua_chave_secreta_forte_aqui_min_32_chars
JWT_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=production
```

**Gerar JWT Secret:**
```bash
openssl rand -base64 64
```

---

## 🧪 Testar Conexão

```bash
# Teste de conexão ao banco
node test-db-connection.js

# Resultado esperado:
# ✅ CONEXÃO ESTABELECIDA COM SUCESSO!
# ✅ MariaDB Version: 10.x.x
```

---

## 🔍 Diagnóstico de Problemas

### Erro: ECONNREFUSED

```bash
# Verificar se MariaDB está rodando
systemctl status mariadb

# Verificar porta 3306
netstat -tuln | grep 3306
```

### Erro: Access Denied

```bash
# Verificar credenciais
mysql -u root -p -h 127.0.0.1

# Verificar usuário no banco
mysql -u root -p -e "SELECT User, Host FROM mysql.user;"
```

### Erro: Unknown Database

```bash
# Criar database
mysql -u root -p -h 127.0.0.1 -e "CREATE DATABASE MuOnline;"

# Importar schema (se necessário)
mysql -u root -p -h 127.0.0.1 MuOnline < database/schema.sql
```

---

## 📚 Documentação Completa

Consulte os guias detalhados:

- **CONFIGURACAO_BANCO_DE_DADOS.md** - Guia completo de configuração do banco
- **INSTALL_QUICKSTART.md** - Instalação passo a passo
- **README_WCOIN_PACKAGES.md** - Sistema de WCoin
- **FIX_BACKEND_MIDDLEWARE.md** - Correções de middleware

---

## 🆘 Suporte

### Comandos Úteis

```bash
# Status do servidor
npm start

# Logs em tempo real
pm2 logs meumu-api

# Reiniciar servidor
pm2 restart meumu-api

# Verificar processos
pm2 list

# Verificar banco
mysql -u root -p -h 127.0.0.1 -e "USE MuOnline; SHOW TABLES;"
```

### Links Importantes

- 📖 Documentação MariaDB: https://mariadb.com/kb/
- 🔐 Segurança JWT: https://jwt.io/
- 🚀 PM2 Process Manager: https://pm2.keymetrics.io/

---

## ✅ Status dos Serviços

| Serviço | Comando de Verificação | Status Esperado |
|---------|------------------------|-----------------|
| MariaDB | `systemctl status mariadb` | ✅ Active (running) |
| Backend | `pm2 list` | ✅ Online |
| Porta 3001 | `netstat -tuln \| grep 3001` | ✅ LISTEN |
| Porta 3306 | `netstat -tuln \| grep 3306` | ✅ LISTEN |

---

## 🔐 Segurança

```bash
# Permissões corretas do .env
chmod 600 .env

# Verificar que .env não está no git
git check-ignore .env
# Deve retornar: .env

# Nunca commitar .env
echo ".env" >> .gitignore
```

---

## 📊 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/login` | POST | Login de usuário |
| `/api/auth/register` | POST | Registro de usuário |
| `/api/characters` | GET | Listar personagens |
| `/api/rankings` | GET | Rankings globais |
| `/api/server` | GET | Info do servidor |
| `/api/events` | GET | Eventos ativos |
| `/api/news` | GET | Notícias |
| `/api/wcoin/packages` | GET | Pacotes WCoin |

**Teste:**
```bash
curl http://localhost:3001/api/server
```

---

## 🎯 Próximos Passos

Depois de configurar:

1. ✅ Testar todos os endpoints
2. ✅ Configurar PM2 para produção
3. ✅ Configurar Nginx reverse proxy
4. ✅ Habilitar HTTPS com SSL
5. ✅ Configurar backups automáticos
6. ✅ Monitoramento com logs

---

**Configuração completa! Seu backend está pronto para produção. 🚀**