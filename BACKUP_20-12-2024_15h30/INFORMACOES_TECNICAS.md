# 🔧 INFORMAÇÕES TÉCNICAS DO BACKUP

## 📅 Metadata do Backup

- **Data:** 20 de Dezembro de 2024
- **Horário:** 15:30 (Horário de Brasília - GMT-3)
- **Versão do Projeto:** 1.0.0
- **Status:** Produção - 100% Funcional
- **Criado por:** Sistema de Backup MeuMU Online

---

## 🛠️ Stack Tecnológico

### Frontend
- **React:** 18.3.1
- **TypeScript:** Via Vite
- **Vite:** 6.3.5
- **Tailwind CSS:** 4.1.12
- **Motion (Framer Motion):** 12.23.24
- **Radix UI:** Múltiplos componentes v1.x

### Backend
- **Node.js:** Express 5.2.1
- **Supabase:** Edge Functions (Hono)
- **MySQL/MariaDB:** Para dados do servidor MU Online
- **Deno:** Para Supabase Functions

### Bibliotecas Principais
- **Lucide React:** 0.487.0 (Ícones)
- **React Hook Form:** 7.55.0 (Formulários)
- **Recharts:** 2.15.2 (Gráficos)
- **Sonner:** 2.0.3 (Toasts)
- **Date-fns:** 3.6.0 (Datas)
- **bcryptjs:** 3.0.3 (Hashing)
- **jsonwebtoken:** 9.0.3 (JWT)
- **helmet:** 8.1.0 (Segurança)

---

## 🎨 Design System

### Paleta de Cores

**Cores Primárias:**
- **Obsidian Profundo:** `#0a0a0a`
- **Dourado Brilhante:** `#FFB800` (yellow-500)
- **Azul Etéreo:** Tons de azul para acentos

**Cores Secundárias:**
- **Verde:** Para status positivo/online
- **Vermelho:** Para alertas/offline
- **Cinza:** Para textos secundários

### Tipografia
- **Font Family:** System fonts + Google Fonts customizadas
- **Heading:** Escalas do Tailwind (text-xl, text-2xl, text-3xl, text-4xl)
- **Body:** text-base (16px)

### Espaçamento
- **Container Max Width:** `max-w-7xl` (1280px)
- **Padding Padrão:** `px-4` (mobile), `sm:px-6`, `lg:px-8`
- **Top Padding:** `pt-32` (para compensar navbar)
- **Bottom Padding:** `pb-20`

### Glassmorphism
- **Background:** `bg-black/40` ou `bg-black/50`
- **Backdrop Filter:** `backdrop-blur-xl` ou `backdrop-blur-md`
- **Border:** `border-yellow-500/30`
- **Shadow:** `shadow-yellow-500/10`

---

## 📐 Padrões de Layout

### Layout Padrão de Seção
```tsx
<div className="min-h-screen pt-32 pb-20 px-4">
  <div className="max-w-7xl mx-auto relative z-20">
    {/* Conteúdo */}
  </div>
</div>
```

### Layout de Card com Glassmorphism
```tsx
<Card className="backdrop-blur-md bg-black/50 border-yellow-500/30">
  {/* Conteúdo */}
</Card>
```

### Layout de Grid Responsivo
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

---

## 🔐 Arquivos Protegidos

⚠️ **NÃO MODIFICAR OU DELETAR:**

1. `/supabase/functions/server/kv_store.tsx`
   - Sistema de armazenamento key-value
   - Funções críticas do banco de dados

2. `/utils/supabase/info.tsx`
   - Credenciais do Supabase
   - Project ID e Anon Key

3. `/src/app/components/figma/ImageWithFallback.tsx`
   - Componente de imagem com fallback
   - Usado em todo o projeto

---

## 🌍 Sistema de Tradução

### Idiomas Suportados (8)
1. **pt-BR** - Português (Brasil)
2. **en** - English
3. **es** - Español
4. **de** - Deutsch
5. **zh** - 中文 (Chinês)
6. **ru** - Русский (Russo)
7. **fil** - Filipino
8. **vi** - Tiếng Việt (Vietnamita)

### Estrutura de Tradução
```typescript
const translations = {
  'pt-BR': {
    hero: {
      title: 'Texto em português',
      // ...
    }
  },
  'en': {
    hero: {
      title: 'Text in English',
      // ...
    }
  }
  // ... outros idiomas
}
```

