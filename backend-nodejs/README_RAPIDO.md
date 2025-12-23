# 🚀 COMANDOS RÁPIDOS - Backend MeuMU Online

## ⚡ **CORREÇÃO RÁPIDA** (Erro HTML no Instalador)

```bash
cd /home/meumu.com/public_html/backend-nodejs
chmod +x forcar-start.sh
./forcar-start.sh
```

---

## 🔍 **DIAGNÓSTICO**

```bash
cd /home/meumu.com/public_html/backend-nodejs
chmod +x diagnostico.sh
./diagnostico.sh
```

---

## 🛠️ **COMANDOS ÚTEIS**

### **Reiniciar Backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs
pm2 restart meumu-backend
```

### **Ver Logs**

```bash
pm2 logs meumu-backend --lines 50
```

### **Parar Backend**

```bash
pm2 stop meumu-backend
```

### **Iniciar Backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs
pm2 start src/server.js --name meumu-backend --update-env
```

### **Status PM2**

```bash
pm2 status
```

### **Testar API**

```bash
# Health Check
curl http://127.0.0.1:3001/health

# Instalador
curl http://127.0.0.1:3001/api/install/check-requirements

# Pretty JSON
curl http://127.0.0.1:3001/health | python3 -m json.tool
```

### **Testar Database**

```bash
cd /home/meumu.com/public_html/backend-nodejs
node test-db-connection.js
```

### **Ver .env**

```bash
cat /home/meumu.com/public_html/backend-nodejs/.env | grep -v "PASSWORD"
```

### **Verificar Porta 3001**

```bash
netstat -tlnp | grep 3001
lsof -i :3001
```

### **Rodar Backend Direto (Debug)**

```bash
cd /home/meumu.com/public_html/backend-nodejs
node src/server.js
```

---

## 📊 **URLs PARA TESTAR**

- **Health:** http://meumu.com:3001/health
- **Instalador:** http://meumu.com:3001/install
- **API Check:** http://meumu.com:3001/api/install/check-requirements

---

## ❌ **PROBLEMAS COMUNS**

### **"Connection Refused" na porta 3001**

```bash
# Abrir porta no firewall
iptables -I INPUT -p tcp --dport 3001 -j ACCEPT
ufw allow 3001/tcp

# Reiniciar backend
pm2 restart meumu-backend
```

### **PM2 Status = "errored"**

```bash
# Ver logs de erro
pm2 logs meumu-backend --err --lines 30

# Deletar e recriar
pm2 delete meumu-backend
cd /home/meumu.com/public_html/backend-nodejs
pm2 start src/server.js --name meumu-backend
```

### **API retorna HTML em vez de JSON**

```bash
# Backend não está rodando!
# Execute o script de correção:
cd /home/meumu.com/public_html/backend-nodejs
./forcar-start.sh
```

### **Database não conecta**

```bash
# Testar conexão
cd /home/meumu.com/public_html/backend-nodejs
node test-db-connection.js

# Verificar .env
cat .env | grep "DB_MU_USER"
cat .env | grep "DB_WEB_USER"

# Deve ser "usermu", não "root"!
```

---

## 🔄 **RESET COMPLETO**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Parar e deletar
pm2 stop meumu-backend
pm2 delete meumu-backend

# Limpar logs
pm2 flush

# Matar processos
pkill -f "src/server.js"

# Iniciar novamente
pm2 start src/server.js --name meumu-backend --update-env

# Verificar
pm2 status
pm2 logs meumu-backend --lines 20
curl http://127.0.0.1:3001/health
```

---

## 📁 **ARQUIVOS IMPORTANTES**

```
/home/meumu.com/public_html/backend-nodejs/
├── .env                    # Configurações
├── src/server.js           # Servidor principal
├── test-db-connection.js   # Teste de database
├── forcar-start.sh         # Script de correção
├── diagnostico.sh          # Script de diagnóstico
└── README_RAPIDO.md        # Este arquivo
```

---

## ✅ **CHECKLIST DE SAÚDE**

Execute para verificar se está tudo OK:

```bash
echo "1. PM2 Status:"
pm2 status | grep meumu-backend

echo ""
echo "2. Porta 3001:"
netstat -tlnp | grep 3001

echo ""
echo "3. API Health:"
curl -s http://127.0.0.1:3001/health | python3 -m json.tool

echo ""
echo "4. Database:"
cd /home/meumu.com/public_html/backend-nodejs && node test-db-connection.js

echo ""
echo "5. Instalador:"
curl -s http://127.0.0.1:3001/api/install/check-requirements | head -10
```

**Tudo deve estar ✅ verde!**

---

## 📞 **SUPORTE**

Se nada funcionar, execute:

```bash
cd /home/meumu.com/public_html/backend-nodejs
./diagnostico.sh > diagnostico.txt
cat diagnostico.txt
```

E envie o output completo.

---

**Mantido por:** MeuMU Online Team  
**Última atualização:** 22 Dezembro 2024
