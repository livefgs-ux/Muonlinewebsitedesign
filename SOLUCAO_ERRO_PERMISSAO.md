# 🐛 SOLUÇÃO: Erro ao criar arquivo .env

## ❌ O Problema

Quando você clica em **"Instalar Agora"** no instalador, aparece:

```
Erro na instalação: Erro ao criar arquivo .env
```

---

## 🔍 Por que acontece?

O servidor web (Apache/Nginx/LiteSpeed) **não tem permissão** para criar arquivos na pasta do projeto.

---

## ✅ SOLUÇÃO RÁPIDA

### **Opção 1: Script Automático (RECOMENDADO)**

#### **Linux/VPS/Mac:**
```bash
cd /caminho/do/projeto
chmod +x scripts/fix-permissions.sh
./scripts/fix-permissions.sh
```

#### **Windows (PowerShell como Administrador):**
```powershell
cd C:\xampp\htdocs\meumu
Set-ExecutionPolicy Bypass -Scope Process
.\scripts\fix-permissions.ps1
```

---

### **Opção 2: Manual (Linux)**

```bash
# 1. Navegar até a pasta
cd /var/www/html/meumu

# 2. Dar permissões de escrita
chmod -R 775 .

# 3. Ajustar o dono (Apache)
chown -R www-data:www-data .

# OU (Nginx)
chown -R nginx:nginx .

# OU (cPanel)
chown -R seu-usuario:seu-usuario .
```

---

### **Opção 3: Manual (Windows)**

1. Clique com **botão direito** na pasta do projeto
2. **Propriedades** → **Segurança**
3. **Editar** → **Adicionar** → Digite **"Todos"**
4. Marcar **"Controle Total"**
5. **Aplicar** → **OK**

---

### **Opção 4: cPanel (Hospedagem)**

1. Acesse **cPanel** → **Gerenciador de Arquivos**
2. Navegue até `public_html/meumu`
3. Selecione **TODAS** as pastas e arquivos
4. Clique em **"Permissões"**
5. Defina:
   - **Pastas:** 755
   - **Arquivos:** 644
6. Marque **"Aplicar recursivamente"**
7. **Salvar**

---

## ✅ Verificar se funcionou

Execute no terminal:

```bash
ls -la
```

Você deve ver algo assim:

```
drwxrwxr-x  backend-nodejs/
drwxrwxr-x  install/
-rw-rw-r--  package.json
```

✅ Se tiver **"w"** (write), está OK!  
❌ Se não tiver **"w"**, execute os comandos novamente.

---

## 🔄 Depois de corrigir

1. Volte para o navegador
2. Recarregue a página: `http://seudominio.com/install`
3. Clique em **"Instalar Agora"** novamente
4. Deve funcionar! ✅

---

## 📝 Arquivo Criado com Sucesso

Após a instalação, você verá:

```
/backend-nodejs/.env          ← Configurações do backend
/config.php                   ← Configurações PHP
/install/.installed           ← Marca de instalação concluída
```

---

## 🆘 Ainda não funciona?

### **1. Verificar SELinux (CentOS/RedHat):**
```bash
sudo setenforce 0
```

### **2. Verificar AppArmor (Ubuntu):**
```bash
sudo systemctl stop apparmor
```

### **3. Ver logs de erro:**
```bash
tail -f /var/log/apache2/error.log
```

### **4. Verificar usuário do PHP:**
```bash
php -r "echo exec('whoami');"
```

---

## 💡 DICA IMPORTANTE

Se você está usando **XAMPP no Windows**, certifique-se de que:

1. ✅ XAMPP está instalado em `C:\xampp`
2. ✅ Projeto está em `C:\xampp\htdocs\meumu`
3. ✅ Apache está rodando
4. ✅ Você executou PowerShell como **Administrador**

---

## 🎯 COMANDOS UNIVERSAIS

### **Linux com ROOT:**
```bash
cd /caminho/do/projeto
chmod -R 775 .
chown -R www-data:www-data .
```

### **Windows com Admin:**
```powershell
icacls "C:\xampp\htdocs\meumu" /grant Everyone:F /T
```

---

## ✅ SUCESSO!

Depois de corrigir as permissões, o instalador deve:

1. ✅ Criar `/backend-nodejs/.env`
2. ✅ Criar `/config.php`
3. ✅ Criar usuário admin no database
4. ✅ Iniciar backend Node.js
5. ✅ Mostrar mensagem de sucesso!

---

## 📚 Documentação Completa

Para instruções detalhadas, veja:
- `/CORRIGIR_PERMISSOES.txt` - Guia completo
- `/README.md` - Documentação geral
- `/logs-criacao/INSTALACAO.md` - Instalação manual

---

**🎮 MeuMU Online** - Instalador Automático  
✨ Desenvolvido para facilitar sua vida!
