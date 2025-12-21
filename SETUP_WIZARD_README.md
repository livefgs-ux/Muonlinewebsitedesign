# 🧙‍♂️ Setup Wizard - MeuMU Online

## 📋 **Sobre**

O **Setup Wizard** é um instalador automático GUI que:

1. **Detecta automaticamente** seu ambiente (CyberPanel, XAMPP, VPS, etc.)
2. **Verifica dependências** (Node.js, PHP, MariaDB, PM2, etc.)
3. **Configura automaticamente** database, API, proxy reverso
4. **Testa conectividade** e valida toda instalação
5. **Corrige problemas** automaticamente quando possível

---

## 🚀 **Como Acessar**

### **Opção 1: Via Navegação**
```
https://meumu.com → Clique no botão "Setup" no menu
```

### **Opção 2: URL Direta**
```
https://meumu.com/setup
```

### **Opção 3: Durante desenvolvimento**
```bash
npm run dev
# Acesse: http://localhost:5173
# Navegue para seção "Setup"
```

---

## 📊 **Etapas do Wizard**

### **1️⃣ Detecção de Ambiente**
- ✅ Identifica CyberPanel, XAMPP, VPS, ou Docker
- ✅ Detecta servidor web (LiteSpeed, Apache, Nginx)
- ✅ Verifica versões de PHP e Node.js
- ✅ Localiza paths automaticamente

### **2️⃣ Verificação de Dependências**
Verifica se está instalado:
- Node.js 18+
- NPM
- PM2 (Process Manager)
- PHP 7.4+
- PHP cURL Extension
- MariaDB/MySQL Client
- Git
- node_modules do backend
- Permissões de escrita
- Porta 3001 disponível

**Auto-Fix disponível para:**
- Instalar PM2
- Instalar node_modules
- Iniciar backend
- Corrigir permissões

### **3️⃣ Configuração de Database**
- Formulário para configurar conexão MariaDB/MySQL
- Teste de conexão em tempo real
- Salvamento automático em `.env`

### **4️⃣ Configuração de API**
Automaticamente:
- ✅ Cria pasta `/api` com proxy PHP
- ✅ Configura `.htaccess` para rewrite
- ✅ Adiciona CORS ao backend
- ✅ Inicia backend com PM2
- ✅ Testa conectividade

### **5️⃣ Testes Finais**
- 🔍 Conexão com Database
- 🔍 Backend respondendo
- 🔍 Proxy API funcionando
- 🔍 Frontend carregando

---

## 🛠️ **Arquitetura**

### **Frontend**
```
/src/pages/Setup.tsx
```
- Interface React com Tailwind CSS
- Glassmorphism dark theme
- Steps interativos
- Console de logs em tempo real
- Auto-fix automático

### **Backend**
```
/backend-nodejs/src/routes/setup.js
```
Endpoints:
- `POST /setup-api/detect-environment` - Detecta ambiente
- `POST /setup-api/check-dependencies` - Verifica dependências
- `POST /setup-api/auto-fix` - Corrige problemas
- `POST /setup-api/test-database-connection` - Testa database
- `POST /setup-api/configure-database` - Salva config database
- `POST /setup-api/configure-api` - Configura API/Proxy
- `POST /setup-api/test-database` - Teste final database
- `POST /setup-api/test-backend` - Teste final backend
- `POST /setup-api/test-proxy` - Teste final proxy
- `POST /setup-api/test-frontend` - Teste final frontend

### **Proxy PHP**
```
/setup-proxy.php (desenvolvimento)
/api/index.php (produção)
```
Faz proxy reverso das requisições do frontend para o backend Node.js

---

## 🔧 **Instalação Manual (se não usar o Wizard)**

### **1. Instalar Dependências**
```bash
# Node.js e NPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2

# MariaDB Client
sudo apt install -y mariadb-client
```

### **2. Configurar Database**
```bash
cd /home/meumu.com/public_html/backend-nodejs
cp .env.example .env
nano .env
```

Edite:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=MuOnline
DB_USER=root
DB_PASSWORD=sua_senha
JWT_SECRET=chave_aleatoria_segura
PORT=3001
```

### **3. Instalar Backend**
```bash
cd /home/meumu.com/public_html/backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend
pm2 save
pm2 startup
```

### **4. Configurar Proxy API**
```bash
cd /home/meumu.com/public_html
mkdir -p api
```

Criar `/api/index.php`:
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

Criar `/api/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
```

### **5. Testar**
```bash
# Backend
curl http://localhost:3001/health

