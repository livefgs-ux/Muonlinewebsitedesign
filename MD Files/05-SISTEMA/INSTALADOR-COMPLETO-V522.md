# 📋 INSTALADOR COMPLETO V522 - DOCUMENTAÇÃO

**Versão:** 522  
**Data:** 2025-12-28  
**Objetivo:** Instalador único que faz TUDO

---

## 🎯 **FILOSOFIA DO INSTALADOR V522**

> **"UM SCRIPT PARA GOVERNAR TODOS ELES"**

O `install.sh` V522 é um instalador **COMPLETO e INTELIGENTE** que:

- ✅ **Faz tudo automaticamente** (opção 1)
- ✅ **Valida cada etapa** antes de continuar
- ✅ **Exibe erros claros** quando algo falha
- ✅ **Não precisa de scripts separados**
- ✅ **Rollback automático** em caso de falha

---

## 🚀 **COMO USAR**

### **INSTALAÇÃO LIMPA (PRIMEIRO USO):**

```bash
cd /home/meumu.com/public_html
chmod +x install.sh
./install.sh

# Escolha opção 1 (Instalação Completa)
# Sente e relaxe - o script faz TUDO!
```

### **ATUALIZAÇÃO DO GITHUB:**

```bash
./install.sh

# Escolha opção 10 (Atualizar do GitHub)
# Depois escolha opção 1 (Instalação Completa)
```

### **REBUILD RÁPIDO:**

```bash
./install.sh

# Escolha opção 4 (Build Frontend)
# Escolha opção 5 (Reiniciar Servidor)
```

---

## 📊 **O QUE CADA OPÇÃO FAZ**

### **1️⃣ INSTALAÇÃO COMPLETA (RECOMENDADO)**

**Executa 10 etapas em sequência:**

