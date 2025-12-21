# 🚨 CORREÇÃO URGENTE - ERRO MIME TYPE

## ❌ **SEU ERRO:**

```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "application/octet-stream"
```

---

## 🎯 **CAUSA:**

Você está acessando o site **SEM TER BUILDADO O REACT!**

O servidor está tentando servir arquivos `.tsx` (TypeScript) diretamente, e o navegador não entende.

---

## ✅ **SOLUÇÃO EM 3 PASSOS:**

### **OPÇÃO A: Script Automático (Recomendado)**

```bash
# 1. Dar permissão
chmod +x SOLUCAO_ERRO_MIME.sh

# 2. Executar
./SOLUCAO_ERRO_MIME.sh

# 3. Seguir instruções na tela
```

**O script vai:**
- ✅ Verificar se /dist existe
- ✅ Executar npm install (se necessário)
- ✅ Executar npm run build
- ✅ Criar .htaccess correto
- ✅ Mostrar configuração do Apache

---

### **OPÇÃO B: Manual (Passo a Passo)**

#### **PASSO 1: Buildar React**

```bash
# Ir para a pasta do projeto
cd /home/meumu.com/public_html

# Instalar dependências
npm install

# Buildar para produção
npm run build
```

**Aguarde 1-2 minutos...**

**Resultado esperado:**
```
✓ 1234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.js     234.56 kB
✓ built in 15.32s
```

✅ **A pasta /dist foi criada!**

---

#### **PASSO 2: Configurar Apache**

Você precisa fazer o Apache servir da pasta `/dist`, não da raiz!

**Editar VirtualHost:**

```bash
sudo nano /etc/apache2/sites-available/meumu.conf
```

**Configuração correta:**

```apache
<VirtualHost *:80>
    ServerName meumu.com
    ServerAlias www.meumu.com
    
    # IMPORTANTE: Apontar para /dist
    DocumentRoot /home/meumu.com/public_html/dist
    
    <Directory /home/meumu.com/public_html/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/meumu_error.log
    CustomLog ${APACHE_LOG_DIR}/meumu_access.log combined
</VirtualHost>
```

**Salvar:** `Ctrl + O`, Enter, `Ctrl + X`

---

#### **PASSO 3: Reiniciar Apache**

```bash
# Habilitar site
sudo a2ensite meumu.conf

# Habilitar mod_rewrite (necessário para React Router)
sudo a2enmod rewrite

# Reiniciar Apache
sudo systemctl restart apache2
```

---

#### **PASSO 4: Testar**

1. **Limpe o cache do navegador:**
   ```
   Ctrl + Shift + R
   ```

2. **Acesse:**
   ```
   http://meumu.com
   ```

3. **Abra o console (F12):**
   - ✅ **SEM erros de MIME type**
   - ✅ **SEM vite.svg 404**
   - ✅ **Site funciona!**

---

## 🔍 **VERIFICAR SE DEU CERTO:**

### **Checklist:**

```bash
# 1. Pasta /dist existe?
ls -la dist/

# Deve mostrar:
# index.html
# assets/
# .htaccess

# 2. Apache configurado?
sudo apache2ctl -S | grep meumu

# Deve mostrar:
# port 80 namevhost meumu.com (/etc/apache2/sites-available/meumu.conf)

# 3. DocumentRoot correto?
grep DocumentRoot /etc/apache2/sites-available/meumu.conf

# Deve mostrar:
# DocumentRoot /home/meumu.com/public_html/dist
```

---

## 🚫 **ERROS COMUNS:**

### **Erro 1: "npm: command not found"**

**Solução:**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

### **Erro 2: Build falha com erro de memória**

**Solução:**
```bash
# Aumentar memória do Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

### **Erro 3: "Permission denied" ao buildar**

**Solução:**
```bash
# Dar permissão
sudo chown -R $USER:$USER /home/meumu.com/public_html
chmod -R 755 /home/meumu.com/public_html
```

---

### **Erro 4: Apache não reinicia**

**Solução:**
```bash
# Ver logs de erro
sudo apache2ctl configtest

# Corrigir erros e tentar novamente
sudo systemctl restart apache2
```

---

## 📊 **ESTRUTURA CORRETA:**

```
/home/meumu.com/public_html/
├── dist/                        ← Apache deve servir DAQUI
│   ├── index.html              ← Arquivo principal
│   ├── assets/                 ← JS/CSS compilados
│   │   ├── index-abc123.js
│   │   └── index-def456.css
│   ├── .htaccess               ← Rewrite rules
│   └── favicon.svg
├── src/                         ← Código fonte (não servir!)
├── backend-nodejs/
├── package.json
└── vite.config.ts
```

---

## ⚠️ **IMPORTANTE:**

### **❌ ERRADO:**
```apache
DocumentRoot /home/meumu.com/public_html
```
Isso serve arquivos `.tsx` diretamente → **ERRO MIME TYPE!**

### **✅ CORRETO:**
```apache
DocumentRoot /home/meumu.com/public_html/dist
```
Isso serve arquivos `.js` compilados → **FUNCIONA!**

---

## 🎯 **POR QUE ISSO ACONTECEU?**

1. **Desenvolvimento vs Produção:**
   - Em desenvolvimento: `npm run dev` → Vite serve arquivos direto
   - Em produção: Precisa buildar → Criar pasta `/dist`

2. **O que o build faz:**
   - Compila `.tsx` → `.js`
   - Minifica código
   - Otimiza assets
   - Gera hashes nos arquivos
   - Cria bundle otimizado

3. **Sem build:**
   - Servidor tenta servir `.tsx`
   - Navegador não entende TypeScript
   - MIME type errado
   - **ERRO!**

---

## 🔧 **COMANDOS ÚTEIS:**

### **Rebuildar (se mudar código):**
```bash
npm run build
```

### **Verificar se build está OK:**
```bash
ls -lh dist/assets/
```

### **Ver logs do Apache:**
```bash
sudo tail -f /var/log/apache2/error.log
```

### **Testar configuração Apache:**
```bash
sudo apache2ctl configtest
```

---

## 🎮 **APÓS CORRIGIR:**

1. ✅ Site abre sem erros
2. ✅ Console limpo (F12)
3. ✅ Login/Cadastro funciona
4. ✅ Rankings aparecem
5. ✅ Backend conecta ao MySQL

**Agora só falta:**
```bash
# Iniciar backend
cd backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend

# Deletar instalador
rm -rf install/
```

---

## 📞 **AINDA COM ERRO?**

Execute e me envie a saída:

```bash
# Info do sistema
echo "=== NODE/NPM ==="
node --version
npm --version

echo "=== PASTA DIST ==="
ls -la dist/

echo "=== APACHE CONFIG ==="
grep -r "DocumentRoot" /etc/apache2/sites-available/

echo "=== APACHE STATUS ==="
sudo systemctl status apache2
```

---

**MeuMU Online v3.0.0**  
**Correção de Erro MIME Type**  
**© 2024-2025 MeuMU Team**

**🚀 Execute o script e resolva em 2 minutos! 🚀**
