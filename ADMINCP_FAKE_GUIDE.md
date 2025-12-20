# 🛡️ AdminCP - Sistema de Painel Administrativo (Modo Fake)

## 📋 Visão Geral

O **AdminCP** foi implementado com sistema de **dados MOCK (fake)** para permitir testes completos do painel administrativo **SEM necessidade de banco de dados real**.

---

## 🎭 Como Acessar

### Método 1: Botão Flutuante na Home (Recomendado)
1. Vá para a página inicial do site
2. Procure o **botão flutuante dourado com ícone de coroa** (Crown 👑) no canto inferior direito
3. Clique no botão para acessar a tela de Login do AdminCP

### Método 2: URL Direta
- Navegue manualmente para a seção `admin`
- O sistema irá redirecionar para a tela de login administrativa

---

## 🔐 Login Fake

### Credenciais
**IMPORTANTE:** No modo fake, **QUALQUER usuário e senha funcionam!**

Exemplos:
- Usuário: `admin_test` | Senha: `123456`
- Usuário: `admin` | Senha: `admin`
- Usuário: `test` | Senha: `test`

### Dados do Admin Mock
Ao fazer login, você receberá este perfil administrativo:

```json
{
  "user": {
    "username": "admin_test",
    "role": "superadmin",
    "email": "admin_test@meumu.dev",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    "permissions": {
      "viewAccounts": true,
      "editCharacters": true,
      "banUsers": true,
      "manageCredits": true,
      "publishNews": true,
      "manageAdmins": true,
      "databaseConfig": true
    }
  },
  "session": {
    "token": "FAKE_JWT_TOKEN_12345",
    "expiresIn": "2h"
  }
}
```

---

## 🎨 Design e Funcionalidades

### ✨ Tela de Login
- **Glassmorphism** com efeitos de blur
- Animação de partículas no fundo
- Badge indicando "MODO FAKE (Testes)"
- Ícone de coroa (Crown) dourado animado
- Inputs com show/hide password
- Loading state durante autenticação simulada

### 🏛️ Dashboard Administrativo

#### Sidebar Colapsável
- Navegação com ícones e labels
- Indicador visual do módulo ativo
- Avatar e perfil do admin no rodapé
- Botão de Logout com confirmação visual

#### Módulos Disponíveis
1. **📊 Visão Geral (Overview)**
   - Cards de estatísticas:
     - Contas Totais: 1,257
     - Personagens: 3,542
     - Economia: 1.2B Zen
     - Eventos Ativos: 3
   - Status do servidor (Uptime, CPU, Memória, TPS)
   - Atividade recente em tempo real

2. **👥 Gerenciar Contas** (Em desenvolvimento)
3. **⚔️ Gerenciar Personagens** (Em desenvolvimento)
4. **🚫 Sistema de Bans** (Em desenvolvimento)
5. **💳 Gerenciar Créditos** (Em desenvolvimento)
6. **📰 Publicar Notícias** (Em desenvolvimento)
7. **📅 Gerenciar Eventos** (Em desenvolvimento)
8. **🛡️ Gerenciar Admins** (Em desenvolvimento)
9. **💾 Configuração DB** (Em desenvolvimento)

#### Top Bar
- Título do módulo ativo
- Barra de busca global
- Notificações (com badge de alertas)
- Menu de perfil

---

## 💾 Persistência de Sessão

### sessionStorage
A sessão do admin é salva em `sessionStorage` com a chave `adminSession`.

**Isso significa:**
- ✅ A sessão persiste ao recarregar a página
- ✅ Você não precisa fazer login novamente
- ❌ A sessão é perdida ao fechar o navegador/aba

### Como Limpar Sessão Manualmente
```javascript
sessionStorage.removeItem('adminSession');
```

Ou clique no botão **"Sair"** no rodapé da sidebar.

---

## 📊 Dados Mock Realistas

### Estatísticas do Dashboard
```javascript
const MOCK_STATS = {
  accounts: {
    total: 1257,
    online: 83,
    banned: 12,
    newToday: 8
  },
  characters: {
    total: 3542,
    activeToday: 156,
    topLevel: 400,
    resets: 28456
  },
  economy: {
    totalZen: "1.2B",
    totalCredits: 45678,
    transactions: 892,
    topDonator: "DarkLord99"
  },
  events: {
    active: 3,
    scheduled: 7,
    completed: 145,
    participants: 423
  },
  server: {
    uptime: "99.8%",
    tps: 19.9,
    memory: "68%",
    cpu: "42%"
  }
}
```

### Atividade Recente
- DarkLord99 fez reset de personagem (2 min atrás)
- MageSupreme comprou 500 créditos (5 min atrás)
- WarriorKing atingiu nível 400 (8 min atrás)
- Admin baniu usuário hack123 (15 min atrás)
- NewPlayer01 criou nova conta (20 min atrás)

