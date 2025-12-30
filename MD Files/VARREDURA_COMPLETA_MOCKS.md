# 🚨 VARREDURA COMPLETA - TODOS OS MOCKS ENCONTRADOS

**Data:** 2025-12-30 21:30 CET  
**Status:** ANÁLISE COMPLETA

---

## ❌ **MOCKS CRÍTICOS ENCONTRADOS (REQUEREM CORREÇÃO IMEDIATA):**

### **1. AccountManagement.tsx - Botão "Nova Conta" (LINHA 84-87)**
```tsx
<Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-lg shadow-amber-500/30">
  <UserPlus className="w-4 h-4 mr-2" />
  Nova Conta
</Button>
```
**PROBLEMA:** ❌ SEM onClick handler
**AÇÃO:** Criar modal + form + endpoint

---

### **2. SettingsSection.tsx - Tab "Banco de Dados" (LINHA 80-122)**
```tsx
<TabsContent value="database" className="mt-6">
  <Card>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Host</label>
          <Input type="text" defaultValue="localhost" /> {/* ❌ MOCK */}
        </div>
        <div>
          <label>Porta</label>
          <Input type="text" defaultValue="3306" /> {/* ❌ MOCK */}
        </div>
      </div>
      <div>
        <label>Nome do Banco</label>
        <Input type="text" defaultValue="MuOnline" /> {/* ❌ MOCK */}
      </div>
      <Button> {/* ❌ SEM onClick */}
        Salvar Configurações
      </Button>
    </CardContent>
  </Card>
</TabsContent>
```
**PROBLEMA:** ❌ defaultValue estático, SEM estados, SEM onClick, NÃO carrega .env, NÃO salva
**AÇÃO:** Implementar estados + load + save + endpoints

---

### **3. CronsSection.tsx - Botão "Novo Cron Job" (LINHA 22-25)**
```tsx
<Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
  <Plus className="w-4 h-4 mr-2" />
  Novo Cron Job
</Button>
```
**PROBLEMA:** ❌ SEM onClick handler
**AÇÃO:** Criar modal + form + endpoint

---

### **4. BansSection.tsx - Botão "Novo Banimento" (LINHA 102-105)**
```tsx
<Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
  <Plus className="w-4 h-4 mr-2" />
  Novo Banimento
</Button>
```
**PROBLEMA:** ❌ SEM onClick handler
**AÇÃO:** Criar modal + form + endpoint

---

### **5. PluginsSection.tsx - Precisa verificar se tem Upload**
**AÇÃO:** Verificar se PluginsSection.tsx tem botão de upload (diferente de plugin-manager.tsx)

---

## ✅ **FUNCIONALIDADES JÁ FUNCIONAIS (NÃO PRECISA CORRIGIR):**

1. **plugin-manager.tsx** → Botão "Instalar Plugin" JÁ TEM handleFileUpload ✅
2. **WCoinPackagesSection.tsx** → Botão "Novo Pacote" JÁ TEM onClick ✅
3. **NewsManagement.tsx** → Botão "Publicar" JÁ TEM handlePublish ✅
4. **CharacterManagement.tsx** → Paginação JÁ FUNCIONA ✅
5. **LogsSection.tsx** → Botão "Atualizar" JÁ FUNCIONA ✅

---

## 📋 **PRIORIDADE DE CORREÇÃO:**

### **🔴 PRIORIDADE ALTA (Usuário mencionou 30x):**
1. ✅ ~~plugin-manager.tsx~~ → **JÁ FUNCIONA** (tem handleFileUpload implementado)
2. ❌ **AccountManagement.tsx** → "Nova Conta" (SEM onClick)

### **🟡 PRIORIDADE MÉDIA:**
3. ❌ **SettingsSection.tsx** → Database config (totalmente mock)
4. ❌ **CronsSection.tsx** → "Novo Cron Job" (SEM onClick)
5. ❌ **BansSection.tsx** → "Novo Banimento" (SEM onClick)

### **🟢 PRIORIDADE BAIXA:**
6. ⚠️ **PluginsSection.tsx** → Verificar se tem upload (pode estar OK)

---

## 🔧 **PLANO DE AÇÃO COMPLETO:**

### **ETAPA 1: AccountManagement.tsx - "Nova Conta" (5 min)**
- [ ] Criar estado para modal
- [ ] Criar form com campos (username, password, email)
- [ ] Criar handler handleCreateAccount
- [ ] Adicionar onClick ao botão
- [ ] Criar endpoint backend: POST /api/admin/accounts/create

### **ETAPA 2: SettingsSection.tsx - Database Config (15 min)**
- [ ] Criar estados para todos os campos
- [ ] Implementar loadEnvConfig (GET /api/admin/env/get)
- [ ] Implementar saveEnvConfig (POST /api/admin/env/update)
- [ ] Adicionar onClick ao botão "Salvar"
- [ ] Adicionar validações
- [ ] Criar 2 endpoints backend

### **ETAPA 3: CronsSection.tsx - "Novo Cron Job" (10 min)**
- [ ] Criar estado para modal
- [ ] Criar form com campos (name, interval, command)
- [ ] Criar handler handleCreateCron
- [ ] Adicionar onClick ao botão
- [ ] Criar endpoint backend: POST /api/admin/crons/create

### **ETAPA 4: BansSection.tsx - "Novo Banimento" (10 min)**
- [ ] Criar estado para modal
- [ ] Criar form com campos (username, reason, duration)
- [ ] Criar handler handleBanUser
- [ ] Adicionar onClick ao botão
- [ ] Criar endpoint backend: POST /api/admin/bans/create

### **ETAPA 5: Verificar PluginsSection.tsx (3 min)**
- [ ] Verificar se tem botão de upload
- [ ] Se tiver, verificar se funciona
- [ ] Corrigir se necessário

---

## ⏰ **TEMPO ESTIMADO TOTAL:**
- **ETAPA 1:** 5 minutos
- **ETAPA 2:** 15 minutos
- **ETAPA 3:** 10 minutos
- **ETAPA 4:** 10 minutos
- **ETAPA 5:** 3 minutos
- **TOTAL:** **43 minutos**

---

## 🚀 **COMEÇAR AGORA?**
Responda "SIM" e vou executar todas as 5 etapas em sequência!
