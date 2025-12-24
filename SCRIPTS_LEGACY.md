# 📜 SCRIPTS LEGACY (.sh) - GUIA DE MIGRAÇÃO

**Status:** Scripts .sh antigos foram **substituídos** por Node.js  
**Motivo:** Compatibilidade multiplataforma (Windows/Linux/macOS)

---

## ✅ **NOVA ESTRUTURA (Use Estes):**

| Novo Script | Substitui | Comando |
|------------|-----------|---------|
| **install.js** | instalacao.sh, setup-*.sh | `node install.js` |
| **check.js** | diagnostico.sh, test-*.sh | `npm run check` |
| **package.json** | reiniciar.sh, forcar-start.sh | `npm run deploy:dev` |

---

## 📁 **SCRIPTS .SH LEGADOS (backend-nodejs/):**

Estes scripts **ainda funcionam** em Linux/macOS, mas foram **consolidados** em `install.js` e `check.js`:

### **CATEGORIA: Instalação/Setup**
- ❌ `INSTALAR_E_INICIAR.sh` → Use: `node install.js && npm run deploy:dev`
- ❌ `setup-env.sh` → Use: `node install.js` (faz automaticamente)
- ❌ `setup-git-hooks.sh` → Use: `node install.js` (faz automaticamente)
- ❌ `instalar-dependencias.sh` → Use: `node install.js`
- ❌ `instalar-frontend.sh` → Use: `npm install` (raiz do projeto)

### **CATEGORIA: Diagnóstico/Teste**
- ❌ `diagnostico.sh` → Use: `npm run check` (opção 1)
- ❌ `diagnostico-completo.sh` → Use: `npm run check` (opção 7)
- ❌ `test-backend.sh` → Use: `npm run check` (opção 1)
- ❌ `test-complete.sh` → Use: `npm run check` (opção 7)
- ❌ `test-security.sh` → Use: `npm run check:security`
- ❌ `verificar-install.sh` → Use: `npm run check` (opção 1)

### **CATEGORIA: Segurança**
- ❌ `security-scan.sh` → Use: `npm run check:security`

### **CATEGORIA: Deploy/Restart**
- ❌ `reiniciar.sh` → Use: `npm run deploy:prod` (PM2)
- ❌ `forcar-start.sh` → Use: `npm run deploy:dev`
- ❌ `quick-start.sh` → Use: `npm run deploy:dev`

### **CATEGORIA: Utilitários**
- ✅ `listar-estrutura.sh` → **Mantido** (útil para debug)
- ⚠️ `nginx-security.conf` → **Mantido** (config Nginx)

---

## 🗑️ **SCRIPTS QUE PODEM SER DELETADOS:**

Se você **não precisa** de compatibilidade com sistemas Linux antigos que não tem Node.js:

```bash
cd backend-nodejs

# Deletar scripts de instalação (substituídos por install.js)
rm INSTALAR_E_INICIAR.sh
rm setup-env.sh
rm setup-git-hooks.sh
rm instalar-dependencias.sh
rm instalar-frontend.sh

# Deletar scripts de diagnóstico (substituídos por check.js)
rm diagnostico.sh
rm diagnostico-completo.sh
rm test-backend.sh
rm test-complete.sh
rm test-security.sh
rm verificar-install.sh

# Deletar scripts de segurança (substituídos por check.js)
rm security-scan.sh

# Deletar scripts de deploy (substituídos por npm scripts)
rm reiniciar.sh
rm forcar-start.sh
rm quick-start.sh
```

**ATENÇÃO:** Faça backup antes ou comite no Git!

---

## 🔧 **TABELA DE CONVERSÃO:**

### **Antes (Scripts .sh - Linux only):**
```bash
./INSTALAR_E_INICIAR.sh           # Instalar tudo
./setup-env.sh                    # Setup .env
./setup-git-hooks.sh              # Setup hooks
./diagnostico.sh                  # Diagnóstico
./test-security.sh                # Security scan
./reiniciar.sh                    # Restart PM2
```

### **Depois (Node.js - Multiplataforma):**
```bash
node install.js                   # Instalar tudo + setup .env + hooks
npm run check                     # Menu com tudo
npm run check:security            # Security scan
npm run deploy:prod               # Deploy PM2
```

---

## 📊 **VANTAGENS DA NOVA ESTRUTURA:**

| Aspecto | Scripts .sh | Scripts .js |
|---------|------------|------------|
| **Windows** | ❌ Não funciona | ✅ Funciona |
| **Linux** | ✅ Funciona | ✅ Funciona |
| **macOS** | ✅ Funciona | ✅ Funciona |
| **XAMPP** | ❌ Difícil | ✅ Fácil |
| **Manutenção** | ❌ Duplicado | ✅ Único |
| **Interativo** | ❌ Limitado | ✅ Menu completo |
| **Detecção** | ❌ Manual | ✅ Automática |

---

## 🎯 **RECOMENDAÇÃO:**

### **Opção 1: Cleanup Completo (Recomendado)**
```bash
# Deletar TODOS os .sh (exceto listar-estrutura.sh)
cd backend-nodejs
rm *.sh
git rm *.sh
git commit -m "chore: remover scripts .sh legacy (substituídos por Node.js)"
```

### **Opção 2: Manter por Compatibilidade**
- Manter os scripts .sh para usuários com sistemas legados
- Documentar que a forma recomendada é usar os scripts .js
- Atualizar README.md para mencionar ambos

### **Opção 3: Mover para pasta legacy/**
```bash
mkdir backend-nodejs/legacy
mv backend-nodejs/*.sh backend-nodejs/legacy/
echo "Scripts antigos - use install.js e check.js" > backend-nodejs/legacy/README.md
```

---

## ✅ **SCRIPTS QUE DEVEM SER MANTIDOS:**

### **Arquivos de Config (NÃO são scripts):**
- ✅ `nginx-security.conf` - Config Nginx (útil)
- ✅ `ecosystem.config.js` - Config PM2 (usado pelo check.js)

### **Scripts Node.js (Utilitários):**
- ✅ `check-tables.js` - Detecta tabelas do banco
- ✅ `check-columns.js` - Detecta colunas
- ✅ `auto-fix-tables.js` - Auto-fix de tabelas
- ✅ `detect-structure.js` - Detecta estrutura
- ✅ `test-db-connection.js` - Testa conexão DB

---

## 🚨 **ATENÇÃO:**

Se você **deletar os scripts .sh**:

1. ✅ Funcionalidade 100% mantida (em install.js e check.js)
2. ✅ Melhor compatibilidade (Windows/Linux/macOS)
3. ✅ Menos confusão para novos usuários
4. ⚠️ Usuários com scripts .sh customizados precisarão migrar

---

## 📝 **DECISÃO:**

**Escolha uma opção e documente aqui:**

- [ ] Opção 1: Deletar todos os .sh
- [ ] Opção 2: Manter por compatibilidade
- [ ] Opção 3: Mover para legacy/

**Data da decisão:** ___________  
**Responsável:** ___________

---

**Status:** 📋 Documentado e pronto para decisão
