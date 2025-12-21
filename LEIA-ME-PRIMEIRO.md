# 🎮 MeuMU Online - Guia de Instalação Completo

## 📋 **IMPORTANTE: LEIA TUDO ANTES DE COMEÇAR!**

Este guia explica **exatamente** como instalar o MeuMU Online sem erros.

---

## ⚠️ **VOCÊ ESTÁ VENDO ERROS?**

### **Erro: "application/octet-stream" ou "vite.svg 404"**
**CAUSA:** Você não buildou o React ainda!  
**SOLUÇÃO:** Siga os passos abaixo na **ORDEM EXATA**.

### **Erro: "Falha ao instalar dependências npm"**
**CAUSA:** Navegador com cache antigo do instalador.  
**SOLUÇÃO:** Pressione `Ctrl + Shift + R` na página do instalador.

---

## 🚀 **INSTALAÇÃO RÁPIDA (3 Etapas)**

### **ETAPA 1: Instalador PHP (Web)**

1. Acesse: `http://seudominio.com/install`
2. Siga os 7 steps do instalador:
   - Step 1: Introdução
   - Step 2: Verificar requisitos
   - Step 3: Conectar ao MySQL/MariaDB
   - Step 4: Criar tabelas WEBMU_*
   - Step 5: Configurar admin (opcional)
   - Step 6: Configurar site (cria .env e config.php)
   - Step 7: Conclusão
3. **NÃO TENTE ACESSAR O SITE AINDA!**

---

### **ETAPA 2: Pós-Instalação (Terminal)**

Execute o script de pós-instalação:

#### **Linux/Mac:**
```bash
chmod +x pos-instalacao.sh
./pos-instalacao.sh
```

#### **Windows:**
```cmd
pos-instalacao.bat
```

**O que este script faz:**
- ✅ Instala dependências do frontend
- ✅ Builda o React (cria pasta `/dist`)
- ✅ Instala dependências do backend
- ✅ Pergunta se quer iniciar o backend (PM2 ou Node)
- ✅ Opcionalmente deleta pasta `/install`

---

### **ETAPA 3: Configurar Servidor Web**

**ATENÇÃO:** O servidor web DEVE apontar para `/dist`!

#### **Apache (XAMPP, etc.):**

Edite `httpd-vhosts.conf` ou `.htaccess`:

```apache
<VirtualHost *:80>
    ServerName meumu.com
    DocumentRoot "/caminho/completo/para/meumu/dist"
    
    <Directory "/caminho/completo/para/meumu/dist">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router
        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^.*$ /index.html [L]
    </Directory>
</VirtualHost>
```

**Reiniciar:**
```bash
sudo systemctl restart apache2
```

---

#### **Nginx:**

Edite `/etc/nginx/sites-available/meumu.com`:

```nginx
server {
    listen 80;
    server_name meumu.com;
    root /caminho/completo/para/meumu/dist;
    index index.html;
    
    # API -> Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
    
    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Ativar e reiniciar:**
```bash
sudo ln -s /etc/nginx/sites-available/meumu.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📁 **ESTRUTURA FINAL**

```
/var/www/meumu/              (ou C:\xampp\htdocs\meumu\)
├── dist/                     ⭐ SERVIDOR WEB APONTA AQUI!
│   ├── index.html
│   ├── assets/
│   │   ├── index-abc.js
│   │   ├── index-def.css
│   │   └── ...
│   └── vite.svg
├── backend-nodejs/
│   ├── .env                  ✅ Criado pelo instalador
│   ├── src/server.js
│   └── node_modules/
├── src/                      (código React fonte)
├── config.php                ✅ Criado pelo instalador
├── package.json
└── pos-instalacao.sh         ⭐ Execute este script!
```

---

## ✅ **VERIFICAR SE FUNCIONOU**

### **1. Backend rodando:**
```bash
curl http://localhost:3001/api/health
# Deve retornar: {"status":"ok"}
```

### **2. Frontend carregando:**
Acesse: `http://meumu.com`

**Se abrir sem erros:** 🎉 **FUNCIONOU!**

**Se der erro:**
- ❌ MIME type: Você **NÃO buildou** → Volte para Etapa 2
- ❌ 404: DocumentRoot **NÃO aponta** para /dist → Volte para Etapa 3
- ❌ Backend: `npm start` não foi executado → Inicie o backend

