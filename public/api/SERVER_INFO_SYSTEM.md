# 🎮 Sistema de Informações do Servidor - MeuMU Online

## 📋 Visão Geral

Sistema completo que monitora e exibe em tempo real:
- ✅ Status do servidor (Online/Offline)
- ✅ Players conectados
- ✅ **Bosses vivos (NOVO!)**
- ✅ Total de contas
- ✅ Total de personagens
- ✅ Total de guilds
- ✅ Dono do castelo (Castle Siege)
- ✅ Rates do servidor (EXP e Drop)

## 🎯 Fluxo do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        MySQL/MariaDB                             │
│  (MEMB_STAT, MEMB_INFO, Character, Guild, Monster, MuCastle)   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │  server_info.php    │ ◄── Executado pelo Cron
                   │  (Coleta dados)     │     a cada 5 minutos
                   └──────────┬──────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │ server_info.json    │ ◄── Cache em disco
                   │ (Cache 30 seg)      │
                   └──────────┬──────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │get_server_info.php  │ ◄── API REST pública
                   │  (Retorna JSON)     │
                   └──────────┬──────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ server-info-widget.tsx       │ ◄── Widget React
              │ (Atualiza a cada 30 seg)     │
              └──────────────────────────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │   Interface Web     │
                   │  (Mostra bosses!)   │
                   └─────────────────────┘
```

## 📊 Dados Coletados

### Do Banco de Dados MySQL:

| Tabela       | Campo         | Informação           |
|--------------|---------------|----------------------|
| MEMB_STAT    | ConnectStat   | Players online       |
| MEMB_INFO    | COUNT(*)      | Total de contas      |
| Character    | CtlCode       | Total de personagens |
| Guild        | COUNT(*)      | Total de guilds      |
| **Monster**  | **Life**      | **Bosses vivos** 🆕  |
| MuCastleData | OWNER_GUILD   | Dono do castelo      |

## 🐲 Sistema de Bosses (NOVO!)

### Como Funciona:

1. **Query SQL** busca na tabela `Monster`:
   ```sql
   SELECT COUNT(DISTINCT MapNumber) as alive_bosses 
   FROM Monster 
   WHERE MapNumber IN (6,7,8,10,24,34,39,51...) 
   AND Life > 0
   ```

2. **Mapas Monitorados**:
   - 6 = Devias
   - 7 = Dungeon
   - 8 = Lost Tower
   - 10 = Atlans
   - 24 = Kalima
   - 34 = Crywolf
   - 39 = Kanturu
   - 51 = Vulcanus
   - 56-72 = Outros

3. **Exibição**: `87/120` (vivos/total)

### Personalizar Total de Bosses:

Edite em `server_info.php` e `get_server_info.php`:

```php
$totalBosses = 150; // Seu total
```

## 🚀 Instalação Rápida

### 1. Configurar Database

```bash
cd /public/api
nano config.php
```

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');
define('DB_NAME', 'MuOnline');
```

### 2. Testar Sistema

```bash
php test_bosses.php
```

### 3. Configurar Cron

**cPanel > Cron Jobs:**
```
*/5 * * * * php /home/usuario/public_html/api/cron.php
```

**Linux (crontab -e):**
```
*/5 * * * * php /var/www/html/api/cron.php
```

### 4. Verificar Widget

Acesse o site e veja o widget lateral direito:
- Deve mostrar "Bosses Vivos: X/120"
- Atualiza automaticamente a cada 30 segundos

## 📁 Estrutura de Arquivos

```
/public/api/
├── config.php                    # Configuração do MySQL
├── cron.php                      # Cron principal (chama todos)
├── server_info.php               # Coleta dados do servidor
├── get_server_info.php           # API REST pública
├── test_bosses.php               # Script de teste
├── BOSSES_CONFIG.md              # Documentação bosses
├── SERVER_INFO_SYSTEM.md         # Esta documentação
└── data/
    └── server_info.json          # Cache dos dados

/src/app/components/
└── server-info-widget.tsx        # Widget React
```

## 🎨 Visualização no Widget

```
┌──────────────────────────────────┐
│ Status do Servidor               │
│ ● Online                    ━━━  │
├──────────────────────────────────┤
│ 💻 Versão                        │
│    Season 19-2-3                 │
├──────────────────────────────────┤
│ 📊 EXP Rate                      │
│    9999x                         │
├──────────────────────────────────┤
│ 💎 Drop Rate                     │
│    60%                           │
├──────────────────────────────────┤
│ 👥 Players Online                │
│    1,247                         │
├──────────────────────────────────┤
│ 💀 Bosses Vivos            🆕    │
│    87/120                        │
└──────────────────────────────────┘
```

