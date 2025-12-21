# 🎮 MeuMU Online - Season 19-2-3 Épico

Site completo para servidor privado de Mu Online com tema Dark Medieval Fantasy.

## ⚡ Instalação Rápida (5 minutos)

### **1. Extrair arquivos**
```bash
# Extrair MeuMU-Online.zip em:
# - XAMPP: C:\xampp\htdocs\
# - CyberPanel: /home/seudominio.com/public_html/
# - Linux: /var/www/html/
```

### **2. Acessar instalador**
```
http://localhost/install
OU
http://seudominio.com/install
```

### **3. Preencher formulário**
- Host Database: `localhost`
- Database: `MuOnline`
- Usuário: `root`
- Senha: `sua_senha`
- Modo Backend: `PM2` ou `Node Standalone`

### **4. Clicar em "Instalar"**

✅ **Pronto! Site funcionando!**

---

## 🏗️ Estrutura

```
meumu-online/
├── install/          ← Instalador automático
├── src/              ← Frontend React
├── backend-nodejs/   ← Backend Node.js + MariaDB
├── api/              ← Proxy PHP
├── assets/           ← Build do frontend
├── scripts/          ← Scripts úteis
└── index.html        ← Entry point
```

---

## 🔧 Requisitos

- ✅ PHP 7.4+
- ✅ Node.js 18+
- ✅ MariaDB/MySQL 10.3+
- ✅ Apache/LiteSpeed/Nginx

---

## 📚 Documentação

Toda documentação técnica está em `/logs-criacao/`:
- Guias de instalação manual
- Troubleshooting
- API documentation
- Histórico de desenvolvimento

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento frontend
npm run dev

# Build produção
npm run build

# Deploy
bash scripts/deploy.sh

# Iniciar backend
bash scripts/start-backend.sh
```

---

## 🌐 Domínio

O site funciona com **1 único domínio**:
- ✅ `seudominio.com` → Site
- ✅ `seudominio.com/api/...` → API
- ❌ NÃO precisa de `api.seudominio.com`
- ❌ NÃO precisa configurar DNS

---

## 🎯 Features

- ⚔️ Sistema de Login/Cadastro seguro
- 👤 Painel do Jogador com gestão de personagens
- 📊 Rankings em tempo real (PvP, Guild, Resets)
- 🎁 Sistema de Eventos automático
- 📰 Sistema de Notícias
- 💰 Shop WCoin integrado
- 🛡️ AdminCP completo
- 🌍 Multilíngue (8 idiomas)
- 📱 100% Responsivo

---

## 🔐 Dados Reais

✅ **TODOS os dados vêm direto do database MariaDB do MU Online**
- Rankings reais
- Characters reais
- Status do servidor real
- Eventos reais
❌ **SEM dados mockados**

---

## 💬 Suporte

Problemas? Acesse o instalador em `/install` - ele diagnostica e corrige automaticamente!

---

**MeuMU Online** - Desenvolvido com ❤️ para a comunidade MU Online
