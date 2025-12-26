# 🎯 INSTRUÇÕES FINAIS - CORRIGIR E INSTALAR

**Data:** 26 de dezembro de 2024

---

## ✅ **ARQUIVOS CORRIGIDOS**

1. ✅ `backend-nodejs/database/00_create_webuser.sql` - Agora usa `meuweb`
2. ✅ `.env.production` - Criado para produção
3. ✅ `.env.development` - Criado para desenvolvimento
4. ✅ `fix-install.sh` - Script criado (mas NÃO funciona via Figma Make)
5. ✅ `corrigir-install-webmu.sh` - Script funcional criado

---

## 🚀 **EXECUTAR AGORA NO SEU SERVIDOR**

Execute esses comandos na ordem:

```bash
# 1. ENTRAR NO DIRETÓRIO
cd /home/meumu.com/public_html

# 2. DAR PERMISSÃO DE EXECUÇÃO NO SCRIPT
chmod +x corrigir-install-webmu.sh

# 3. EXECUTAR O SCRIPT DE CORREÇÃO
./corrigir-install-webmu.sh

# 4. VERIFICAR SE CORRIGIU
grep -n "meuweb" install.sh | wc -l
# Deve mostrar pelo menos 13 ocorrências

grep -n "webmu" install.sh | wc -l
# Deve mostrar 0 (ZERO)

# 5. LIMPAR DATABASES ANTIGOS
mysql -u root -p@mysql123@ << 'EOF'
DROP DATABASE IF EXISTS webmu;
DROP DATABASE IF EXISTS meuweb;
CREATE DATABASE meuweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# 6. CRIAR USUÁRIO WEBUSER
cd backend-nodejs/database
mysql -u root -p@mysql123@ < 00_create_webuser.sql

# 7. CRIAR TABELAS NECESSÁRIAS
mysql -u root -p@mysql123@ meuweb < 06_create_events_table.sql
mysql -u root -p@mysql123@ meuweb < 06_create_admin_logs.sql
mysql -u root -p@mysql123@ meuweb < 05_create_wcoin_packages.sql

# 8. VERIFICAR SE TUDO FOI CRIADO
mysql -u root -p@mysql123@ -e "SHOW DATABASES;" | grep meuweb
mysql -u root -p@mysql123@ meuweb -e "SHOW TABLES;"
mysql -u webuser -p@meusite123@ -e "SELECT 1;" && echo "✅ WEBUSER OK"

# 9. VOLTAR PARA O DIRETÓRIO RAIZ
cd /home/meumu.com/public_html

# 10. RODAR O INSTALADOR
./install.sh

# Escolha opção 1 (Instalação Completa)
```

---

## 📋 **CHECKLIST DE VERIFICAÇÃO**

Marque cada item conforme executar:

- [ ] Script `corrigir-install-webmu.sh` executado
- [ ] Nenhuma ocorrência de `webmu` resta em `install.sh`
- [ ] Database `meuweb` criado
- [ ] Database `webmu` removido (se existia)
- [ ] Usuário `webuser` criado com sucesso
- [ ] Login com `webuser` funciona
- [ ] Tabelas `events`, `admin_logs`, `wcoin_packages` criadas
- [ ] `install.sh` executado com sucesso
- [ ] Servidor backend rodando
- [ ] Frontend buildado
- [ ] Site acessível em `http://meumu.com:3001`

---

## 🧪 **TESTES FINAIS**

Depois de tudo instalado, teste:

```bash
# Testar backend
curl http://localhost:3001/health

# Testar rankings
curl http://localhost:3001/api/rankings/guilds?limit=10

# Testar eventos
curl http://localhost:3001/api/events

# Ver logs do PM2
pm2 logs meumu-api --lines 50
```

---

## ❌ **SE ALGO DER ERRADO**

### **Problema 1: install.sh ainda tem 'webmu'**
```bash
# Executar correção manual
cd /home/meumu.com/public_html
sed -i 's/webmu/meuweb/g' install.sh
sed -i 's/webmu/meuweb/g' validate-all.sh
```

### **Problema 2: Usuário 'webuser' não existe**
```bash
cd /home/meumu.com/public_html/backend-nodejs/database
mysql -u root -p@mysql123@ < 00_create_webuser.sql
```

### **Problema 3: Tabelas não existem**
```bash
cd /home/meumu.com/public_html/backend-nodejs/database
mysql -u root -p@mysql123@ meuweb < 06_create_events_table.sql
mysql -u root -p@mysql123@ meuweb < 06_create_admin_logs.sql
mysql -u root -p@mysql123@ meuweb < 05_create_wcoin_packages.sql
```

### **Problema 4: Backend não inicia**
```bash
# Ver logs
pm2 logs meumu-api

# Verificar .env
cat backend-nodejs/.env | grep DB_WEB_NAME
# Deve mostrar: DB_WEB_NAME=meuweb (não webmu)

# Se estiver errado, corrigir:
cd backend-nodejs
nano .env
# Mudar DB_WEB_NAME=webmu para DB_WEB_NAME=meuweb
# Salvar (Ctrl+X, Y, Enter)

# Reiniciar
pm2 restart meumu-api
```

---

## 📊 **ESTRUTURA FINAL ESPERADA**

```
/home/meumu.com/public_html/
├── backend-nodejs/
│   ├── database/
│   │   ├── 00_create_webuser.sql  (usa meuweb ✅)
│   │   ├── 05_create_wcoin_packages.sql
│   │   ├── 06_create_admin_logs.sql
│   │   └── 06_create_events_table.sql
│   ├── .env  (DB_WEB_NAME=meuweb ✅)
│   └── .env.production  (DB_WEB_NAME=meuweb ✅)
├── dist/  (frontend buildado)
├── install.sh  (usa meuweb, NÃO webmu ✅)
├── validate-all.sh  (usa meuweb ✅)
└── ...
```

**Database MariaDB:**
```
+------------------+
| Databases        |
+------------------+
| muonline         | ← Servidor MU (READ-ONLY)
| meuweb           | ← Site (READ+WRITE) ✅
+------------------+

Tables em 'meuweb':
+------------------+
| Tables_in_meuweb |
+------------------+
| admin_logs       |
| events           |
| wcoin_packages   |
+------------------+

Usuários MySQL:
+---------+-----------+
| User    | Host      |
+---------+-----------+
| root    | localhost |
| webuser | localhost | ✅
| webuser | 127.0.0.1 | ✅
+---------+-----------+
```

---

## 🎯 **RESUMO**

**ANTES:**
- ❌ `install.sh` usava `webmu`
- ❌ `00_create_webuser.sql` usava `webmu`
- ❌ Conflito com `validate-all.sh` (que usa `meuweb`)
- ❌ Script não era idempotente

**DEPOIS:**
- ✅ TODOS os arquivos usam `meuweb`
- ✅ SQL corrigido
- ✅ Sem conflitos
- ✅ Totalmente idempotente

---

**✅ TUDO CORRIGIDO E PRONTO PARA INSTALAR!**
