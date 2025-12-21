# 🔄 PLANO DE CONVERSÃO: MOCK → FETCH REAL

## Data: 20/12/2024 - 17h00

---

## ✅ ETAPAS CONCLUÍDAS

### 1. ✅ Criado Serviço de API Centralizado
**Arquivo**: `/src/services/api.ts`

- ✅ Funções fetch genéricas
- ✅ Interface TypeScript para todas as entidades
- ✅ APIs organizadas por categoria:
  - `userAPI` - Usuários e autenticação
  - `characterAPI` - Personagens e ações
  - `rankingsAPI` - Rankings (Resets, PK, Guilds, Events)
  - `eventsAPI` - Eventos do servidor
  - `newsAPI` - Notícias
  - `serverAPI` - Informações do servidor
  - `adminAPI` - Painel administrativo

**Base URL**:
```typescript
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43`;
```

---

### 2. ✅ Criado Rotas do Servidor (Backend)
**Arquivo**: `/supabase/functions/server/routes.tsx`

**Rotas Implementadas**:

#### 👤 Usuários:
- `GET /user/me` - Dados do usuário logado
- `GET /user/characters` - Listar personagens
- `POST /user/update-email` - Atualizar email
- `POST /user/update-password` - Atualizar senha

#### 🎮 Personagens:
- `POST /character/distribute-points` - Distribuir pontos
- `POST /character/reset` - Reset de personagem

#### 🏆 Rankings:
- `GET /rankings/resets?limit=10` - Top resets
- `GET /rankings/pk?limit=10` - Top PK
- `GET /rankings/guilds?limit=10` - Top guilds

#### 📊 Servidor:
- `GET /server/info` - Informações do servidor

#### 📰 Notícias:
- `GET /news` - Listar notícias

#### 🛡️ Admin:
- `POST /admin/login` - Login admin
- `GET /admin/stats` - Estatísticas do dashboard

**Todas as rotas conectam direto no MySQL/MariaDB usando `mysql2@3.6.5/promise`**

---

### 3. ✅ Integrado Rotas no Servidor Principal
**Arquivo**: `/supabase/functions/server/index.tsx`

```typescript
import { apiRoutes } from "./routes.tsx";

// Mount all API routes
app.route("/make-server-4169bd43", apiRoutes);
```

---

### 4. ✅ Removido Dependência figma:asset
**Arquivo**: `/src/app/components/dashboard-section.tsx`

**ANTES** ❌:
```typescript
import characterExample from 'figma:asset/0481c7d9f941d688b911f1c81a92c821fe1a50e8.png';
```

**DEPOIS** ✅:
```typescript
const characterPlaceholder = 'https://via.placeholder.com/400x600/1a1a1a/FFB800?text=Character';
```

---

## 🚧 PRÓXIMAS ETAPAS (A FAZER)

### 5. ⏳ Atualizar Componentes para Usar Fetch Real

#### 📝 Lista de Componentes com Mocks:

| Componente | Localização | Status | Mock a Remover |
|-----------|-------------|--------|----------------|
| `dashboard-section.tsx` | `/src/app/components/` | 🔄 Em andamento | `mockUser`, `mockCharacters` |
| `rankings-section.tsx` | `/src/app/components/` | ⏳ Pendente | `topResets`, `topPK`, `topGuilds`, `topEvents` |
| `admin-login.tsx` | `/src/app/components/` | ⏳ Pendente | `MOCK_ADMIN` |
| `admin-dashboard.tsx` | `/src/app/components/` | ⏳ Pendente | Dados mock do dashboard |
| `DashboardSection.tsx` | `/src/app/components/admincp/sections/` | ⏳ Pendente | `MOCK_STATS` |
| `plugin-manager.tsx` | `/src/app/components/admincp/` | ⏳ Pendente | `MOCK_PLUGINS` |
| `cron-manager.tsx` | `/src/app/components/admincp/` | ⏳ Pendente | `MOCK_CRONS` |

---

### 6. ⏳ Atualizar Context API para Fetch Real

#### Contextos a Atualizar:

**A. AuthContext** (`/src/contexts/AuthContext.tsx`):
```typescript
// Substituir mock login por:
const login = async (username: string, password: string) => {
  const response = await api.user.login(username, password);
  // Armazenar token JWT
  localStorage.setItem('token', response.token);
  setUser(response.user);
};
```

**B. PlayerContext** (`/src/contexts/PlayerContext.tsx`):
```typescript
// Carregar personagens reais:
const loadCharacters = async () => {
  const token = localStorage.getItem('token');
  const characters = await api.character.getUserCharacters(token);
  setCharacters(characters);
};
```

**C. NewsContext** (`/src/contexts/NewsContext.tsx`):
```typescript
// Carregar notícias reais:
const loadNews = async () => {
  const news = await api.news.getAllNews();
  setNews(news);
};
```

---

### 7. ⏳ Implementar Autenticação JWT

**Criar Helper de Auth**:
```typescript
// /src/utils/auth.ts
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
```

**Atualizar API Service para usar token**:
```typescript
// Todas as chamadas protegidas usam:
const token = getAuthToken();
if (!token) throw new Error('Not authenticated');
```

---

### 8. ⏳ Criar Tabela de News no Banco (Se não existir)

```sql
CREATE TABLE IF NOT EXISTS News (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  imageUrl VARCHAR(500),
  publishTo VARCHAR(100),
  INDEX idx_date (date DESC)
);
```

---

### 9. ⏳ Validações e Segurança

**A. Hash de Senhas**:
```typescript
// No servidor, usar bcrypt para hash
import * as bcrypt from "npm:bcrypt";

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

