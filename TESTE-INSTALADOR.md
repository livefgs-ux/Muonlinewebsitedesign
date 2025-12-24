# 🧪 TESTE DO INSTALADOR WEB

**Data:** 24/12/2025 23:00  
**Correção:** Database names agora em minúsculas (muonline, webmu)

---

## 🎯 **PASSO A PASSO COMPLETO**

### **1️⃣ REINICIAR O SERVIDOR BACKEND**

```bash
# Ir para o diretório
cd /home/meumu.com/public_html

# Se o servidor estiver rodando, pressione Ctrl+C

# Iniciar menu de manutenção
node check.js

# Escolher opção 4 (Deploy Desenvolvimento)
```

**✅ DEVE MOSTRAR:**
```
🚀 Iniciando servidor de desenvolvimento...
✅ Servidor rodando na porta 3001
📦 Instalador disponível em /install
```

---

### **2️⃣ ABRIR NAVEGADOR**

Acesse uma destas URLs:
- `http://meumu.com:3001/install`
- `http://meumu.com/install` (será redirecionado para :3001)

---

### **3️⃣ ABRIR CONSOLE DO NAVEGADOR (F12)**

Pressione **F12** e vá na aba **Console**.

**✅ DEVE MOSTRAR (SEM ERROS CSP!):**
```
✅ Instalador carregado
🌐 URL atual: http://meumu.com:3001
🔌 Porta atual: 3001
✅ Detectado porta 3001 - usando diretamente
🎯 API Base URL: http://meumu.com:3001
```

**❌ NÃO DEVE MOSTRAR:**
```
Refused to execute inline event handler
script-src 'self'
Content Security Policy
```

---

### **4️⃣ PREENCHER FORMULÁRIO**

#### **Seção 1: Conexão MySQL/MariaDB**
- **Host:** `localhost`
- **Porta:** `3306`
- **Usuário:** `root`
- **Senha:** `SUA_SENHA_MYSQL`

#### **Seção 2: Database do Servidor MU**
- **Nome da Database:** `muonline` ← MINÚSCULA!

#### **Seção 3: Database do Website**
- **Nome da Database:** `webmu` ← MINÚSCULA!

---

### **5️⃣ CLICAR "🧪 TESTAR AMBAS CONEXÕES"**

**NO CONSOLE DEVE APARECER:**
```
🚀 Iniciando teste de ambas databases...
🔍 Testando muonline: {host: "localhost", port: 3306, database: "muonline"}
📡 POST: http://meumu.com:3001/api/install/test-connection
📥 Response muonline: 200
📊 Data muonline: {success: true, database: "muonline", tables: [...]}

🔍 Testando webmu: {host: "localhost", port: 3306, database: "webmu"}
📡 POST: http://meumu.com:3001/api/install/test-connection
📥 Response webmu: 200
📊 Data webmu: {success: true, database: "webmu", tables: [...]}

✅ Ambas databases conectadas - Botão Finalizar habilitado
```

**NA TELA DEVE APARECER:**

```
┌─────────────────────────────────────────────┐
│ 📦 Database do Servidor MU                  │
│                                             │
│ ✅ Conexão bem-sucedida!                    │
│    Database: muonline                       │
│    Tabelas encontradas: 15                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🌐 Database do Website                      │
│                                             │
│ ✅ Conexão bem-sucedida!                    │
│    Database: webmu                          │
│    Tabelas encontradas: 0                   │
│    ✨ Database criada automaticamente       │
└─────────────────────────────────────────────┘
```

---

### **6️⃣ BOTÃO "FINALIZAR INSTALAÇÃO" DEVE ESTAR ATIVO**

O botão dourado deve ficar HABILITADO (não mais acinzentado).

Clique em **"✅ Finalizar Instalação"**.

**NO CONSOLE:**
```
🎉 Finalizando instalação...
📡 POST: http://meumu.com:3001/api/install/finalize
📥 Response: 200
📊 Data: {success: true, message: "Instalação concluída!", log: [...]}
```

