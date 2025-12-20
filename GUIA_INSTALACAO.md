# 🎮 MeuMU Online - Guia de Instalação e Configuração

**Season 19-2-3 - Épico**  
Site completo com sistema de autenticação, painel do jogador, rankings em tempo real e muito mais.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **MySQL/MariaDB** com o banco de dados do Mu Online configurado
- **Git** (opcional, para clonar o repositório)

---

## 🚀 Instalação Rápida

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

1. Copie o arquivo de exemplo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e configure as credenciais do seu banco MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_NAME=MuOnline
```

3. Configure também o JWT_SECRET (gere uma chave forte):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole em `JWT_SECRET` no arquivo `.env`.

### 3. Iniciar Servidores

#### Opção 1: Iniciar Tudo de uma Vez (Recomendado)

```bash
npm run dev:all
```

Isso iniciará automaticamente:
- Frontend (Vite) na porta **5173**
- Backend (Express) na porta **3001**

#### Opção 2: Iniciar Separadamente

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

---

## 🔧 Configuração Detalhada

### Testar Conexão com Banco de Dados

Antes de iniciar o servidor, teste a conexão:

```bash
npm run test:db
```

Se aparecer ✅ **"Conexão com MySQL OK"**, está tudo certo!

### Estrutura de Tabelas do MU Online

O backend espera as seguintes tabelas no banco de dados:

#### Tabelas Principais:
- **MEMB_INFO** - Informações de contas (login, senha, email)
- **MEMB_STAT** - Status de conexão (players online)
- **Character** - Personagens (níveis, stats, resets)
- **Guild** - Guilds (pontuação, membros)
- **GuildMember** - Membros das guilds
- **MuCastleData** - Dados do Castle Siege (opcional)

#### Campos Importantes:

**MEMB_INFO:**
- `memb___id` - Username da conta
- `memb__pwd` - Senha (hash)
- `mail_addr` - Email
- `bloc_code` - Status (0=ativo, 1=bloqueado)
- `ctl1_code` - Role (0=user, 1+=admin)

**Character:**
- `Name` - Nome do personagem
- `AccountID` - ID da conta (referência para MEMB_INFO.memb___id)
- `cLevel` - Nível do personagem
- `Class` - Classe do personagem
- `Resets` - Quantidade de resets
- `MasterResets` - Quantidade de master resets
- `LevelUpPoint` - Pontos disponíveis para distribuir
- `Strength`, `Dexterity`, `Vitality`, `Energy`, `Leadership` - Atributos
- `CtlCode` - Status (0=offline, 1=online)

---

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação Seguro
- ✓ Registro de conta com validação
- ✓ Login com JWT e cookies HTTP-only
- ✓ Verificação de sessão automática
- ✓ Logout com limpeza de sessão
- ✓ Proteção contra XSS e SQL Injection

### ✅ Painel do Jogador
- ✓ Listagem de personagens da conta
- ✓ Visualização de stats em tempo real
- ✓ Distribuição de pontos via web
- ✓ Sistema de reset completo
- ✓ Verificação de nível e zen automática

### ✅ Rankings em Tempo Real
- ✓ Top players por nível
- ✓ Top players por resets
- ✓ Top PKs (Player Killers)
- ✓ Top guilds por pontuação
- ✓ Ranking Gens (Duprian vs Vanert)

### ✅ Status do Servidor
- ✓ Players online em tempo real
- ✓ Total de contas registradas
- ✓ Total de personagens criados
- ✓ Status detalhado por servidor/channel

### ✅ Segurança Avançada
- ✓ Rate limiting (proteção contra spam)
- ✓ Helmet (headers de segurança)
- ✓ XSS protection
- ✓ CORS configurado
- ✓ Cookie seguro (httpOnly, sameSite)

---

## 📡 Endpoints da API

### Autenticação
```
POST /api/auth/register    - Registrar nova conta
POST /api/auth/login       - Fazer login
POST /api/auth/logout      - Fazer logout
GET  /api/auth/verify      - Verificar sessão
```

### Jogador (Protegido - Requer Login)
```
GET  /api/player/characters              - Listar personagens
GET  /api/player/character/:name         - Buscar personagem
POST /api/player/character/:name/add-stats - Distribuir pontos
POST /api/player/character/:name/reset   - Fazer reset
GET  /api/player/account-info            - Informações da conta
```

### Rankings (Público)
```
GET /api/rankings/players?orderBy=level&limit=100
GET /api/rankings/guilds?limit=50
GET /api/rankings/killers?limit=100
GET /api/rankings/gens
```

### Status (Público)
```
GET /api/status           - Status básico
GET /api/status/detailed  - Status detalhado
```

---

## 🔐 Segurança

### Variáveis de Ambiente Importantes

**JWT_SECRET** - Chave secreta para geração de tokens. NUNCA compartilhe!

**SSL_ENABLED** - Defina como `true` em produção para HTTPS

### Boas Práticas

1. **NUNCA** comite o arquivo `.env` no Git
2. Use senhas fortes para o banco de dados
3. Em produção, sempre use HTTPS
4. Configure firewall no servidor MySQL
5. Limite as conexões do MySQL apenas para IPs confiáveis

---

## 🐛 Solução de Problemas

### Erro de Conexão com MySQL

**Problema:** `❌ Erro ao conectar com MySQL`

**Solução:**
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste manualmente: `mysql -u sa -p -h localhost MuOnline`

### Erro de CORS

**Problema:** `Access-Control-Allow-Origin error`

**Solução:**
Verifique se `FRONTEND_URL` no `.env` está correto:
```env
FRONTEND_URL=http://localhost:5173
```

### Erro "Port already in use"

**Problema:** Porta 3001 ou 5173 já está em uso

**Solução:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Tabelas não encontradas

**Problema:** `Table 'MuOnline.Character' doesn't exist`

