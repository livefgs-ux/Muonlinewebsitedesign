# ⚔️ MeuMU Online - Season 19-2-3 Épico

Site completo para servidor privado de Mu Online com tema **Dark Medieval Fantasy** e dados **100% REAIS** do banco de dados MySQL.

## 🔥 Características

- ✅ **Dados 100% Reais** - Conecta ao banco MySQL do servidor
- ✅ **Players Online em Tempo Real** - Atualiza a cada 10 segundos
- ✅ **Rankings Dinâmicos** - Top Players, Guilds, PKs
- ✅ **Sistema de Login/Cadastro**
- ✅ **Área do Jogador** - Gestão de personagens
- ✅ **Castle Siege** - Informações em tempo real
- ✅ **AdminCP Completo** - 68+ componentes administrativos
- ✅ **Multilíngue** - 8 idiomas (PT, EN, ES, FR, DE, IT, RU, ZH)
- ✅ **Design Moderno** - Glassmorphism + Dark Medieval Fantasy

## 🚀 Início Rápido

### 1️⃣ Configure o MySQL

Edite o arquivo `.env`:

```env
DB_HOST=192.168.1.100     # IP do seu servidor MySQL
DB_USER=sa
DB_PASSWORD=sua_senha      # Sua senha do MySQL
DB_NAME=MuOnline
```

### 2️⃣ Teste a Conexão

```bash
npm run test:db
```

### 3️⃣ Inicie o Servidor

```bash
# Opção 1: Tudo junto (recomendado)
npm run dev:all

# Opção 2: Separado
npm run server    # Terminal 1 (Backend)
npm run dev       # Terminal 2 (Frontend)
```

### 4️⃣ Acesse o Site

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001

## 📚 Documentação

- 📖 **[INÍCIO RÁPIDO](INICIO_RAPIDO.md)** - 4 passos simples
- 📖 **[GUIA COMPLETO](GUIA_CONEXAO_MYSQL.md)** - Instruções detalhadas
- 📖 **[CONFIGURAÇÃO DO BACKEND](SERVER_SETUP.md)** - Setup da API
- 📖 **[IMPLEMENTAÇÃO REAL](REAL_DATA_IMPLEMENTATION.md)** - Como funciona

## 🎨 Tecnologias

### Frontend
- **React 18** - Framework JavaScript
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS 4** - Estilização moderna
- **TypeScript** - Tipagem estática
- **Motion** - Animações suaves
- **Radix UI** - Componentes acessíveis

### Backend
- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **MySQL2** - Driver MySQL
- **CORS** - Cross-Origin Resource Sharing

## 📊 Estrutura do Projeto

```
/
├── src/                          # Frontend React
│   ├── app/
│   │   ├── components/          # Componentes React
│   │   │   ├── PlayersOnlineWidget.tsx
│   │   │   ├── RealTimeRankings.tsx
│   │   │   └── DatabaseConnectionSetup.tsx
│   │   ├── hooks/               # React Hooks
│   │   │   ├── useServerStats.ts
│   │   │   └── useRankings.ts
│   │   └── App.tsx              # Componente principal
│   └── styles/                  # Estilos CSS
│
├── server/                       # Backend API
│   ├── config/
│   │   └── database.js          # Configuração MySQL
│   ├── routes/
│   │   ├── stats.js             # Rotas de estatísticas
│   │   └── rankings.js          # Rotas de rankings
│   ├── server.js                # Servidor Express
│   └── test-connection.js       # Script de teste
│
├── .env                         # Credenciais MySQL (NÃO COMMITAR)
├── .env.example                 # Exemplo de credenciais
├── package.json                 # Dependências
└── README.md                    # Este arquivo
```

## 🔌 API Endpoints

### Estatísticas

```
GET /api/stats/online          # Players online
GET /api/stats/server          # Estatísticas gerais
GET /api/stats/castle-siege    # Castle Siege info
```

### Rankings

```
GET /api/rankings/players      # Top players
GET /api/rankings/guilds       # Top guilds
GET /api/rankings/killers      # Top PKs
GET /api/rankings/gens         # Ranking Gens
```

## 🔒 Segurança

### ⚠️ IMPORTANTE

1. **NUNCA** commite o arquivo `.env` (já está no `.gitignore`)
2. Use **senha forte** no MySQL
3. Configure **firewall** para liberar apenas IPs confiáveis
4. Crie usuário MySQL **apenas com permissão de SELECT**

### Exemplo de Permissões Seguras

```sql
-- Crie usuário somente leitura
CREATE USER 'mu_readonly'@'%' IDENTIFIED BY 'SenhaForte123!';

-- Dê permissão APENAS de SELECT
GRANT SELECT ON MuOnline.* TO 'mu_readonly'@'%';
FLUSH PRIVILEGES;
```

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia frontend (Vite)
npm run server       # Inicia backend (Express)
npm run dev:all      # Inicia frontend + backend
npm run test:db      # Testa conexão MySQL
npm run build        # Build de produção
```

## 🐛 Troubleshooting

### Erro: "Can't connect to MySQL"

**Solução:**
1. Verifique se MySQL está rodando
2. Confirme credenciais no `.env`
3. Libere porta 3306 no firewall
4. Teste: `mysql -h HOST -u USER -p DATABASE`

### Erro: "Access denied"

**Solução:**
1. Verifique usuário e senha no `.env`
2. Confirme permissões no MySQL:
```sql
GRANT SELECT ON MuOnline.* TO 'sa'@'%';
FLUSH PRIVILEGES;
```

### Players Online sempre 0

**Solução:**
Verifique estrutura da tabela `MEMB_STAT`:
```sql
DESCRIBE MEMB_STAT;
SELECT * FROM MEMB_STAT WHERE ConnectStat = 1;
```

## 🎯 Próximos Passos

Depois da conexão funcionar:

1. ✅ Substitua TODOS os dados fake pelos componentes reais
2. ✅ Configure atualização automática dos rankings
3. ✅ Adicione cache Redis para performance
4. ✅ Implemente WebSocket para updates em tempo real
5. ✅ Configure PM2 para produção

## 📝 Licença

Este projeto é privado e desenvolvido para o servidor **MeuMU Online**.

## 👥 Créditos

- **Servidor:** MeuMU Online - Season 19-2-3 Épico
- **Tema:** Dark Medieval Fantasy
- **Tecnologia:** React + Express + MySQL

---

## 🎮 Sobre o Servidor

**MeuMU Online** é um servidor privado de Mu Online Season 19-2-3 com rates épicos e sistema de progressão equilibrado. Junte-se à nossa comunidade e viva a experiência definitiva do Mu Online!

### Características do Servidor
- ⚔️ **Season 19-2-3** com todas as atualizações
- 🏆 **Sistema de Resets** infinito
- 🛡️ **Castle Siege** semanal
- 👥 **Gens System** Duprian vs Vanert
- 🎁 **Eventos automáticos** a cada 2 horas
- 💎 **Shop VIP** com itens exclusivos

---

**⚔️ Feito com ❤️ para a comunidade MU Online**