### **3. Console do navegador (F12):**
Deve estar **sem erros** na aba Console e Network.

---

## 🔥 **COMANDOS MANUAIS (se não usar os scripts)**

### **Build Frontend:**
```bash
npm install
npm run build
```

### **Iniciar Backend:**

**PM2 (Recomendado):**
```bash
npm install -g pm2
cd backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup  # Auto-start no boot
```

**Node Standalone:**
```bash
cd backend-nodejs
npm install
npm start
```

---

## 🐛 **TROUBLESHOOTING**

### **Problema 1: "Falha ao instalar dependências npm" no instalador**

**Causa:** Cache do navegador  
**Solução:**
1. Pressione `Ctrl + Shift + R` na página
2. OU abra em modo anônimo: `Ctrl + Shift + N`
3. OU limpe cache completo (F12 → Network → Disable cache)

---

### **Problema 2: "application/octet-stream" ou "vite.svg 404"**

**Causa:** React não foi buildado  
**Solução:**
```bash
npm run build
```
Então configure servidor web para apontar para `/dist`

---

### **Problema 3: Rotas React dão 404**

**Causa:** React Router não configurado  
**Solução:** Adicionar `RewriteRule` (Apache) ou `try_files` (Nginx)

---

### **Problema 4: "Cannot GET /api/***"**

**Causa:** Backend não está rodando  
**Solução:**
```bash
cd backend-nodejs
npm start
```

---

### **Problema 5: Backend não conecta ao MySQL**

**Verificar .env:**
```bash
cat backend-nodejs/.env
# Conferir DB_MU_HOST, DB_MU_USER, DB_MU_PASSWORD
```

**Testar conexão:**
```bash
mysql -h localhost -u root -p muonline
```

---

## 📚 **DOCUMENTAÇÃO COMPLETA**

- `/install/DEPLOY_PRODUCAO.md` - Deploy completo e detalhado
- `/install/SOLUCAO_MIME_TYPE.md` - Solução rápida para erro MIME
- `/install/ERROS_COMUNS.md` - Todos os erros possíveis
- `/install/LIMPAR_CACHE.md` - Como limpar cache do navegador
- `/CORRECAO_IMPORTS.md` - Fix de importações quebradas

---

## 🔒 **SEGURANÇA**

### **Após tudo funcionar:**

```bash
# 1. Deletar instalador
rm -rf install/

# 2. Proteger arquivos sensíveis
chmod 640 config.php
chmod 640 backend-nodejs/.env

# 3. Configurar SSL (Let's Encrypt)
sudo certbot --apache -d meumu.com -d www.meumu.com
```

---

## 🎯 **CHECKLIST FINAL**

- [ ] Instalador PHP concluído (7 steps)
- [ ] Arquivos `.env` e `config.php` criados
- [ ] Script `pos-instalacao.sh` executado
- [ ] Pasta `/dist` criada com sucesso
- [ ] Backend rodando na porta 3001
- [ ] `curl http://localhost:3001/api/health` retorna `{"status":"ok"}`
- [ ] Servidor web aponta para `/dist`
- [ ] Site abre sem erros: `http://meumu.com`
- [ ] Console do navegador (F12) sem erros
- [ ] Pasta `/install` deletada

---

## 📞 **SUPORTE**

Se AINDA tiver problemas:

1. **Limpe cache do navegador:** `Ctrl + Shift + R`
2. **Verifique logs do backend:** `pm2 logs meumu-backend`
3. **Verifique logs do servidor web:**
   - Apache: `tail -f /var/log/apache2/error.log`
   - Nginx: `tail -f /var/log/nginx/error.log`
4. **Console do navegador:** F12 → aba Console

---

## 🎮 **ORDEM DE EXECUÇÃO (RESUMO)**

```
1. Acesse: http://meumu.com/install
   └─ Complete os 7 steps

2. Execute: ./pos-instalacao.sh (ou .bat no Windows)
   └─ Builda React + Configura Backend

3. Configure servidor web:
   └─ DocumentRoot → /dist

4. Acesse: http://meumu.com
   └─ 🎉 Site funcionando!
```

---

**MeuMU Online v2.0.1**  
Season 19-2-3 Épico  
© 2024-2025 MeuMU Team

**NÃO PULE NENHUMA ETAPA!**  
**EXECUTE NA ORDEM EXATA!**  
**LEIA OS ERROS SE APARECEREM!**
