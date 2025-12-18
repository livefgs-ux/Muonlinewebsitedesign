# 📊 Sistema de Rankings via Cron - MU Online

Sistema automatizado de geração de rankings para servidores MU Online com **MySQL/MariaDB**.

## ✨ NOVO: Sistema de Bosses em Tempo Real 🐲

Agora o sistema também monitora e exibe **quantos bosses estão vivos** no servidor!

**📖 Guias de Início Rápido:**
- 🚀 **[QUICKSTART.md](QUICKSTART.md)** - Comece em 5 minutos!
- 🐲 **[BOSSES_CONFIG.md](BOSSES_CONFIG.md)** - Configuração de bosses
- 📚 **[SERVER_INFO_SYSTEM.md](SERVER_INFO_SYSTEM.md)** - Sistema completo

**Widget mostra:**
- 💀 Bosses Vivos: 87/120
- 👥 Players Online: 1,247
- 🏰 Dono do Castelo
- 📊 EXP/Drop Rates

## 🔧 Configuração

### 1️⃣ Editar Configurações do Banco de Dados

Abra o arquivo `config.php` e edite com suas credenciais:

```php
define('DB_HOST', 'localhost'); // IP do MySQL Server
define('DB_USER', 'root'); // Usuário do MySQL
define('DB_PASS', 'SuaSenha123'); // Senha do MySQL
define('DB_NAME', 'MuOnline'); // Nome do banco de dados
define('DB_PORT', '3306'); // Porta do MySQL (padrão 3306)
define('DB_CHARSET', 'utf8mb4'); // Charset
```

### 2️⃣ Configurar Cron Job

#### **Via cPanel (Hospedagem Compartilhada)**

1. Acesse **cPanel** → **Cron Jobs**
2. Adicione um novo cron:
   - **Minuto**: `*/5` (a cada 5 minutos)
   - **Hora**: `*`
   - **Dia**: `*`
   - **Mês**: `*`
   - **Dia da Semana**: `*`
   - **Comando**: `/usr/bin/php /home/seu_usuario/public_html/api/cron.php`

#### **Via SSH (VPS/Dedicado)**

```bash
# Editar crontab
crontab -e

# Adicionar linha (executar a cada 5 minutos):
*/5 * * * * /usr/bin/php /var/www/html/api/cron.php >> /var/log/mu_cron.log 2>&1
```

#### **Via Task Scheduler (Windows Server)**

1. Abrir **Task Scheduler**
2. Criar nova tarefa:
   - **Trigger**: A cada 5 minutos
   - **Action**: Executar programa
   - **Program**: `C:\php\php.exe`
   - **Arguments**: `C:\inetpub\wwwroot\api\cron.php`

### 3️⃣ Testar Manualmente

Execute via linha de comando para testar:

```bash
php /caminho/para/cron.php
```

Você deve ver:
```
=== MU Online Cron Started at 2025-01-20 15:30:00 ===
Executing: resets_ranking.php ... Done! (0.245s)
Executing: killers_ranking.php ... Done! (0.189s)
Executing: guilds_ranking.php ... Done! (0.156s)
...
=== Cron Finished! Total time: 2.145s ===
```

## 📁 Estrutura de Arquivos

```
/api/
├── config.php                  # Configurações do banco de dados
├── cron.php                    # Script principal que executa todos os rankings
├── resets_ranking.php          # Top Resets
├── killers_ranking.php         # Top PK/Killers
├── guilds_ranking.php          # Top Guilds
├── levels_ranking.php          # Top Levels
├── masterlevel_ranking.php     # Top Master Level
├── grandresets_ranking.php     # Top Grand Resets
├── online_ranking.php          # Top Tempo Online
├── online_characters.php       # Jogadores Online Agora
├── server_info.php             # Informações do Servidor
└── data/                       # Pasta com JSONs gerados
    ├── resets_ranking.json
    ├── killers_ranking.json
    ├── guilds_ranking.json
    └── ...
```

## 🎯 Rankings Disponíveis

| Ranking | Arquivo | Descrição |
|---------|---------|-----------|
| **Top Resets** | resets_ranking.php | Personagens com mais resets |
| **Top PK** | killers_ranking.php | Personagens com mais kills |
| **Top Guilds** | guilds_ranking.php | Guilds com maior score |
| **Top Levels** | levels_ranking.php | Personagens com maior level |
| **Top Master Level** | masterlevel_ranking.php | Personagens com maior master level |
| **Top Grand Resets** | grandresets_ranking.php | Personagens com mais grand resets |
| **Top Online** | online_ranking.php | Personagens com mais tempo jogado |
| **Players Online** | online_characters.php | Jogadores online no momento |
| **Server Info** | server_info.php | Informações gerais do servidor |

## 🔍 Formato dos JSONs

Todos os JSONs seguem o padrão:

```json
{
  "updated_at": "2025-01-20 15:30:00",
  "total": 100,
  "data": [
    {
      "rank": 1,
      "name": "ImmortalKing",
      "class": "Dark Knight",
      "resets": 250,
      "level": 400
    }
  ]
}
```

## ⚙️ Personalização

### Alterar Frequência de Atualização

Edite o cron job:
- **1 minuto**: `* * * * *`
- **5 minutos**: `*/5 * * * *`
- **15 minutos**: `*/15 * * * *`
- **1 hora**: `0 * * * *`

### Adicionar Novos Rankings

1. Crie um novo arquivo PHP em `/api/`
2. Siga o padrão dos rankings existentes
3. Adicione o arquivo no array `$ranking_files` do `cron.php`

## 🚨 Troubleshooting

### Erro: "Access denied for user"
- Verifique usuário/senha no `config.php`
- Verifique se o usuário tem permissões no banco

### Erro: "could not find driver"
- Instale extensão PHP para MySQL/MariaDB:
```bash
# Linux
apt-get install php-mysql

# Windows
# Habilite extension=php_mysql.dll no php.ini
```

### Cron não executa
- Verifique caminho do PHP: `which php`
- Verifique permissões: `chmod +x cron.php`
- Verifique logs: `tail -f /var/log/cron.log`

## 📞 Suporte

Para dúvidas sobre configuração de colunas específicas do seu banco de dados MU Online, consulte a documentação do seu Files.