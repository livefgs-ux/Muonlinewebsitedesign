# 🚀 GUIA COMPLETO: Conectar Site ao MySQL do MU Online

## 📋 PASSO 1: Configure as Credenciais do MySQL

### 1.1 Abra o arquivo `.env` na raiz do projeto

Edite com as informações do seu servidor:

```env
# IP ou hostname do servidor MySQL
DB_HOST=192.168.1.100     # ⚠️ ALTERE AQUI - IP da sua VPS ou localhost

# Porta do MySQL (padrão 3306)
DB_PORT=3306

# Usuário do MySQL
DB_USER=sa                # ⚠️ ALTERE se usar outro usuário

# Senha do MySQL
DB_PASSWORD=MinhaSenh@123 # ⚠️ ALTERE AQUI - sua senha real

# Nome do banco de dados
DB_NAME=MuOnline          # ⚠️ ALTERE se o banco tiver outro nome

# Porta do servidor API (não altere)
PORT=3001

# URL da API para o frontend
VITE_API_URL=http://localhost:3001
```

### 1.2 Exemplos de Configuração

**Servidor Local (mesma máquina):**
```env
DB_HOST=localhost
DB_USER=sa
DB_PASSWORD=sua_senha
DB_NAME=MuOnline
```

**Servidor Remoto (VPS):**
```env
DB_HOST=191.252.100.50    # IP público da VPS
DB_USER=sa
DB_PASSWORD=SenhaForte123!
DB_NAME=MuOnline
```

---

## 🧪 PASSO 2: Teste a Conexão com o MySQL

Antes de iniciar o servidor, **TESTE** se consegue conectar:

```bash
npm run test:db
```

### ✅ Resultado Esperado (SUCESSO):

```
🔍 Testando conexão com MySQL...

📋 Configuração:
   Host: 192.168.1.100
   Porta: 3306
   Usuário: sa
   Banco: MuOnline
   Senha: ***configurada***

🔌 Conectando...
✅ Conexão estabelecida com sucesso!

📊 Testando queries básicas...

1️⃣ Testando tabela MEMB_INFO (Contas)...
   ✅ Total de contas: 1523

2️⃣ Testando tabela Character (Personagens)...
   ✅ Total de personagens: 3847

3️⃣ Testando tabela MEMB_STAT (Players Online)...
   ✅ Players online: 42

4️⃣ Testando tabela Guild (Guilds)...
   ✅ Total de guilds: 125

5️⃣ Testando ranking (Top 3 players)...
   ✅ Top 3 players:
      1. DarkKnight - Level 400 (15 resets)
      2. MagicGirl - Level 400 (14 resets)
      3. Warrior - Level 400 (13 resets)

═══════════════════════════════════════════════════
✅ TESTE CONCLUÍDO COM SUCESSO!
═══════════════════════════════════════════════════

🚀 Próximo passo: Execute "npm run server" para iniciar a API
```

### ❌ Se der ERRO:

**Erro: "Can't connect to MySQL server"**

**Solução:**
1. Verifique se o MySQL está rodando:
   ```bash
   # Linux/VPS
   sudo systemctl status mysql
   
   # Windows
   # Abra Serviços e veja se "MySQL" está rodando
   ```

2. Teste conexão manual:
   ```bash
   mysql -h 192.168.1.100 -u sa -p MuOnline
   ```

3. Verifique firewall (libere porta 3306):
   ```bash
   # Linux/VPS
   sudo ufw allow 3306
   
   # Windows
   # Firewall > Regra de Entrada > Nova Regra > Porta 3306 TCP
   ```

**Erro: "Access denied for user 'sa'@'...'**

**Solução:**
1. Senha está correta no `.env`?
2. Usuário tem permissão? Execute no MySQL:
   ```sql
   GRANT ALL PRIVILEGES ON MuOnline.* TO 'sa'@'%' IDENTIFIED BY 'sua_senha';
   FLUSH PRIVILEGES;
   ```

**Erro: "Unknown database 'MuOnline'"**

**Solução:**
1. Verifique nome do banco no `.env`
2. Liste bancos disponíveis:
   ```sql
   SHOW DATABASES;
   ```

---

## 🚀 PASSO 3: Inicie o Servidor Backend (API)

Depois que o teste der **✅ SUCESSO**, inicie a API:

```bash
npm run server
```

### ✅ Resultado Esperado:

```
✅ Conexão com MySQL estabelecida com sucesso!

🚀 Servidor MeuMU Online API rodando na porta 3001
📡 Health check: http://localhost:3001/health
📊 Stats: http://localhost:3001/api/stats/online
🏆 Rankings: http://localhost:3001/api/rankings/players

⚔️  MeuMU Online - Season 19-2-3 Épico
```

### 🧪 Teste se a API está funcionando:

Abra no navegador ou use curl:

```bash
# Teste 1: Health check
curl http://localhost:3001/health

# Teste 2: Players online
curl http://localhost:3001/api/stats/online

# Teste 3: Estatísticas do servidor
curl http://localhost:3001/api/stats/server

# Teste 4: Top 10 players
curl http://localhost:3001/api/rankings/players?limit=10
```

---

## 🎨 PASSO 4: Configure o Frontend React

### 4.1 Crie arquivo de configuração

Crie o arquivo `/src/config/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Estatísticas
  stats: {
    online: '/api/stats/online',
    server: '/api/stats/server',
    castleSiege: '/api/stats/castle-siege'
  },
  // Rankings
  rankings: {
    players: '/api/rankings/players',
    guilds: '/api/rankings/guilds',
    killers: '/api/rankings/killers',
    gens: '/api/rankings/gens'
  }
};
```

### 4.2 Use os hooks React criados

