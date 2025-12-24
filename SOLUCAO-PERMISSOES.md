# 🔓 SOLUÇÃO: ERRO DE PERMISSÕES EACCES

**Data:** 24/12/2025 23:30  
**Erro:** `npm error code EACCES permission denied mkdir 'node_modules/fsevents'`

---

## 🎯 **ESCOLHA A SOLUÇÃO MAIS FÁCIL PARA VOCÊ:**

---

## ✅ **SOLUÇÃO 1: SCRIPT AUTOMÁTICO (MAIS FÁCIL!)**

```bash
cd /home/meumu.com/public_html

# Dar permissão de execução
chmod +x fix-permissions.sh

# Executar script
./fix-permissions.sh

# O script vai:
# 1. Detectar quem você é (fabricio)
# 2. Detectar quem é o dono (meumu.com)
# 3. Perguntar se quer corrigir
# 4. Corrigir com sudo
# 5. Executar node install.js automaticamente
```

---

## ✅ **SOLUÇÃO 2: CORRIGIR OWNERSHIP (RECOMENDADO)**

```bash
# Dar ownership para o seu usuário
sudo chown -R $USER:$USER /home/meumu.com/public_html

# Verificar se funcionou
ls -la /home/meumu.com/public_html/
# Agora deve mostrar: fabricio fabricio

# Executar instalação
cd /home/meumu.com/public_html
node install.js
```

### **Por que esta é a melhor solução?**
- ✅ Corrige o problema definitivamente
- ✅ Não precisa usar sudo toda vez
- ✅ Você vira o dono do diretório
- ✅ npm install funciona normalmente

---

## ✅ **SOLUÇÃO 3: USAR SUDO (TEMPORÁRIO)**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Instalar com sudo
sudo npm install

# Depois corrigir ownership do node_modules
sudo chown -R $USER:$USER node_modules
```

### **Quando usar?**
- ⚠️ Apenas se não puder usar `sudo chown` no diretório principal
- ⚠️ Terá que fazer isso toda vez que instalar pacotes

---

## ✅ **SOLUÇÃO 4: FLAG --UNSAFE-PERM**

```bash
cd /home/meumu.com/public_html/backend-nodejs

# Instalar com flag especial
npm install --unsafe-perm
```

### **Quando usar?**
- ⚠️ Se não tiver acesso a sudo
- ⚠️ Instalação em ambiente compartilhado
- ⚠️ Menos seguro, use apenas se necessário

---

## 📊 **COMPARAÇÃO DAS SOLUÇÕES:**

| Solução | Dificuldade | Permanente | Segurança | Quando Usar |
|---------|-------------|------------|-----------|-------------|
| **1. Script Automático** | ⭐ Muito Fácil | ✅ Sim | ✅ Alta | **SEMPRE!** |
| **2. Corrigir Ownership** | ⭐⭐ Fácil | ✅ Sim | ✅ Alta | Servidor próprio |
| **3. Usar Sudo** | ⭐⭐⭐ Médio | ❌ Não | ⚠️ Média | Sem ownership |
| **4. Flag unsafe-perm** | ⭐⭐ Fácil | ❌ Não | ⚠️ Baixa | Sem sudo |

---

## 🧪 **TESTE SE FUNCIONOU:**

Depois de aplicar a solução, teste:

```bash
# 1. Verificar ownership
ls -la /home/meumu.com/public_html/
# Deve mostrar SEU usuário

# 2. Testar escrita
touch /home/meumu.com/public_html/backend-nodejs/.test
rm /home/meumu.com/public_html/backend-nodejs/.test
# Se não der erro, está OK!

# 3. Instalar dependências
cd /home/meumu.com/public_html/backend-nodejs
npm install
# Deve funcionar SEM erros EACCES

# 4. Verificar se xss-clean foi instalado
ls node_modules/ | grep xss-clean
# Deve mostrar: xss-clean
```

---

## ❌ **AINDA DÁ ERRO?**

### **Erro 1: sudo: command not found**
```bash
# Você não tem sudo instalado ou não tem permissão
# Use a Solução 4 (--unsafe-perm)
```

### **Erro 2: Operation not permitted**
```bash
# Você não tem permissão de sudo
# Peça ao administrador do servidor:
sudo chown -R fabricio:fabricio /home/meumu.com/public_html
```

### **Erro 3: npm WARN checkPermissions Missing write access**
```bash
# Ownership ainda não foi corrigido
# Execute novamente:
sudo chown -R $USER:$USER /home/meumu.com/public_html
```

---

## 🔍 **VERIFICAR QUEM É O DONO:**

```bash
# Ver quem você é:
whoami
# Resultado: fabricio

# Ver quem é o dono do diretório:
stat -c '%U' /home/meumu.com/public_html
# Resultado: meumu.com (DIFERENTE!)

# Ver permissões detalhadas:
ls -la /home/meumu.com/public_html/
# drwxr-xr-x meumu.com meumu.com ...
#            ↑         ↑
#          dono     grupo
```

---

## 🚀 **DEPOIS DE CORRIGIR:**

```bash
# 1. Executar instalação
cd /home/meumu.com/public_html
node install.js

# 2. Ou usar check.js
node check.js
# Opção 2 (Fix Automático)

# 3. Depois deploy
node check.js
# Opção 4 (Deploy Desenvolvimento)
```

---

## 💡 **DICAS:**

### **Para CyberPanel:**
```bash
# No painel CyberPanel, vá em:
# Websites → meumu.com → Fix Permissions
# Isso corrige automaticamente!
```

### **Para cPanel:**
```bash
# No File Manager, selecione o diretório
# Botão direito → Change Permissions
# Owner: fabricio
# Aplicar recursivamente
```

### **Para servidor próprio (root):**
```bash
# Você pode usar sudo diretamente:
cd /home/meumu.com/public_html
sudo chown -R fabricio:fabricio .
```

---

## 🎯 **RESUMO:**

**PROBLEMA:**
- Usuário `fabricio` não é o dono de `/home/meumu.com/public_html/`
- npm não consegue criar arquivos

**SOLUÇÃO RÁPIDA:**
```bash
cd /home/meumu.com/public_html
chmod +x fix-permissions.sh
./fix-permissions.sh
```

**SOLUÇÃO MANUAL:**
```bash
sudo chown -R $USER:$USER /home/meumu.com/public_html
node install.js
```

---

**BOA SORTE! 🚀🎄**
