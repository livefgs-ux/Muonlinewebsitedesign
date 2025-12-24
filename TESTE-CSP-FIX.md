# ✅ **TESTE RÁPIDO: CSP CORRIGIDO**

**Data:** 24/12/2025 23:55  
**Fix:** CSP permitindo blob: + scriptSrcAttr

---

## 🎯 **O QUE FOI CORRIGIDO:**

1. **`scriptSrc: blob:`** - Permite scripts de extensões do navegador
2. **`scriptSrcAttr: 'unsafe-inline'`** - Permite `onclick` handlers
3. **`imgSrc: blob:`** - Permite images blob
4. **`crossOriginOpenerPolicy: false`** - Remove aviso COOP (HTTP)
5. **`hsts: false`** - Remove aviso HSTS (só funciona com HTTPS)

---

## 🧪 **TESTE AGORA:**

```bash
# ════════════════════════════════════════════════════════════════
# PASSO 1: ATUALIZAR CÓDIGO
# ════════════════════════════════════════════════════════════════
cd /home/meumu.com/public_html
rm -rf * .git
git clone https://github.com/livefgs-ux/Muonlinewebsitedesign .

# ════════════════════════════════════════════════════════════════
# PASSO 2: INSTALAR (NÃO npm run check!)
# ════════════════════════════════════════════════════════════════
node install.js

# Se der erro de permissão:
sudo chown -R $USER:$USER /home/meumu.com/public_html
node install.js

# ════════════════════════════════════════════════════════════════
# PASSO 3: INICIAR SERVIDOR
# ════════════════════════════════════════════════════════════════
node check.js
# Opção 4 (Deploy Desenvolvimento)

# ════════════════════════════════════════════════════════════════
# PASSO 4: ABRIR INSTALADOR NO NAVEGADOR
# ════════════════════════════════════════════════════════════════
# URL: http://meumu.com:3001/install

# ════════════════════════════════════════════════════════════════
# PASSO 5: VERIFICAR CONSOLE (F12)
# ════════════════════════════════════════════════════════════════
```

---

## ✅ **RESULTADO ESPERADO NO CONSOLE:**

### **ANTES (COM ERROS):**
```
❌ Loading the script 'blob:http://meumu.com:3001/...' violates CSP
❌ Executing inline event handler violates CSP
⚠️  Cross-Origin-Opener-Policy header has been ignored
⚠️  Origin-Agent-Cluster warning
```

### **DEPOIS (LIMPO):**
```
✅ Instalador carregado
🌐 URL atual: http://meumu.com:3001
🔌 Porta atual: 3001
✅ Detectado porta 3001 - usando diretamente
🎯 API Base URL: http://meumu.com:3001
✅ Instalador carregado
🌐 API Base: http://meumu.com:3001

(SEM ERROS CSP!)
```

---

## 🎯 **TESTE DE FUNCIONALIDADE:**

```bash
# 1. Preencher formulário:
Host: localhost
Porta: 3306
Usuário: root
Senha: SUA_SENHA_MYSQL
DB MU: muonline (minúscula!)
DB WEB: webmu

# 2. Clicar "🧪 Testar Ambas Conexões"
# DEVE mostrar:
# ✅ MuOnline: Conectado - 15 tabelas
# ✅ WebMU: Conectado - Database criada

# 3. Clicar "✅ Finalizar Instalação"
# DEVE mostrar:
# ✅ Instalação concluída!
# .env criado com sucesso
# Tabelas criadas: web_config, web_news, web_events, web_downloads, web_audit_logs

# 4. Reiniciar servidor
# Ctrl+C
node check.js
# Opção 4

# 5. Testar API
curl http://meumu.com:3001/api/health
# DEVE retornar: {"status":"ok"}

curl http://meumu.com:3001/api/rankings/players
# DEVE retornar: dados reais do MU
```

---

## 📊 **CHECKLIST DE VERIFICAÇÃO:**

- [ ] Console limpo (sem erros CSP)
- [ ] Botões funcionando (clicáveis)
- [ ] Teste de conexão funciona
- [ ] Database criado corretamente
- [ ] .env salvo com credenciais
- [ ] API funcionando após reiniciar

---

## 🐛 **SE AINDA HOUVER ERROS CSP:**

```bash
# Verificar se mudanças foram aplicadas:
cat /home/meumu.com/public_html/backend-nodejs/src/server.js | grep "scriptSrcAttr"

# DEVE mostrar:
# scriptSrcAttr: ["'unsafe-inline'"],

# Se NÃO mostrar, significa que o código NÃO foi atualizado!
# Deletar tudo e clonar novamente:
cd /home/meumu.com/public_html
rm -rf * .git
git clone https://github.com/livefgs-ux/Muonlinewebsitedesign .
node install.js
```

---

## 💡 **DICA: CACHE DO NAVEGADOR**

Se ainda ver erros CSP depois de reiniciar o servidor:

```
1. Pressionar Ctrl+Shift+R (hard refresh)
2. OU abrir aba anônima (Ctrl+Shift+N)
3. OU limpar cache:
   - Chrome: Ctrl+Shift+Del → Limpar cache
   - Firefox: Ctrl+Shift+Del → Limpar cache
```

---

**REPORTE O RESULTADO AQUI! 🚀**
