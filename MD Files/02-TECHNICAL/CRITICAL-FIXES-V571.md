# 🚨 CORREÇÕES CRÍTICAS IDENTIFICADAS - V571
**Data:** 2025-12-30 07:00 CET (UTC+1)  
**Versão:** V571  
**Status:** 🔴 **EMERGENCIAL - 15 bugs críticos**

---

## 📋 **RESUMO EXECUTIVO**

**Problemas Identificados pelo Usuário:**
1. ✅ MOCKs não foram removidos (apenas API adicionada)
2. ❌ Botões não funcionais (Nova Conta, Instalar Plugin, Novo Banimento)
3. ❌ Notícias - Erro 400 ao postar
4. ❌ Configurações - Não salva alterações
5. ❌ Logs - Exportar CSV retorna erro 500
6. ❌ Editor de Site - Labels ilegíveis
7. ❌ Personagens - Char "MeuMuzin" não aparece
8. ❌ Sistema - Dashboard/Diagnostics/DB Test retornam 404
9. ❌ Defense - Erro "Shield is not defined"
10. ❌ Remover TODAS as funções de firewall (VPS já tem)

---

## 🔴 **CORREÇÕES PRIORITÁRIAS (FAZER AGORA)**

### **1. PERSONAGENS NÃO APARECEM** 🔴🔴🔴

**PROBLEMA:**
- Usuário criou char "MeuMuzin" na conta "admin"
- Char NÃO aparece no site

**CAUSA PROVÁVEL:**
```javascript
// charactersController.js LINHA 38
const getGuidSql = `SELECT guid FROM accounts WHERE account = ?`;
const guidResult = await executeQueryMU(getGuidSql, [accountId]);

// PROBLEMA: accountId vem de req.user que pode estar errado
```

**SOLUÇÃO:**
1. Verificar se `req.user.accountId` está correto
2. Logar query SQL para debug
3. Verificar se account_id no character_info está correto

**TESTE:**
```sql
-- Executar no MariaDB
SELECT * FROM character_info WHERE name = 'MeuMuzin';
SELECT * FROM accounts WHERE account = 'admin';
-- Verificar se account_id do char = guid da account
```

---

### **2. NOTÍCIAS - ERRO 400 AO POSTAR** 🔴

**PROBLEMA:**
- Frontend envia POST /api/news
- Backend retorna 400

**CAUSA PROVÁVEL:**
```javascript
// newsController.js - Validação middleware rejeitando
```

**SOLUÇÃO:**
1. Verificar schema de validação em `/routes/news.js`
2. Logar req.body no controller
3. Verificar campos obrigatórios

**TESTE:**
```bash
curl -X POST http://localhost:3001/api/news \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Teste","content":"Conteúdo teste","status":"published"}'
```

---

### **3. CONFIGURAÇÕES - NÃO SALVA** 🔴

**PROBLEMA:**
- SettingsSection não salva alterações

**CAUSA PROVÁVEL:**
```javascript
// SettingsSection.tsx - Endpoint ou validação
```

**SOLUÇÃO:**
1. Verificar se `/api/admin/settings/update` existe
2. Verificar req.body esperado
3. Adicionar logs no controller

---

### **4. LOGS EXPORTAR - ERRO 500** 🔴

**PROBLEMA:**
- Botão "Exportar CSV" retorna 500

**CAUSA PROVÁVEL:**
```javascript
// adminLogsController.js - exportLogsToCSV()
// Pode estar faltando permissão de escrita ou caminho errado
```

**SOLUÇÃO:**
1. Verificar função `exportLogsToCSV` em `/controllers/adminLogsController.js`
2. Logar erro completo
3. Verificar se precisa criar diretório temporário

---

### **5. EDITOR DE SITE - LABELS ILEGÍVEIS** 🟡

**PROBLEMA:**
- Labels das tabs não visíveis (fonte ilegível)

**SOLUÇÃO:**
1. Verificar CSS do SiteEditorSection
2. Aumentar font-size ou cor de contraste
3. Verificar se Tailwind está aplicando classes corretas

