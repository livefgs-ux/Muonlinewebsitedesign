# 🚨 V577 - CORREÇÃO COMPLETA DE TODOS OS MOCKS

**Data:** 2025-12-30 21:45 CET  
**Objetivo:** ELIMINAR 100% DOS MOCKS DO PROJETO

---

## 📋 **MOCKS IDENTIFICADOS (FRONTEND):**

### ❌ **CRÍTICO 1: AccountManagement.tsx - Botão "Nova Conta"**
**Arquivo:** `/src/app/components/admincp/sections/AccountManagement.tsx:84`
```tsx
<Button className="...">
  <UserPlus className="w-4 h-4 mr-2" />
  Nova Conta
</Button>
```
**Problema:** SEM onClick handler
**Solução:** Criar modal + form + handler + endpoint

---

### ❌ **CRÍTICO 2: SettingsSection.tsx - Database Config**
**Arquivo:** `/src/app/components/admincp/sections/SettingsSection.tsx:80-122`
**Problema:** 
- Campos com defaultValue estático
- SEM estados
- SEM onClick no botão "Salvar"
- NÃO carrega .env
- NÃO salva alterações
**Solução:** Implementar sistema completo de env config

---

### ❌ **CRÍTICO 3: SettingsSection.tsx - Tab "Geral"**
**Arquivo:** `/src/app/components/admincp/sections/SettingsSection.tsx:72`
```tsx
<Button className="...">
  <Save className="w-4 h-4 mr-2" />
  Salvar Alterações
</Button>
```
**Problema:** SEM onClick handler
**Solução:** Implementar save handler

---

### ❌ **CRÍTICO 4: CronsSection.tsx - Botão "Novo Cron Job"**
**Arquivo:** `/src/app/components/admincp/sections/CronsSection.tsx:22`
**Problema:** SEM onClick handler
**Solução:** Criar modal + form + handler + endpoint

---

### ❌ **CRÍTICO 5: CronsSection.tsx - Botões Play/Delete**
**Arquivo:** `/src/app/components/admincp/sections/CronsSection.tsx:61,64`
**Problema:** Botões individuais SEM onClick
**Solução:** Adicionar handlers

---

### ❌ **CRÍTICO 6: BansSection.tsx - Botão "Novo Banimento"**
**Arquivo:** `/src/app/components/admincp/sections/BansSection.tsx:102`
**Problema:** SEM onClick handler
**Solução:** Criar modal + form + handler + endpoint

---

### ❌ **CRÍTICO 7: NewsManagement.tsx - "Salvar como Rascunho"**
**Arquivo:** `/src/app/components/admincp/sections/NewsManagement.tsx:182`
**Problema:** SEM onClick handler
**Solução:** Adicionar handler

---

### ❌ **CRÍTICO 8: PluginsSection.tsx - Botão "Instalar Plugin"**
**Arquivo:** `/src/app/components/admincp/sections/PluginsSection.tsx:127`
**Problema:** SEM onClick handler
**Solução:** Verificar se é wrapper do PluginManager ou criar handler

---

### ❌ **CRÍTICO 9: SiteEditorSection.tsx - Botões Preview/Save**
**Arquivo:** `/src/app/components/admincp/sections/SiteEditorSection.tsx:16,20`
**Problema:** SEM onClick handler
**Solução:** Verificar se é wrapper do SiteEditor ou criar handlers

---

## 📋 **ENDPOINTS BACKEND NECESSÁRIOS:**

### ✅ **JÁ EXISTEM:**
- `/backend-nodejs/src/routes/accounts.js` ✅
- `/backend-nodejs/src/routes/plugins.js` ✅
- `/backend-nodejs/src/routes/settings.js` ✅ (precisa verificar)
- `/backend-nodejs/src/routes/bans.js` ✅
- `/backend-nodejs/src/routes/adminLogs.js` ✅

### ❌ **FALTAM:**
- [ ] POST `/api/admin/accounts/create` (criar conta)
- [ ] GET `/api/admin/env/get` (pegar configs .env)
- [ ] POST `/api/admin/env/update` (atualizar .env)
- [ ] POST `/api/admin/crons/create` (criar cron)
- [ ] POST `/api/admin/crons/:id/execute` (executar cron)
- [ ] DELETE `/api/admin/crons/:id` (deletar cron)
- [ ] POST `/api/admin/bans/create` (criar ban)
- [ ] POST `/api/admin/news/draft` (salvar rascunho)

---

## 🎯 **PLANO DE EXECUÇÃO:**

### **FASE 1: FIXES RÁPIDOS (10 min)**
1. AccountManagement.tsx → Adicionar modal + handler "Nova Conta"
2. SettingsSection.tsx → Adicionar handlers "Salvar Alterações" e "Salvar Configurações"
3. NewsManagement.tsx → Adicionar handler "Salvar como Rascunho"

### **FASE 2: DATABASE CONFIG (15 min)**
4. SettingsSection.tsx → Implementar sistema completo de env config
5. Criar endpoints backend para env management

### **FASE 3: CRONS (10 min)**
6. CronsSection.tsx → Adicionar handlers "Novo Cron Job", Play, Delete
7. Criar endpoints backend para crons

### **FASE 4: BANS (10 min)**
8. BansSection.tsx → Adicionar handler "Novo Banimento"
9. Verificar endpoint backend (provavelmente já existe)

### **FASE 5: VERIFICAÇÕES (5 min)**
10. PluginsSection.tsx → Verificar se é wrapper do PluginManager
11. SiteEditorSection.tsx → Verificar se é wrapper do SiteEditor

---

## ⏰ **TEMPO ESTIMADO TOTAL: 50 MINUTOS**

---

## 🚀 **STATUS:**
- [ ] FASE 1: FIXES RÁPIDOS
- [ ] FASE 2: DATABASE CONFIG
- [ ] FASE 3: CRONS
- [ ] FASE 4: BANS
- [ ] FASE 5: VERIFICAÇÕES

---

**AGUARDANDO CONFIRMAÇÃO PARA INICIAR!**
