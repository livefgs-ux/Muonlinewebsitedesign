# 🔍 AUDITORIA COMPLETA DO ADMINCP - RELATÓRIO TÉCNICO

**Projeto:** MeuMU Online  
**Data:** 2025-12-30  
**Versão:** V573+  
**Auditor:** Sistema Automatizado

---

## 📋 SUMÁRIO EXECUTIVO

### Status Geral
- ✅ **Backend:** 18 endpoints REST funcionais
- ⚠️ **Frontend AdminCP:** Múltiplas seções usando dados MOCK
- ❌ **Integração:** Maioria das seções NÃO conectadas ao backend

### Prioridade de Correção
1. 🔴 **CRÍTICO:** DashboardSection (estatísticas falsas)
2. 🔴 **CRÍTICO:** CharacterManagement (personagens fake)
3. 🟠 **ALTO:** AccountManagement (verificar integração)
4. 🟠 **ALTO:** CronsSection (crons fake)
5. 🟡 **MÉDIO:** Outras seções

---

## 🗂️ ENDPOINTS DISPONÍVEIS NO BACKEND

### 1. **Authentication (`/api/auth`)**
```
POST   /api/auth/login          ✅ Login de usuário
POST   /api/auth/register       ✅ Registro de conta
POST   /api/auth/logout         ✅ Logout
GET    /api/auth/me             ✅ Dados do usuário autenticado
```

### 2. **Accounts (`/api/accounts`)**
```
GET    /api/accounts/search              ✅ Buscar conta
GET    /api/accounts/:username           ✅ Detalhes da conta
GET    /api/accounts/from-ip             ✅ Contas do mesmo IP
GET    /api/accounts/online              ✅ Contas online
GET    /api/accounts/new-registrations   ✅ Novos registros
PUT    /api/accounts/:username/email     ✅ Atualizar email
PUT    /api/accounts/:username/password  ✅ Resetar senha
PUT    /api/accounts/:username/cash      ✅ Adicionar/remover cash
GET    /api/accounts/stats               ✅ Estatísticas de contas
```

### 3. **Characters (`/api/characters`)**
```
GET    /api/characters               ✅ Listar personagens da conta
GET    /api/characters/:name         ✅ Detalhes do personagem
POST   /api/characters/:name/points  ✅ Distribuir pontos
POST   /api/characters/:name/reset   ✅ Resetar personagem
```

### 4. **Bans (`/api/bans`)**
```
GET    /api/bans                 ✅ Listar bans
POST   /api/bans/ban-account     ✅ Banir conta
POST   /api/bans/unban-account   ✅ Desbanir conta
POST   /api/bans/ban-ip          ✅ Banir IP
POST   /api/bans/unban-ip        ✅ Desbanir IP
```

### 5. **Rankings (`/api/rankings`)**
```
GET    /api/rankings/players   ✅ Ranking de jogadores
GET    /api/rankings/guilds    ✅ Ranking de guilds
GET    /api/rankings/resets    ✅ Ranking de resets
```

### 6. **Events (`/api/events`)**
```
GET    /api/events          ✅ Listar eventos
POST   /api/events          ✅ Criar evento
PUT    /api/events/:id      ✅ Atualizar evento
DELETE /api/events/:id      ✅ Deletar evento
```

### 7. **News (`/api/news`)**
```
GET    /api/news          ✅ Listar notícias
POST   /api/news          ✅ Criar notícia
PUT    /api/news/:id      ✅ Atualizar notícia
DELETE /api/news/:id      ✅ Deletar notícia
```

### 8. **Server Status (`/api/server`)**
```
GET    /api/server/status   ✅ Status do servidor
GET    /api/server/info     ✅ Informações do servidor
```

### 9. **Plugins (`/api/plugins`)**
```
GET    /api/plugins         ✅ Listar plugins
POST   /api/plugins         ✅ Criar plugin
PUT    /api/plugins/:id     ✅ Atualizar plugin
DELETE /api/plugins/:id     ✅ Deletar plugin
```

### 10. **Site Editor (`/api/site-editor`)**
```
GET    /api/site-editor/settings     ✅ Obter configurações
PUT    /api/site-editor/settings     ✅ Salvar configurações
```