---

### **6. SISTEMA - 404 ERRORS** 🔴

**PROBLEMA:**
- Dashboard → 404
- Diagnostics → 404
- DB Test → 404

**CAUSA PROVÁVEL:**
```javascript
// Componentes não encontrados ou rotas erradas
```

**SOLUÇÃO:**
1. Verificar imports em `system-management.tsx`
2. Verificar se componentes existem:
   - `AdminDiagnostics`
   - `AdminDbTest`
   - `AdminSecurityDashboard`

---

### **7. DEFENSE - "Shield is not defined"** 🔴

**PROBLEMA:**
```
ReferenceError: Shield is not defined
at admin-dashboard-QShjvOKM.js:194:21412
```

**CAUSA:**
- Import faltando: `import { Shield } from 'lucide-react'`

**SOLUÇÃO:**
1. Encontrar componente que usa `Shield` sem importar
2. Adicionar import correto

---

### **8. REMOVER FIREWALL FUNCTIONS** 🟡

**PROBLEMA:**
- Funções de firewall não devem existir (VPS já gerencia)

**ARQUIVOS PARA LIMPAR:**
- `SecurityPanel.tsx` → Remover botão "Reiniciar Firewall"
- `AdminLiveDefense.tsx` → Remover se existir
- `AdminAdaptiveFirewall.tsx` → Remover se existir

---

## 🟢 **CORREÇÕES JÁ FEITAS (V570)**

✅ DonationsPanel - MOCK removido (mas precisa backend)  
✅ SecurityPanel - MOCK removido  

---

## 📝 **PLANO DE AÇÃO V571**

### **FASE 1 - CRÍTICO (30 min)**
1. ✅ Corrigir personagens não aparecem
2. ✅ Corrigir erro 400 em notícias
3. ✅ Corrigir erro 500 em export logs
4. ✅ Corrigir erro "Shield is not defined"

### **FASE 2 - IMPORTANTE (20 min)**
5. ✅ Corrigir configurações não salvam
6. ✅ Corrigir 404 em Sistema/Dashboard
7. ✅ Melhorar legibilidade do SiteEditor

### **FASE 3 - LIMPEZA (15 min)**
8. ✅ Remover funções de firewall
9. ✅ Desabilitar botões não funcionais
10. ✅ Adicionar mensagens de "não implementado" onde necessário

---

## 🔍 **DEBUG COMMANDS**

### **Verificar personagens no DB:**
```sql
USE muonline;
SELECT c.*, a.account 
FROM character_info c 
JOIN accounts a ON c.account_id = a.guid 
WHERE a.account = 'admin';
```

### **Testar endpoints:**
```bash
# Notícias
curl -X GET http://localhost:3001/api/news

# Logs
curl -X GET http://localhost:3001/api/admin/logs/logs \
  -H "Authorization: Bearer TOKEN"

# Configurações
curl -X GET http://localhost:3001/api/admin/settings/all \
  -H "Authorization: Bearer TOKEN"
```

### **Verificar erros do backend:**
```bash
cd backend-nodejs
pm2 logs backend --lines 100
# ou
tail -f logs/error.log
```

---

## ⚠️ **AVISOS IMPORTANTES**

1. **NÃO criar novos MOCKs** - Apenas conectar APIs reais
2. **NÃO adicionar funções de sistema** (firewall, backup de VPS, etc)
3. **SEMPRE validar** se endpoint existe antes de chamar
4. **ADICIONAR mensagens** de "não implementado" onde necessário

---

**AGUARDANDO CONFIRMAÇÃO PARA INICIAR CORREÇÕES!**

**Opções:**
- 🔴 **A)** Corrigir TUDO agora (V571 completo - 1h)
- 🟡 **B)** Apenas Fase 1 (crítico - 30 min)
- ⚪ **C)** Apenas personagens + notícias (15 min)

**FIM DO DOCUMENTO V571**