**NA TELA:**
```
┌─────────────────────────────────────────────┐
│ 🎉 Instalação Concluída!                    │
│                                             │
│ Próximos passos:                            │
│ 1️⃣ Pressione Ctrl+C no terminal             │
│ 2️⃣ Execute: node check.js                   │
│ 3️⃣ Escolha: Opção 4 (Deploy Desenvolvimento)│
│                                             │
│ 🌐 API: http://meumu.com:3001/api           │
└─────────────────────────────────────────────┘
```

---

## ❌ **ERROS POSSÍVEIS E SOLUÇÕES**

### **ERRO 1: Botão não responde**

**Sintoma:** Clica no botão e nada acontece.

**Solução:**
```bash
# 1. Verificar se servidor está rodando
ps aux | grep node

# 2. Se não estiver, iniciar:
node check.js
# Opção 4

# 3. Limpar cache do navegador:
Ctrl + Shift + Del
# Marcar "Cache" e "Cookies"
# Clicar "Limpar dados"

# 4. Recarregar página
F5
```

---

### **ERRO 2: Console mostra erros CSP**

**Sintoma:**
```
Refused to execute inline event handler
script-src 'self'
```

**Solução:**
```bash
# 1. Servidor precisa reiniciar com a correção
cd /home/meumu.com/public_html
pkill node

# 2. Iniciar novamente
node check.js
# Opção 4

# 3. Abrir em aba anônima
Ctrl + Shift + N (Chrome)
http://meumu.com:3001/install
```

---

### **ERRO 3: Failed to fetch**

**Sintoma:**
```
❌ Erro ao conectar
Failed to fetch
Verifique se o servidor Node.js está rodando na porta 3001
```

**Solução:**
```bash
# 1. Verificar se servidor está REALMENTE rodando:
curl http://localhost:3001/health

# Se não responder:
node check.js
# Opção 4

# 2. Verificar se porta 3001 está aberta:
netstat -tuln | grep 3001

# 3. Verificar firewall:
sudo ufw status
# Se ativo, permitir porta 3001:
sudo ufw allow 3001
```

---

### **ERRO 4: Database não encontrado**

**Sintoma:**
```
❌ Erro na conexão
ER_BAD_DB_ERROR: Database 'MuOnline' not found
```

**Causa:** Nome em maiúscula! Linux é case-sensitive!

**Solução:**
```
✅ Use: muonline (tudo minúsculo)
❌ NÃO use: MuOnline, MUONLINE, MU_ONLINE
```

---

### **ERRO 5: Access denied**

**Sintoma:**
```
❌ Erro na conexão
ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

**Solução:**
```bash
# Verificar senha do MySQL:
mysql -u root -p
# Digite a senha

# Se conectar, a senha está correta!
# Use a mesma senha no instalador
```

---

## ✅ **CHECKLIST FINAL**

Antes de reportar erro, verificar:

- [ ] Servidor Node.js está rodando? (`ps aux | grep node`)
- [ ] Porta 3001 está aberta? (`netstat -tuln | grep 3001`)
- [ ] Console do navegador (F12) está aberto?
- [ ] Console NÃO mostra erros CSP?
- [ ] Database é `muonline` (minúsculo)?
- [ ] MariaDB está rodando? (`systemctl status mariadb`)
- [ ] Senha do MySQL está correta?
- [ ] Cache do navegador foi limpo?

---

## 📊 **STATUS ESPERADO**

| Item | Status Esperado |
|------|----------------|
| **Servidor rodando** | ✅ Porta 3001 |
| **Console sem erros CSP** | ✅ Sem "Refused to execute" |
| **Botão responde** | ✅ Mostra loading |
| **Database muonline** | ✅ Conectado |
| **Database webmu** | ✅ Criado automaticamente |
| **Botão Finalizar** | ✅ Habilitado (amarelo) |
| **Instalação concluída** | ✅ Mensagem de sucesso |

---

## 🎯 **TESTE AGORA E REPORTE:**

Depois de seguir este guia, reporte:

1. ✅ **Funcionou perfeitamente?** → Marcar como resolvido!
2. ❌ **Deu erro?** → Copiar CONSOLE COMPLETO (F12) e enviar

---

**Boa sorte! 🚀🎄**