### 11. **Downloads (`/api/downloads`)**
```
GET    /api/downloads        ✅ Listar downloads
POST   /api/downloads        ✅ Adicionar download
PUT    /api/downloads/:id    ✅ Atualizar download
DELETE /api/downloads/:id    ✅ Deletar download
```

### 12. **WCoin Packages (`/api/wcoin`)**
```
GET    /api/wcoin/packages       ✅ Listar pacotes
POST   /api/wcoin/packages       ✅ Criar pacote
PUT    /api/wcoin/packages/:id   ✅ Atualizar pacote
DELETE /api/wcoin/packages/:id   ✅ Deletar pacote
```

### 13. **Admin Logs (`/api/admin-logs`)**
```
GET    /api/admin-logs     ✅ Listar logs de admin
POST   /api/admin-logs     ✅ Criar log de ação
```

### 14. **Sandbox Security (`/api/sandbox`)**
```
POST   /api/sandbox/simulate   ✅ Simular ataques de segurança
GET    /api/sandbox/history    ✅ Histórico de simulações
```

---

## 🔴 SEÇÕES COM DADOS MOCK (CRÍTICAS)

### 1. **DashboardSection.tsx** 🔴 CRÍTICO

**Localização:** `/src/app/components/admincp/sections/DashboardSection.tsx`

**Problema:**
```javascript
const MOCK_STATS = {
  accounts: {
    total: 1257,        // ❌ FAKE
    online: 83,         // ❌ FAKE
    banned: 12,         // ❌ FAKE
    newToday: 8         // ❌ FAKE
  },
  characters: {
    total: 3542,        // ❌ FAKE
    activeToday: 156,   // ❌ FAKE
    topLevel: 400,      // ❌ FAKE
    resets: 28456       // ❌ FAKE
  },
  economy: {
    totalZen: "1.2B",   // ❌ FAKE
    totalCredits: 45678,// ❌ FAKE
    transactions: 892,  // ❌ FAKE
  },
  events: {
    active: 3,          // ❌ FAKE
    scheduled: 7,       // ❌ FAKE
    completed: 145,     // ❌ FAKE
    participants: 423   // ❌ FAKE
  },
  server: {
    uptime: "99.8%",    // ❌ FAKE
    tps: 19.9,          // ❌ FAKE
    memory: "68%",      // ❌ FAKE
    cpu: "42%",         // ❌ FAKE
    players: "83/500"   // ❌ FAKE
  }
};
```

**Solução:**
- Criar endpoint `/api/admin/dashboard-stats` no backend
- Retornar estatísticas REAIS do banco de dados
- Atualizar DashboardSection.tsx para usar `useEffect` + `fetch`

**Queries SQL necessárias:**
```sql
-- Contas
SELECT COUNT(*) as total FROM accounts;
SELECT COUNT(*) as online FROM accounts_status WHERE online = 1;
SELECT COUNT(*) as banned FROM accounts WHERE blocked = 1;
SELECT COUNT(*) as newToday FROM accounts WHERE DATE(created_at) = CURDATE();

-- Personagens
SELECT COUNT(*) as total FROM character_info;
SELECT COUNT(*) as activeToday FROM character_info WHERE DATE(FROM_UNIXTIME(last_use)) = CURDATE();
SELECT MAX(level) as topLevel FROM character_info;
SELECT SUM(reset) as totalResets FROM character_info;

-- Eventos
SELECT COUNT(*) as active FROM event_stage WHERE status = 'active';

-- Servidor
SELECT COUNT(*) as online FROM character_info WHERE online = 1;
```

---

### 2. **CharacterManagement.tsx** 🔴 CRÍTICO

**Localização:** `/src/app/components/admincp/sections/CharacterManagement.tsx`

**Problema:**
```javascript
const MOCK_CHARACTERS = [
  { id: 1, name: 'DarkWarrior', class: 'Dark Knight', level: 400, resets: 15, account: 'DarkLord99', online: true },
  { id: 2, name: 'FireMage', class: 'Soul Master', level: 387, resets: 12, account: 'MageSupreme', online: true },
  // ... mais personagens FAKE
];
```

