# 📖 LEIA PRIMEIRO - Instalação do MeuMU Online

**Data**: 20/12/2024  
**Versão**: 1.0.0 (Test Install 1)  

---

## 🎯 BEM-VINDO!

Parabéns por escolher o **MeuMU Online** para o seu servidor privado!

Este pacote contém **tudo que você precisa** para ter um site profissional funcionando em menos de 30 minutos.

---

## ⚡ INSTALAÇÃO RÁPIDA (Para Experientes)

```bash
# 1. Instalar
npm install

# 2. Configurar
cp .env.example .env
nano .env  # Adicione suas credenciais

# 3. Banco de dados
mysql -u root -p MuOnline < database-scripts/02_criar_tabela_news.sql

# 4. Testar
npm run dev

# 5. Build
npm run build
```

**Funciona?** ✅ Pule para o [Deploy](#deploy-rápido)  
**Não funciona?** ⏩ Continue lendo

---

## 📋 ORDEM DE LEITURA (Para Iniciantes)

Se é sua primeira vez instalando um site Node.js/React, **siga esta ordem**:

### 1️⃣ **Requisitos** (5 min)
```
📖 Leia: 01_REQUISITOS.md
```
Verifique se você tem tudo instalado:
- Node.js 18+
- MySQL/MariaDB
- Conta Supabase (gratuita)

### 2️⃣ **Instalação** (15 min)
```
📖 Leia: 02_INSTALACAO_PASSO_A_PASSO.md
```
Tutorial completo com prints e explicações.

### 3️⃣ **Banco de Dados** (10 min)
```
📖 Leia: 03_CONFIGURACAO_BANCO.md
```
Como criar tabelas e configurar usuário admin.

### 4️⃣ **Supabase** (10 min)
```
📖 Leia: 04_CONFIGURACAO_SUPABASE.md
```
Como criar projeto e fazer deploy do backend.

### 5️⃣ **Deploy** (15 min)
```
📖 Leia: 05_DEPLOY_PRODUCAO.md
```
Como colocar o site online (Vercel, Netlify, etc).

### 6️⃣ **Problemas?**
```
📖 Leia: 06_TROUBLESHOOTING.md
```
Soluções para os problemas mais comuns.

---

## 🔍 CHECKLIST PRÉ-INSTALAÇÃO

Antes de começar, certifique-se:

### ✅ Software Instalado
```
[ ] Node.js 18.0 ou superior
[ ] npm ou yarn
[ ] MySQL 5.7+ ou MariaDB 10.4+
[ ] Git (opcional, mas recomendado)
[ ] Editor de código (VSCode recomendado)
```

### ✅ Acesso aos Dados
```
[ ] Host do MySQL (geralmente localhost)
[ ] Usuário do MySQL (geralmente root ou sa)
[ ] Senha do MySQL
[ ] Nome do banco do MU (geralmente MuOnline)
[ ] Conta Supabase criada (gratuita)
```

### ✅ Servidor MU Online
```
[ ] Servidor MU funcionando
[ ] Banco de dados com tabelas:
    - MEMB_INFO
    - Character
    - MEMB_STAT
    - Guild
```

---

## 🎯 O QUE ESTE SITE FAZ

### Frontend (O que os jogadores veem)
```
✅ Página inicial com informações do servidor
✅ Sistema de cadastro e login
✅ Rankings em tempo real (Resets, PK, Guilds)
✅ Notícias e atualizações
✅ Downloads do cliente
✅ Área do jogador (dashboard)
✅ Sistema multilíngue (8 idiomas)
```

### Backend (O que você gerencia)
```
✅ Painel administrativo (AdminCP)
✅ Gerenciamento de contas
✅ Gerenciamento de personagens
✅ Sistema de notícias
✅ Logs de atividade
✅ Estatísticas em tempo real
✅ API REST conectada ao banco do MU
```

---

## 🏗️ ARQUITETURA DO SISTEMA

```
┌─────────────────┐
│   Jogadores     │ (Navegador)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Frontend      │ (React + Vite)
│   /src/         │ → Hospedado no Vercel/Netlify
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend       │ (Supabase Edge Functions)
│   /supabase/    │ → Hospedado no Supabase
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Banco MySQL    │ (MU Online Database)
│  Seu servidor   │ → Seu servidor local/VPS
└─────────────────┘
```

---

## 📊 TEMPO ESTIMADO

### Primeira Instalação
```
👨‍💻 Experiente:   30 minutos
👨‍🎓 Intermediário: 1 hora
🆕 Iniciante:     2-3 horas
```

### Reinstalação
```
⚡ 10 minutos (já sabe como funciona)
```

---

## 🔒 SEGURANÇA - IMPORTANTE!

### ⚠️ NUNCA FAÇA ISSO:
```
❌ Commit do arquivo .env no GitHub
❌ Usar senha padrão (123456, admin, etc)
❌ Deixar o site sem HTTPS em produção
❌ Compartilhar suas chaves de API
❌ Pular o backup do banco de dados
```

### ✅ SEMPRE FAÇA ISSO:
```
✅ Use senhas fortes
✅ Faça backup do banco antes de instalar
✅ Teste em ambiente local primeiro
✅ Use HTTPS em produção
✅ Mantenha dependências atualizadas
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
Site Ready to Install/
│
├── 📖 Documentação/
│   ├── 00_LEIA_PRIMEIRO.md             ← Você está aqui
│   ├── 01_REQUISITOS.md
│   ├── 02_INSTALACAO_PASSO_A_PASSO.md
│   ├── 03_CONFIGURACAO_BANCO.md
│   ├── 04_CONFIGURACAO_SUPABASE.md
│   ├── 05_DEPLOY_PRODUCAO.md
│   ├── 06_TROUBLESHOOTING.md
│   └── 07_MANUTENCAO.md
│
├── 📜 database-scripts/
│   ├── 01_verificar_tabelas.sql        ← Verificar se banco está OK
│   ├── 02_criar_tabela_news.sql        ← Criar tabela de notícias
│   ├── 03_criar_admin.sql              ← Criar usuário admin
│   └── 04_indices_otimizacao.sql       ← Otimizar performance
│
├── 🗂️ src/                              ← Código fonte do site
├── 🗂️ supabase/                         ← Backend (API)
├── ⚙️ package.json                      ← Dependências
├── ⚙️ .env.example                      ← Template de configuração
└── 📝 README.md                         ← Visão geral
```

---

## 🚨 PROBLEMAS COMUNS

### "npm: command not found"
**Solução**: Instale o Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Baixe em: https://nodejs.org/
```

### "ERROR 1045: Access denied for user"
**Solução**: Credenciais do MySQL incorretas
```bash
# Teste sua conexão primeiro
mysql -u root -p
# Se funcionar, use essas credenciais no .env
```

### "Cannot find module"
**Solução**: Dependências não instaladas
```bash
npm install
```

### "Port 5173 already in use"
**Solução**: Outra aplicação usando a porta
```bash
# Pare a outra aplicação ou mude a porta
npm run dev -- --port 3000
```

---

## 💡 DICAS IMPORTANTES

### 1. **Backup é Essencial**
```bash
# Backup do banco ANTES de qualquer instalação
mysqldump -u root -p MuOnline > backup_$(date +%Y%m%d).sql
```

### 2. **Teste Local Primeiro**
```
NUNCA instale direto em produção.
Sempre teste em localhost primeiro!
```

### 3. **Use Git**
```bash
# Controle de versão é seu amigo
git init
git add .
git commit -m "Instalação inicial"
```

### 4. **Documente Suas Mudanças**
```
Se você modificar algo, anote!
Vai te salvar depois.
```

### 5. **Comunidade**
```
Problemas? Pesquise no Google/ChatGPT primeiro.
90% das dúvidas já foram resolvidas por alguém.
```

---

## 🎓 CONHECIMENTOS RECOMENDADOS

### Essenciais (Obrigatório)
```
✅ Saber usar terminal/CMD
✅ Entender conceitos de banco de dados
✅ Saber editar arquivos de texto
```

### Úteis (Recomendado)
```
⭐ Básico de MySQL
⭐ Básico de Node.js
⭐ Conceitos de API REST
```

### Avançado (Opcional)
```
🚀 React/TypeScript
🚀 Supabase/Serverless
🚀 DevOps/Deploy
```

**Não tem experiência?** Não tem problema! Os tutoriais explicam tudo passo a passo.

---

## 📞 PRECISA DE AJUDA?

### Durante a Instalação
```
1. Leia o arquivo de troubleshooting (06_TROUBLESHOOTING.md)
2. Procure o erro no Google
3. Verifique se seguiu todos os passos
4. Consulte a documentação do Supabase/MySQL
```

### Erros de Código
```
1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase
3. Verifique se as variáveis de ambiente estão corretas
```

### Dúvidas Gerais
```
1. Releia a documentação
2. Verifique os exemplos
3. Teste passo a passo
```

---

## 🎯 PRÓXIMO PASSO

**Tudo pronto para começar?**

➡️ **Vá para**: `01_REQUISITOS.md`

Lá você vai verificar se tem tudo necessário para instalar o site.

---

## ✅ CHECKLIST FINAL

Antes de continuar, confirme:

```
[ ] Li este documento completamente
[ ] Entendi a arquitetura do sistema
[ ] Tenho todos os requisitos
[ ] Fiz backup do banco de dados
[ ] Estou pronto para começar!
```

---

## 🎉 BOA SORTE!

Você está prestes a ter um site **profissional** para o seu servidor de MU Online!

**Tempo estimado**: 30 min a 2 horas  
**Dificuldade**: ⭐⭐⭐☆☆ (Média)  
**Resultado**: 🎮🔥💯 (Épico!)

---

**Vamos começar?** ➡️ `01_REQUISITOS.md`

---

**MeuMU Online - Season 19-2-3 Épico** ⚔️  
**Data**: 20/12/2024