## 🔄 Atualização Automática

### Backend (Cron):
- Roda a cada **5 minutos**
- Atualiza `server_info.json`
- Conecta diretamente ao MySQL

### Frontend (Widget):
- Faz fetch a cada **30 segundos**
- Usa cache se disponível
- Fallback para JSON estático

## 📡 API REST

### Endpoint:
```
GET /api/get_server_info.php
```

### Resposta (JSON):
```json
{
    "status": "online",
    "players_online": 1247,
    "total_accounts": 5634,
    "total_characters": 12847,
    "total_guilds": 234,
    "castle_owner": "DragonGuard",
    "total_bosses": 120,
    "alive_bosses": 87,
    "server_name": "MeuMU Online",
    "season": "Season 19-2-3 - Épico",
    "exp_rate": "9999x",
    "drop_rate": "60%",
    "updated_at": "2025-01-15 14:30:00"
}
```

### Códigos HTTP:
- `200 OK` - Servidor online
- `503 Service Unavailable` - Banco offline

## 🛠️ Personalização

### Alterar Frequência do Cron:

```bash
# A cada 1 minuto (mais rápido)
*/1 * * * * php /path/to/cron.php

# A cada 10 minutos (mais lento)
*/10 * * * * php /path/to/cron.php
```

### Alterar Cache do Frontend:

Em `server-info-widget.tsx`:

```typescript
// Atualizar a cada 1 minuto
const interval = setInterval(fetchServerInfo, 60000);
```

### Adicionar Novos Dados:

1. **Backend** (`server_info.php`):
```php
$server_info = [
    // ... dados existentes
    'novo_dado' => $valor,
];
```

2. **Frontend** (`server-info-widget.tsx`):
```typescript
interface ServerData {
    // ... campos existentes
    novo_dado: string;
}
```

3. **Widget**:
```typescript
{
    label: "Novo Dado",
    value: serverData?.novo_dado || "0",
    icon: IconName,
}
```

## 🐛 Troubleshooting

### Widget não mostra dados:

1. Verifique console do navegador (F12)
2. Teste a API diretamente: `/api/get_server_info.php`
3. Verifique se o arquivo JSON existe: `/api/data/server_info.json`
4. Veja logs do PHP

### Bosses sempre em 0:

1. Execute: `php test_bosses.php`
2. Verifique se tabela `Monster` existe
3. Veja se campo `Life` está correto
4. Ajuste os mapas monitorados

### Cron não executa:

1. Verifique logs: `tail -f /var/log/cron.log`
2. Teste manual: `php /path/to/cron.php`
3. Verifique permissões de escrita em `/data/`
4. Confirme que o cron está salvo

### Cache desatualizado:

1. Delete o cache: `rm /api/data/server_info.json`
2. Execute manual: `php server_info.php`
3. Verifique permissões: `chmod 666 server_info.json`

## 📊 Monitoramento

### Ver última atualização:

```bash
cat /public/api/data/server_info.json | grep updated_at
```

### Ver logs do cron:

```bash
tail -100 /var/log/cron.log | grep cron.php
```

### Testar conexão MySQL:

```bash
php test_bosses.php
```

## 🔒 Segurança

- ✅ PDO com Prepared Statements
- ✅ CORS configurado adequadamente
- ✅ Cache para evitar DDoS
- ✅ Validação de inputs
- ✅ Timeout de queries
- ✅ Error handling robusto

## 📈 Performance

| Operação              | Tempo    | Cache    |
|-----------------------|----------|----------|
| Query MySQL           | ~50ms    | -        |
| Gerar JSON            | ~10ms    | -        |
| Ler cache             | ~2ms     | 30 seg   |
| Frontend fetch        | ~100ms   | 30 seg   |
| **Total (com cache)** | **~2ms** | ✅       |

## 🎯 Próximas Melhorias

- [ ] Adicionar estatísticas de PvP
- [ ] Mostrar próximo evento
- [ ] Adicionar gráfico de players online
- [ ] Sistema de notificações de bosses
- [ ] Alertas quando boss específico nasce
- [ ] Histórico de mortes de bosses
- [ ] Integração com Discord webhooks

## 📞 Suporte

Para mais informações:
- `BOSSES_CONFIG.md` - Detalhes sobre bosses
- `README.md` - Guia geral da API
- Console do navegador - Erros do frontend
- Logs do PHP - Erros do backend

---

**🎮 MeuMU Online - Season 19-2-3 Épico**
**⚔️ Sistema de Bosses implementado com sucesso!**
