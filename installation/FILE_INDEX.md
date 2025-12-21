# 📑 ÍNDICE COMPLETO DE ARQUIVOS - Pasta de Instalação

Este documento lista **TODOS** os arquivos disponíveis na pasta `/installation` com suas descrições e finalidades.

---

## 📂 ESTRUTURA DE ARQUIVOS

```
/installation/
├── README.md                           - Este índice (leia primeiro!)
├── INSTALLATION_GUIDE.md               - ⭐ Guia completo (45 páginas)
├── QUICK_START.md                      - ⚡ Guia rápido (5 minutos)
├── API_REFERENCE.md                    - 📡 Documentação da API
├── IMPLEMENTATION_SUMMARY.md           - 📊 Resumo técnico executivo
├── TROUBLESHOOTING.md                  - 🔧 Solução de problemas
├── install.sh                          - 🚀 Instalador automatizado (Linux)
├── setup-database.sh                   - 🗄️ Configuração do banco
├── setup-nginx.sh                      - 🌐 Configuração do Nginx
├── backup.sh                           - 💾 Script de backup
├── restore.sh                          - ♻️ Script de restauração
└── config/
    ├── .env.example                    - Exemplo de variáveis de ambiente
    ├── nginx.conf.example              - Exemplo de config Nginx
    └── pm2.config.js                   - Configuração PM2
```

---

## 📄 DESCRIÇÃO DOS ARQUIVOS

### 📖 Documentação

#### `README.md` ⭐ **LEIA PRIMEIRO**
- Visão geral da pasta de instalação
- Como começar
- Opções de instalação disponíveis

#### `INSTALLATION_GUIDE.md` (45 páginas)
**Guia completo e detalhado contendo:**
- Requisitos do sistema
- Preparação do ambiente (Node.js, MySQL, Nginx)
- Instalação passo a passo
- Configuração completa do backend
- Configuração completa do frontend
- Setup do Nginx como proxy reverso
- Configuração de SSL/HTTPS com Certbot
- PM2 para gerenciamento de processos
- Firewall (UFW) e Fail2Ban
- Otimização de performance
- Hardening de segurança
- Sistema de logs e monitoramento
- Backup e recuperação
- Troubleshooting detalhado

**Quando usar:** Para instalação em produção completa

#### `QUICK_START.md` (1 página)
**Guia rápido de 5 minutos contendo:**
- Pré-requisitos
- 5 comandos essenciais
- Configuração mínima
- Acesso rápido ao sistema

**Quando usar:** Se você já tem experiência e quer instalar rapidamente

#### `API_REFERENCE.md` (30 páginas)
**Documentação completa da API REST contendo:**
- Todos os 20+ endpoints documentados
- Request/Response de cada rota
- Exemplos em JavaScript, Python, cURL
- Códigos de erro e status
- Rate limiting
- Autenticação JWT
- Query parameters
- Webhook configurations

**Quando usar:** Para integrar com sistemas externos ou desenvolver

#### `IMPLEMENTATION_SUMMARY.md` (50 páginas)
**Resumo técnico executivo contendo:**
- Visão geral do sistema completo
- Todos os módulos implementados
- Estrutura de arquivos completa
- Rotas frontend e backend
- Tabelas do banco de dados
- Funcionalidades implementadas
- Checklist de produção
- Status final do projeto

**Quando usar:** Para entender o sistema completo antes de instalar

#### `TROUBLESHOOTING.md`
**Solução de problemas comuns:**
- Erros de conexão MySQL
- Problemas com Node.js/PM2
- Erros do Nginx
- Problemas de SSL
- Performance issues
- Logs e debugging

**Quando usar:** Quando encontrar algum problema

---

### 🔧 Scripts de Instalação

#### `install.sh` ⚡ **RECOMENDADO**
**Instalador automatizado para Linux (Ubuntu/Debian)**

**O que faz:**
1. ✅ Atualiza sistema (apt update)
2. ✅ Instala Node.js 18+
3. ✅ Instala MariaDB
4. ✅ Instala PM2 globalmente
5. ✅ Instala Nginx
6. ✅ Instala Certbot (SSL)
7. ✅ Cria diretório do projeto
8. ✅ Instala dependências npm
9. ✅ Configura firewall (UFW)
10. ✅ Cria arquivo .env

**Como usar:**
```bash
cd /var/www/meumuonline/installation
chmod +x install.sh
sudo ./install.sh
```

**Tempo estimado:** 5-10 minutos

---

#### `setup-database.sh`
**Configuração automatizada do banco de dados**

**O que faz:**
1. ✅ Solicita credenciais MySQL
2. ✅ Testa conexão
3. ✅ Verifica banco MuOnline existente
4. ✅ Cria banco webmu
5. ✅ Importa todas as tabelas SQL
6. ✅ Exibe informações para .env

**Como usar:**
```bash
chmod +x setup-database.sh
./setup-database.sh
```

**Tempo estimado:** 2-3 minutos

---

#### `setup-nginx.sh`
**Configuração automatizada do Nginx**

**O que faz:**
1. ✅ Solicita nome do domínio
2. ✅ Cria configuração otimizada
3. ✅ Configura proxy para API (porta 3001)
4. ✅ Configura SPA (React Router)
5. ✅ Ativa Gzip compression
6. ✅ Adiciona security headers
7. ✅ Cria link simbólico
8. ✅ Remove site padrão
9. ✅ Testa e reinicia Nginx

**Como usar:**
```bash
chmod +x setup-nginx.sh
sudo ./setup-nginx.sh
```

