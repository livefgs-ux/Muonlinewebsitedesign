# 🚀 GUIA RÁPIDO: INSTALADOR WEB

## 📌 **O QUE MUDOU?**

### ✅ **AGORA TEM INSTALADOR WEB!**
- Interface visual completa no navegador
- 4 steps guiados
- Configuração em **5 minutos**
- Zero comandos manuais

---

## 🎯 **PASSO A PASSO COMPLETO**

### **PASSO 1: Iniciar o Backend**

```bash
cd /home/meumu.com/public_html
node check.js
```

Digite: **4** (Deploy - Desenvolvimento)

**Você verá esta tela:**

```
╔══════════════════════════════════════════════════════════╗
║  📋 IMPORTANTE: PRÓXIMOS PASSOS                          ║
╠══════════════════════════════════════════════════════════╣
║  1️⃣  O servidor vai INICIAR e OCUPAR este terminal    ║
║  2️⃣  DEIXE ESTA JANELA ABERTA (servidor rodando)      ║
║  3️⃣  ABRA OUTRO TERMINAL para continuar trabalhando   ║
║                                                       ║
║  🌐 Acesse o INSTALADOR WEB:                           ║
║     http://meumu.com:3001/install                      ║
║     OU: http://SEU-IP:3001/install                     ║
║                                                       ║
║  💡 DICA: Rodando em BACKGROUND                        ║
║     Para NÃO ocupar o terminal, use:                 ║
║     Opção 5 (Deploy Produção - PM2)                  ║
║                                                       ║
║  ⚠️  Para PARAR: Pressione Ctrl+C                      ║
╚══════════════════════════════════════════════════════════╝

Iniciando servidor em modo desenvolvimento...
Porta: 3001
Hot reload: Ativado (nodemon)

[nodemon] starting `node src/server.js`
✅ Servidor rodando na porta 3001
📦 Instalador disponível em /install
```

---

### **PASSO 2: Abrir OUTRO Terminal (ou usar navegador)**

**OPÇÃO A: Continuar no Servidor (SSH)**
```bash
# Pressione Ctrl+Z (pausa temporária)
# OU abra OUTRA aba do PuTTY/terminal

# DEIXE o servidor rodando!
```

**OPÇÃO B: Abrir Navegador (RECOMENDADO)**
```
http://meumu.com:3001/install
```

---

### **PASSO 3: Configurar pelo Navegador**

#### **STEP 1: Database do Servidor MU 📦**

```
┌────────────────────────────────────┐
│ Host do MySQL/MariaDB              │
│ localhost                          │
├────────────────────────────────────┤
│ Porta        │ Usuário             │
│ 3306         │ root                │
├────────────────────────────────────┤
│ Senha                              │
│ ••••••••••                         │
├────────────────────────────────────┤
│ Nome da Database do MU             │
│ MuOnline                           │
└────────────────────────────────────┘

[Testar Conexão]
```

**Após clicar "Testar Conexão":**
```
✅ Conexão bem-sucedida!
Database: MuOnline
Tabelas encontradas: 42
```

**Avança automaticamente para STEP 2**

---

#### **STEP 2: Database do Website 🌐**

```
┌────────────────────────────────────┐
│ Nome da Database do Website        │
│ webmu                              │
├────────────────────────────────────┤
│ ☑ Criar database automaticamente   │
└────────────────────────────────────┘

[Testar & Criar Database]
```

**Após clicar "Testar & Criar":**
```
✅ Sucesso!
Database: webmu
Database criada: Sim
Tabelas: 5 (criadas automaticamente)
```

**Avança automaticamente para STEP 3**

---

#### **STEP 3: Segurança 🔐**

```
┌────────────────────────────────────┐
│ JWT Secret (Chave de Autenticação) │
│ a8f3k9x2m5n7p1q4r6s8t0u2v4w6y8z  │ ← Já gerado!
│ [🎲 Gerar Nova Chave]              │
├────────────────────────────────────┤
│ Domínio do Frontend (Opcional)     │
│ http://meumu.com                   │
└────────────────────────────────────┘

[✅ Finalizar Instalação]
```

**Após clicar "Finalizar":**
```
✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!

📝 Criando arquivo .env...
✅ Arquivo .env criado com sucesso!

📊 Criando tabelas no database WebMU...
  ✓ Tabela web_config
  ✓ Tabela web_news
  ✓ Tabela web_events
  ✓ Tabela web_downloads
  ✓ Tabela web_audit_logs
✅ Todas as tabelas criadas com sucesso!

════════════════════════════════════════
✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!
════════════════════════════════════════
```

**Avança automaticamente para STEP 4**

---

#### **STEP 4: Concluído! 🎉**

```
🎉

Instalação Concluída!

Seu backend está configurado e pronto para uso!

✅ Backend Configurado
   Todas as conexões foram testadas com sucesso

──────────────────────────────────────────

🚀 Próximos Passos:

1️⃣ Reiniciar o Servidor
   Pressione Ctrl+C no terminal e execute:
   node check.js → Opção 4

2️⃣ Acessar a API
   API: http://meumu.com:3001/api

3️⃣ Configurar Frontend (Opcional)
   Edite src/utils/supabase/info.tsx com a URL da API
```

---

### **PASSO 4: Reiniciar Backend**

