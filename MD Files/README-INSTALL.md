# 🎮 MeuMU Online - Instalação Detalhada

## 📋 Requisitos

- **Node.js** 16+ (recomendado 18+)
- **MySQL/MariaDB** 5.7+
- **PM2** (instalado automaticamente)
- **Linux** (Ubuntu/Debian/CentOS)

---

## 🚀 Instalação em 3 Passos

### **1. Execute o script de setup:**

```bash
chmod +x setup.sh
./setup.sh
```

### **2. Abra o instalador web:**

Acesse no navegador:

```
http://SEU-IP:3001/install
```

ou

```
http://seu-dominio.com:3001/install
```

### **3. Siga as instruções na tela:**

- ✅ Verificação de requisitos
- ✅ Configuração de databases
- ✅ Instalação automática
- ✅ Pronto!

---

## 🎯 Como Funciona

### **Backend serve TUDO:**

```
http://seu-dominio.com:3001/
├── /install          → Instalador web
├── /api/*            → API REST
└── /*                → Frontend React
```

**UMA porta, SEM proxy reverso necessário!**

---

## ✅ Após a Instalação

O site estará disponível em:

```
http://seu-dominio.com:3001
```

Se você configurou proxy reverso (opcional), também funcionará em:

```
http://seu-dominio.com
```

---

## 🔧 Comandos Úteis

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs meumu-backend

# Reiniciar
pm2 restart meumu-backend

# Parar
pm2 stop meumu-backend

# Iniciar
pm2 start meumu-backend
```

---

## 🗑️ Remover Instalador

Por segurança, remova a pasta `/install` após a instalação:

**Opção 1:** Via interface web (botão no final da instalação)

**Opção 2:** Manualmente:

```bash
rm -rf install/
```

---

## ❓ Problemas Comuns

### **Backend não inicia:**

```bash
cd backend-nodejs
node src/server.js
```

Veja o erro e corrija (geralmente .env ou MySQL)

### **Porta 3001 já em uso:**

```bash
pkill -9 node
pm2 delete all
./setup.sh
```

### **MySQL não conecta:**

Verifique:
- MySQL está rodando: `systemctl status mysql`
- Credenciais corretas no instalador
- Database existe: `mysql -e 'SHOW DATABASES;'`

---

## 📞 Suporte

- 📧 Email: suporte@meumu.com
- 💬 Discord: discord.gg/meumu

---

## 📄 Licença

© 2024 MeuMU Online. Todos os direitos reservados.
