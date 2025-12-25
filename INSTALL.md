# 🎯 MEUMU ONLINE - GUIA DE INSTALAÇÃO RÁPIDA

## ✅ PRÉ-REQUISITOS (JÁ ATENDIDOS)
- ✅ Node.js instalado
- ✅ MySQL/MariaDB instalado e rodando
- ✅ Databases `muonline` e `webmu` criadas
- ✅ Senha do MySQL: `@mysql123@`

---

## 🚀 INSTALAÇÃO AUTOMÁTICA (RECOMENDADO)

### **PASSO 1: Baixar arquivos do Figma Make**

Copie estes 2 arquivos para o servidor:

1. `/backend-nodejs/.env.production` → Copiar para `/home/meumu.com/public_html/backend-nodejs/`
2. `/install.sh` → Copiar para `/home/meumu.com/public_html/`

### **PASSO 2: Executar instalador**

```bash
cd /home/meumu.com/public_html
chmod +x install.sh
./install.sh
```

**O script vai fazer tudo automaticamente:**
- ✅ Verificar MySQL
- ✅ Copiar .env correto
- ✅ Rebuildar frontend
- ✅ Reiniciar servidor Node.js
- ✅ Testar conexões

---

## 🔧 INSTALAÇÃO MANUAL (3 COMANDOS)

Se preferir fazer manualmente:

```bash
# 1. Copiar .env
cd /home/meumu.com/public_html
cp backend-nodejs/.env.production backend-nodejs/.env

# 2. Rebuildar frontend
npm run build

# 3. Reiniciar servidor
pkill -f "node.*server.js"
cd backend-nodejs && npm start &
```

---

## 🌐 ACESSAR O SITE

Depois da instalação, acesse:

- **Frontend:** http://meumu.com:3001
- **API:** http://meumu.com:3001/api
- **Health Check:** http://meumu.com:3001/health
- **Instalador Web:** http://meumu.com:3001/install

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

```bash
# Teste 1: Health check
curl http://localhost:3001/health

# Teste 2: Ver logs
tail -f /home/meumu.com/public_html/backend-nodejs/logs/server.log

# Teste 3: Verificar processos Node
ps aux | grep node
```

---

## ❌ RESOLUÇÃO DE PROBLEMAS

### Problema: "Conexão recusada"
```bash
# Verificar se MySQL está rodando
sudo systemctl status mariadb

# Testar senha do MySQL
mysql -u root -p@mysql123@ -e "SHOW DATABASES;"
```

### Problema: "Failed to fetch"
```bash
# Verificar se porta 3001 está aberta
sudo netstat -tulnp | grep 3001

# Verificar firewall
sudo ufw status
sudo ufw allow 3001/tcp
```

### Problema: Servidor não inicia
```bash
# Ver erros no log
cat /home/meumu.com/public_html/backend-nodejs/logs/server.log

# Testar manualmente
cd /home/meumu.com/public_html/backend-nodejs
npm start
# (deixe rodando e veja os erros)
```

---

## 📁 ARQUIVOS CRIADOS

- `/backend-nodejs/.env.production` → Configuração correta do backend
- `/install.sh` → Script de instalação automática
- `/INSTALL.md` → Este guia

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Reiniciar servidor
pkill -f "node.*server.js" && cd /home/meumu.com/public_html/backend-nodejs && npm start &

# Ver logs em tempo real
tail -f /home/meumu.com/public_html/backend-nodejs/logs/server.log

# Verificar status
curl http://localhost:3001/health

# Rebuildar frontend
cd /home/meumu.com/public_html && npm run build
```

---

## 🎉 PRÓXIMOS PASSOS APÓS INSTALAÇÃO

1. ✅ Acessar http://meumu.com:3001
2. ✅ Testar login com conta existente do MU
3. ✅ Verificar rankings
4. ✅ Testar painel do jogador
5. ✅ Configurar eventos (se necessário)

---

## 📞 SUPORTE

Se encontrar problemas:
1. Leia a seção "RESOLUÇÃO DE PROBLEMAS" acima
2. Verifique os logs: `tail -f backend-nodejs/logs/server.log`
3. Teste conexão MySQL: `mysql -u root -p@mysql123@ -e "SHOW DATABASES;"`

---

**Criado por: Figma Make AI Assistant**  
**Data:** 25/12/2025