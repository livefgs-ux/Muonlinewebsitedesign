# 📋 REQUISITOS DO SISTEMA - MeuMU Online

**Data**: 20/12/2024  
**Versão**: 1.0.0  

---

## 🎯 OBJETIVO

Este documento lista **todos os requisitos** necessários para instalar e executar o site MeuMU Online.

---

## 💻 REQUISITOS DE SOFTWARE

### 1. **Node.js** (Obrigatório)

**Versão**: 18.0 ou superior (LTS recomendado)

#### Como Verificar
```bash
node --version
# Deve mostrar: v18.x.x ou superior
```

#### Como Instalar

**Ubuntu/Debian**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL**:
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

**Windows**:
1. Baixe em: https://nodejs.org/
2. Execute o instalador
3. Marque "Add to PATH"

**MacOS**:
```bash
brew install node@18
```

---

### 2. **npm ou yarn** (Obrigatório)

**Versão**: npm 9.0+ ou yarn 1.22+

#### Como Verificar
```bash
npm --version
# Deve mostrar: 9.x.x ou superior
```

**Já vem com Node.js!** Não precisa instalar separadamente.

---

### 3. **MySQL ou MariaDB** (Obrigatório)

**Versão**: MySQL 5.7+ ou MariaDB 10.4+

#### Como Verificar
```bash
mysql --version
# Deve mostrar: mysql Ver 5.7+ ou 10.4+ (MariaDB)
```

#### Como Instalar

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Windows**:
- MySQL: https://dev.mysql.com/downloads/installer/
- MariaDB: https://mariadb.org/download/

**Já tem MU Online?** ✅ Você já tem MySQL instalado!

---

### 4. **Git** (Recomendado)

**Versão**: Qualquer versão recente

#### Como Verificar
```bash
git --version
```

#### Como Instalar
```bash
# Ubuntu/Debian
sudo apt install git

# Windows
# Baixe em: https://git-scm.com/download/win

# MacOS
brew install git
```

**Não é obrigatório**, mas facilita atualizações futuras.

---

### 5. **Editor de Código** (Recomendado)

Escolha um:
- **VSCode** (Recomendado): https://code.visualstudio.com/
- Sublime Text
- Atom
- Notepad++ (Windows)
- Nano/Vim (Linux)

---

## ☁️ REQUISITOS DE SERVIÇOS ONLINE

### 1. **Conta Supabase** (Obrigatório)

**Custo**: Gratuito (plano free é suficiente)  
**Link**: https://supabase.com/

#### O que é?
Backend-as-a-Service que hospeda as Edge Functions (API).

#### Limites do Plano Free
```
✅ 500MB Database
✅ 5GB Bandwidth
✅ 50MB File Storage
✅ 2GB Edge Functions invocations/month
```

**É suficiente?** ✅ Sim! Para até 1000 jogadores simultâneos.

#### Como Criar Conta
1. Acesse https://supabase.com/
2. Clique em "Start your project"
3. Use GitHub, Google ou Email
4. Pronto! ✅

---

### 2. **Serviço de Deploy** (Recomendado)

Escolha um para hospedar o frontend:

#### **Opção A: Vercel** (Recomendado)
```
✅ Gratuito
✅ Deploy automático
✅ SSL grátis
✅ CDN global
```
**Link**: https://vercel.com/

#### **Opção B: Netlify**
```
✅ Gratuito
✅ Deploy fácil
✅ SSL grátis
```
**Link**: https://netlify.com/

#### **Opção C: Servidor Próprio**
```
✅ Controle total
❌ Precisa configurar Nginx/Apache
❌ Precisa gerenciar SSL
```

---

## 🖥️ REQUISITOS DE HARDWARE

### Desenvolvimento (Local)
```
CPU:  Dual-core 2.0 GHz
RAM:  4GB mínimo, 8GB recomendado
Disk: 10GB livres
OS:   Windows 10+, Ubuntu 20.04+, MacOS 10.15+
```

### Produção (Servidor)
```
CPU:  2 cores mínimo, 4 cores recomendado
RAM:  2GB mínimo, 4GB recomendado
Disk: 20GB livres
OS:   Ubuntu 20.04+, Windows Server 2019+
```

**Já tem servidor de MU?** ✅ Pode usar o mesmo!

---

## 🗄️ REQUISITOS DE BANCO DE DADOS

### Tabelas Existentes (MU Online)
```
✅ MEMB_INFO        → Contas de usuários
✅ Character        → Personagens
✅ MEMB_STAT        → Status online
✅ Guild            → Guilds
```

**Verificar se existem**:
```sql
USE MuOnline;
SHOW TABLES LIKE 'MEMB_INFO';
SHOW TABLES LIKE 'Character';
SHOW TABLES LIKE 'Guild';
```

### Tabelas Novas (Você vai criar)
```
❗ News             → Sistema de notícias
```

**Script fornecido**: `database-scripts/02_criar_tabela_news.sql`

---

## 🔐 REQUISITOS DE ACESSO

### MySQL/MariaDB
```
✅ Host (geralmente: localhost ou 127.0.0.1)
✅ Porta (geralmente: 3306)
✅ Usuário (geralmente: root ou sa)
✅ Senha
✅ Nome do banco (geralmente: MuOnline)
```

#### Como Testar Conexão
```bash
mysql -h localhost -u root -p
# Digite a senha
# Se conectar = ✅ OK
```

### Servidor MU Online
```
✅ Servidor funcionando
✅ Pelo menos 1 conta criada
✅ Pelo menos 1 personagem criado
✅ Tabelas do banco populadas
```

---

## 🌐 REQUISITOS DE REDE

