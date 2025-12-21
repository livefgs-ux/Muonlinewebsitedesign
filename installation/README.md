# 📦 PACOTE DE INSTALAÇÃO - MeuMU Online CMS

Este diretório contém todos os arquivos necessários para instalação e configuração do sistema.

---

## 📂 CONTEÚDO DA PASTA

### 📄 Documentação
- `INSTALLATION_GUIDE.md` - Guia completo de instalação (45 páginas)
- `API_REFERENCE.md` - Documentação da API REST
- `QUICK_START.md` - Guia rápido (5 minutos)
- `IMPLEMENTATION_SUMMARY.md` - Resumo executivo completo

### ⚙️ Scripts de Instalação
- `install.sh` - Script automatizado para Linux
- `install-windows.bat` - Script para Windows
- `setup-database.sh` - Script de configuração do banco
- `setup-nginx.sh` - Script de configuração do Nginx

### 🗄️ SQL
- `database/` - Todos os arquivos SQL necessários

### 📋 Configuração
- `.env.example` - Arquivo de exemplo de variáveis de ambiente
- `nginx.conf.example` - Configuração exemplo do Nginx
- `pm2.config.js` - Configuração do PM2

### 🔧 Utilitários
- `backup.sh` - Script de backup automatizado
- `restore.sh` - Script de restauração
- `health-check.sh` - Verificação de saúde do sistema

---

## 🚀 INSTALAÇÃO RÁPIDA

### Opção 1: Script Automatizado (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-repo/meumuonline.git
cd meumuonline

# Execute o instalador
cd installation
chmod +x install.sh
sudo ./install.sh
```

### Opção 2: Instalador Visual

1. Configure o servidor conforme documentação
2. Acesse `https://seudominio.com/install`
3. Siga o wizard de 3 etapas

### Opção 3: Manual

Consulte `INSTALLATION_GUIDE.md` para instruções detalhadas.

---

## 📖 DOCUMENTOS

### Para Administradores
- **INSTALLATION_GUIDE.md** - Leia primeiro! Guia completo.
- **QUICK_START.md** - Se tem experiência, comece aqui.

### Para Desenvolvedores
- **API_REFERENCE.md** - Documentação da API REST.
- **IMPLEMENTATION_SUMMARY.md** - Visão técnica do sistema.

---

## ✅ CHECKLIST DE PRÉ-INSTALAÇÃO

Antes de começar, certifique-se de ter:

- [ ] Servidor Linux ou Windows Server
- [ ] Node.js 18+ instalado
- [ ] MySQL/MariaDB instalado
- [ ] Banco MuOnline existente
- [ ] Domínio configurado (opcional)
- [ ] Acesso root/admin ao servidor

---

## 🆘 SUPORTE

Se encontrar problemas:

1. Consulte `TROUBLESHOOTING.md`
2. Verifique logs em `/logs`
3. Abra issue no GitHub
4. Entre em contato no Discord

---

**Boa instalação!** 🎮
