# 🚨 ERRO MIME TYPE "application/octet-stream" - SOLUÇÃO COMPLETA

## ❌ O ERRO:

```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "application/octet-stream". 
Strict MIME type checking is enforced for module scripts per HTML spec.
```

---

## 🔍 O QUE SIGNIFICA:

O navegador esperava receber **JavaScript modular** (`application/javascript`), mas o servidor respondeu com **arquivo binário genérico** (`application/octet-stream`).

Isso acontece porque o servidor web (Nginx/Apache) não conseguiu **identificar o tipo do arquivo** e mandou o padrão "octet-stream" (download binário).

---

## 🎯 3 CAUSAS PRINCIPAIS:

### **1️⃣ PERMISSÕES INCORRETAS (mais comum)**

Após `git clone`, os arquivos vêm com permissões do repositório, que podem impedir o servidor web de **ler** os arquivos corretamente.

**Sintomas:**
- ✅ `ls -la` mostra os arquivos
- ❌ Navegador recebe `application/octet-stream`
- ❌ Nginx/Apache não consegue identificar extensão `.tsx`, `.js`, `.mjs`

**Solução:**
```bash
# Via script automático:
./fix-permissions-mime.sh

# OU manualmente:
sudo chown -R fabricio:webapps /home/meumu.com/public_html
sudo find /home/meumu.com/public_html -type d -exec chmod 755 {} \;
sudo find /home/meumu.com/public_html -type f -exec chmod 644 {} \;
```

---

### **2️⃣ PROJETO NÃO BUILDADO (Vite/React)**

Arquivos `.tsx` são **TypeScript + React** e **NÃO rodam direto no navegador**!

Eles precisam ser **compilados** (build) para JavaScript puro antes de serem servidos.

**Como identificar:**
- ✅ Você fez `git clone` do repositório
- ❌ **NÃO rodou `npm run build`**
- ❌ Navegador está tentando carregar `src/main.tsx` diretamente

**Solução:**
```bash
cd /home/meumu.com/public_html

# 1. Instalar dependências
npm install

# 2. Buildar projeto (gera pasta dist/)
npm run build

# 3. Verificar se dist/ foi criada
ls -la dist/
```

**O que acontece:**
- `npm run build` → Compila `.tsx` para `.js` puro
- Gera pasta `dist/` com arquivos prontos para navegador
- Nginx/Apache serve apenas arquivos da pasta `dist/`

---

### **3️⃣ NGINX/APACHE SEM MIME TYPES**

O servidor web precisa saber que `.js`, `.mjs`, `.tsx` são JavaScript.

**Como verificar (Nginx):**
```bash
# Verificar se include mime.types está presente
sudo nano /etc/nginx/nginx.conf

# Deve ter dentro do bloco http {} ou server {}:
include /etc/nginx/mime.types;
```

**Como verificar (Apache):**
```bash
# Verificar se mod_mime está ativo
sudo a2enmod mime

# Verificar /etc/mime.types
cat /etc/mime.types | grep javascript
```

**Conteúdo esperado em `/etc/nginx/mime.types`:**
```
application/javascript    js mjs;
application/json          json;
text/css                 css;
text/html                html htm;
```

---

## ✅ SOLUÇÃO COMPLETA (PASSO A PASSO):

### **Cenário 1: Após `git clone` (SEM build)**

```bash
# 1. Ajustar permissões
./fix-permissions-mime.sh

# 2. Instalar dependências
npm install

# 3. Buildar projeto
npm run build

# 4. Verificar se dist/ foi criada
ls -la dist/

# 5. Reiniciar servidor web (se necessário)
sudo systemctl restart nginx
# OU
sudo systemctl restart apache2
```

---

### **Cenário 2: Já buildado mas erro persiste**

