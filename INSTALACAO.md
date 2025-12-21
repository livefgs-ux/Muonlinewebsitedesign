# 🎮 MeuMU Online - Guia de Instalação Completo

## 🚀 **Método 1: Setup Wizard (RECOMENDADO) - 5 minutos**

O jeito mais fácil e rápido! Interface gráfica que faz tudo automaticamente.

### **1. Deploy Inicial**

```bash
# Clone ou faça upload dos arquivos para o servidor
cd /home/meumu.com/public_html

# Instale dependências do frontend (apenas uma vez)
npm install

# Build do frontend
npm run build

# Deploy para produção
bash deploy-production.sh
```

### **2. Acesse o Setup Wizard**

```
https://meumu.com/setup
```

OU faça login como admin e clique em **"Setup"** no menu.

### **3. Siga os 5 Passos no Wizard**

1. **Detecção de Ambiente** - Detecta CyberPanel, XAMPP, etc.
2. **Verificação de Dependências** - Verifica Node.js, PHP, MariaDB, PM2
3. **Configuração de Database** - Configure conexão com MariaDB
4. **Configuração de API** - Cria proxy reverso automaticamente
5. **Testes Finais** - Valida toda instalação

✅ **Pronto!** Tudo configurado automaticamente.

---

## 🛠️ **Método 2: Instalação Manual (Avançado)**

Use se preferir controle total ou se o Setup Wizard falhar.

### **Pré-requisitos**

- ✅ Servidor Linux (Ubuntu 20.04+ / CentOS 7+)
- ✅ Node.js 18+
- ✅ PHP 7.4+
- ✅ MariaDB/MySQL 10.3+
- ✅ LiteSpeed ou Apache ou Nginx
- ✅ PM2 (Process Manager)

### **Passo 1: Instalar Node.js e PM2**

```bash
# Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2
```

### **Passo 2: Configurar Backend**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
nano .env
```

**Edite `.env`:**
```env
# Database MariaDB/MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=MuOnline
DB_USER=root
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=chave_aleatoria_muito_segura_aqui

# Server
PORT=3001
NODE_ENV=production

# CORS (domínios permitidos)
ALLOWED_ORIGINS=https://meumu.com,http://localhost:5173
```

### **Passo 3: Iniciar Backend**

```bash
# Via script automático
bash /home/meumu.com/public_html/start-backend.sh

# OU manualmente
cd /home/meumu.com/public_html/backend-nodejs
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup
```

### **Passo 4: Configurar Proxy API**

```bash
cd /home/meumu.com/public_html
mkdir -p api
```

**Criar `/api/index.php`:**
```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
$backend = 'http://127.0.0.1:3001';
$uri = $_SERVER['REQUEST_URI'];
$path = preg_replace('#^/api/?#', '', $uri);
$url = $backend . '/api/' . $path;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
$headers = [];
foreach (getallheaders() as $k => $v) {
    if (strtolower($k) !== 'host') $headers[] = "$k: $v";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}
$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
if (curl_errno($ch)) {
    http_response_code(502);
    header('Content-Type: application/json');
    die(json_encode(['error' => curl_error($ch)]));
}
curl_close($ch);
http_response_code($code);
if ($type) header('Content-Type: ' . $type);
echo $response;
?>
```

**Criar `/api/.htaccess`:**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
```

**Permissões:**
```bash
chmod 755 /home/meumu.com/public_html/api
chmod 644 /home/meumu.com/public_html/api/index.php
chmod 644 /home/meumu.com/public_html/api/.htaccess
```

### **Passo 5: Build e Deploy Frontend**

```bash
cd /home/meumu.com/public_html

# Instalar dependências
npm install

# Build
npm run build

# Deploy
bash deploy-production.sh
```

### **Passo 6: Testar**

```bash
# Backend
curl http://localhost:3001/health

# API via proxy
curl https://meumu.com/api/server/info

# Frontend
curl -I https://meumu.com
```

Abra no navegador:
```
https://meumu.com
```

---

## 🔍 **Diagnóstico e Troubleshooting**

### **Backend não inicia**

```bash
# Ver logs
pm2 logs meumu-backend

# Status
pm2 status

# Reiniciar
pm2 restart meumu-backend

# Testar manualmente
cd /home/meumu.com/public_html/backend-nodejs
node src/server.js
# Deve mostrar "Servidor rodando na porta 3001"
```

### **API retorna 404**