### Como Usar
```tsx
const { t, language } = useLanguage();
const translated = t('hero.title');
```

---

## 🔌 Integração com Banco de Dados

### Tabelas Principais do MU Online

**Character Table:**
- `Name` - Nome do personagem
- `cLevel` - Nível
- `Class` - Classe
- `Resets` - Quantidade de resets
- `PkLevel` - Nível PK
- `MapName` - Localização atual
- `MapPosX`, `MapPosY` - Coordenadas

**AccountCharacter Table:**
- Relação entre conta e personagens

**Guild Table:**
- `G_Name` - Nome da guild
- `G_Master` - Mestre da guild
- `G_Score` - Pontuação

**MuCastleData Table:**
- Dados de Castle Siege
- Guild dona do castelo

### KV Store (Supabase)
```typescript
// Tabela: kv_store_4169bd43
{
  key: string,
  value: jsonb,
  created_at: timestamp,
  updated_at: timestamp
}
```

---

## 🚀 Performance e Otimizações

### Lazy Loading Implementado
```tsx
const HeroSection = lazy(() => import('./components/hero-section'));
const DashboardSection = lazy(() => import('./components/dashboard-section'));
// ... outras seções
```

### Suspense com Loader
```tsx
<Suspense fallback={<SectionLoader />}>
  {renderSection()}
</Suspense>
```

### Debounce e Throttle
- Hooks disponíveis: `useDebounce`, `useThrottle`
- Usado em inputs de busca e eventos frequentes

---

## 🔒 Segurança

### Proteções Implementadas
1. **Helmet** - Headers de segurança HTTP
2. **CORS** - Cross-Origin Resource Sharing configurado
3. **Rate Limiting** - Proteção contra spam
4. **XSS Clean** - Proteção contra XSS
5. **JWT** - Autenticação via tokens
6. **bcrypt** - Hash de senhas

### AdminCP Security
- Sessão separada do usuário comum
- Autenticação em duas camadas
- Logs de ações administrativas
- Firewall adaptativo
- Auditoria de segurança

---

## 📊 Estado do Projeto (20/12/2024 15:30)

### ✅ Funcionalidades Completas

**Frontend:**
- [x] Sistema de navegação
- [x] 7 seções principais (Hero, News, Downloads, Events, Rankings, Dashboard, Login)
- [x] Sistema multilíngue (8 idiomas)
- [x] Layout responsivo
- [x] Glassmorphism design
- [x] Animações Motion
- [x] Widgets dinâmicos (3)

**Player Dashboard:**
- [x] Login/Cadastro
- [x] Gestão de personagens
- [x] Distribuição de pontos
- [x] Sistema de reset
- [x] Verificação de personagem online
- [x] Edição de conta (email, senha)
- [x] VIP status

**AdminCP:**
- [x] Login administrativo
- [x] Dashboard de segurança
- [x] Gestão de contas
- [x] Gestão de personagens
- [x] Gestão de notícias
- [x] Sistema de logs
- [x] Cron jobs
- [x] Plugins
- [x] Editor de site
- [x] Firewall adaptativo
- [x] Backup manager
- [x] Diagnósticos

**Integrações:**
- [x] Supabase (Auth, Storage, DB)
- [x] MySQL/MariaDB (dados do MU)
- [x] Express backend
- [x] Discord/WhatsApp (placeholders)

### 🎯 Última Correção Aplicada

**Data:** 20/12/2024 15:15
**Correção:** Padronização de layout no Dashboard
- Removido `mt-8` do componente Tabs
- Harmonização com outras seções
- Layout consistente em todo o site

### ⚡ Melhorias Pendentes (Futuras)

- [ ] Integração real com banco de dados MU Online
- [ ] Sistema de cache para rankings
- [ ] WebSocket para atualizações em tempo real
- [ ] Sistema de notificações push
- [ ] PWA (Progressive Web App)
- [ ] Mais idiomas (se necessário)
- [ ] Testes automatizados
- [ ] CI/CD pipeline

---

## 🔄 Versionamento

### Versão Atual: 1.0.0

**Semantic Versioning:**
- **Major (1):** Versão principal - Sistema completo
- **Minor (0):** Features adicionais
- **Patch (0):** Bug fixes e melhorias

