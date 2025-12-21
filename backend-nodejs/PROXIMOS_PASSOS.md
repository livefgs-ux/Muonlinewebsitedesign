# 🎯 PRÓXIMOS PASSOS - Backend MeuMU Online

**Status Atual:** ✅ Health check corrigido  
**Arquivos Editados:** `.env.template`, `.gitignore`  
**O que falta:** Criar o arquivo `.env` com suas credenciais

---

## ✅ O QUE JÁ ESTÁ PRONTO

- ✅ Backend Node.js completo (18 endpoints)
- ✅ Conexão MariaDB configurada
- ✅ Middlewares de segurança (CORS, Rate Limit, Helmet)
- ✅ Sistema de autenticação JWT
- ✅ Health check funcionando (`/health`)
- ✅ `.gitignore` configurado (protege `.env`)
- ✅ `.env.template` atualizado

---

## 📋 O QUE VOCÊ PRECISA FAZER AGORA

### **PASSO 1: Criar arquivo `.env`**

Você tem 2 opções:

#### **Opção A: Setup Automático** (Recomendado - 2 minutos)

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Tornar executável
chmod +x setup-env.sh

# Executar
./setup-env.sh
```

O script vai perguntar:
- Senha do MariaDB → Digite sua senha
- Nome do database → `muonline` (Enter)
- Porta → `3001` (Enter)
- Domínios CORS → Seus domínios ou Enter

**Pule para o Passo 2 se usar esta opção.**

---

#### **Opção B: Manual** (3-5 minutos)

```bash
cd /home/meumu.com/public_html/backend-nodejs

# 1. Copiar template
cp .env.template .env

# 2. Gerar chave JWT forte
openssl rand -base64 64

# (Copie a saída - será algo como: xK9mP3nR8tL2jH7...)

# 3. Editar .env
nano .env
```

**Configure estas linhas no `.env`:**

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
DB_PASSWORD=SUA_SENHA_DO_MARIADB_AQUI  ← EDITE!
DB_NAME=muonline

# ================================================
# JWT SECRET
# ================================================
JWT_SECRET=COLE_AQUI_A_CHAVE_GERADA_NO_PASSO_2  ← EDITE!
JWT_EXPIRES_IN=7d

# ================================================
# CORS
# ================================================
ALLOWED_ORIGINS=http://localhost:5173,https://meumu.com,https://www.meumu.com
```

**Salvar e sair:**
- `Ctrl + O` → Enter (salvar)
- `Ctrl + X` (sair)

---

### **PASSO 2: Reiniciar o Backend**

```bash
# Se já está rodando
npm restart

# OU se não iniciou ainda
npm start
```

---

### **PASSO 3: Verificar se está funcionando**

#### **3.1 Verificar logs do backend**

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

Se ainda aparecer `Database: undefined`, o arquivo `.env` não foi criado corretamente!

---

#### **3.2 Testar Health Check**

```bash
curl http://localhost:3001/health
```

**Deve retornar:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "MeuMU Online API está funcionando!",
  "database": "connected",
  "timestamp": "2024-12-21T...",
  "uptime": 123.456
}
```

---

#### **3.3 Testar Endpoints da API**

```bash
# Info da API
curl http://localhost:3001/

# Info do servidor
curl http://localhost:3001/api/server/info

# Estatísticas do servidor
curl http://localhost:3001/api/server/stats

# Rankings (dados reais do banco)
curl http://localhost:3001/api/rankings/players
```

---

## 🔍 TROUBLESHOOTING

### **Problema: `Database: undefined`**

**Causa:** Arquivo `.env` não existe ou está no lugar errado

**Solução:**
```bash
cd /home/meumu.com/public_html/backend-nodejs

# Verificar se .env existe
ls -la .env

# Se NÃO aparecer nada, criar:
cp .env.template .env
nano .env
# Configure DB_PASSWORD e JWT_SECRET
# Salve e saia (Ctrl+O, Enter, Ctrl+X)

# Reiniciar
npm restart
```

---

### **Problema: "Cannot connect to database"**

**Causa:** MariaDB não está rodando ou senha incorreta

**Solução:**
```bash
# Verificar se MariaDB está rodando
systemctl status mariadb

# Se não estiver rodando:
sudo systemctl start mariadb

# Testar conexão manual
mysql -u root -p -h 127.0.0.1

# Se conectar manualmente mas backend não conecta:
# Verificar senha no .env
cat .env | grep DB_PASSWORD