```bash
# Verificar se pasta /api existe
ls -lah /home/meumu.com/public_html/api

# Testar proxy PHP diretamente
curl https://meumu.com/api/index.php

# Verificar .htaccess
cat /home/meumu.com/public_html/api/.htaccess
```

### **Erro de Database**

```bash
# Testar conexão MySQL
mysql -h localhost -u root -p -e "SHOW DATABASES;"

# Verificar se database MuOnline existe
mysql -h localhost -u root -p -e "USE MuOnline; SHOW TABLES;"

# Verificar .env
cat /home/meumu.com/public_html/backend-nodejs/.env
```

### **Frontend com erro 404**

```bash
# Verificar se index.html existe
ls -lah /home/meumu.com/public_html/index.html

# Verificar .htaccess principal
cat /home/meumu.com/public_html/.htaccess

# Rebuild
npm run build
bash deploy-production.sh
```

---

## 📁 **Estrutura de Diretórios**

```
/home/meumu.com/public_html/
├── api/                        ← Proxy PHP para backend
│   ├── index.php
│   └── .htaccess
├── backend-nodejs/             ← Backend Node.js/Express
│   ├── .env                    ← Configuração (NUNCA commitar!)
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── characters.js
│   │   │   ├── rankings.js
│   │   │   ├── events.js
│   │   │   ├── news.js
│   │   │   ├── server.js
│   │   │   └── setup.js       ← Setup Wizard API
│   │   └── middleware/
│   └── package.json
├── src/                        ← Frontend React/Vite
│   ├── app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── contexts/
│   │   └── pages/
│   ├── pages/
│   │   └── Setup.tsx          ← Setup Wizard GUI
│   ├── services/
│   │   └── api.ts
│   └── styles/
├── assets/                     ← Build artifacts (gerado)
├── index.html                  ← SPA entry point
├── .htaccess                   ← SPA fallback routing
├── deploy-production.sh        ← Script de deploy
├── start-backend.sh            ← Script para iniciar backend
└── package.json
```

---

## 🔐 **Segurança**

### **Após instalação:**

1. **Desabilitar Setup Wizard em produção:**
   ```typescript
   // Em /src/app/App.tsx
   case 'setup':
     return <HeroSection onNavigate={setCurrentSection} />;
     // Comentar: return <Setup />;
   ```

2. **Proteger .env:**
   ```bash
   chmod 600 /home/meumu.com/public_html/backend-nodejs/.env
   ```

3. **Configurar firewall:**
   ```bash
   # Bloquear porta 3001 externamente (usar apenas proxy)
   sudo ufw deny 3001/tcp
   
   # OU se usar porta 3001 diretamente, permitir apenas HTTPS
   sudo ufw allow 443/tcp
   ```

4. **SSL/HTTPS:**
   - Use Let's Encrypt via CyberPanel
   - OU manualmente com certbot

5. **Backups automáticos:**
   ```bash
   # Criar cron job para backup diário
   0 2 * * * mysqldump -u root -p'senha' MuOnline > /backups/muonline-$(date +\%Y\%m\%d).sql
   ```

---

## 🚀 **Comandos Úteis**

### **Backend:**
```bash
pm2 start meumu-backend      # Iniciar
pm2 stop meumu-backend       # Parar
pm2 restart meumu-backend    # Reiniciar
pm2 logs meumu-backend       # Ver logs
pm2 monit                    # Monitor em tempo real
```

### **Frontend:**
```bash
npm run dev                  # Desenvolvimento
npm run build                # Build produção
npm run preview              # Preview build
bash deploy-production.sh    # Deploy
```

### **Database:**
```bash
mysql -u root -p MuOnline    # Acessar database
pm2 logs meumu-backend       # Ver queries no log
```

---

## 📚 **Documentação Adicional**

- 🧙‍♂️ [Setup Wizard - README](./SETUP_WIZARD_README.md)
- 🔧 [Guia Completo Fix API](./GUIA_COMPLETO_FIX_API.md)
- 📊 [Backend API Endpoints](./backend-nodejs/README.md)

---

## 💬 **Suporte**

Se encontrar problemas:

1. ✅ Use o **Setup Wizard** - ele diagnostica e corrige automaticamente
2. ✅ Verifique logs: `pm2 logs meumu-backend`
3. ✅ Consulte este guia
4. ✅ Verifique a documentação específica

---

**MeuMU Online - Season 19-2-3 Épico** 🎮⚔️✨
