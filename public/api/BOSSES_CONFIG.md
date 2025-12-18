# 🐲 Sistema de Contagem de Bosses - MeuMU Online

## 📋 Descrição

O sistema monitora em tempo real quantos bosses estão vivos no servidor através de consultas diretas ao banco de dados MySQL/MariaDB.

## 🎯 Funcionalidades

- ✅ Contagem em tempo real de bosses vivos
- ✅ Total de bosses configurados no servidor
- ✅ Atualização automática via Cron (a cada 5 minutos)
- ✅ Cache de 30 segundos para otimização
- ✅ API REST para consumo do frontend
- ✅ Sistema de fallback caso o PHP não esteja disponível

## 🗂️ Estrutura do Banco de Dados

### Tabela: `Monster`

O sistema consulta a tabela `Monster` que armazena informações sobre monstros/bosses ativos:

```sql
CREATE TABLE Monster (
    MapNumber INT,      -- Número do mapa onde está o boss
    Life INT,           -- Vida atual do boss
    -- outros campos...
);
```

### Mapas de Bosses Monitorados

Os seguintes mapas são considerados para contagem de bosses:

| Map ID | Nome do Local |
|--------|---------------|
| 6      | Devias        |
| 7      | Dungeon       |
| 8      | Lost Tower    |
| 10     | Atlans        |
| 24     | Kalima        |
| 34     | Crywolf       |
| 39     | Kanturu       |
| 51     | Vulcanus      |
| 56-72  | Outros mapas  |

## 📁 Arquivos do Sistema

### 1. `/public/api/server_info.php` (Cron)
Script executado pelo cron que:
- Conecta ao MySQL
- Conta bosses vivos (`Life > 0`)
- Salva em cache JSON
- Roda a cada 5 minutos

### 2. `/public/api/get_server_info.php` (API REST)
Endpoint público que:
- Retorna dados do cache (se válido)
- Gera novos dados se cache expirado
- Responde em JSON
- Cache de 30 segundos

### 3. `/public/api/data/server_info.json` (Cache)
Arquivo JSON com dados atualizados:
```json
{
    "status": "online",
    "players_online": 1247,
    "total_bosses": 120,
    "alive_bosses": 87,
    "updated_at": "2025-01-15 14:30:00"
}
```

### 4. `/src/app/components/server-info-widget.tsx` (Frontend)
Widget React que:
- Faz fetch da API a cada 30 segundos
- Mostra bosses vivos em tempo real
- Tem fallback para JSON estático
- Ícone de caveira (Skull) para bosses

## 🚀 Como Configurar

### 1. Configurar Banco de Dados

Edite `/public/api/config.php`:

```php
define('DB_HOST', 'localhost');      // IP do MySQL
define('DB_USER', 'root');           // Usuário
define('DB_PASS', 'sua_senha_aqui'); // Senha
define('DB_NAME', 'MuOnline');       // Database
define('DB_PORT', '3306');           // Porta MySQL
```

### 2. Configurar Cron Job

**No cPanel:**
```bash
*/5 * * * * /usr/bin/php /home/usuario/public_html/api/cron.php
```

**No Linux (crontab):**
```bash
*/5 * * * * php /var/www/html/api/cron.php
```

### 3. Testar Manualmente

Execute via terminal:
```bash
php /caminho/para/public/api/server_info.php
```

Ou via navegador:
```
https://seusite.com/api/get_server_info.php
```

## 🎨 Interface do Widget

O widget mostra:

```
┌─────────────────────────┐
│ Status do Servidor      │
│ ● Online                │
├─────────────────────────┤
│ 💻 Versão               │
│    Season 19-2-3        │
├─────────────────────────┤
│ 📊 EXP Rate             │
│    9999x                │
├─────────────────────────┤
│ 💎 Drop Rate            │
│    60%                  │
├─────────────────────────┤
│ 👥 Players Online       │
│    1,247                │
├─────────────────────────┤
│ 💀 Bosses Vivos         │
│    87/120               │
└─────────────────────────┘
```

## 🔧 Personalização

### Alterar Total de Bosses

Edite em `/public/api/server_info.php` e `/public/api/get_server_info.php`:

```php
$totalBosses = 150; // Seu total de bosses
```

### Adicionar/Remover Mapas de Bosses

Modifique o array `$bossMapNumbers`:

```php
$bossMapNumbers = [6, 7, 8, 10, 24, 34, 39, 51, 56, 57];
```

### Alterar Tempo de Cache

Em `/public/api/get_server_info.php`:

```php
if ($cacheAge < 60) { // Mudar de 30 para 60 segundos
```

### Alterar Frequência de Atualização Frontend

Em `/src/app/components/server-info-widget.tsx`:

```typescript
const interval = setInterval(fetchServerInfo, 60000); // 60 segundos
```

## 📊 Consultas SQL Personalizadas

### Contar bosses por mapa:
```sql
SELECT MapNumber, COUNT(*) as total 
FROM Monster 
WHERE Life > 0 
GROUP BY MapNumber;
```

### Listar bosses específicos:
```sql
SELECT * FROM Monster 
WHERE MapNumber IN (6, 7, 8, 10) 
AND Life > 0;
```

### Bosses mortos recentemente:
```sql
SELECT * FROM Monster 
WHERE Life = 0 
ORDER BY LastUpdate DESC 
LIMIT 10;
```

## 🐛 Troubleshooting

### Bosses sempre mostram 0:

1. Verifique se a tabela `Monster` existe:
```sql
SHOW TABLES LIKE 'Monster';
```

2. Verifique se há dados:
```sql
SELECT COUNT(*) FROM Monster;
```

3. Verifique o campo Life:
```sql
SELECT MapNumber, Life FROM Monster LIMIT 10;
```

### Cache não atualiza:

1. Verifique permissões da pasta `/public/api/data/`:
```bash
chmod 755 /public/api/data/
chmod 666 /public/api/data/server_info.json
```

2. Verifique se o cron está rodando:
```bash
tail -f /var/log/cron.log
```

### API retorna erro:

1. Ative debug no PHP:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

2. Verifique logs do Apache/Nginx:
```bash
tail -f /var/log/apache2/error.log
```

## 📱 Responsividade

O widget é **oculto em mobile** e aparece apenas em telas **lg** (1024px+):

```tsx
className="fixed right-6 top-24 z-40 hidden lg:block"
```

## 🔒 Segurança

- ✅ Prepared Statements (PDO)
- ✅ CORS configurado
- ✅ Cache para evitar sobrecarga
- ✅ Timeout de conexão
- ✅ Validação de dados

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Logs do servidor
- Console do navegador (F12)
- Network tab para ver requisições
- Arquivo de cache JSON

---

**Desenvolvido para MeuMU Online - Season 19-2-3 Épico** ⚔️🐲