**B. Validação de Inputs**:
```typescript
// Validar todos os inputs antes de queries SQL
function sanitizeInput(input: string): string {
  return input.trim().replace(/[^\w\s@.-]/g, '');
}
```

**C. Rate Limiting**:
```typescript
// Adicionar rate limit para prevenir spam
import { rateLimiter } from "npm:hono/rate-limit";

app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests
}));
```

---

## 📋 CHECKLIST DE CONVERSÃO

### Por Componente:

#### ✅ dashboard-section.tsx
- [x] Remover figma:asset
- [ ] Substituir `mockUser` por `api.user.getCurrentUser()`
- [ ] Substituir `mockCharacters` por `api.user.getUserCharacters()`
- [ ] Implementar distribuição de pontos real
- [ ] Implementar reset real
- [ ] Testar online/offline detection

#### ⏳ rankings-section.tsx
- [ ] Substituir `topResets` por `api.rankings.getTopResets()`
- [ ] Substituir `topPK` por `api.rankings.getTopPK()`
- [ ] Substituir `topGuilds` por `api.rankings.getTopGuilds()`
- [ ] Substituir `topEvents` por `api.rankings.getTopEvents()`
- [ ] Adicionar loading states
- [ ] Adicionar error handling

#### ⏳ admin-login.tsx
- [ ] Substituir `MOCK_ADMIN` por `api.admin.login()`
- [ ] Implementar JWT token storage
- [ ] Validar permissões de admin
- [ ] Adicionar 2FA (opcional)

#### ⏳ admin-dashboard.tsx (DashboardSection)
- [ ] Substituir `MOCK_STATS` por `api.admin.getDashboardStats()`
- [ ] Implementar atualização em tempo real
- [ ] Adicionar WebSocket para métricas live (opcional)

---

## 🔧 ESTRUTURA DE DADOS ESPERADA

### MySQL/MariaDB Tables:

#### MEMB_INFO (Contas)
```sql
- memb___id (VARCHAR) - ID da conta
- memb_name (VARCHAR) - Nome de usuário
- memb__pwd (VARCHAR) - Senha (hash)
- mail_addr (VARCHAR) - Email
- bloc_code (INT) - Status da conta (0=Active, 1=Banned)
- vip_level (INT) - Nível VIP
- cash_point (INT) - Créditos
- appl_days (DATETIME) - Data de criação
```