# API
curl https://meumu.com/api/server/info
```

---

## 🧪 **Troubleshooting**

### **Problema: "Backend não disponível"**
```bash
# Verificar se backend está rodando
pm2 list

# Se não estiver, iniciar:
cd /home/meumu.com/public_html/backend-nodejs
pm2 start src/server.js --name meumu-backend

# Ver logs
pm2 logs meumu-backend
```

### **Problema: "Porta 3001 em uso"**
```bash
# Ver o que está usando a porta
lsof -i :3001

# Matar processo
kill -9 <PID>

# Reiniciar backend
pm2 restart meumu-backend
```

### **Problema: "Erro de permissão"**
```bash
# Corrigir permissões
sudo chown -R $USER:$USER /home/meumu.com/public_html
chmod 755 /home/meumu.com/public_html/api
chmod 644 /home/meumu.com/public_html/api/index.php
```

### **Problema: "Database connection failed"**
```bash
# Testar conexão manualmente
mysql -h localhost -u root -p -e "SHOW DATABASES;"

# Verificar se database MuOnline existe
mysql -h localhost -u root -p -e "USE MuOnline; SHOW TABLES;"
```

### **Problema: "404 na API"**
```bash
# Verificar se pasta /api existe
ls -lah /home/meumu.com/public_html/api

# Verificar se .htaccess está funcionando
curl -I https://meumu.com/api/server/info

# Testar proxy diretamente
curl https://meumu.com/api/index.php
```

---

## 📦 **Estrutura de Arquivos Criada**

```
/home/meumu.com/public_html/
├── api/
│   ├── index.php           ← Proxy PHP
│   └── .htaccess          ← Rewrite rules
├── backend-nodejs/
│   ├── .env               ← Configuração database
│   ├── src/
│   │   ├── server.js      ← Servidor principal
│   │   └── routes/
│   │       └── setup.js   ← Setup Wizard API
│   └── node_modules/      ← Dependências
├── assets/
├── index.html
└── .htaccess              ← SPA fallback
```

---

## 🔐 **Segurança**

⚠️ **IMPORTANTE:**
- O Setup Wizard NÃO requer autenticação
- Após instalação, DESABILITE o Setup Wizard em produção
- Nunca exponha credenciais no código
- Use `.env` para configurações sensíveis
- Configure firewall para bloquear porta 3001 se usar proxy

### **Desabilitar Setup Wizard:**
```typescript
// Em /src/app/App.tsx
case 'setup':
  // return <Setup />; // Comentar esta linha
  return <HeroSection onNavigate={setCurrentSection} />;
```

Ou remover botão "Setup" da navegação.

---

## 📚 **Logs**

### **Backend Logs**
```bash
# PM2
pm2 logs meumu-backend

# Arquivo
tail -f /home/meumu.com/logs/backend.log
```

### **Setup Wizard Logs**
Logs aparecem em tempo real no console do próprio wizard (interface).

### **API Errors**
Abra DevTools → Console para ver erros de fetch/API.

---

## 🎯 **Features**

✅ Detecção automática de ambiente  
✅ Verificação de dependências  
✅ Auto-fix inteligente  
✅ Interface visual moderna  
✅ Logs em tempo real  
✅ Testes automatizados  
✅ Configuração zero-touch  
✅ Multi-ambiente (CyberPanel/XAMPP/VPS)  
✅ Diagnóstico detalhado  
✅ Correção com 1 clique  

---

## 🚀 **Próximos Passos**

Após instalação completa via Wizard:

1. ✅ Acesse `https://meumu.com`
2. ✅ Verifique se API está respondendo
3. ✅ Faça login com conta de teste
4. ✅ Configure eventos e notícias no AdminCP
5. ✅ Desabilite o Setup Wizard
6. ✅ Configure backups automáticos
7. ✅ Configure SSL/HTTPS

---

## 📞 **Suporte**

Se encontrar problemas:

1. Execute o Setup Wizard novamente
2. Verifique logs no console do wizard
3. Execute comandos de diagnóstico manualmente
4. Consulte a seção Troubleshooting
5. Verifique logs do PM2: `pm2 logs meumu-backend`

---

**Criado com ❤️ para MeuMU Online - Season 19-2-3 Épico**