### Desenvolvimento (Local)
```
✅ Acesso à internet (para npm install)
✅ Portas livres: 5173 (frontend), 3000 (opcional)
```

### Produção
```
✅ Domínio próprio (recomendado)
✅ SSL/HTTPS (obrigatório em produção)
✅ Porta 80 (HTTP) e 443 (HTTPS) abertas
✅ Firewall configurado
```

---

## 📊 CHECKLIST DE REQUISITOS

### ✅ Software
```
[ ] Node.js 18.0+ instalado
[ ] npm 9.0+ instalado
[ ] MySQL 5.7+ ou MariaDB 10.4+ instalado
[ ] Git instalado (opcional)
[ ] Editor de código instalado
```

### ✅ Serviços Online
```
[ ] Conta Supabase criada
[ ] Projeto Supabase criado
[ ] Conta Vercel/Netlify criada (para deploy)
```

### ✅ Banco de Dados
```
[ ] Servidor MU Online funcionando
[ ] Tabelas MEMB_INFO, Character, Guild existem
[ ] Consigo conectar no MySQL
[ ] Tenho credenciais (host, user, password, database)
```

### ✅ Conhecimento
```
[ ] Sei usar terminal/CMD
[ ] Sei editar arquivos de texto
[ ] Entendo conceitos básicos de banco de dados
```

---

## 🧪 TESTE RÁPIDO DE AMBIENTE

Execute estes comandos para verificar tudo:

```bash
# 1. Node.js
node --version
# Esperado: v18.x.x ou superior

# 2. npm
npm --version
# Esperado: 9.x.x ou superior

# 3. MySQL
mysql --version
# Esperado: mysql Ver 5.7+ ou 10.4+

# 4. Git (opcional)
git --version
# Esperado: git version x.x.x

# 5. Conexão MySQL
mysql -h localhost -u root -p
# Esperado: Conectar com sucesso

# 6. Verificar tabelas
mysql -u root -p -e "USE MuOnline; SHOW TABLES;"
# Esperado: Lista de tabelas incluindo MEMB_INFO, Character, Guild
```

**Todos funcionaram?** ✅ Você está pronto!  
**Algum falhou?** ❌ Instale/corrija antes de continuar

---

## 💾 ESPAÇO EM DISCO

### Desenvolvimento
```
Node modules:     ~500MB
Código fonte:     ~50MB
Build cache:      ~100MB
Total:            ~650MB
```

### Produção (Build)
```
Frontend build:   ~10MB
Backend:          ~5MB (hospedado no Supabase)
Total:            ~15MB
```

**Muito leve!** 🎉

---

## 🌍 REQUISITOS DE NAVEGADOR (Jogadores)

O site funciona em:

```
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Opera 76+
```

**Mobile**:
```
✅ Chrome Mobile (Android)
✅ Safari Mobile (iOS)
```

**Não funciona**:
```
❌ Internet Explorer
❌ Navegadores muito antigos
```

---

## 🔒 REQUISITOS DE SEGURANÇA

### Desenvolvimento
```
✅ Firewall ativo
✅ Antivírus ativo
✅ Sistema operacional atualizado
```

### Produção
```
✅ SSL/HTTPS configurado
✅ Firewall configurado
✅ Senhas fortes
✅ Backup automático do banco
✅ Logs de acesso ativos
```

---

## 📦 RESUMO DOS REQUISITOS

| Item | Obrigatório | Versão Mínima | Gratuito |
|------|-------------|---------------|----------|
| Node.js | ✅ Sim | 18.0 | ✅ Sim |
| npm | ✅ Sim | 9.0 | ✅ Sim |
| MySQL/MariaDB | ✅ Sim | 5.7/10.4 | ✅ Sim |
| Supabase | ✅ Sim | - | ✅ Sim |
| Git | ⭐ Recomendado | Qualquer | ✅ Sim |
| Vercel/Netlify | ⭐ Recomendado | - | ✅ Sim |
| Editor código | ⭐ Recomendado | - | ✅ Sim |
| Domínio próprio | ❌ Opcional | - | ❌ Não |

---

## 🎓 CONHECIMENTOS NECESSÁRIOS

### Obrigatórios
```
✅ Usar terminal/CMD (comandos básicos)
✅ Editar arquivos de texto
✅ Copiar e colar (sério!)
```

### Recomendados
```
⭐ Conceitos de banco de dados
⭐ Saber reiniciar serviços
⭐ Entender variáveis de ambiente
```

### Não Necessários
```
❌ Programação avançada
❌ React/TypeScript
❌ DevOps
```

**Iniciante?** Não se preocupe! Os tutoriais explicam tudo.

---

## ✅ PRÓXIMO PASSO

**Tem todos os requisitos?**

➡️ **Vá para**: `02_INSTALACAO_PASSO_A_PASSO.md`

**Falta algo?**

⬅️ **Volte e instale** os requisitos que faltam.

---

## 📞 PROBLEMAS COM REQUISITOS?

### "Não consigo instalar Node.js"
- Windows: Desabilite temporariamente o antivírus
- Linux: Use `sudo` nos comandos
- Mac: Instale via Homebrew

### "MySQL não conecta"
```bash
# Verificar se está rodando
sudo systemctl status mysql    # Linux
net start mysql                # Windows

# Resetar senha root (se esqueceu)
sudo mysql_secure_installation
```

### "Não tenho cartão de crédito para Supabase"
**Não precisa!** O plano free não requer cartão.

---

**Tudo pronto?** ✅ Vamos para a instalação! ➡️

---

**MeuMU Online - Season 19-2-3 Épico** ⚔️  
**Data**: 20/12/2024
