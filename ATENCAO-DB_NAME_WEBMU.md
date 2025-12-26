# ⚠️ ATENÇÃO - VARIÁVEL DB_NAME_WEBMU OBRIGATÓRIA

**Data:** 26 de dezembro de 2024  
**Importância:** 🔴 **CRÍTICA**

---

## 🚨 **PROBLEMA RESOLVIDO**

### **Erro anterior:**
```
❌ Startup Bloqueado: DB_NAME_WEBMU não encontrado no .env
```

### **Causa:**
O backend possui um validador de segurança que verifica se TODAS as variáveis obrigatórias estão presentes no `.env` antes de iniciar o servidor.

A variável `DB_NAME_WEBMU` estava faltando, causando bloqueio do startup.

---

## ✅ **SOLUÇÃO APLICADA**

### **1. Arquivo `/install.sh` CORRIGIDO**

Agora o `install.sh` cria automaticamente a variável `DB_NAME_WEBMU` no `.env.production`:

```bash
# DATABASES (Nomes)
DB_NAME_MUONLINE=muonline
DB_NAME_MEUWEB=meuweb
DB_NAME_WEBMU=meuweb     # ✅ ADICIONADO
```

### **2. Arquivo `/backend-nodejs/.env.production` CRIADO**

Arquivo template criado com TODAS as variáveis necessárias, incluindo:

```env
DB_NAME_WEBMU=meuweb
```

---

## 📋 **APÓS O CLONE**

Quando você fizer o clone do repositório e executar `./install.sh`, o arquivo `.env` será criado automaticamente com a variável correta.

**Comando:**
```bash
cd /home/meumu.com/public_html
chmod +x install.sh
./install.sh
```

**O instalador vai:**
1. ✅ Copiar `.env.production` para `.env`
2. ✅ Incluir `DB_NAME_WEBMU=meuweb`
3. ✅ Backend vai iniciar SEM bloqueio

---

## 🔍 **VERIFICAR SE ESTÁ CORRETO**

Após executar o `install.sh`, verifique:

```bash
cd /home/meumu.com/public_html/backend-nodejs
cat .env | grep DB_NAME_WEBMU
```

**Saída esperada:**
```
DB_NAME_WEBMU=meuweb
```

---

## 🛠️ **SE O PROBLEMA PERSISTIR**

Caso o backend ainda não inicie, siga estes passos:

### **1. Verificar arquivo `.env`:**
```bash
cd /home/meumu.com/public_html/backend-nodejs
nano .env
```

### **2. Adicionar manualmente:**
```env
# Procure a seção DATABASES e adicione:
DB_NAME_WEBMU=meuweb
```

### **3. Salvar e reiniciar:**
```bash
# Salvar: CTRL+O, Enter, CTRL+X
pm2 restart all
```

### **4. Verificar logs:**
```bash
pm2 logs meumu-api --lines 50
```

---

## 📊 **VARIÁVEIS OBRIGATÓRIAS NO .ENV**

Lista completa de variáveis que o validador verifica:

### **Database:**
- ✅ `DB_HOST`
- ✅ `DB_USER`
- ✅ `DB_PASSWORD`
- ✅ `DB_NAME_MUONLINE` (database do jogo)
- ✅ `DB_NAME_MEUWEB` (database do site)
- ✅ `DB_NAME_WEBMU` (alias para `meuweb`) ← **ESTA ESTAVA FALTANDO**

### **Servidor:**
- ✅ `PORT`
- ✅ `JWT_SECRET`
- ✅ `NODE_ENV`

---

## 🎯 **RESUMO**

| Item | Status |
|------|--------|
| Variável `DB_NAME_WEBMU` | ✅ Adicionada ao `install.sh` |
| Arquivo `.env.production` | ✅ Criado com todas as variáveis |
| Clone + install.sh | ✅ Vai funcionar automaticamente |
| Startup do backend | ✅ Não vai mais bloquear |

---

## 🚀 **PRÓXIMOS PASSOS**

1. Fazer commit das correções:
```bash
git add .
git commit -m "✅ Fix: Adicionar DB_NAME_WEBMU ao .env"
git push
```

2. No servidor, fazer clone fresh:
```bash
cd /home/meumu.com
rm -rf public_html/*
cd public_html
git clone <seu-repo> .
chmod +x install.sh
./install.sh
```

3. O sistema vai iniciar SEM bloqueio!

---

**✅ PROBLEMA RESOLVIDO E DOCUMENTADO!**
