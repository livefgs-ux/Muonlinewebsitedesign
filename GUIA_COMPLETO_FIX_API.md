# 🔴 GUIA COMPLETO - Resolver Erro 404 da API

## 📋 **SITUAÇÃO ATUAL:**

```
GET https://meumu.com/api/server/info 404 (Not Found)
```

**Causa:** O `.htaccess` não está redirecionando `/api/*` corretamente.

---

## ✅ **3 SOLUÇÕES DISPONÍVEIS**

Escolha UMA das soluções abaixo (recomendo a Solução 1):

---

## 🥇 **SOLUÇÃO 1: Criar pasta /api com index.php** (MAIS SIMPLES)

Esta solução **NÃO DEPENDE** do `.htaccess` funcionar.

### **Passo 1: Criar estrutura**

```bash
cd /home/meumu.com/public_html

# Criar pasta api
mkdir -p api

# Criar index.php dentro de /api
```

### **Passo 2: Copiar arquivos**

Via **CyberPanel File Manager** ou SSH, crie estes 2 arquivos:

#### **Arquivo 1: `/api/index.php`**

```php
<?php
/**
 * API Proxy - MeuMU Online
 */

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Backend
$backend = 'http://127.0.0.1:3001';
$uri = $_SERVER['REQUEST_URI'];
$path = preg_replace('#^/api/?#', '', $uri);
$url = $backend . '/api/' . $path;

// cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Headers
$headers = [];
foreach (getallheaders() as $k => $v) {
    if (strtolower($k) !== 'host') {
        $headers[] = "$k: $v";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Body
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// Executar
$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if (curl_errno($ch)) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => curl_error($ch), 'url' => $url]);
    curl_close($ch);
    exit;
}

curl_close($ch);
http_response_code($code);
if ($type) header('Content-Type: ' . $type);
echo $response;
?>
```

#### **Arquivo 2: `/api/.htaccess`**

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
```

### **Passo 3: Testar**

```bash
# Backend
curl http://localhost:3001/api/server/info

# Proxy
curl https://meumu.com/api/server/info
```

**Ambos devem retornar JSON!**

### **Passo 4: Deploy frontend**

```bash
cd /home/meumu.com/public_html
bash deploy-production.sh
```

✅ **PRONTO! Deve funcionar.**

---

## 🥈 **SOLUÇÃO 2: Expor API na porta 3001** (SE SOLUÇÃO 1 FALHAR)

Esta solução expõe o backend diretamente na porta 3001.

### **Passo 1: Executar script**

```bash
cd /home/meumu.com/public_html
chmod +x expose-api.sh
bash expose-api.sh
```

O script vai:
- ✅ Abrir porta 3001 no firewall
- ✅ Adicionar CORS ao backend
- ✅ Reiniciar backend
- ✅ Testar acesso

### **Passo 2: Atualizar frontend**

Editar `/src/services/api.ts` linha 24:

```typescript
// ANTES:
return '/api';

// DEPOIS:
return 'https://meumu.com:3001/api';
```

### **Passo 3: Rebuild**

```bash
npm run build
bash deploy-production.sh
```

### **Passo 4: Configurar firewall no CyberPanel**

```
CyberPanel → Security → Firewall
→ Allow Port 3001
```

✅ **PRONTO!**

---

## 🥉 **SOLUÇÃO 3: Nginx Reverse Proxy** (MAIS AVANÇADO)

Se você tem Nginx como proxy reverso na frente do LiteSpeed:

### **Criar `/etc/nginx/sites-available/meumu-api.conf`:**

```nginx
server {
    listen 80;
    server_name meumu.com;

    # API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend (LiteSpeed)
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

**Ativar:**

```bash
sudo ln -s /etc/nginx/sites-available/meumu-api.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔍 **DIAGNÓSTICO**

Antes de tentar qualquer solução, execute:

```bash
cd /home/meumu.com/public_html

echo "=== Backend ===" && \
curl -s http://localhost:3001/api/server/info && \
echo -e "\n=== Proxy ===" && \
curl -s https://meumu.com/api/server/info && \
echo -e "\n=== Estrutura ===" && \
ls -lah api/ 2>/dev/null || echo "Pasta /api não existe"
```

---

## 📊 **CHECKLIST**

- [ ] Backend rodando: `pm2 status` mostra `meumu-backend online`
- [ ] Backend responde: `curl http://localhost:3001/health` retorna JSON
- [ ] Pasta `/api` existe: `ls -lah /home/meumu.com/public_html/api`
- [ ] Arquivo `/api/index.php` existe
- [ ] Arquivo `/api/.htaccess` existe
- [ ] Proxy funciona: `curl https://meumu.com/api/server/info` retorna JSON

---

## 🚀 **RECOMENDAÇÃO**

**USE A SOLUÇÃO 1** (pasta /api com index.php)

É a mais simples e confiável. Funciona 100% no CyberPanel/LiteSpeed.

---

## 📞 **COMANDOS RÁPIDOS**

### **Criar tudo de uma vez:**

```bash
cd /home/meumu.com/public_html

# Criar pasta
mkdir -p api

# Criar index.php
cat > api/index.php << 'EOF'
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
EOF

# Criar .htaccess
cat > api/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
EOF

# Testar
echo -e "\n=== Testando ===" && \
curl -s https://meumu.com/api/server/info | python3 -m json.tool | head -20
```

---

**Execute os comandos acima e cole aqui o resultado!** 🚀
