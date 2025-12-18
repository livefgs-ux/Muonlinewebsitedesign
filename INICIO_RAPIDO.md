# ⚡ INÍCIO RÁPIDO - Conectar ao MySQL

## 🎯 RESUMO: 4 Passos Simples

### ✅ PASSO 1: Configure o `.env`

Edite o arquivo `.env` na raiz do projeto:

```env
DB_HOST=192.168.1.100     # ⚠️ MUDE AQUI - IP do seu servidor MySQL
DB_USER=sa                # Usuário do MySQL
DB_PASSWORD=sua_senha     # ⚠️ MUDE AQUI - Sua senha
DB_NAME=MuOnline          # Nome do banco de dados
```

### ✅ PASSO 2: Teste a Conexão

```bash
npm run test:db
```

**Resultado esperado:**
```
✅ Conexão com MySQL estabelecida com sucesso!
✅ Total de contas: 1523
✅ Players online: 42
```

### ✅ PASSO 3: Inicie o Backend

```bash
npm run server
```

**Resultado esperado:**
```
🚀 Servidor MeuMU Online API rodando na porta 3001
```

### ✅ PASSO 4: Inicie o Frontend

```bash
# Em outro terminal
npm run dev
```

**Ou inicie tudo junto:**
```bash
npm run dev:all
```

---

## 🧪 Teste se Funcionou

Abra no navegador:

1. **Frontend:** http://localhost:5173
2. **API Health:** http://localhost:3001/health
3. **Players Online:** http://localhost:3001/api/stats/online

---

## ❌ Deu Erro?

### Erro: "Can't connect to MySQL"
```bash
# Verifique se MySQL está rodando
sudo systemctl status mysql   # Linux
# ou Services.msc > MySQL      # Windows

# Teste conexão manual
mysql -h IP -u sa -p MuOnline
```

### Erro: "Access denied"
- Verifique usuário e senha no `.env`
- Confirme permissões no MySQL:
```sql
GRANT SELECT ON MuOnline.* TO 'sa'@'%';
FLUSH PRIVILEGES;
```

### Erro: "Backend não está rodando"
- Execute: `npm run server`
- Verifique se porta 3001 está livre

---

## 📊 Endpoints da API

```bash
# Players online
curl http://localhost:3001/api/stats/online

# Estatísticas gerais
curl http://localhost:3001/api/stats/server

# Top 10 players
curl http://localhost:3001/api/rankings/players?limit=10

# Top guilds
curl http://localhost:3001/api/rankings/guilds?limit=10
```

---

## 🎨 Use no Frontend

### Players Online (Header)
```tsx
import { PlayersOnlineBadge } from './components/PlayersOnlineWidget';

<PlayersOnlineBadge />
```

### Estatísticas (Cards)
```tsx
import { useServerStats } from './hooks/useServerStats';

function Stats() {
  const { stats, loading } = useServerStats();
  return <div>Players: {stats.playersOnline}</div>;
}
```

### Rankings
```tsx
import { RealTimeRankings } from './components/RealTimeRankings';

<RealTimeRankings />
```

---

## 📚 Documentação Completa

- **Guia Detalhado:** `/GUIA_CONEXAO_MYSQL.md`
- **Configuração Backend:** `/SERVER_SETUP.md`
- **Implementação:** `/REAL_DATA_IMPLEMENTATION.md`

---

## 🔥 Agora é Real!

Todos os dados do site vêm DIRETAMENTE do banco MySQL do seu servidor MU Online:

✅ Players online atualizando a cada 10 segundos  
✅ Rankings 100% reais  
✅ Estatísticas precisas  
✅ ZERO dados fake  

**⚔️ MeuMU Online - Season 19-2-3 Épico**