| Etapa | Descrição | O que faz |
|-------|-----------|-----------|
| **0** | Proteções de Segurança | Mata processos, libera portas, testa MySQL |
| **1** | Verificar MySQL | Garante que databases existem |
| **2** | Dependências Frontend | `npm install` na raiz |
| **3** | Dependências Backend | `npm install` em backend-nodejs/ |
| **4** | Configurar .env | Cria/atualiza arquivos .env |
| **5** | **Build Frontend** | **`npm run build` - CRIA DIST/** |
| **6** | Proxy LiteSpeed | Configura proxy reverso (HTTPS) |
| **7** | Parar processos | Garante que nada está rodando |
| **7.5** | Normalizar middleware | Fix de compatibilidade V516 |
| **8** | Iniciar servidor | PM2 ou nohup |
| **9** | Test Health | curl localhost:3001/health |
| **10** | Test HTTPS | curl https://meumu.com/api/health |

**Resultado:**
- ✅ Frontend compilado em `dist/`
- ✅ Backend rodando na porta 3001
- ✅ HTTPS configurado (se possível)
- ✅ Site acessível em `https://meumu.com`

---

### **2️⃣ INSTALAR DEPENDÊNCIAS**

```bash
# O que faz:
npm install --no-scripts  # Frontend (raiz)
npm install               # Backend (backend-nodejs/)
```

**Quando usar:**
- Adicionou novo pacote no package.json
- node_modules corrompido
- Após git pull

---

### **3️⃣ CONFIGURAR .ENV**

```bash
# O que faz:
1. Copia .env.production → .env (backend)
2. Cria .env se não existir (frontend)
3. Configura URLs, databases, secrets
```

**Quando usar:**
- Mudou credenciais MySQL
- Mudou domínio
- Primeira instalação

---

### **4️⃣ BUILD FRONTEND** ⚠️ **CRÍTICO!**

```bash
# O que faz:
1. Limpa dist/ antigo (backup)
2. npm run build
3. Cria dist/ com arquivos compilados
4. Valida se dist/ foi criado
```

**POR QUE É CRÍTICO:**

| Sem Build | Com Build |
|-----------|-----------|
| ❌ Navegador acessa `/src/main.tsx` | ✅ Navegador acessa `/dist/assets/index-XYZ.js` |
| ❌ TypeScript não roda no navegador | ✅ JavaScript compilado funciona |
| ❌ Erro: `SyntaxError: missing )` | ✅ Site carrega perfeitamente |
| ❌ MIME type error | ✅ MIME type correto |

**Quando usar:**
- **SEMPRE** após modificar código frontend
- **SEMPRE** após git pull/clone
- **SEMPRE** antes de deploy

---

### **5️⃣ REINICIAR SERVIDOR**

```bash
# O que faz:
1. Mata TODOS os processos Node.js
2. Libera porta 3001
3. Valida .env
4. Testa MySQL
5. Inicia servidor (PM2 ou nohup)
6. Aguarda 5 segundos
7. Testa /health
```

**Quando usar:**
- Modificou backend
- Mudou .env
- Servidor travou
- Após erro

---

### **6️⃣ VERIFICAR MYSQL**

```bash
# O que faz:
sudo mysql -e "SHOW DATABASES;"

# Verifica:
- ✅ MySQL rodando?
- ✅ Database 'muonline' existe?
- ✅ Database 'meuweb' existe?
```

---

### **7️⃣ VERIFICAR PORTAS**

```bash
# O que faz:
netstat -tulnp | grep :3306  # MySQL
netstat -tulnp | grep :3001  # Node.js
ps aux | grep node           # Processos
```

---

### **8️⃣ HEALTH CHECK**

```bash
# O que faz:
curl http://localhost:3001/health
curl http://localhost:3001/api/server/info

# Verifica:
- ✅ Servidor respondendo?
- ✅ Database conectado?
- ✅ API funcional?
```

---

### **9️⃣ VER LOGS**

```bash
# O que faz:
tail -50 backend-nodejs/logs/server.log
```

**Para logs em tempo real:**
```bash
tail -f backend-nodejs/logs/server.log
```

---

### **🔟 ATUALIZAR DO GITHUB**

```bash
# O que faz:
1. Para servidor
2. APAGA TUDO em public_html/
3. git clone (fresh)
4. Ajusta permissões
5. Valida estrutura
```

**⚠️ ATENÇÃO:**
- **APAGA TUDO!**
- Backups de .env são perdidos
- Use apenas se sabe o que está fazendo

**Depois de atualizar:**
```bash
./install.sh
# Escolha opção 1 (Instalação Completa)
```

---

### **1️⃣1️⃣ CONFIGURAR PROXY LITESPEED**

```bash
# O que faz:
1. Detecta sudo
2. Executa setup-litespeed-proxy.sh
3. Configura proxy reverso para /api
4. Reinicia LiteSpeed
```

**Quando usar:**
- Ativar HTTPS
- Configurar domínio

---

## 🛡️ **PROTEÇÕES AUTOMÁTICAS**

O instalador V522 tem **20+ verificações de segurança:**

### **ANTES DE INSTALAR:**
- ✅ Mata processos Node.js duplicados
- ✅ Libera porta 3001 se ocupada
- ✅ Valida MySQL acessível
- ✅ Cria databases se não existem
- ✅ Cria usuário 'webuser' seguro

### **DURANTE INSTALAÇÃO:**
- ✅ Valida .env sem placeholders
- ✅ Testa conexão MySQL antes de subir
- ✅ Backup de dist/ antigo
- ✅ Valida build completou
- ✅ Normaliza middleware (V516 fix)

### **APÓS INSTALAÇÃO:**
- ✅ Health check automático
- ✅ Test HTTPS (se configurado)
- ✅ Logs de auditoria

---

## ❌ **TRATAMENTO DE ERROS**

### **Erro: "Porta 3001 está em uso"**

```bash
# O instalador tenta automaticamente:
1. pkill -9 node
2. lsof -ti:3001 | xargs kill -9

# Se falhar:
./install.sh
Escolha opção 5 (Reiniciar Servidor)
```

### **Erro: "MySQL não acessível"**

```bash
# Verifique:
sudo systemctl status mariadb

# Reinicie:
sudo systemctl restart mariadb

# Depois:
./install.sh
Escolha opção 1
```

### **Erro: "Build falhou"**

```bash
# Verifique RAM disponível:
free -h

# Se < 2GB:
# Build precisa memória!

# Tente manual com verbose:
cd /home/meumu.com/public_html
npm run build 2>&1 | tee build.log

# Analise erros em build.log
```

### **Erro: "dist/ não foi criado"**

```bash
# Causas comuns:
1. Falta RAM (build precisa ~2GB)
2. Erro de sintaxe em arquivo .tsx
3. Dependência faltando

# Diagnóstico:
./install.sh
Escolha opção 2 (Instalar Dependências)
Escolha opção 4 (Build Frontend)

# Se ainda falhar:
npm run build
# Leia TODOS os erros!
```

---

## 📁 **ESTRUTURA ESPERADA APÓS INSTALAÇÃO**

```
/home/meumu.com/public_html/
├── dist/                         # ✅ CRIADO PELO BUILD!
│   ├── index.html               # Entry point do site
│   ├── favicon.svg
│   └── assets/
│       ├── index-abc123.css     # CSS minificado
│       └── index-def456.js      # JavaScript compilado
│
├── src/                          # Arquivos fonte (NÃO servidos!)
│   ├── main.tsx
│   └── app/
│       └── App.tsx
│
├── backend-nodejs/
│   ├── .env                      # Configuração (CRIADO!)
│   ├── src/
│   │   ├── server.js
│   │   └── middleware/
│   │       └── auth.js
│   └── logs/
│       ├── server.log
│       ├── alerts/
│       ├── audit/
│       └── security/
│
├── install.sh                    # ✅ SCRIPT PRINCIPAL!
├── package.json
├── vite.config.ts
└── .env                          # Frontend config (CRIADO!)
```

---

## 🔍 **VALIDAÇÃO COMPLETA**

### **APÓS EXECUTAR OPÇÃO 1:**

```bash
# 1. Verificar dist/ existe:
ls -la /home/meumu.com/public_html/dist/
# DEVE mostrar:
# - index.html
# - assets/
#   - index-HASH.css
#   - index-HASH.js

# 2. Verificar backend rodando:
curl http://localhost:3001/health
# DEVE retornar JSON:
# {"success":true,"status":"healthy",...}

# 3. Verificar site no navegador:
# Acesse: https://meumu.com/
# Abra Console (F12)
# DEVE ESTAR LIMPO (sem erros!)

# 4. Verificar processos:
ps aux | grep node
# DEVE mostrar: node ...server.js (PID XXX)

# 5. Verificar porta:
netstat -tulnp | grep :3001
# DEVE mostrar: LISTEN ...node
```

---

## 🚨 **TROUBLESHOOTING**

### **"Instalei 100 vezes e continua com erro MIME!"**

**Causa:** Servidor web está servindo pasta ERRADA!

**Diagnóstico:**
```bash
# Se você consegue acessar arquivos .tsx no navegador
# = Servidor servindo src/ ao invés de dist/

# Solução:
1. ./install.sh → Opção 4 (Build - garante dist/ existe)
2. Configure Document Root: /home/meumu.com/public_html/dist
3. Reinicie LiteSpeed
```

**Como configurar Document Root:**

1. **Via CyberPanel (RECOMENDADO):**
   ```
   https://meumu.com:8090
   → Websites → meumu.com → Manage
   → Document Root: /home/meumu.com/public_html/dist
   → Salvar
   → Restart LiteSpeed
   ```

2. **Via vHost (AVANÇADO):**
   ```bash
   sudo nano /usr/local/lsws/conf/vhosts/meumu.com/vhconf.conf
   
   # Mude:
   docRoot   /home/meumu.com/public_html/dist
   
   # Salve e reinicie:
   sudo /usr/local/lsws/bin/lswsctrl restart
   ```

---

## ✅ **CHECKLIST DE SUCESSO**

Após `./install.sh` → Opção 1:

```bash
☑ MySQL rodando (porta 3306)
☑ Databases 'muonline' e 'meuweb' existem
☑ node_modules/ existe (frontend e backend)
☑ .env configurado (frontend e backend)
☑ dist/ criado com index.html e assets/
☑ Backend rodando (porta 3001)
☑ /health retorna JSON
☑ Site carrega em https://meumu.com/
☑ Console do navegador LIMPO (sem erros)
☑ Cadeado verde (HTTPS)
```

---

## 🎯 **RESUMO EXECUTIVO**

| Cenário | Comando |
|---------|---------|
| **Primeira instalação** | `./install.sh` → Opção 1 |
| **Atualizei código frontend** | `./install.sh` → Opção 4 |
| **Atualizei código backend** | `./install.sh` → Opção 5 |
| **Mudei .env** | `./install.sh` → Opção 5 |
| **Servidor travou** | `./install.sh` → Opção 5 |
| **Atualizei do GitHub** | `./install.sh` → Opção 10 → Opção 1 |
| **Site dá erro MIME** | `./install.sh` → Opção 4 + Configure Document Root |
| **Verificar se está tudo OK** | `./install.sh` → Opção 8 |

---

## 🔗 **REFERÊNCIAS**

- [Changelog V522](./CHANGELOG-V522.md)
- [Solução Definitiva Build Frontend](./SOLUCAO-DEFINITIVA-BUILD-FRONTEND.md)
- [Correção Urgente V522](../02-AUDITORIAS/CORRECAO-URGENTE-V522-CORS-BUILD.md)

---

**FIM DA DOCUMENTAÇÃO**
