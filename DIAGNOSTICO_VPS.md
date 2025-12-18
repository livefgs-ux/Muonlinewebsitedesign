# 🔍 DIAGNÓSTICO - Conexão VPS 93.127.203.177

## ✅ Credenciais Configuradas

```
Host: 93.127.203.177
Usuário: root
Senha: @mysql123@
Database 1: muonline
Database 2: webmu
```

## 🚀 PASSO 1: Execute o Diagnóstico Completo

Este script vai testar TUDO e te dizer exatamente o que está acontecendo:

```bash
npm run diagnostico
```

### O que ele faz:
1. ✅ Testa conexão com o servidor MySQL
2. ✅ Verifica versão do MySQL
3. ✅ Lista TODOS os bancos de dados disponíveis
4. ✅ Verifica se "muonline" e "webmu" existem
5. ✅ Lista todas as tabelas de cada banco
6. ✅ Testa queries de players online
7. ✅ Testa ranking de players
8. ✅ Mostra a estrutura das tabelas

### Resultado Esperado:

Se **FUNCIONAR**, você verá:
```
✅ CONEXÃO ESTABELECIDA COM SUCESSO!
✅ Versão MySQL: 8.0.x
✅ Banco "muonline" acessado com sucesso!
✅ Players online: 42
✅ Top 3 players:
   1. PlayerName - Level 400
```

Se **DER ERRO**, o script dirá EXATAMENTE qual é o problema e como resolver.

---

## ❌ POSSÍVEIS PROBLEMAS

### Problema 1: MySQL não está aceitando conexões remotas

**Sintomas:**
```
❌ Error: connect ECONNREFUSED
```

**Solução - Acesse sua VPS via SSH:**

```bash
# 1. Conecte na VPS
ssh root@93.127.203.177

# 2. Edite o arquivo de configuração do MySQL
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# 3. Procure esta linha:
bind-address = 127.0.0.1

# 4. Altere para:
bind-address = 0.0.0.0

# 5. Salve (Ctrl+O, Enter, Ctrl+X)

# 6. Reinicie o MySQL
sudo systemctl restart mysql

# 7. Verifique se está rodando
sudo systemctl status mysql
```

### Problema 2: Firewall bloqueando porta 3306

**Sintomas:**
```
❌ Error: connect ETIMEDOUT
```

**Solução - Na VPS:**

```bash
# Libere a porta 3306
sudo ufw allow 3306/tcp

# Verifique regras do firewall
sudo ufw status

# Se o firewall estiver inativo, ative:
sudo ufw enable
```

### Problema 3: Usuário root sem permissão remota

**Sintomas:**
```
❌ Error: ER_ACCESS_DENIED_ERROR
❌ Access denied for user 'root'@'SEU_IP'
```

**Solução - No MySQL da VPS:**

```bash
# 1. Acesse o MySQL
sudo mysql -u root -p
# (Digite a senha: @mysql123@)

# 2. Execute estes comandos:
USE mysql;

# Permite root conectar de qualquer IP
UPDATE user SET host='%' WHERE user='root';

# Ou crie um novo usuário específico (MAIS SEGURO):
CREATE USER 'muadmin'@'%' IDENTIFIED BY '@mysql123@';
GRANT ALL PRIVILEGES ON muonline.* TO 'muadmin'@'%';
GRANT ALL PRIVILEGES ON webmu.* TO 'muadmin'@'%';
FLUSH PRIVILEGES;

# 3. Saia do MySQL
EXIT;

# 4. Reinicie o MySQL
sudo systemctl restart mysql
```

Se criar o novo usuário, altere no `.env`:
```env
DB_USER=muadmin
DB_PASSWORD=@mysql123@
```

### Problema 4: Bancos de dados com nomes diferentes

**Sintomas:**
O diagnóstico lista os bancos mas não encontra "muonline" ou "webmu"

**Solução:**
1. Execute o diagnóstico para ver os nomes corretos:
   ```bash
   npm run diagnostico
   ```

2. Procure na lista de bancos por nomes parecidos:
   - MuOnline (com maiúscula)
   - mu_online (com underscore)
   - MU (só as iniciais)

3. Atualize o `.env` com o nome correto:
   ```env
   DB_NAME=NOME_CORRETO_AQUI
   ```

---

## ✅ CHECKLIST DE VERIFICAÇÃO NA VPS

Execute estes comandos na VPS para verificar tudo:

```bash
# 1. MySQL está rodando?
sudo systemctl status mysql

# 2. Porta 3306 está aberta?
sudo netstat -tlnp | grep 3306

# 3. Firewall permite conexões?
sudo ufw status

# 4. Teste conexão local
mysql -u root -p
# Digite: @mysql123@
# Depois: SHOW DATABASES;
# Depois: EXIT;

# 5. Veja bind-address
sudo cat /etc/mysql/mysql.conf.d/mysqld.cnf | grep bind-address
```

---

## 🎯 DEPOIS QUE DIAGNOSTICAR

### Se o diagnóstico PASSAR:

```bash
# Inicie o servidor backend
npm run server

# Em outro terminal, inicie o frontend
npm run dev

# Ou inicie tudo junto:
npm run dev:all
```

### Teste a API:

```bash
# Players online
curl http://localhost:3001/api/stats/online

# Estatísticas
curl http://localhost:3001/api/stats/server

# Rankings
curl http://localhost:3001/api/rankings/players?limit=10
```

---

## 📞 COMANDOS ÚTEIS

### Verificar logs do MySQL na VPS:

```bash
sudo tail -f /var/log/mysql/error.log
```

### Testar conexão da sua máquina:

```bash
# Tenta conectar ao MySQL remoto
mysql -h 93.127.203.177 -u root -p
# Digite: @mysql123@
```

### Verificar se porta está aberta:

```bash
# Da sua máquina local
telnet 93.127.203.177 3306

# Ou use nmap
nmap -p 3306 93.127.203.177
```

---

## 🔒 IMPORTANTE - SEGURANÇA

Depois de funcionar, **MUDE ESTAS CONFIGURAÇÕES**:

1. **Não use root** - Crie usuário específico:
```sql
CREATE USER 'muadmin'@'%' IDENTIFIED BY 'SenhaForte123!@';
GRANT SELECT ON muonline.* TO 'muadmin'@'%';
GRANT SELECT ON webmu.* TO 'muadmin'@'%';
FLUSH PRIVILEGES;
```

2. **Configure firewall** para aceitar apenas seu IP:
```bash
sudo ufw allow from SEU_IP to any port 3306
```

3. **Use senha forte**:
```bash
ALTER USER 'root'@'%' IDENTIFIED BY 'SenhaUltraForte!@#456';
```

---

## 🚀 PRÓXIMO PASSO

**EXECUTE AGORA:**

```bash
npm run diagnostico
```

E me envie o resultado completo! Assim posso ajudar com o problema específico. ✅

---

**⚔️ MeuMU Online - Conectando ao servidor VPS**
