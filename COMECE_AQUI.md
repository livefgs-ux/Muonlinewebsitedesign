# 🚀 MeuMU Online - COMECE AQUI

## ❌ **SEU ERRO:**

```
❌ API Error [/server/info]: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**OU**

```
❌ Pasta backend-nodejs não encontrada!
```

---

## ✅ **SOLUÇÃO EM 2 PASSOS:**

### **1️⃣ Execute o script do diretório do PROJETO:**

```bash
# Navegue até onde você baixou/clonou o projeto MeuMU Online
cd /caminho/do/projeto/MeuMU

# Execute o script
chmod +x setup-completo-auto.sh
./setup-completo-auto.sh
```

**O script vai:**
- ✅ Detectar que você tem `backend-nodejs/` no projeto
- ✅ Perguntar seu domínio (ex: meumu.com)
- ✅ Copiar automaticamente para `/home/meumu.com/public_html/backend-nodejs`
- ✅ Configurar tudo
- ✅ Iniciar backend
- ✅ Testar

---

### **2️⃣ OU, se não tiver o projeto completo:**

```bash
# Execute direto do servidor
chmod +x setup-completo-auto.sh
./setup-completo-auto.sh
```

**Ele vai avisar que precisa do instalador web:**
```
Execute: http://meumu.com/install
```

---

## 📂 **ESTRUTURA DO PROJETO:**

```
MeuMU-Online/                     ← Projeto completo (dev)
├── backend-nodejs/               ← ✅ BACKEND EXISTE AQUI
│   ├── src/
│   ├── package.json
│   └── .env.example
├── src/                          ← Frontend React
├── dist/                         ← Build do React
├── setup-completo-auto.sh        ← ⭐ EXECUTE ESTE
└── README.md

/home/meumu.com/public_html/      ← Onde vai ser copiado (CyberPanel)
├── backend-nodejs/               ← ✅ SERÁ CRIADO AUTOMATICAMENTE
│   ├── src/
│   ├── package.json
│   └── .env                      ← Criado pelo instalador
├── dist/                         ← Arquivos do React
├── install/                      ← Instalador web
└── .htaccess
```

---

## 🎯 **OPÇÕES:**

| Script | Quando usar |
|--------|-------------|
| **`setup-completo-auto.sh`** | ⭐ **USE ESTE!** Detecta, cria, configura TUDO |
| `resolver-tudo.sh` | Mesma coisa que acima |
| `configurar-cyberpanel.sh` | Só configurar proxy (se backend já existe) |
| `diagnostico-completo.sh` | Ver o que está faltando |

---

## 📋 **PASSO A PASSO MANUAL:**

Se preferir fazer manualmente:

### **1. Copiar backend:**

```bash
# Do projeto para o servidor
cd /caminho/do/projeto/MeuMU
rsync -av --exclude='node_modules' --exclude='.env' \
  backend-nodejs/ \
  /home/meumu.com/public_html/backend-nodejs/
```

### **2. Configurar .env:**

```bash
cd /home/meumu.com/public_html/backend-nodejs
cp .env.example .env
nano .env
# Configure: DB_PASSWORD, WEBMU_DB_PASSWORD, JWT_SECRET
```

### **3. Instalar e iniciar:**

```bash
npm install
pm2 start src/server.js --name meumu-backend
pm2 save
```

### **4. Configurar proxy:**

```bash
cd /home/meumu.com/public_html
./configurar-cyberpanel.sh
```

---

## 🚨 **TROUBLESHOOTING:**

### **"Backend não encontrado no diretório atual"**

**Causa:** Você está executando o script de um lugar que não tem `backend-nodejs/`

**Solução:**
1. Navegue até o diretório do projeto completo
2. OU use o instalador web: `http://meumu.com/install`

---

### **"Arquivo .env não encontrado"**

**Causa:** Backend copiado mas não configurado

**Solução:**
1. Execute: `http://meumu.com/install`
2. OU crie manualmente: `cp .env.example .env && nano .env`

---

### **"Proxy retorna HTML"**

**Causa:** Proxy não configurado no OpenLiteSpeed

**Solução:**
```bash
./configurar-cyberpanel.sh
```

---

## 🎮 **TESTE FINAL:**

```bash
# Backend direto
curl http://localhost:3001/api/health
# ✅ Deve retornar JSON

# Proxy via domínio
curl http://meumu.com/api/health
# ✅ Deve retornar JSON (NÃO HTML!)

# Navegador
# 1. Abra http://meumu.com
# 2. F12 → Console
# 3. SEM ERROS 404!
```

---

## 🚀 **EXECUTE AGORA:**

```bash
chmod +x setup-completo-auto.sh
./setup-completo-auto.sh
```

**3 minutos e está pronto!** 🎮✨

---

**MeuMU Online v3.0.0**  
**Setup Completo Automático**  
**© 2024-2025 MeuMU Team**