Volte ao terminal onde o servidor estava rodando:

```bash
# Pressione Ctrl+C
^C

# Reinicie
node check.js

# Digite 4 novamente
# Ou use Opção 5 para rodar em background com PM2!
```

---

## 🔥 **OPÇÃO ALTERNATIVA: RODAR EM BACKGROUND (PM2)**

Se você **NÃO quer ocupar o terminal**, use **PM2**:

```bash
node check.js
# Digite 5 (Deploy Produção - PM2)
```

**Vantagens:**
- ✅ Não ocupa o terminal
- ✅ Reinicia automaticamente se cair
- ✅ Logs salvos
- ✅ Pode fechar SSH sem parar servidor

**Comandos úteis:**
```bash
pm2 logs meumu-backend      # Ver logs em tempo real
pm2 monit                   # Monitorar recursos
pm2 restart meumu-backend   # Reiniciar
pm2 stop meumu-backend      # Parar
```

---

## 📊 **COMPARAÇÃO: ANTES vs DEPOIS**

### **ANTES (Versão 401):**
```bash
# 1. Editar .env manualmente
nano backend-nodejs/.env

# 2. Copiar/colar credenciais
# 3. Salvar
# 4. Conectar MySQL manualmente
mysql -u root -p

# 5. Criar database
CREATE DATABASE webmu;

# 6. Criar tabelas manualmente (SQL)
# 7. Testar conexões
# 8. Rezar para funcionar 🙏

Total: 15-30 minutos + conhecimento técnico
```

### **DEPOIS (Versão ATUAL):**
```bash
# 1. node check.js → Opção 4
# 2. Abrir navegador: http://meumu.com:3001/install
# 3. Clicar 4 vezes (Next, Next, Next, Finish)

Total: 5 minutos + ZERO conhecimento técnico
```

---

## ❓ **PERGUNTAS FREQUENTES**

### **1. "O servidor ocupa meu terminal, o que faço?"**

**SOLUÇÃO 1:** Abra outro terminal
```bash
# No Linux/Mac:
Ctrl+Shift+T (nova aba)

# No Windows (PuTTY):
Abrir nova sessão
```

**SOLUÇÃO 2:** Use PM2 (Opção 5)
```bash
node check.js
# Digite 5
# Servidor roda em background!
```

---

### **2. "Erro 404 ao acessar /install"**

**CAUSA:** Servidor não está rodando!

**SOLUÇÃO:**
```bash
# Verificar se servidor está rodando:
curl http://localhost:3001/health

# Se não responder:
node check.js
# Digite 4 ou 5
```

---

### **3. "Não consigo acessar http://meumu.com:3001/install"**

**POSSÍVEIS CAUSAS:**
1. ❌ Servidor não está rodando
2. ❌ Porta 3001 bloqueada no firewall
3. ❌ Domínio não aponta para o servidor

**SOLUÇÕES:**

**Solução 1:** Usar IP direto
```bash
# Descobrir seu IP:
curl ifconfig.me

# Acessar:
http://SEU-IP:3001/install
```

**Solução 2:** Abrir porta no firewall
```bash
# CyberPanel/OpenLiteSpeed:
sudo firewall-cmd --add-port=3001/tcp --permanent
sudo firewall-cmd --reload

# UFW (Ubuntu):
sudo ufw allow 3001/tcp
```

**Solução 3:** Acessar localmente no servidor
```bash
# SSH no servidor:
curl http://localhost:3001/install

# Ou usar w3m (navegador texto):
w3m http://localhost:3001/install
```

---

### **4. "Erro ao conectar no MySQL"**

**POSSÍVEIS CAUSAS:**
1. ❌ Senha incorreta
2. ❌ MySQL não está rodando
3. ❌ Database não existe

**SOLUÇÕES:**

**Verificar se MySQL está rodando:**
```bash
sudo systemctl status mysql
# OU
sudo systemctl status mariadb
```

**Testar credenciais:**
```bash
mysql -u root -p
# Digite a senha
# Se conectar: credenciais OK!
```

**Ver databases existentes:**
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

---

### **5. "Depois de finalizar, o que faço?"**

**1. Reiniciar o servidor:**
```bash
# No terminal onde o servidor está rodando:
Ctrl+C

# Reiniciar:
node check.js
# Opção 4 ou 5
```

**2. Testar API:**
```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"healthy"}
```

**3. Testar endpoint:**
```bash
curl http://localhost:3001/api/server/status
# Deve retornar JSON com status do servidor
```

---

## 🎯 **RESUMO ULTRARRÁPIDO**

```bash
# TERMINAL 1: Iniciar backend
node check.js → 4

# NAVEGADOR: Configurar
http://meumu.com:3001/install
→ Next → Next → Next → Finish

# TERMINAL 1: Reiniciar
Ctrl+C
node check.js → 4 ou 5

# PRONTO! 🎉
```

---

## 🆘 **SUPORTE**

Se ainda tiver problemas:

1. Execute diagnóstico completo:
```bash
node check.js
# Opção 7 (Executar Tudo)
```

2. Verifique logs:
```bash
tail -f backend-nodejs/logs/security/security.log
```

3. Teste manualmente:
```bash
cd backend-nodejs
npm install
npm run dev
```

---

**Última atualização:** 24/12/2024
**Versão do instalador:** 1.0.0