#### Character (Personagens)
```sql
- Name (VARCHAR) - Nome do personagem
- AccountID (VARCHAR) - ID da conta (FK)
- Class (TINYINT) - Classe
- cLevel (INT) - Nível
- Resets (INT) - Número de resets
- Strength (INT) - Força
- Dexterity (INT) - Agilidade
- Vitality (INT) - Vitalidade
- Energy (INT) - Energia
- LevelUpPoint (INT) - Pontos disponíveis
- MapNumber (INT) - Mapa atual
- G_Name (VARCHAR) - Nome da guild
- PkLevel (INT) - Nível PK
- PkCount (INT) - Total de kills
- ConnectStat (INT) - Status online (1=Online, 0=Offline)
```

#### MEMB_STAT (Status de Conexão)
```sql
- memb___id (VARCHAR) - ID da conta
- ConnectStat (INT) - Status (1=Online, 0=Offline)
- ServerName (VARCHAR) - Nome do servidor
- IP (VARCHAR) - IP da conexão
- ConnectTM (DATETIME) - Timestamp de conexão
```

#### Guild (Guilds)
```sql
- G_Name (VARCHAR) - Nome da guild
- G_Master (VARCHAR) - Nome do mestre
- G_Count (INT) - Número de membros
- G_Score (INT) - Pontuação da guild
```

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### Fase 1: Base (CONCLUÍDA ✅)
1. ✅ Criar `/src/services/api.ts`
2. ✅ Criar `/supabase/functions/server/routes.tsx`
3. ✅ Integrar rotas no servidor
4. ✅ Remover `figma:asset`

### Fase 2: Autenticação (PRÓXIMO)
1. ⏳ Implementar JWT no backend
2. ⏳ Criar helper de auth no frontend
3. ⏳ Atualizar AuthContext para usar API real
4. ⏳ Testar login/logout

### Fase 3: Dados do Usuário
1. ⏳ Atualizar dashboard-section para carregar dados reais
2. ⏳ Implementar distribuição de pontos
3. ⏳ Implementar sistema de reset
4. ⏳ Testar todas as funções

### Fase 4: Rankings
1. ⏳ Atualizar rankings-section para API real
2. ⏳ Implementar paginação
3. ⏳ Adicionar filtros e ordenação

### Fase 5: Admin
1. ⏳ Atualizar admin-login
2. ⏳ Atualizar admin-dashboard
3. ⏳ Implementar todas as funções admin

### Fase 6: Polimento
1. ⏳ Adicionar loading states em todos os componentes
2. ⏳ Adicionar error handling
3. ⏳ Implementar retry logic
4. ⏳ Otimizar performance

---

## 📝 CÓDIGO DE EXEMPLO

### Como Atualizar um Componente:

**ANTES (Mock)** ❌:
```typescript
const mockUser = {
  username: 'SaulNoob',
  email: 'saul@muserver.com',
  // ...
};

// Renderizar mockUser
<h2>Bem-vindo, {mockUser.username}</h2>
```

**DEPOIS (API Real)** ✅:
```typescript
import api from '../../services/api';
import { useState, useEffect } from 'react';

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadUser();
}, []);

const loadUser = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    const userData = await api.user.getCurrentUser(token);
    setUser(userData);
  } catch (err) {
    setError(err.message);
    console.error('Erro ao carregar usuário:', err);
  } finally {
    setLoading(false);
  }
};

// Renderizar com loading/error states
{loading && <p>Carregando...</p>}
{error && <p>Erro: {error}</p>}
{user && <h2>Bem-vindo, {user.username}</h2>}
```

---

## ✅ RESULTADO FINAL ESPERADO

Após completar todas as etapas:

1. ✅ **Zero Mocks** - Todos os dados vêm do banco MySQL/MariaDB
2. ✅ **Autenticação Real** - JWT tokens, sessões seguras
3. ✅ **Validações** - Inputs sanitizados, queries seguras
4. ✅ **Performance** - Loading states, caching, otimizações
5. ✅ **Pronto para Produção** - Site exportável e instalável

---

## 🎯 PRÓXIMO PASSO IMEDIATO

**Atualizar `rankings-section.tsx` para usar API real!**

Quer que eu faça isso agora? 🚀