**Solução:**
- ✅ Endpoint já existe: `GET /api/characters`
- Mas retorna apenas personagens da conta logada!
- Criar novo endpoint: `GET /api/admin/all-characters` (para admin)
- Adicionar paginação (LIMIT 50, OFFSET X)
- Adicionar filtros (busca por nome, conta, classe)

**Implementação Backend:**
```javascript
// Backend: /src/controllers/adminController.js
exports.getAllCharacters = async (req, res) => {
  const { page = 1, limit = 50, search = '', sortBy = 'level', sortOrder = 'DESC' } = req.query;
  
  const offset = (page - 1) * limit;
  
  let sql = `
    SELECT 
      c.guid,
      c.name,
      c.race,
      c.level,
      c.level_master,
      c.level_majestic,
      c.reset,
      c.online,
      a.account as account_username
    FROM character_info c
    INNER JOIN accounts a ON c.account_id = a.guid
  `;
  
  if (search) {
    sql += ` WHERE c.name LIKE ? OR a.account LIKE ?`;
  }
  
  sql += ` ORDER BY c.${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
  
  const params = search 
    ? [`%${search}%`, `%${search}%`, parseInt(limit), offset]
    : [parseInt(limit), offset];
  
  const result = await executeQueryMU(sql, params);
  
  return successResponse(res, result.data);
};
```

---

### 3. **CronsSection.tsx** 🟠 ALTO

**Localização:** `/src/app/components/admincp/sections/CronsSection.tsx`

**Problema:**
```javascript
const MOCK_CRONS = [
  { id: 1, name: 'Sincronizar Rankings', schedule: '*/5 * * * *', description: 'Atualiza rankings a cada 5 minutos', active: true, lastRun: '2 min atrás' },
  { id: 2, name: 'Backup Automático', schedule: '0 3 * * *', description: 'Backup diário às 3h da manhã', active: true, lastRun: '6 horas atrás' },
  // ... mais crons FAKE
];
```

**Solução:**
- ⚠️ **ATENÇÃO:** Crons são do sistema operacional (crontab) ou Node-Cron
- Não existem no banco de dados `muonline`
- Opções:
  1. Criar tabela `webengine_crons` no banco `meuweb`
  2. Ler crontab do sistema (requer permissões)
  3. Usar node-cron com armazenamento em JSON/DB

**Recomendação:**
- Criar endpoint `/api/crons` que lê de `meuweb.webengine_crons`
- Permitir ativar/desativar crons
- Registrar última execução

---

### 4. **AccountManagement.tsx** 🟠 ALTO

**Localização:** `/src/app/components/admincp/sections/AccountManagement.tsx`

**Status:** ⚠️ **VERIFICAR SE JÁ USA BACKEND**

**Endpoints Necessários:**
- ✅ `GET /api/accounts/search` (já existe)
- ✅ `GET /api/accounts/:username` (já existe)
- ✅ `PUT /api/accounts/:username/email` (já existe)
- ✅ `PUT /api/accounts/:username/password` (já existe)

**Ação:** Verificar se o componente está conectado aos endpoints.

---

## 📊 TABELA DE STATUS DE INTEGRAÇÃO

| Seção AdminCP | Status | Backend Endpoint | Mock? | Prioridade |
|---------------|--------|------------------|-------|------------|
| **Dashboard** | ❌ NÃO CONECTADO | Precisa criar `/api/admin/dashboard-stats` | ✅ SIM | 🔴 CRÍTICO |
| **Accounts** | ⚠️ VERIFICAR | ✅ `/api/accounts/*` | ❓ | 🟠 ALTO |
| **Characters** | ❌ NÃO CONECTADO | Precisa criar `/api/admin/all-characters` | ✅ SIM | 🔴 CRÍTICO |
| **Donations** | ⚠️ VERIFICAR | ❓ Precisa verificar | ❓ | 🟡 MÉDIO |
| **News** | ✅ CONECTADO | ✅ `/api/news` | ❌ NÃO | ✅ OK |
| **Settings** | ⚠️ VERIFICAR | ✅ `/api/site-editor/settings` | ❓ | 🟡 MÉDIO |
| **Plugins** | ✅ CONECTADO | ✅ `/api/plugins` | ❌ NÃO | ✅ OK |
| **Security** | ⚠️ VERIFICAR | ❓ | ❓ | 🟡 MÉDIO |
| **Logs** | ⚠️ VERIFICAR | ✅ `/api/admin-logs` | ❓ | 🟡 MÉDIO |
| **Site Editor** | ✅ CONECTADO | ✅ `/api/site-editor/settings` | ❌ NÃO | ✅ OK |
| **Crons** | ❌ NÃO CONECTADO | Precisa criar `/api/crons` | ✅ SIM | 🟠 ALTO |
| **Bans** | ⚠️ VERIFICAR | ✅ `/api/bans` | ❓ | 🟠 ALTO |
| **System** | ⚠️ VERIFICAR | ❓ | ❓ | 🟡 MÉDIO |
| **Installation Guide** | ⚠️ VERIFICAR | ❓ | ❓ | 🟢 BAIXO |
| **Donation Links** | ⚠️ VERIFICAR | ❓ | ❓ | 🟡 MÉDIO |
| **WCoin Packages** | ✅ CONECTADO | ✅ `/api/wcoin/packages` | ❌ NÃO | ✅ OK |

---

## 🛠️ PLANO DE CORREÇÃO

### Fase 1: CRÍTICO (Imediato)
1. ✅ Criar endpoint `/api/admin/dashboard-stats`
2. ✅ Atualizar `DashboardSection.tsx` para usar dados reais
3. ✅ Criar endpoint `/api/admin/all-characters`
4. ✅ Atualizar `CharacterManagement.tsx` para usar dados reais

### Fase 2: ALTO (Próximo)
1. ⚠️ Verificar e corrigir `AccountManagement.tsx`
2. ⚠️ Implementar sistema de Crons
3. ⚠️ Verificar e corrigir `BansSection.tsx`

### Fase 3: MÉDIO (Após correções críticas)
1. ⚠️ Verificar todas as seções marcadas como "VERIFICAR"
2. ⚠️ Testar integração completa
3. ⚠️ Remover todos os dados MOCK

---

## 📝 CHECKLIST DE CORREÇÃO

### Para cada seção:
- [ ] Identificar endpoint backend necessário
- [ ] Criar endpoint se não existir
- [ ] Testar endpoint com Postman/cURL
- [ ] Atualizar componente React para usar `useEffect` + `fetch`
- [ ] Adicionar loading state
- [ ] Adicionar error handling
- [ ] Adicionar refresh/reload
- [ ] Remover dados MOCK
- [ ] Testar no navegador
- [ ] Validar com conta admin real
- [ ] Documentar mudanças

---

## 🔒 SEGURANÇA

Todas as rotas de admin devem ter:
```javascript
// Middleware obrigatório
router.use(authenticate, requireAdmin);
```

Verificar:
- ✅ Token JWT válido
- ✅ `isAdmin: true` no payload
- ✅ Detecção via `character_info.authority > 0`

---

## 📊 EXEMPLO DE CORREÇÃO COMPLETA

### ANTES (DashboardSection.tsx):
```javascript
const MOCK_STATS = {
  accounts: { total: 1257 }
};

return <div>{MOCK_STATS.accounts.total}</div>;
```

### DEPOIS (DashboardSection.tsx):
```javascript
import { useState, useEffect } from 'react';

export function DashboardSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas');
        }
        
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!stats) return <div>Sem dados</div>;
  
  return <div>{stats.accounts.total}</div>;
}
```

---

## 🎯 PRÓXIMOS PASSOS

1. **IMEDIATO:** Corrigir DashboardSection
2. **IMEDIATO:** Corrigir CharacterManagement
3. **HOJE:** Auditar AccountManagement
4. **HOJE:** Implementar Crons
5. **AMANHÃ:** Auditar todas as seções restantes

---

**FIM DO RELATÓRIO**

*Última atualização: 2025-12-30 (V573)*  
*Próxima auditoria: Após correções da Fase 1*
