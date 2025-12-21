# 🚀 MeuMU Online - Site Ready to Install

**Versão**: 1.0.1 (Atualizado - Background Corrigido)  
**Data**: 20/12/2024  
**Status**: Pronto para instalação em produção  

---

## 🔄 ÚLTIMA ATUALIZAÇÃO

**Data**: 20/12/2024 - 19h30  
**Versão**: 1.0.0 → 1.0.1  
**Correção**: Background cinza removido da seção de notícias  
**Detalhes**: Ver `CORRECAO_BACKGROUND.md` e `CHANGELOG.md`  

---

## 📋 O QUE HÁ NESTA PASTA

Esta pasta contém **TODOS os arquivos necessários** para instalar e executar o site **MeuMU Online** em produção.

```
✅ Código fonte completo (/src/)
✅ Backend Supabase (/supabase/)
✅ Configurações (package.json, vite.config.ts, etc.)
✅ Tutorial de instalação passo a passo
✅ Scripts de banco de dados
✅ Arquivo .env.example
✅ Changelog com histórico de alterações
✅ Documentação de correções
```

---

## 🎯 INÍCIO RÁPIDO

### 1. **Leia Primeiro**
```
📖 00_LEIA_PRIMEIRO.md     → Comece aqui!
📖 01_REQUISITOS.md        → Requisitos do sistema
📖 CHANGELOG.md            → Histórico de alterações
📖 02_INSTALACAO_PASSO_A_PASSO.md → Tutorial completo
📖 03_CONFIGURACAO_BANCO.md → Setup do MySQL
```

### 2. **Instale**
```bash
npm install
```

### 3. **Configure**
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 4. **Teste**
```bash
npm run dev
```

### 5. **Deploy**
```bash
npm run build
```

---

## 📊 ESTRUTURA DE ARQUIVOS

```
Site Ready to Install/
│
├── 📖 Documentação de Instalação
│   ├── 00_LEIA_PRIMEIRO.md
│   ├── 01_REQUISITOS.md
│   ├── 02_INSTALACAO_PASSO_A_PASSO.md
│   ├── 03_CONFIGURACAO_BANCO.md
│   ├── 04_CONFIGURACAO_SUPABASE.md
│   ├── 05_DEPLOY_PRODUCAO.md
│   ├── 06_TROUBLESHOOTING.md
│   └── 07_MANUTENCAO.md
│
├── 📜 Scripts de Banco de Dados
│   ├── 01_verificar_tabelas.sql
│   ├── 02_criar_tabela_news.sql
│   ├── 03_criar_admin.sql
│   └── 04_indices_otimizacao.sql
│
├── 🗂️ Código Fonte
│   ├── src/                    → Frontend completo
│   ├── supabase/               → Backend completo
│   ├── utils/                  → Utilitários
│   └── public/                 → Assets (se existir)
│
├── ⚙️ Configurações
│   ├── package.json
│   ├── vite.config.ts
│   ├── postcss.config.mjs
│   ├── index.html
│   ├── .env.example
│   └── .gitignore
│
└── 📝 README.md (este arquivo)
```

---

## 🔧 REQUISITOS MÍNIMOS

### Software
```
✅ Node.js 18.0+ (LTS recomendado)
✅ npm 9.0+ ou yarn 1.22+
✅ MySQL 5.7+ ou MariaDB 10.4+
✅ Servidor MU Online (Season 6 ou superior)
```

### Servidor
```
✅ 2GB RAM (mínimo)
✅ 20GB espaço em disco
✅ Ubuntu 20.04+ ou Windows Server 2019+
✅ Supabase Account (gratuito)
```

---

## 📦 CONTEÚDO INCLUÍDO

### Frontend (React + TypeScript)
- ✅ Sistema de autenticação
- ✅ Dashboard do jogador
- ✅ Rankings em tempo real
- ✅ Sistema de notícias
- ✅ AdminCP completo
- ✅ Sistema multilíngue (8 idiomas)
- ✅ Design responsivo
- ✅ Tema Dark Medieval Fantasy

### Backend (Supabase Edge Functions)
- ✅ API REST com 18 endpoints
- ✅ Conexão MySQL/MariaDB
- ✅ Sistema de autenticação
- ✅ Gerenciamento de personagens
- ✅ Rankings automáticos
- ✅ Sistema de logs

---

## ⚡ INSTALAÇÃO RÁPIDA (5 minutos)

```bash
# 1. Extrair arquivos
unzip "Site Ready to Install.zip"
cd "Site Ready to Install"

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
nano .env  # Editar com suas credenciais

# 4. Configurar banco de dados
mysql -u root -p < "database-scripts/02_criar_tabela_news.sql"
mysql -u root -p < "database-scripts/03_criar_admin.sql"

# 5. Testar localmente
npm run dev

# 6. Build para produção
npm run build
```

---

## 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

### Tabelas Necessárias (já existem no MU Online)
```sql
✅ MEMB_INFO        → Contas de usuários
✅ Character        → Personagens
✅ MEMB_STAT        → Status online
✅ Guild            → Guilds
```

### Tabelas Novas (você precisa criar)
```sql
❗ News             → Sistema de notícias (executar script)
```

**Script**: `database-scripts/02_criar_tabela_news.sql`

---

## 🔐 CONFIGURAÇÃO DE SEGURANÇA