**Tempo estimado:** 1-2 minutos

---

### 💾 Scripts de Backup

#### `backup.sh`
**Backup completo automatizado**

**O que faz:**
1. ✅ Backup do banco webmu (compactado .gz)
2. ✅ Backup dos arquivos do projeto (tar.gz)
3. ✅ Remove backups antigos (7+ dias)
4. ✅ Exibe estatísticas

**Como usar:**
```bash
chmod +x backup.sh
./backup.sh
```

**Agendar com cron (diário às 3h):**
```bash
sudo crontab -e
# Adicionar:
0 3 * * * /var/www/meumuonline/installation/backup.sh
```

**Local dos backups:** `/var/backups/meumuonline/`

---

#### `restore.sh`
**Restauração de backup**

**O que faz:**
1. ✅ Lista backups disponíveis
2. ✅ Permite escolher qual restaurar
3. ✅ Restaura banco de dados
4. ✅ Restaura arquivos
5. ✅ Reinicia serviços

**Como usar:**
```bash
chmod +x restore.sh
./restore.sh
```

**⚠️ ATENÇÃO:** Restaurar irá sobrescrever dados atuais!

---

### ⚙️ Arquivos de Configuração

#### `config/.env.example`
Arquivo de exemplo com todas as variáveis de ambiente necessárias.

**Variáveis principais:**
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- DB_NAME_MUONLINE, DB_NAME_WEBMU
- JWT_SECRET, ENCRYPTION_KEY
- NODE_ENV, PORT
- RATE_LIMIT settings
- ALLOWED_ORIGINS (CORS)

**Como usar:**
```bash
cp config/.env.example ../backend-nodejs/.env
nano ../backend-nodejs/.env
# Editar valores
```

---

#### `config/nginx.conf.example`
Arquivo de exemplo de configuração completa do Nginx.

**Inclui:**
- Configuração de proxy reverso
- SPA routing (React Router)
- Gzip compression
- Security headers
- SSL/HTTPS (comentado)
- Rate limiting
- Logs

**Como usar:**
```bash
sudo cp config/nginx.conf.example /etc/nginx/sites-available/meumuonline
sudo nano /etc/nginx/sites-available/meumuonline
# Ajustar domínio e paths
```

---

#### `config/pm2.config.js`
Configuração do PM2 para gerenciamento de processos.

**Configurações:**
- Nome da aplicação
- Script de entrada
- Modo cluster (multi-core)
- Watch para desenvolvimento
- Variáveis de ambiente
- Logs

**Como usar:**
```bash
cp config/pm2.config.js ../backend-nodejs/
pm2 start ../backend-nodejs/pm2.config.js
```

---

## 🎯 FLUXOS DE INSTALAÇÃO

### Fluxo 1: Automatizado Completo (Recomendado)

```bash
1. sudo ./install.sh               # Instala dependências do sistema
2. ./setup-database.sh             # Configura banco de dados
3. nano ../backend-nodejs/.env     # Editar configurações
4. npm run build                   # Build frontend
5. pm2 start backend               # Iniciar backend
6. sudo ./setup-nginx.sh           # Configurar Nginx
7. sudo certbot --nginx            # Obter SSL
8. Acessar /install no navegador   # Wizard final
```

**Tempo total:** ~15 minutos

---

### Fluxo 2: Manual Completo

```bash
1. Seguir INSTALLATION_GUIDE.md passo a passo
2. Executar cada comando manualmente
3. Testar cada etapa
```

**Tempo total:** ~30-45 minutos

---

### Fluxo 3: Rápido (Experientes)

```bash
1. Seguir QUICK_START.md
2. 5 comandos principais
3. Pronto!
```

**Tempo total:** ~5 minutos

---

## 📚 QUANDO USAR CADA ARQUIVO

| Situação | Arquivo Recomendado |
|----------|---------------------|
| Primeira instalação completa | `install.sh` + `INSTALLATION_GUIDE.md` |
| Já tenho Node/MySQL instalados | `setup-database.sh` + `setup-nginx.sh` |
| Sou experiente em Linux | `QUICK_START.md` |
| Quero entender a API | `API_REFERENCE.md` |
| Preciso fazer backup | `backup.sh` |
| Sistema deu erro | `TROUBLESHOOTING.md` |
| Quero visão técnica | `IMPLEMENTATION_SUMMARY.md` |
| Integrar com sistema externo | `API_REFERENCE.md` |

---

## ✅ CHECKLIST DE ARQUIVOS

Verifique se você tem todos os arquivos:

- [ ] README.md
- [ ] INSTALLATION_GUIDE.md
- [ ] QUICK_START.md
- [ ] API_REFERENCE.md
- [ ] IMPLEMENTATION_SUMMARY.md
- [ ] TROUBLESHOOTING.md
- [ ] install.sh
- [ ] setup-database.sh
- [ ] setup-nginx.sh
- [ ] backup.sh
- [ ] restore.sh
- [ ] config/.env.example
- [ ] config/nginx.conf.example
- [ ] config/pm2.config.js

---

## 🆘 SUPORTE

Se algum arquivo estiver faltando ou com problemas:

1. Verifique o repositório GitHub
2. Baixe novamente o pacote completo
3. Entre em contato no Discord
4. Abra issue no GitHub

---

## 📞 CONTATOS

- **Discord:** https://discord.gg/meumuonline
- **GitHub:** https://github.com/seu-repo/meumuonline
- **Email:** suporte@meumuonline.com

---

**Última atualização:** 21 de Dezembro de 2024  
**Versão:** 1.0.0
