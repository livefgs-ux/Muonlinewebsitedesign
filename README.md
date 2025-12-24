# 🎮 MeuMU Online

**Servidor Privado de Mu Online Completo**  
Dark Medieval Fantasy · Multilíngue (PT/EN/ES) · 100% Responsivo

---

## 🚀 INSTALAÇÃO RÁPIDA

### **Requisitos:**
- Node.js 18+ ([Download](https://nodejs.org))
- MariaDB/MySQL

### **Passo 1: Clonar/Baixar**

```bash
git clone https://github.com/seu-usuario/meumu-online.git
cd meumu-online
```

### **Passo 2: Executar Diagnóstico + Auto-Fix**

```bash
node check.js
# Escolha opção 1 (Diagnóstico)
# Digite S quando perguntar para corrigir
```

**OU execute direto:**

```bash
node check.js fix
```

### **Passo 3: Configurar .env**

Edite `backend-nodejs/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME_MUONLINE=MuOnline
DB_NAME_WEBMU=WebMU
JWT_SECRET=gere_um_secret_de_64_caracteres
```

### **Iniciar:**

```bash
# Desenvolvimento
npm run deploy:dev

# Produção (PM2)
npm run deploy:prod
```

**Acesse:** http://localhost:3001

---

## 🔧 COMANDOS

| Comando | Descrição |
|---------|-----------|
| `npm run check` | Menu diagnóstico interativo |
| `npm run check:fix` | Fix automático |
| `npm run check:security` | Scan de segurança |
| `npm run deploy:dev` | Iniciar (dev) |
| `npm run deploy:prod` | Iniciar (produção) |

---

## 📁 ESTRUTURA

```
/
├── install.js          Instalador
├── check.js            Diagnóstico
├── cleanup.js          Limpeza
├── README.md           Este arquivo
├── CHANGELOG.md        Histórico completo
├── backend-nodejs/     Backend Node.js + Express
│   ├── .env.example    Template
│   ├── src/            Código fonte
│   └── package.json
└── src/                Frontend React
```

---

## 🎨 FEATURES

- 🔐 Login/Cadastro seguro
- 👤 Dashboard do jogador
- 🎮 Gestão de personagens
- 🔄 Sistema de reset
- 🏆 Rankings (Players/Guilds/PvP)
- ⏱️ Cronômetros de eventos
- 📰 Sistema de notícias
- 💎 Sistema WCoin
- 🌍 Multilíngue (PT/EN/ES)
- 📱 100% Responsivo

---

## 🔒 SEGURANÇA

15 camadas de proteção:
- JWT + bcrypt
- Rate limiting (4 níveis)
- XSS/SQL Injection protection
- Audit logs completos
- Git hooks (anti-secrets)
- Headers seguros (Helmet)

**Score: 98/100** 🎯

---

## 🌍 COMPATIBILIDADE

✅ Windows · Linux · macOS  
✅ XAMPP · CyberPanel · VPS

---

## 🆘 PROBLEMAS?

```bash
npm run check
# Opção 2: Fix Automático
```

Ver: [CHANGELOG.md](CHANGELOG.md) para histórico completo

---

## 📝 LICENÇA

MIT License

---

**🎄 Feliz Natal! Bom jogo! 🎮**