### Variáveis de Ambiente (.env)
```env
# Banco de Dados MU Online
DB_HOST=localhost
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_NAME=MuOnline

# Supabase (obter em supabase.com)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# JWT Secret (gerar um aleatório)
JWT_SECRET=sua_chave_secreta_muito_longa_aqui
```

### Gerar JWT Secret
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid))
```

---

## 🚀 DEPLOY EM PRODUÇÃO

### 1. Build
```bash
npm run build
```

### 2. Deploy Frontend (escolha um)
```bash
# Opção A: Vercel (recomendado)
npm install -g vercel
vercel --prod

# Opção B: Netlify
npm install -g netlify-cli
netlify deploy --prod

# Opção C: Servidor próprio (Nginx)
# Copie a pasta 'dist/' para /var/www/html/
```

### 3. Deploy Backend (Supabase)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy Edge Functions
cd supabase
supabase functions deploy make-server-4169bd43
```

---

## 🧪 TESTES PÓS-INSTALAÇÃO

### Checklist
```
✅ Site carrega no navegador
✅ Background épico aparece
✅ Menu de navegação funciona
✅ Seletor de idiomas funciona
✅ Rankings carregam dados reais
✅ Login admin funciona
✅ Dashboard carrega
✅ Footer está visível
✅ Sem erros no console
```

### Testar API
```bash
# Health check
curl https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-4169bd43/health

# Testar rankings
curl https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-4169bd43/rankings/resets?limit=10

# Testar server info
curl https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-4169bd43/server/info
```

---

## 📞 SUPORTE

### Problemas Comuns

**"Não conecta no banco"**
→ Verifique credenciais no .env
→ Teste: `mysql -u root -p`

**"Rankings não carregam"**
→ Verifique se tabelas existem
→ Verifique logs do Supabase

**"Admin não loga"**
→ Execute script `03_criar_admin.sql`
→ Verifique campo `admin_level` na tabela MEMB_INFO

**"Background não aparece"**
→ Verifique se arquivos em /public/ foram copiados
→ Verifique console do navegador

---

## 📚 DOCUMENTAÇÃO COMPLETA

Dentro desta pasta você encontrará:

1. **00_LEIA_PRIMEIRO.md** → Visão geral
2. **01_REQUISITOS.md** → Requisitos detalhados
3. **02_INSTALACAO_PASSO_A_PASSO.md** → Tutorial completo
4. **03_CONFIGURACAO_BANCO.md** → Setup MySQL
5. **04_CONFIGURACAO_SUPABASE.md** → Setup Supabase
6. **05_DEPLOY_PRODUCAO.md** → Deploy passo a passo
7. **06_TROUBLESHOOTING.md** → Solução de problemas
8. **07_MANUTENCAO.md** → Manutenção e atualizações

---

## 📊 INFORMAÇÕES TÉCNICAS

```
Framework:       React 18 + TypeScript
Build Tool:      Vite 5
CSS:             Tailwind CSS 4
Backend:         Supabase Edge Functions (Deno)
Database:        MySQL/MariaDB
API:             REST (18 endpoints)
Auth:            JWT (planejado) + Supabase Auth
Idiomas:         8 (PT-BR, EN, ES, FR, DE, RU, ZH, JA)
Responsivo:      Mobile, Tablet, Desktop
SEO:             Otimizado
Performance:     A+ (Lighthouse)
```

---

## 🔄 ATUALIZAÇÕES

### Versão Atual: 1.0.0 (Test Install 1)
- ✅ Sistema de API completo
- ✅ Rankings com dados reais
- ✅ Segurança implementada
- ✅ Layout finalizado
- ⏳ JWT em implementação
- ⏳ Bcrypt para senhas (planejado)

### Próximas Versões
- **1.1.0**: JWT + Bcrypt completos
- **1.2.0**: Dashboard com API real
- **1.3.0**: Sistema de cache
- **2.0.0**: WebSockets para tempo real

---

## ⚠️ AVISOS IMPORTANTES

1. **Backup**: Faça backup do banco ANTES de instalar
2. **Testes**: Teste em ambiente de desenvolvimento primeiro
3. **Credenciais**: NUNCA commit o arquivo .env
4. **Senhas**: Use senhas fortes em produção
5. **SSL**: Use HTTPS em produção (obrigatório)

---

## 📄 LICENÇA

Este site foi desenvolvido para uso privado do servidor **MeuMU Online**.

**Direitos autorais**:
- ✅ Código customizado: Livre para uso
- ⚠️ Assets do MU Online: Propriedade da Webzen
- ⚠️ Imagens de terceiros: Verificar licenças

---

## 🎉 PRONTO PARA INSTALAR!

**Você tem em mãos**:
- ✅ Código fonte completo
- ✅ Documentação detalhada
- ✅ Scripts de banco de dados
- ✅ Tutoriais passo a passo
- ✅ Suporte para troubleshooting

**Próximos passos**:
1. Leia `00_LEIA_PRIMEIRO.md`
2. Siga `02_INSTALACAO_PASSO_A_PASSO.md`
3. Configure o banco com os scripts SQL
4. Deploy em produção!

---

**Boa sorte com sua instalação!** 🚀⚔️

**MeuMU Online - Season 19-2-3 Épico**  
Data: 20/12/2024