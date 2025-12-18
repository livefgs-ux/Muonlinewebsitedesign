# ✅ CHECKLIST DE CONEXÃO - VPS 93.127.203.177

## 📋 PASSO A PASSO VISUAL

### ☐ 1. VERIFIQUE O ARQUIVO .ENV

Abra o arquivo `.env` e confirme:

```env
DB_HOST=93.127.203.177     ✅ Seu IP VPS
DB_USER=root               ✅ Usuário MySQL
DB_PASSWORD=@mysql123@     ✅ Sua senha
DB_NAME=muonline           ✅ Nome do banco
```

---

### ☐ 2. EXECUTE O DIAGNÓSTICO

```bash
npm run diagnostico
```

**O que esperar:**
- ✅ Conexão estabelecida = MySQL acessível
- ✅ Lista de bancos = Credenciais corretas
- ✅ Tabelas encontradas = Banco configurado
- ❌ Erro = Veja seção de problemas abaixo

---

### ☐ 3. SE DER ERRO DE CONEXÃO

**Erro típico:** `ECONNREFUSED` ou `ETIMEDOUT`

#### Na VPS (via SSH):

```bash
# Acesse a VPS
ssh root@93.127.203.177

# Execute estes 5 comandos:

# 1. MySQL está rodando?
sudo systemctl status mysql
# Se não estiver: sudo systemctl start mysql

# 2. Porta 3306 aberta?
sudo netstat -tlnp | grep 3306
# Deve mostrar: 0.0.0.0:3306 ou :::3306

# 3. Bind-address configurado?
sudo grep bind-address /etc/mysql/mysql.conf.d/mysqld.cnf
# Deve ser: bind-address = 0.0.0.0

# 4. Se não for 0.0.0.0, edite:
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Altere: bind-address = 0.0.0.0
# Salve: Ctrl+O, Enter, Ctrl+X
sudo systemctl restart mysql

# 5. Libere firewall
sudo ufw allow 3306/tcp
sudo ufw status
```

---

### ☐ 4. SE DER ERRO DE AUTENTICAÇÃO

**Erro típico:** `ER_ACCESS_DENIED_ERROR`

#### No MySQL da VPS:

```bash
# Acesse MySQL
sudo mysql -u root -p
# Senha: @mysql123@

# Execute dentro do MySQL:
USE mysql;
SELECT user, host FROM user WHERE user='root';

# Se não aparecer root@'%', execute:
UPDATE user SET host='%' WHERE user='root' AND host='localhost';
FLUSH PRIVILEGES;
EXIT;

# Reinicie MySQL
sudo systemctl restart mysql
```

---

### ☐ 5. TESTE DE NOVO

```bash
npm run diagnostico
```

**Resultado esperado:**
```
✅ CONEXÃO ESTABELECIDA COM SUCESSO!
✅ Banco "muonline" acessado com sucesso!
✅ Players online: X
```

---

### ☐ 6. INICIE O SERVIDOR

```bash
npm run server
```

**Resultado esperado:**
```
✅ Conexão com MySQL estabelecida com sucesso!
🚀 Servidor MeuMU Online API rodando na porta 3001
```

---

### ☐ 7. TESTE A API

Abra no navegador ou use curl:

```bash
# Teste 1: Health check
curl http://localhost:3001/health

# Teste 2: Players online
curl http://localhost:3001/api/stats/online

# Teste 3: Estatísticas
curl http://localhost:3001/api/stats/server
```

**Resultado esperado (exemplo):**
```json
{
  "success": true,
  "data": {
    "playersOnline": 42,
    "totalAccounts": 1523,
    "totalCharacters": 3847,
    "totalGuilds": 125
  }
}
```

---

### ☐ 8. INICIE O FRONTEND

```bash
# Em outro terminal
npm run dev

# OU inicie tudo junto:
npm run dev:all
```

**Acesse:** http://localhost:5173

---

## ❌ PROBLEMAS COMUNS E SOLUÇÕES RÁPIDAS

### Problema 1: "ECONNREFUSED"
```
✋ MySQL não aceita conexões remotas
🔧 Solução: Altere bind-address para 0.0.0.0
📖 Ver seção 3 acima
```

### Problema 2: "ETIMEDOUT"
```
✋ Firewall bloqueando porta 3306
🔧 Solução: sudo ufw allow 3306/tcp
📖 Ver seção 3 acima
```

### Problema 3: "ER_ACCESS_DENIED_ERROR"
```
✋ Usuário root não pode conectar remotamente
🔧 Solução: UPDATE user SET host='%'...
📖 Ver seção 4 acima
```

### Problema 4: "ER_BAD_DB_ERROR"
```
✋ Banco "muonline" não existe
🔧 Solução: Execute npm run diagnostico para ver bancos disponíveis
📖 Atualize DB_NAME no .env com nome correto
```

### Problema 5: Tabelas não encontradas
```
✋ Estrutura do banco diferente
🔧 Solução: Execute npm run diagnostico para ver estrutura
📖 Ajustaremos as queries conforme sua estrutura
```

---

## 🎯 ATALHO - TESTE RÁPIDO

Execute tudo de uma vez:

```bash
# 1. Diagnóstico completo
npm run diagnostico

# 2. Se passar, inicie tudo
npm run dev:all
```

---

## 📞 COMANDOS DE TESTE NA VPS

Se precisar verificar algo na VPS:

```bash
# Status do MySQL
sudo systemctl status mysql

# Logs do MySQL (em tempo real)
sudo tail -f /var/log/mysql/error.log

# Processos na porta 3306
sudo lsof -i :3306

# Testar conexão local
mysql -u root -p
```

---

## ✅ CHECKLIST FINAL

Marque conforme vai completando:

- [ ] Arquivo .env configurado
- [ ] Diagnóstico executado e passou
- [ ] Servidor backend rodando (npm run server)
- [ ] API respondendo (curl http://localhost:3001/health)
- [ ] Frontend rodando (npm run dev)
- [ ] Site abrindo em http://localhost:5173
- [ ] Players online mostrando número real
- [ ] Rankings mostrando dados reais

---

## 🚀 DEPOIS QUE TUDO FUNCIONAR

1. Substitua dados fake pelos componentes reais
2. Configure segurança (usuário não-root)
3. Configure backup automático do banco
4. Deploy em produção

---

**⚔️ Execute agora: `npm run diagnostico`**