# Editar se necessário
nano .env
npm restart
```

---

### **Problema: "JWT must be provided"**

**Causa:** `JWT_SECRET` não está no `.env` ou está vazio

**Solução:**
```bash
# Gerar chave
openssl rand -base64 64

# Editar .env
nano .env
# Adicionar/editar: JWT_SECRET=chave_gerada_acima
# Salvar e sair

# Reiniciar
npm restart
```

---

### **Problema: "ECONNREFUSED" ao fazer curl**

**Causa:** Backend não está rodando

**Solução:**
```bash
# Verificar se está rodando
pm2 list
# OU
ps aux | grep node

# Se não estiver rodando:
cd /home/meumu.com/public_html/backend-nodejs
npm start
```

---

### **Problema: "CORS error" no frontend**

**Causa:** Domínio do frontend não está em `ALLOWED_ORIGINS`

**Solução:**
```bash
# Editar .env
nano .env

# Adicionar seu domínio:
ALLOWED_ORIGINS=http://localhost:5173,https://meumu.com,https://www.meumu.com

# Salvar e reiniciar
npm restart
```

---

## 📊 ESTRUTURA DE ARQUIVOS

```
backend-nodejs/
├── .env                    ← VOCÊ CRIA (não commitar!)
├── .env.template           ← Template (já editado por você)
├── .gitignore              ← Protege .env (já editado por você)
├── setup-env.sh            ← Script automático
├── package.json
├── src/
│   ├── server.js           ← Main (corrigido - health check OK)
│   ├── config/
│   │   ├── database.js     ← Conexão MariaDB
│   │   └── auth.js         ← Config JWT
│   ├── routes/             ← 9 arquivos de rotas
│   ├── controllers/        ← 9 controllers
│   ├── middleware/         ← Logger, auth, errors
│   └── utils/              ← Helpers
└── test-db-connection.js   ← Script de teste
```

---

## ✅ CHECKLIST FINAL

Antes de conectar o frontend, certifique-se:

- [ ] Arquivo `.env` criado (não `.env.template`)
- [ ] `DB_PASSWORD` configurado com senha real
- [ ] `DB_NAME=muonline` (minúsculo)
- [ ] `JWT_SECRET` gerado (64+ chars)
- [ ] `ALLOWED_ORIGINS` inclui seus domínios
- [ ] Backend reiniciado (`npm restart`)
- [ ] Logs mostram `Database: muonline` ✅
- [ ] `curl http://localhost:3001/health` retorna `success: true`
- [ ] `curl http://localhost:3001/api/server/stats` retorna dados
- [ ] `curl http://localhost:3001/api/rankings/players` retorna lista

---

## 🚀 DEPOIS DO BACKEND FUNCIONAR

### **Próximos passos:**

1. **Conectar Frontend ao Backend**
   - Atualizar `/src/services/api.ts`
   - Configurar base URL para `http://localhost:3001`
   - Testar login/cadastro

2. **Testar Funcionalidades**
   - Login de usuário
   - Gestão de personagens
   - Distribuição de pontos
   - Rankings em tempo real
   - Sistema de reset

3. **Configurar Domínio**
   - Nginx reverse proxy
   - SSL/HTTPS
   - PM2 para produção

---

## 📞 COMANDOS RÁPIDOS

```bash
# Ir para pasta do backend
cd /home/meumu.com/public_html/backend-nodejs

# Setup automático
./setup-env.sh

# Criar .env manualmente
cp .env.template .env && nano .env

# Gerar JWT
openssl rand -base64 64

# Iniciar
npm start

# Reiniciar
npm restart

# Parar
npm stop

# Ver logs
npm run logs

# Testar
curl http://localhost:3001/health
curl http://localhost:3001/api/server/stats
curl http://localhost:3001/api/rankings/players

# Verificar se .env existe
ls -la .env

# Testar conexão com banco
node test-db-connection.js
```

---

## 🎯 RESUMO

**O que está pronto:**
- ✅ Backend completo com 18 endpoints REST
- ✅ Health check funcionando (`/health`)
- ✅ `.env.template` configurado
- ✅ `.gitignore` protegendo senhas

**O que você precisa fazer:**
1. Criar `.env` (copiar de `.env.template`)
2. Configurar `DB_PASSWORD` (senha do MariaDB)
3. Gerar e configurar `JWT_SECRET`
4. Reiniciar backend com `npm restart`
5. Testar com `curl http://localhost:3001/health`

**Tempo estimado:** 3-5 minutos

---

**Siga os passos acima e seu backend estará 100% funcional! 🚀**
