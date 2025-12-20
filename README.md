# ⚔️ MeuMU Online - Season 19-2-3 Épico

![Status](https://img.shields.io/badge/Status-Pronto-success)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB)

Site completo para servidor privado de Mu Online com sistema de autenticação seguro, painel do jogador, rankings em tempo real, sistema de reset via web e muito mais!

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e configure suas credenciais MySQL
```

### 3. Testar Conexão
```bash
npm run diagnostico
```

### 4. Iniciar Servidores
```bash
npm run dev:all
```

Pronto! Acesse:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- ✅ Registro de conta com validação completa
- ✅ Login seguro com JWT e cookies HTTP-only
- ✅ Proteção contra XSS, SQL Injection e CSRF
- ✅ Verificação de sessão automática

### 👤 Painel do Jogador
- ✅ Listagem de personagens da conta
- ✅ Visualização de stats em tempo real (STR, AGI, VIT, ENE, CMD)
- ✅ **Distribuição de pontos via web** (sem precisar entrar no jogo)
- ✅ **Sistema de reset completo** com verificação automática de nível e zen
- ✅ Informações detalhadas de cada personagem

### 🏆 Rankings em Tempo Real
- ✅ Top players por nível
- ✅ Top players por resets
- ✅ Top PKs (Player Killers)
- ✅ Top guilds por pontuação
- ✅ Ranking Gens (Duprian vs Vanert)

### 📊 Status do Servidor
- ✅ Players online em tempo real (consulta MEMB_STAT.ConnectStat)
- ✅ Total de contas registradas
- ✅ Total de personagens criados
- ✅ Status detalhado por servidor/channel

### 🎨 Interface Moderna
- ✅ Dark Medieval Fantasy theme
- ✅ Glassmorphism effects
- ✅ Animações fluidas (Motion/React)
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ 8 idiomas suportados

---

## 📁 Estrutura do Projeto

```
meumu-online/
├── src/
│   ├── app/
│   │   ├── components/       # Componentes React
│   │   ├── contexts/         # Contexts (Auth, Player, Language, etc)
│   │   ├── hooks/            # Custom hooks
│   │   ├── i18n/             # Traduções
│   │   └── config/           # Configurações (API)
│   └── styles/               # CSS e Tailwind
├── server/
│   ├── config/               # Configuração do banco de dados
│   ├── middleware/           # Auth, segurança, rate limiting
│   ├── routes/               # Rotas da API
│   │   ├── auth.js          # Login, registro, logout
│   │   ├── player.js        # Painel do jogador
│   │   ├── rankings.js      # Rankings em tempo real
│   │   ├── status.js        # Status do servidor
│   │   └── admin/           # AdminCP (rotas protegidas)
│   └── server.js            # Servidor Express
├── .env.example             # Exemplo de configuração
├── package.json
└── README.md
```

---

## 🔧 Configuração

### Arquivo `.env`

```env
# Banco de Dados MySQL do Mu Online
DB_HOST=localhost
DB_PORT=3306
DB_USER=sa
DB_PASSWORD=sua_senha
DB_NAME=MuOnline

# JWT para autenticação
JWT_SECRET=sua_chave_secreta_forte_aqui

# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Sistema de Reset (configure conforme seu servidor)
RESET_MIN_LEVEL=400
RESET_ZEN_COST=10000000
RESET_POINTS_REWARD=500
```

**💡 Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📡 API Endpoints

### Autenticação (Público)
```
POST /api/auth/register      # Registrar conta
POST /api/auth/login         # Fazer login
POST /api/auth/logout        # Fazer logout
GET  /api/auth/verify        # Verificar sessão
```

### Player (Protegido - Requer Login)
```
GET  /api/player/characters              # Listar personagens
GET  /api/player/character/:name         # Detalhes do personagem
POST /api/player/character/:name/add-stats  # Distribuir pontos
POST /api/player/character/:name/reset   # Fazer reset
```

### Rankings (Público)
```
GET /api/rankings/players    # Top players (nível/resets)
GET /api/rankings/guilds     # Top guilds
GET /api/rankings/killers    # Top PKs
GET /api/rankings/gens       # Ranking Gens
```

### Status (Público)
```
GET /api/status              # Status geral do servidor
GET /api/status/detailed     # Status detalhado
```

---

## 🛡️ Segurança

Este sistema implementa múltiplas camadas de segurança:

- **JWT Tokens** - Autenticação stateless
- **HTTP-Only Cookies** - Proteção contra XSS
- **CORS** - Controle de origem de requisições
- **Helmet** - Headers de segurança
- **Rate Limiting** - Proteção contra spam e DDoS
- **XSS Clean** - Sanitização de inputs
- **Prepared Statements** - Proteção contra SQL Injection
- **Bcrypt** - Hash seguro de senhas

---

## 🧪 Diagnóstico e Testes

### Executar Diagnóstico Completo
```bash
npm run diagnostico
```

Isso verifica:
- ✓ Variáveis de ambiente configuradas
- ✓ Conexão com MySQL
- ✓ Estrutura de tabelas do MU
- ✓ Colunas importantes (Resets, ConnectStat, etc)
- ✓ Consultas de teste
- ✓ Configurações de segurança

### Testar Apenas Conexão
```bash
npm run test:db
```

---

## 📦 Scripts Disponíveis

```bash
npm run dev              # Inicia frontend (Vite)
npm run server           # Inicia backend (Express)
npm run dev:all          # Inicia frontend + backend
npm run build            # Build para produção
npm run diagnostico      # Diagnóstico completo do sistema
npm run test:db          # Testa conexão com MySQL
```

---

## 🐛 Solução de Problemas

### ❌ Erro de Conexão com MySQL

**Causa:** Credenciais incorretas ou MySQL não está rodando

**Solução:**
1. Verifique o arquivo `.env`
2. Teste manualmente: `mysql -u sa -p -h localhost MuOnline`
3. Execute: `npm run diagnostico`

### ❌ Erro de CORS

**Causa:** Frontend e backend em origens diferentes

**Solução:**
Adicione no `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### ❌ Players Online sempre 0

**Causa:** Tabela MEMB_STAT não tem coluna ConnectStat

**Solução:**
Verifique se sua tabela tem a coluna `ConnectStat` que indica status de conexão (0=offline, 1=online).

### ❌ Sistema de Reset não funciona

**Causa:** Tabela Character não tem coluna Resets

**Solução:**
Adicione a coluna na tabela:
```sql
ALTER TABLE Character ADD COLUMN Resets INT DEFAULT 0;
```

---

## 🌐 Deploy em Produção

### 1. Build do Frontend
```bash
npm run build
```

### 2. Configurar Variáveis de Produção
```env
NODE_ENV=production
SSL_ENABLED=true
FRONTEND_URL=https://seu-dominio.com
```

### 3. Usar PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start server/server.js --name meumu-api
pm2 startup
pm2 save
```

### 4. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        root /var/www/meumu/dist;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

---

## 🎨 Tecnologias Utilizadas

### Frontend
- **React 18.3** - UI Library
- **Tailwind CSS 4.0** - Styling (tema customizado)
- **Motion/React** - Animações
- **Lucide React** - Ícones
- **Vite** - Build tool

### Backend
- **Node.js 18+** - Runtime
- **Express 5** - Web framework
- **MySQL2** - Database driver
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

### Segurança
- **Helmet** - Security headers
- **CORS** - Origin control
- **Express Rate Limit** - DDoS protection
- **XSS Clean** - Input sanitization

---

## 📄 Documentação Completa

- **[GUIA_INSTALACAO.md](GUIA_INSTALACAO.md)** - Guia detalhado de instalação e configuração
- **[ADMINCP_README.md](ADMINCP_README.md)** - Documentação do painel administrativo
- **[START_HERE.txt](START_HERE.txt)** - Instruções rápidas

---

## 💡 Suporte

Se encontrar problemas:

1. ✅ Execute o diagnóstico: `npm run diagnostico`
2. ✅ Consulte o [GUIA_INSTALACAO.md](GUIA_INSTALACAO.md)
3. ✅ Verifique os logs do servidor no console
4. ✅ Confira se as tabelas do MU estão corretas

---

## ⚖️ Licença

Este projeto foi desenvolvido para uso em servidores privados de Mu Online.

---

<div align="center">

**⚔️ MeuMU Online - Season 19-2-3 Épico ⚔️**

*Desenvolvido com ❤️ para a comunidade Mu Online*

</div>