Os hooks já estão prontos em:
- `/src/app/hooks/useServerStats.ts` - Para estatísticas
- `/src/app/hooks/useRankings.ts` - Para rankings

---

## 🔥 PASSO 5: Substitua Dados Fake por Dados Reais

### 5.1 Players Online no Header

**ANTES (dados fake):**
```tsx
<div>420 players online</div>
```

**DEPOIS (dados reais):**
```tsx
import { PlayersOnlineBadge } from './components/PlayersOnlineWidget';

<PlayersOnlineBadge refreshInterval={10000} />
```

### 5.2 Estatísticas na Homepage

**ANTES (dados fake):**
```tsx
<div>Total Accounts: 5000</div>
<div>Total Characters: 12000</div>
```

**DEPOIS (dados reais):**
```tsx
import { useServerStats } from './hooks/useServerStats';

function HomePage() {
  const { stats, loading } = useServerStats(30000);
  
  return (
    <div>
      <div>Total Accounts: {loading ? '...' : stats.totalAccounts}</div>
      <div>Total Characters: {loading ? '...' : stats.totalCharacters}</div>
      <div>Players Online: {loading ? '...' : stats.playersOnline}</div>
    </div>
  );
}
```

### 5.3 Rankings

**ANTES (dados mockados):**
```tsx
const mockPlayers = [{ name: 'Player1', level: 400 }];
```

**DEPOIS (dados reais):**
```tsx
import { RealTimeRankings } from './components/RealTimeRankings';

<RealTimeRankings />
```

---

## 🔒 PASSO 6: Segurança (IMPORTANTE!)

### 6.1 NUNCA compartilhe o arquivo `.env`

Adicione ao `.gitignore`:
```
.env
.env.local
```

### 6.2 Configure permissões mínimas no MySQL

```sql
-- Crie usuário apenas para leitura (mais seguro)
CREATE USER 'mu_readonly'@'%' IDENTIFIED BY 'SenhaForte123!';

-- Dê permissão APENAS de SELECT (leitura)
GRANT SELECT ON MuOnline.MEMB_INFO TO 'mu_readonly'@'%';
GRANT SELECT ON MuOnline.MEMB_STAT TO 'mu_readonly'@'%';
GRANT SELECT ON MuOnline.Character TO 'mu_readonly'@'%';
GRANT SELECT ON MuOnline.Guild TO 'mu_readonly'@'%';
GRANT SELECT ON MuOnline.MuCastleData TO 'mu_readonly'@'%';

FLUSH PRIVILEGES;
```

Depois altere no `.env`:
```env
DB_USER=mu_readonly
DB_PASSWORD=SenhaForte123!
```

### 6.3 Configure Firewall

**Linux/VPS:**
```bash
# Libere MySQL apenas para IPs específicos
sudo ufw allow from SEU_IP to any port 3306
sudo ufw deny 3306
```

**Windows:**
Firewall > Regra de Entrada > MySQL > Permitir apenas IPs confiáveis

---

## 📊 PASSO 7: Verifique Dados Reais no Site

### 7.1 Inicie tudo junto

```bash
# Terminal 1: Inicia backend
npm run server

# Terminal 2: Inicia frontend
npm run dev
```

Ou use o comando que inicia tudo:
```bash
npm run dev:all
```

### 7.2 Abra o site

```
http://localhost:5173
```

### 7.3 Verifique se os dados são REAIS

✅ Players online deve estar atualizando a cada 10 segundos
✅ Rankings devem mostrar personagens do seu banco
✅ Estatísticas devem bater com o banco de dados
✅ Nomes de players e guilds devem ser reais

---

## 🐛 TROUBLESHOOTING

### Problema: CORS Error no navegador

**Solução:** O backend já tem CORS configurado, mas se der erro:

```javascript
// Em server/server.js, adicione:
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true
}));
```

### Problema: Players online sempre 0

**Solução:** Verifique a estrutura da tabela MEMB_STAT:

```sql
-- Deve ter o campo ConnectStat
DESCRIBE MEMB_STAT;

-- Teste query manual
SELECT * FROM MEMB_STAT WHERE ConnectStat = 1;
```

### Problema: Rankings vazios

**Solução:** Verifique se há personagens ativos:

```sql
-- Personagens ativos (CtlCode = 0)
SELECT COUNT(*) FROM Character WHERE CtlCode = 0;

-- Se não tiver, altere a query para remover filtro
```

---

## ✅ CHECKLIST FINAL

Antes de considerar concluído, verifique:

- [ ] Arquivo `.env` configurado com credenciais corretas
- [ ] Teste de conexão passou (`npm run test:db`)
- [ ] Servidor backend rodando (`npm run server`)
- [ ] Frontend conectando na API
- [ ] Players online mostrando valor real e atualizando
- [ ] Rankings mostrando dados reais do banco
- [ ] Estatísticas corretas (contas, chars, guilds)
- [ ] Nenhum erro no console do navegador
- [ ] Nenhum erro no terminal do backend

---

## 🎉 PRÓXIMOS PASSOS

Depois que tudo estiver funcionando:

1. **Substitua TODOS os dados fake** no site pelos componentes reais
2. **Configure atualização automática** dos rankings
3. **Adicione cache** para melhorar performance
4. **Implemente WebSocket** para updates em tempo real
5. **Configure PM2** para rodar em produção

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionar:

1. Verifique logs do backend no terminal
2. Verifique console do navegador (F12)
3. Teste queries manualmente no MySQL
4. Revise credenciais no `.env`
5. Confirme que firewall permite conexões

---

**⚔️ MeuMU Online - Season 19-2-3 Épico**  
*Agora com dados 100% REAIS do servidor!* 🔥
