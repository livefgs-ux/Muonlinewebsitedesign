# ⚡ Guia de Início Rápido - Sistema de Bosses

## 🎯 Para Ver o Widget Funcionando AGORA (Sem MySQL)

### 1. Os dados demo já estão prontos!
O arquivo `/public/api/data/server_info.json` já contém dados de exemplo.

### 2. Acesse seu site
O widget já deve estar funcionando mostrando:
- ✅ Players Online: 1,247
- ✅ **Bosses Vivos: 87/120** ← NOVO!
- ✅ Versão, EXP Rate, Drop Rate

### 3. Gerar novos dados demo (opcional)
```bash
php /public/api/generate_demo_data.php
```

---

## 🗄️ Para Conectar ao MySQL Real

### Passo 1: Configurar Database (2 minutos)

Edite `/public/api/config.php`:

```php
define('DB_HOST', 'localhost');      // ou IP do seu MySQL
define('DB_USER', 'seu_usuario');    // usuário do MySQL
define('DB_PASS', 'sua_senha');      // senha do MySQL
define('DB_NAME', 'MuOnline');       // nome do database
```

### Passo 2: Testar Conexão (1 minuto)

```bash
cd /public/api
php test_bosses.php
```

Se aparecer "✓ Conexão OK", está pronto!

### Passo 3: Executar Primeira Vez (30 segundos)

```bash
php server_info.php
```

Isso vai buscar dados reais do MySQL e salvar no cache.

### Passo 4: Configurar Cron Automático (2 minutos)

**No cPanel:**
1. Vá em "Cron Jobs"
2. Adicione:
   ```
   */5 * * * * php /home/usuario/public_html/api/cron.php
   ```

**No Linux (Terminal):**
```bash
crontab -e
# Adicionar linha:
*/5 * * * * php /var/www/html/api/cron.php
```

---

## ✅ Pronto!

Seu widget agora:
- 🔄 Atualiza automaticamente a cada 30 segundos
- 🐲 Mostra bosses vivos em tempo real
- 💾 Cache inteligente (30 seg)
- 🚀 Performance otimizada

---

## 🎨 Como Fica no Widget

```
╔═══════════════════════════════════╗
║  Status do Servidor               ║
║  ● Online                    ━━━  ║
╠═══════════════════════════════════╣
║  💻 Versão                        ║
║     Season 19-2-3                 ║
╠───────────────────────────────────╣
║  📊 EXP Rate                      ║
║     9999x                         ║
╠───────────────────────────────────╣
║  💎 Drop Rate                     ║
║     60%                           ║
╠───────────────────────────────────╣
║  👥 Players Online                ║
║     1,247                         ║
╠───────────────────────────────────╣
║  💀 Bosses Vivos            [NEW] ║
║     87/120                        ║
╚═══════════════════════════════════╝
```

---

## 🐛 Problemas?

### Widget não aparece?
- Está em tela grande? (Widget oculto em mobile)
- Está em AdminCP? (Widget oculto lá)
- Abra F12 > Console para ver erros

### Dados não atualizam?
```bash
# Gerar novos dados demo
php generate_demo_data.php

# Ou testar com MySQL
php test_bosses.php
```

### Bosses sempre em 0?
- Sua tabela Monster pode ter nome diferente
- Edite `server_info.php` e ajuste a query
- Veja `BOSSES_CONFIG.md` para mais detalhes

---

## 📚 Documentação Completa

- `SERVER_INFO_SYSTEM.md` - Guia completo do sistema
- `BOSSES_CONFIG.md` - Configuração detalhada de bosses
- `README.md` - Documentação geral da API

---

## 🎮 Aproveite seu servidor MU Online!

**MeuMU Online - Season 19-2-3 Épico** ⚔️🐲

Sistema desenvolvido com:
- React + TypeScript
- PHP 7.4+
- MySQL/MariaDB
- Cron Jobs
- REST API
