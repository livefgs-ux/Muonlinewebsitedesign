# 🚀 Configuração do Backend API - MeuMU Online

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MySQL do servidor MU Online configurado e rodando
- Credenciais de acesso ao banco de dados

## ⚙️ Configuração

### 1. Configure as variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Host do servidor MySQL (IP da sua VPS)
DB_HOST=192.168.1.100  # Exemplo: seu IP

# Porta do MySQL
DB_PORT=3306

# Usuário do banco de dados
DB_USER=sa

# Senha do banco de dados  
DB_PASSWORD=sua_senha_aqui

# Nome do banco de dados
DB_NAME=MuOnline

# Porta do servidor API
PORT=3001

# URL da API (para o frontend)
VITE_API_URL=http://localhost:3001
```

### 2. Instale as dependências (se necessário)

```bash
npm install
# ou
pnpm install
```

### 3. Inicie o servidor backend

```bash
npm run server
```

Você verá a mensagem:

```
✅ Conexão com MySQL estabelecida com sucesso!
🚀 Servidor MeuMU Online API rodando na porta 3001
📡 Health check: http://localhost:3001/health
📊 Stats: http://localhost:3001/api/stats/online
🏆 Rankings: http://localhost:3001/api/rankings/players
```

### 4. Teste a conexão

Abra no navegador: `http://localhost:3001/api/test-connection`

Deve retornar:
```json
{
  "success": true,
  "message": "Conexão com MySQL OK"
}
```

## 🔌 Endpoints da API

### Estatísticas do Servidor

- **GET** `/api/stats/online` - Players online em tempo real
- **GET** `/api/stats/server` - Estatísticas gerais (contas, chars, guilds)
- **GET** `/api/stats/castle-siege` - Informações do Castle Siege

### Rankings

- **GET** `/api/rankings/players?orderBy=level&limit=100` - Top players
  - Parâmetros: `orderBy` (level, resets, kills), `limit` (número de resultados)
- **GET** `/api/rankings/guilds?limit=50` - Top guilds
- **GET** `/api/rankings/killers?limit=100` - Top PKs
- **GET** `/api/rankings/gens` - Ranking Gens (Duprian vs Vanert)

## 📊 Estrutura das Tabelas MySQL

O backend consulta as seguintes tabelas do MU Online:

### MEMB_STAT
```sql
- memb___id (VARCHAR) - Account ID
- ConnectStat (INT) - Status de conexão (1 = online, 0 = offline)
```

### MEMB_INFO
```sql
- memb___id (VARCHAR) - Account ID
- memb_name (VARCHAR) - Nome da conta
```

### Character
```sql
- Name (VARCHAR) - Nome do personagem
- AccountID (VARCHAR) - ID da conta
- cLevel (INT) - Nível do personagem
- resets (INT) - Número de resets
- Class (INT) - Classe do personagem
- PkCount (INT) - Número de PKs
- CtlCode (INT) - Código de controle (0 = ativo)
- G_Family (INT) - Família Gens (1 = Duprian, 2 = Vanert)
```

### Guild
```sql
- G_Name (VARCHAR) - Nome da guild
- G_Master (VARCHAR) - Nome do mestre
- G_Score (INT) - Pontuação da guild
- G_Count (INT) - Número de membros
- G_Notice (VARCHAR) - Aviso da guild
```

### MuCastleData
```sql
- SIEGE_START_DATE (DATETIME) - Data de início do Castle Siege
- SIEGE_END_DATE (DATETIME) - Data de término
- CASTLE_OCCUPY (VARCHAR) - Guild dona do castelo
- SIEGE_GUILDLIST_SETTED (INT) - Registro aberto (1 = sim)
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: 

- **NUNCA** compartilhe o arquivo `.env` publicamente
- Configure firewall no MySQL para aceitar apenas IPs confiáveis
- Use senhas fortes para o usuário do banco de dados
- Considere usar SSL/TLS para conexões MySQL remotas

## 🐛 Troubleshooting

### Erro: "Can't connect to MySQL server"

1. Verifique se o MySQL está rodando
2. Confirme host e porta no `.env`
3. Verifique firewall da VPS (libere porta 3306)
4. Teste conexão manual: `mysql -h HOST -u USER -p`

### Erro: "Access denied for user"

1. Verifique usuário e senha no `.env`
2. Confirme permissões do usuário no MySQL:
```sql
GRANT SELECT ON MuOnline.* TO 'sa'@'%';
FLUSH PRIVILEGES;
```

### Players online sempre 0

1. Verifique se a tabela `MEMB_STAT` existe
2. Confirme estrutura da tabela (campo `ConnectStat`)
3. Teste query manual no MySQL

## 🚀 Modo Produção

Para rodar em produção (VPS):

1. Configure variáveis de ambiente de produção
2. Use PM2 para manter o servidor rodando:

```bash
npm install -g pm2
pm2 start server/server.js --name "meumuonline-api"
pm2 startup
pm2 save
```

3. Configure proxy reverso com Nginx:

```nginx
location /api {
  proxy_pass http://localhost:3001;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs do servidor
2. Teste conexão manual com MySQL
3. Confirme estrutura das tabelas
4. Verifique firewall e permissões

---

**⚔️ MeuMU Online - Season 19-2-3 Épico**