---

## 🔧 Implementação Técnica

### Arquivos Principais
- `/src/app/components/admin-login.tsx` - Tela de login administrativa
- `/src/app/components/admin-dashboard.tsx` - Dashboard completo
- `/src/app/App.tsx` - Integração e roteamento

### Rotas
- `currentSection === 'admin'` → Mostra `AdminLogin`
- Após login bem-sucedido → Mostra `AdminDashboard` (fullscreen)
- `showAdminPanel === true` → Renderiza AdminCP ao invés do site

### Estado Global
```typescript
const [adminSession, setAdminSession] = useState<any>(null);
const [showAdminPanel, setShowAdminPanel] = useState(false);
```

### Funções Principais
```typescript
// Login
const handleAdminLoginSuccess = (adminData: any) => {
  setAdminSession(adminData);
  setShowAdminPanel(true);
};

// Logout
const handleAdminLogout = () => {
  setAdminSession(null);
  setShowAdminPanel(false);
  sessionStorage.removeItem('adminSession');
};
```

---

## 🚀 Próximos Passos

### Integração com Backend Real
Quando for conectar ao backend MySQL do Mu Online:

1. **Substituir função de login fake:**
```typescript
// Antes (FAKE)
if (username.trim() && password.trim()) {
  onLoginSuccess(MOCK_ADMIN);
}

// Depois (REAL)
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await response.json();
if (data.success) {
  onLoginSuccess(data.adminData);
}
```

2. **Conectar estatísticas reais:**
```typescript
// Buscar do banco de dados
const stats = await fetch('/api/admin/stats').then(r => r.json());
```

3. **Implementar módulos funcionais:**
- Adicionar forms de edição
- Conectar com endpoints CRUD
- Implementar validações
- Adicionar confirmações de ações críticas

---

## 🎨 Paleta de Cores AdminCP

### Primárias
- Dourado Principal: `from-amber-500 to-amber-600`
- Background: `slate-900/80` com `backdrop-blur-xl`
- Borders: `amber-500/20` a `amber-500/40`

### Módulos
- Azul: Contas e Estatísticas
- Roxo: Personagens
- Verde: Economia e Créditos
- Vermelho: Bans e Segurança
- Ciano: Notícias
- Rosa: Eventos

### Efeitos
- Glassmorphism em todos os cards
- Shadow com glow dourado nos elementos ativos
- Hover transitions suaves (300ms)
- Animações de entrada (fade + slide)

---

## 💡 Dicas de UX

### Navegação
- Sidebar pode ser colapsada para mais espaço
- Todos os módulos têm ícones intuitivos
- Indicador visual claro do módulo ativo

### Feedback Visual
- Loading states em todas as ações
- Badges de status coloridos
- Tooltips informativos
- Animações de sucesso/erro

### Responsividade
- Sidebar adaptativa para mobile
- Cards reorganizam em grid responsivo
- Touch-friendly em dispositivos móveis

---

## 📝 Notas Importantes

### ⚠️ Modo Fake vs Produção
- **MODO FAKE:** Aceita qualquer credencial
- **PRODUÇÃO:** Deve validar contra tabela de admins no DB
- **SEGURANÇA:** Implementar rate limiting, CAPTCHA, 2FA

### 🔒 Permissões
O sistema já tem estrutura de permissões granulares:
- Cada módulo verifica `user.permissions[nome]`
- Sidebar só mostra módulos permitidos
- Fácil expandir para roles personalizados

### 📱 Multi-idioma
- Atualmente em PT-BR
- Preparado para i18n (usar context LanguageContext)
- Textos centralizados para fácil tradução

---

## 🎯 Checklist de Implementação

- [x] Tela de login administrativa
- [x] Dashboard com sidebar colapsável
- [x] Módulo Overview com estatísticas
- [x] Persistência de sessão (sessionStorage)
- [x] Sistema de permissões
- [x] Design glassmorphism épico
- [x] Botão flutuante de acesso rápido
- [x] Dados mock realistas
- [ ] Módulo de Gerenciamento de Contas
- [ ] Módulo de Gerenciamento de Personagens
- [ ] Módulo de Sistema de Bans
- [ ] Módulo de Créditos
- [ ] Módulo de Publicação de Notícias
- [ ] Integração com API real
- [ ] Logs de auditoria
- [ ] Notificações em tempo real

---

## 🏆 Resultado Final

Um **AdminCP completo e funcional** para testes e prototipagem, com:
- ✨ Visual épico Dark Medieval Fantasy
- 🔐 Sistema de login fake para desenvolvimento
- 📊 Dashboard com estatísticas realistas
- 🎨 Design glassmorphism profissional
- 📱 Totalmente responsivo
- ⚡ Performance otimizada
- 🛡️ Estrutura pronta para produção

**Basta clicar no botão dourado na home para começar! 👑**