**Solução:**
Certifique-se de que seu banco de dados Mu Online está corretamente configurado com todas as tabelas necessárias.

---

## 🌐 Deploy em Produção

### 1. Build do Frontend
```bash
npm run build
```

Isso gera os arquivos estáticos em `/dist`.

### 2. Configurar Backend em Produção

```env
NODE_ENV=production
SSL_ENABLED=true
FRONTEND_URL=https://seu-dominio.com
DB_HOST=seu-ip-mysql
```

### 3. Usar PM2 para Gerenciamento

```bash
npm install -g pm2
pm2 start server/server.js --name "meumu-api"
pm2 startup
pm2 save
```

### 4. Configurar Nginx (Opcional)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /var/www/meumu/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📝 Customização

### Alterar Valores do Sistema de Reset

Edite o arquivo `.env`:

```env
RESET_MIN_LEVEL=400           # Nível mínimo para reset
RESET_ZEN_COST=10000000       # Custo em zen
RESET_POINTS_REWARD=500       # Pontos ganhos

MASTER_RESET_MIN_RESETS=10    # Resets necessários para MR
MASTER_RESET_ZEN_COST=50000000
MASTER_RESET_POINTS_REWARD=1000
```

Ou edite diretamente em `/server/routes/player.js`.

### Adicionar Novos Idiomas

Edite `/src/app/i18n/translations.ts` e adicione os textos traduzidos.

---

## 🎨 Tema e Estilo

O site usa:
- **Tailwind CSS 4.0** - Customizado para tema dark medieval
- **Glassmorphism** - Efeitos de vidro translúcido
- **Motion/React** - Animações fluidas
- **Lucide React** - Ícones modernos

Cores principais:
- Obsidian: `#0a0a0a`
- Gold: `#FFB800`
- Blue Ethereal: `#60A5FA`

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique a documentação completa
2. Teste os diagnósticos: `npm run diagnostico`
3. Confira os logs do servidor no console

---

## 📄 Licença

Este projeto foi criado para uso privado em servidores de Mu Online.

**⚔️ MeuMU Online - Season 19-2-3 Épico ⚔️**