```bash
# 1. Ajustar permissões
./fix-permissions-mime.sh

# 2. Verificar mime.types no Nginx
sudo nano /etc/nginx/nginx.conf
# Adicionar se não tiver:
include /etc/nginx/mime.types;

# 3. Reiniciar Nginx
sudo systemctl restart nginx

# 4. Testar no navegador (Ctrl+Shift+R para limpar cache)
```

---

### **Cenário 3: OpenLiteSpeed (CyberPanel)**

```bash
# 1. Ajustar permissões
./fix-permissions-mime.sh

# 2. Buildar projeto
npm run build

# 3. Configurar virtual host para servir pasta dist/
# No CyberPanel:
#   - Website → meumu.com → General
#   - Document Root: /home/meumu.com/public_html/dist

# 4. Reiniciar LiteSpeed
sudo systemctl restart lsws
```

---

## 📊 TABELA DE DIAGNÓSTICO:

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Erro logo após `git clone` | Permissões erradas | `./fix-permissions-mime.sh` |
| Arquivo `main.tsx` no erro | Projeto não buildado | `npm install` + `npm run build` |
| Todos `.js` como octet-stream | Nginx sem mime.types | Adicionar `include /etc/nginx/mime.types;` |
| Funciona local, falha servidor | Permissões + falta build | Permissões + build |

---

## 🔍 COMO VERIFICAR SE ESTÁ CORRETO:

### **1. Permissões OK:**
```bash
ls -la /home/meumu.com/public_html

# Esperado:
drwxr-xr-x  fabricio webapps  (diretórios)
-rw-r--r--  fabricio webapps  (arquivos)
```

### **2. Build OK:**
```bash
ls -la /home/meumu.com/public_html/dist/

# Esperado:
-rw-r--r-- index.html
-rw-r--r-- assets/index-abc123.js
-rw-r--r-- assets/index-def456.css
```

### **3. MIME types OK (Nginx):**
```bash
curl -I http://meumu.com/assets/index-abc123.js

# Esperado:
Content-Type: application/javascript
```

**NÃO pode ser:**
```
Content-Type: application/octet-stream  ❌
```

---

## 🚀 SOLUÇÃO AUTOMÁTICA (install.sh):

O script `install.sh` agora automaticamente:

```bash
./install.sh
# Escolher opção 10 (Atualizar do GitHub)
# → Clona repositório
# → Ajusta permissões automaticamente  ✅ NOVO!
# → Avisa para rodar opção 1

# Escolher opção 1 (Instalação Completa)
# → npm install
# → npm run build  ✅
# → Configura .env
# → Inicia servidor
```

---

## 📝 CHECKLIST FINAL:

✅ **Permissões ajustadas:**
```bash
./fix-permissions-mime.sh
```

✅ **Projeto buildado:**
```bash
npm install
npm run build
```

✅ **Pasta dist/ existe:**
```bash
ls -la dist/
```

✅ **Nginx/Apache servindo dist/:**
```bash
# Nginx: root /home/meumu.com/public_html/dist;
# Apache: DocumentRoot /home/meumu.com/public_html/dist
```

✅ **MIME types configurados:**
```bash
include /etc/nginx/mime.types;
```

✅ **Cache do navegador limpo:**
```
Ctrl + Shift + R (hard refresh)
```

---

## 🎯 RESUMO:

1. **Git clone** → Permissões erradas
2. **Fix permissões** → `./fix-permissions-mime.sh`
3. **Build projeto** → `npm install` + `npm run build`
4. **Servir dist/** → Configurar Nginx/Apache
5. **Testar** → `curl -I` deve retornar `application/javascript`

---

## 📞 AINDA COM PROBLEMA?

### **Debug avançado:**
```bash
# 1. Verificar permissões
ls -la /home/meumu.com/public_html/dist/assets/*.js

# 2. Testar MIME type
curl -I http://meumu.com/assets/index-abc123.js

# 3. Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# 4. Ver logs do build
npm run build --verbose
```

---

**✅ Problema resolvido com permissões + build!** 🎉