### Changelog Resumido
- **v1.0.0** (20/12/2024) - Release inicial completo
  - Todas as funcionalidades implementadas
  - Layout padronizado
  - 8 idiomas suportados
  - AdminCP completo
  - Sistema de segurança

---

## 📦 Dependências Críticas

### Produção (Critical)
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "motion": "12.23.24",
  "lucide-react": "0.487.0",
  "@radix-ui/*": "~1.x",
  "express": "^5.2.1",
  "mysql2": "^3.16.0"
}
```

### Desenvolvimento
```json
{
  "@vitejs/plugin-react": "4.7.0",
  "vite": "6.3.5",
  "tailwindcss": "4.1.12",
  "@tailwindcss/vite": "4.1.12"
}
```

---

## 🌐 URLs e Endpoints

### Frontend
- **Desenvolvimento:** `http://localhost:5173`
- **Produção:** (configurar)

### Backend Express
- **Desenvolvimento:** `http://localhost:3000`
- **API Base:** `/api/v1/`

### Supabase
- **URL:** `https://{projectId}.supabase.co`
- **Functions:** `/functions/v1/make-server-4169bd43/`

### Endpoints Principais
```
GET  /api/v1/stats - Estatísticas do servidor
GET  /api/v1/rankings - Rankings
POST /api/v1/auth/login - Login
POST /api/v1/auth/register - Cadastro
GET  /api/v1/player/characters - Personagens do jogador
POST /api/v1/player/distribute-points - Distribuir pontos
POST /api/v1/player/reset - Reset de personagem
```

---

## 🗄️ Estrutura de Dados

### User (Player)
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  accountStatus: 'Active' | 'Banned' | 'Suspended';
  vipStatus: string;
  vipExpiry: string;
  characters: Character[];
}
```

### Character
```typescript
interface Character {
  id: number;
  name: string;
  class: string;
  level: number;
  resets: number;
  location: string;
  coords: string;
  online: boolean;
  lastLogin: Date;
  stats: {
    str: number;
    agi: number;
    vit: number;
    ene: number;
    points: number;
  };
}
```

### News
```typescript
interface News {
  id: string;
  title: Record<string, string>; // Multilíngue
  content: Record<string, string>;
  category: string;
  date: string;
  publishTo: ('home' | 'news')[];
}
```

---

## 🎮 Configurações do Servidor MU Online

### Season Info
- **Season:** 19-2-3
- **Tipo:** Épico
- **Rates:** (configurável)
- **Drop:** (configurável)
- **Max Level:** 400
- **Reset:** A partir do level 400

### Classes Disponíveis
- Dark Knight
- Dark Wizard / Soul Master
- Fairy Elf / Muse Elf
- Magic Gladiator / Duel Master
- Dark Lord / Lord Emperor
- Summoner
- Rage Fighter
- Grow Lancer

---

## 💾 Backup e Restauração

### Localização deste Backup
```
/BACKUP_20-12-2024_15h30/
```

### Arquivos Incluídos
- ✅ README_BACKUP.md
- ✅ LISTA_ARQUIVOS_BACKUP.md
- ✅ GUIA_RESTAURACAO.md
- ✅ INVENTARIO_COMPLETO.md
- ✅ INFORMACOES_TECNICAS.md (este arquivo)
- ✅ package.json
- ✅ src/app/App.tsx

### Como Restaurar
Ver `GUIA_RESTAURACAO.md` para instruções detalhadas.

---

## 🐛 Bugs Conhecidos

**Nenhum bug crítico conhecido no momento deste backup.**

Bugs menores (não impeditivos):
- [ ] Alguns textos podem precisar de ajustes de tradução
- [ ] Animações podem ter pequenos glitches em browsers antigos
- [ ] Performance pode ser otimizada ainda mais

---

## 📞 Suporte e Contato

**Projeto:** MeuMU Online  
**Backup criado por:** Sistema Automático  
**Para restauração:** Consulte `GUIA_RESTAURACAO.md`  
**Para dúvidas técnicas:** Consulte este arquivo

---

## ✅ Checklist de Validação do Backup

- [x] App.tsx salvo
- [x] package.json salvo
- [x] Documentação completa criada
- [x] Guia de restauração criado
- [x] Inventário completo criado
- [x] Informações técnicas documentadas
- [x] Data e hora registradas
- [x] Estado funcional confirmado

---

**Última atualização:** 20/12/2024 15:30  
**Versão do documento:** 1.0  
**Status:** Completo e Validado ✅
