# ⚔️ MeuMU Online - Website Completo

**Servidor Privado de Mu Online com sistema web moderno, seguro e responsivo.**

---

## 🚀 **INSTALAÇÃO RÁPIDA (5 MINUTOS)**

### **NOVO: Instalador Web Visual! 🎉**

```bash
# 1. Entrar no diretório
cd /home/meumu.com/public_html

# 2. Iniciar servidor
node check.js
# Digite: 4 (Deploy - Desenvolvimento)

# 3. Abrir navegador
# http://meumu.com:3001/install

# 4. Seguir os 4 steps no navegador
# → Configurar MySQL
# → Criar database webmu
# → Gerar JWT secret
# → Finalizar

# 5. Reiniciar servidor
# Ctrl+C
# node check.js → 4

# PRONTO! Backend configurado! 🎉
```

**📖 Guia detalhado:** [GUIA-RAPIDO-INSTALADOR.md](./GUIA-RAPIDO-INSTALADOR.md)

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