# ⚡ SETUP RÁPIDO - 3 PASSOS

**Problema:** Backend mostra `Database: undefined`  
**Tempo:** 3 minutos  
**Dificuldade:** ⭐ Fácil

---

## 📋 ANTES DE COMEÇAR

Você precisa ter:
- ✅ MariaDB instalado e rodando
- ✅ Senha do usuário `root` do MariaDB
- ✅ Database `muonline` criado (ou outro nome)
- ✅ Backend na pasta `/home/meumu.com/public_html/backend-nodejs/`

---

## 🚀 PASSO 1: Criar arquivo .env

Escolha **UMA** das opções:

### **Opção A: Automático (Recomendado)**

```bash
cd /home/meumu.com/public_html/backend-nodejs
chmod +x setup-env.sh
./setup-env.sh
```

**O script vai perguntar:**
- Senha do MariaDB → Digite sua senha
- Nome do database → `muonline` (aperte Enter)
- Porta → `3001` (aperte Enter)
- Domínios CORS → Digite seus domínios ou aperte Enter

✅ **Pronto! Pule para o Passo 3.**

---

### **Opção B: Manual**

```bash
cd /home/meumu.com/public_html/backend-nodejs
cp .env.template .env
nano .env
```

**Cole isto e edite apenas as linhas marcadas:**

```env
PORT=3001
NODE_ENV=production

# ← EDITE AQUI: Sua senha do MariaDB
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=COLOQUE_SUA_SENHA_AQUI  ← EDITE!
DB_NAME=muonline

# ← EDITE AQUI: Cole a chave JWT gerada abaixo
JWT_SECRET=COLE_AQUI_A_CHAVE_JWT  ← EDITE!
JWT_EXPIRES_IN=7d

# ← EDITE AQUI (opcional): Seus domínios
ALLOWED_ORIGINS=http://localhost:5173,https://meumu.com
```

**Salvar:**
- `Ctrl + O` → Enter → `Ctrl + X`

---

## 🔐 PASSO 2: Gerar Chave JWT (Apenas se fez manual)

Se usou a **Opção A (Automático)**, pule este passo.

Se usou a **Opção B (Manual)**:

```bash
openssl rand -base64 64
```

**Vai aparecer algo assim:**
```
xK9mP3nR8... (64 caracteres aleatórios)
```

**Copie isso e cole no `.env` na linha `JWT_SECRET=`**

```bash
nano .env
# Encontre a linha JWT_SECRET e cole a chave
# Salvar: Ctrl+O, Enter, Ctrl+X
```

---

## ✅ PASSO 3: Reiniciar Backend

```bash
npm restart
```

**OU se ainda não iniciou:**

```bash
npm start
```

---

## 🎯 RESULTADO ESPERADO

Você deve ver:

```
🚀 Iniciando MeuMU Online Backend...
================================================
✅ Conectado ao MariaDB com sucesso!
📊 Database: muonline  ← ✅ DEVE APARECER!
================================================
✅ Servidor rodando na porta 3001
🌍 Ambiente: production
📡 API URL: http://localhost:3001
📊 Health Check: http://localhost:3001/health
================================================
```

---

## ✅ TESTAR SE FUNCIONOU

### **Teste 1: Health Check**

```bash
curl http://localhost:3001/health
```

**Deve retornar:**
```json
{
  "success": true,
  "message": "MeuMU Online API está funcionando!",
  "database": "connected"
}
```

---

### **Teste 2: Listar Endpoints**

```bash
curl http://localhost:3001/
```

**Deve retornar:**
```json
{
  "success": true,
  "message": "MeuMU Online API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "rankings": "/api/rankings",
    ...
  }
}
```

---

### **Teste 3: Testar Rankings (dados reais)**

```bash
curl http://localhost:3001/api/rankings/players
```

**Deve retornar lista de players do banco:**
```json
{
  "success": true,
  "rankings": [
    {
      "name": "PlayerName",
      "class": "DarkKnight",
      "level": 400,
      ...
    }
  ]
}
```

---

## 🚨 SE DER ERRO

### **Erro: "Database: undefined"**

→ O arquivo `.env` não foi criado ou está no lugar errado.

```bash
# Verificar se existe
ls -la .env

# Se não existir, criar:
cp .env.template .env
nano .env
# Configure DB_PASSWORD e JWT_SECRET
npm restart
```

---

### **Erro: "Cannot connect to database"**

→ Senha do MariaDB está errada ou banco não está rodando.

```bash
# Testar conexão manual
mysql -u root -p -h 127.0.0.1

# Se pedir senha, digite a mesma que colocou no .env
# Se conectar, o problema é no .env

# Verificar .env
cat .env | grep DB_PASSWORD

# Se a senha estiver errada, editar:
nano .env
# Corrigir DB_PASSWORD
npm restart
```

---

### **Erro: "ECONNREFUSED"**

→ MariaDB não está rodando.

```bash
# Verificar status
systemctl status mariadb

# Se não estiver rodando, iniciar:
sudo systemctl start mariadb

# Verificar novamente
systemctl status mariadb

# Depois reiniciar backend
npm restart
```

---

### **Erro: "JWT must be provided"**

→ `JWT_SECRET` não está configurado no `.env`.

```bash
# Gerar chave
openssl rand -base64 64

# Editar .env
nano .env
# Adicionar linha:
# JWT_SECRET=chave_gerada_acima

# Reiniciar
npm restart
```

---

## 📊 COMANDOS DE DIAGNÓSTICO

```bash
# Verificar se .env existe
ls -la .env

# Ver conteúdo do .env (sem senhas)
cat .env | grep -v PASSWORD | grep -v SECRET

# Testar conexão com banco
node test-db-connection.js

# Ver logs do backend
npm run logs

# Status do PM2
pm2 list

# Verificar porta 3001
netstat -tuln | grep 3001
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
backend-nodejs/
├── .env              ← ARQUIVO REAL (você cria)
├── .env.template     ← Exemplo (NÃO editar)
├── .gitignore        ← Protege .env
├── setup-env.sh      ← Script automático
├── package.json
├── src/
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   └── ...
└── test-db-connection.js
```

---

## 🔐 SEGURANÇA

### ✅ Faça:
- Use senhas fortes no MariaDB
- Gere JWT_SECRET com 64+ caracteres
- Nunca commite o `.env` no Git
- Configure CORS apenas com domínios confiáveis

### ❌ Não faça:
- Não use senhas fracas ("123456", "admin")
- Não compartilhe o `.env`
- Não deixe `DB_PASSWORD` vazio
- Não ignore o `.gitignore`

---

## ✅ CHECKLIST FINAL

- [ ] Arquivo `.env` criado ✅
- [ ] `DB_PASSWORD` configurado ✅
- [ ] `JWT_SECRET` gerado (64+ chars) ✅
- [ ] Backend reiniciado ✅
- [ ] Mensagem mostra `Database: muonline` ✅
- [ ] `curl http://localhost:3001/health` funciona ✅
- [ ] Sem erros nos logs ✅

---

## 🎉 PRONTO!

Se todos os testes passaram, seu backend está **100% funcional**!

**Próximos passos:**
1. Conectar o frontend ao backend
2. Testar login/cadastro
3. Testar gestão de personagens
4. Configurar domínio em produção

---

## 📞 COMANDOS RÁPIDOS DE REFERÊNCIA

```bash
# Setup
cd backend-nodejs && ./setup-env.sh

# Iniciar
npm start

# Reiniciar
npm restart

# Parar
npm stop

# Logs
npm run logs

# Testar
curl http://localhost:3001/health
```

---

**Setup completo em 3 passos! 🚀**
