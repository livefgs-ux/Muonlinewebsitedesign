# 🚀 Instalação Automática - MeuMU Online

## 📋 O QUE ESTE SISTEMA FAZ

Este é um sistema profissional de deploy automático via GitHub que:

✅ **Limpa completamente** o diretório de instalação  
✅ **Remove arquivos ocultos** e força limpeza total  
✅ **Clona** a versão mais recente do GitHub  
✅ **Preserva** o arquivo `.env` com senhas entre atualizações  
✅ **Instala** dependências automaticamente  
✅ **Builda** o frontend React  
✅ **Reinicia** o backend via PM2  
✅ **Gera logs completos** de toda instalação  
✅ **Mostra erros detalhados** para debug rápido  

---

## 🎯 INSTALAÇÃO INICIAL (PRIMEIRA VEZ)

### 1️⃣ Configurar Repositório GitHub

**No Figma Make:**
1. Baixe o projeto completo (botão Download)
2. Extraia o ZIP em uma pasta local

**No Terminal (sua máquina local):**
```bash
cd /caminho/para/pasta/extraida

# Inicializar Git
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "Initial commit - MeuMU Online"

# Conectar ao GitHub (SUBSTITUA SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/meumu-website.git

# Enviar
git branch -M main
git push -u origin main
```

---

### 2️⃣ Configurar Script no Servidor

**No servidor VPS via SSH:**

```bash
cd /home/meumu.com

# Baixar script de instalação
curl -o instalacao.sh https://raw.githubusercontent.com/SEU-USUARIO/meumu-website/main/instalacao.sh

# OU se não tiver curl:
wget https://raw.githubusercontent.com/SEU-USUARIO/meumu-website/main/instalacao.sh

# Dar permissão de execução
chmod +x instalacao.sh

# Editar para configurar sua URL do GitHub
nano instalacao.sh
```

**Dentro do nano, altere a linha 16:**

```bash
# DE:
GITHUB_REPO="https://github.com/SEU-USUARIO/meumu-website.git"

# PARA:
GITHUB_REPO="https://github.com/seu-usuario-real/meumu-website.git"
```

Salve com `Ctrl+O`, `Enter`, `Ctrl+X`

---

### 3️⃣ Executar Instalação

```bash
cd /home/meumu.com
./instalacao.sh
```

**O script irá:**
- ✅ Limpar tudo (incluindo arquivos ocultos)
- ✅ Clonar do GitHub
- ✅ Instalar dependências
- ✅ Buildar frontend
- ✅ Iniciar backend
- ✅ Gerar log completo

---

## 🔄 ATUALIZAR O SITE (APÓS MUDANÇAS)

### Workflow Completo:

#### 1. **No Figma Make** - Fazer alterações
- Edite componentes, styles, etc
- Baixe o projeto atualizado

#### 2. **No seu computador** - Commitar no GitHub
```bash
cd /caminho/para/pasta/do/projeto

# Substituir arquivos com versão nova do Figma Make
# (copie e cole por cima dos arquivos antigos)

# Ver o que mudou
git status

# Adicionar tudo
git add .

# Commitar
git commit -m "Descrição do que mudou"

# Enviar para GitHub
git push
```

#### 3. **No servidor** - Atualizar site
```bash
cd /home/meumu.com
./instalacao.sh
```

**PRONTO!** Em 2-3 minutos o site está atualizado! 🎉

---

## 📋 LOGS E DEBUG

### Ver log da última instalação:
```bash
ls -lt /home/meumu.com/logs/ | head -5
cat /home/meumu.com/logs/instalacao_TIMESTAMP.log
```

### Ver logs do backend em tempo real:
```bash
pm2 logs meumu-backend
```

### Ver status do PM2:
```bash
pm2 status
```

### Reiniciar backend manualmente:
```bash
pm2 restart meumu-backend
```

---

## ❌ SE DER ERRO

### O script mostrará automaticamente:
1. ❌ **Mensagem de erro clara**
2. 📋 **Linha exata onde falhou**
3. 📄 **Últimas 30 linhas do log**
4. 📁 **Caminho completo do log**

### Como resolver:
1. **Copie TODO o erro** que apareceu
2. **Copie as últimas 30 linhas** do log
3. **Cole no Figma Make**
4. Eu vou **corrigir e gerar novo script**

---

## 🔒 SEGURANÇA

### ⚠️ NUNCA COMMITE NO GIT:
- ❌ Arquivo `.env` (contém senhas!)
- ❌ Pasta `node_modules/`
- ❌ Pasta `logs/` (pode ter info sensível)
- ❌ Arquivos `.sql` (backups de banco)

### ✅ SEMPRE COMMITE:
- ✅ `.env.example` (exemplo sem senhas)
- ✅ `package.json`
- ✅ Código fonte
- ✅ `instalacao.sh`
- ✅ Documentação

**O `.gitignore` já está configurado para proteger arquivos sensíveis!**

---

## 📁 ESTRUTURA DO PROJETO

```
/home/meumu.com/
├── instalacao.sh              # Script de instalação automática
├── logs/                      # Logs de cada instalação
│   ├── instalacao_20240101_120000.log
│   └── instalacao_20240102_140000.log
└── public_html/               # Site (clonado do GitHub)
    ├── src/                   # Código React
    ├── backend-nodejs/        # Backend Node.js
    │   ├── .env              # ⚠️ NÃO COMMITAR!
    │   └── src/
    ├── package.json
    ├── .env.example          # ✅ Commitar
    └── .gitignore            # ✅ Commitar
```

---

## 🆘 COMANDOS ÚTEIS

### Forçar limpeza total manual:
```bash
cd /home/meumu.com
pm2 stop meumu-backend
rm -rf public_html
./instalacao.sh
```

### Ver espaço em disco:
```bash
df -h
du -sh /home/meumu.com/*
```

### Ver processos Node.js:
```bash
ps aux | grep node
```

### Matar todos processos Node.js (CUIDADO!):
```bash
pkill -9 node
pm2 resurrect
```

---

## 🎮 FLUXO DE TRABALHO IDEAL

```
┌─────────────────────────────────────────────────────┐
│  1. DESENVOLVER NO FIGMA MAKE                       │
│     ↓                                               │
│  2. BAIXAR PROJETO ATUALIZADO                       │
│     ↓                                               │
│  3. SUBSTITUIR ARQUIVOS LOCAIS                      │
│     ↓                                               │
│  4. git add . && git commit -m "..." && git push   │
│     ↓                                               │
│  5. SSH NO SERVIDOR: ./instalacao.sh               │
│     ↓                                               │
│  6. SITE ATUALIZADO! 🚀                             │
└─────────────────────────────────────────────────────┘
```

**Tempo total: ~3 minutos!** ⚡

---

## 📞 SUPORTE

Se tiver problemas:

1. ✅ Veja o log completo: `cat /home/meumu.com/logs/instalacao_*.log`
2. ✅ Copie o erro completo
3. ✅ Cole no chat do Figma Make
4. ✅ Eu corrijo e gero novo script!

---

**Boa sorte com seu servidor MU Online! 🎮🚀**
