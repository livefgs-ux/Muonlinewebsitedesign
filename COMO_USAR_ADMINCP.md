# 🚀 Como Usar o AdminCP - Guia Rápido

## 🎯 Acesso Rápido ao AdminCP

### Método 1: Via Navegação do Site

1. Abra o site MeuMU Online
2. Na navegação superior, clique em **"Admin"**
3. Você será redirecionado para a tela de login do AdminCP

### Método 2: Via URL Direta (quando implementado routing)

```
http://localhost:5173/admin
```

### Método 3: Via Componente Standalone

```tsx
import { AdminPageWrapper } from './components/admin-page-wrapper';

// Renderize diretamente
<AdminPageWrapper />
```

## 🔐 Login no AdminCP

### Credenciais (Modo Fake)

No modo de testes/desenvolvimento, **qualquer credencial funciona**:

```
Usuário: admin_test (ou qualquer texto)
Senha: 123456 (ou qualquer texto)
```

### O que acontece ao logar?

1. ✅ Dados do admin são salvos em `sessionStorage`
2. ✅ Dashboard administrativo é carregado
3. ✅ Sidebar com 10 módulos aparece
4. ✅ Você está autenticado como **SuperAdmin**

## 🎨 Interface do AdminCP

### Layout Principal

```
┌─────────────────────────────────────────────────┐
│  [Sidebar]  │  [Top Bar - Busca/Notif/Profile] │
│             │                                    │
│  Dashboard  │  [Área de Conteúdo Principal]    │
│  Contas     │                                    │
│  Personag.  │  • Cards de estatísticas         │
│  Notícias   │  • Tabelas de dados              │
│  Config.    │  • Formulários                    │
│  Plugins    │  • Gráficos                       │
│  Logs       │                                    │
│  Editor     │                                    │
│  Crons      │                                    │
│  Bans       │                                    │
│             │                                    │
│  [User]     │                                    │
│  [Logout]   │                                    │
└─────────────────────────────────────────────────┘
```

## 🗂️ Módulos Disponíveis

### 1. 📊 Dashboard

**O que ver:**
- Total de contas registradas (1.257)
- Jogadores online (83)
- Status do servidor (CPU, Memória, Uptime)
- Atividade recente dos jogadores

**Ações disponíveis:**
- Visualizar métricas em tempo real
- Monitorar performance
- Ver últimas ações dos usuários

### 2. 👥 Contas

**O que ver:**
- Lista completa de contas
- Status (Online/Offline/Banido)
- Créditos de cada conta
- Último login

**Ações disponíveis:**
- ➕ Criar nova conta
- ✏️ Editar conta existente
- 🚫 Banir usuário
- 🔍 Buscar por nome/email

### 3. ⚔️ Personagens

**O que ver:**
- Lista de todos os personagens
- Classe e nível
- Número de resets
- Status online/offline

**Ações disponíveis:**
- ✏️ Editar personagem
- 🔍 Buscar por nome
- Ver estatísticas gerais

### 4. 📰 Notícias

**O que fazer:**
- ✍️ Criar nova notícia
- 📝 Editar notícias existentes
- 🗑️ Deletar notícias
- 👁️ Visualizar preview
- 💾 Salvar como rascunho

**Campos do formulário:**
- Título da notícia
- Conteúdo (texto longo)
- Status (Publicado/Rascunho)

### 5. ⚙️ Configurações

**Abas disponíveis:**

**Geral:**
- Nome do site
- Link do Discord
- Link do WhatsApp

**Banco de Dados:**
- Host do MySQL
- Porta
- Nome do banco

**Segurança:**
- Two-Factor Authentication (2FA)
- Logs de auditoria
- IP Whitelist

**Notificações:**
- Novos registros
- Transações de créditos

### 6. 🔌 Plugins

**O que fazer:**
- Ver plugins instalados
- ✅ Ativar/desativar plugins
- ⚙️ Configurar plugins
- 🗑️ Desinstalar plugins
- ➕ Instalar novos plugins

**Plugins de exemplo (mock):**
- Event Ranking v1.2.0
- Auto Backup v2.0.1
- Discord Bot v1.5.3
- Analytics v3.1.0

### 7. 📜 Logs

**O que ver:**
- Histórico completo de ações
- Timestamp preciso
- Usuário/sistema responsável
- Tipo de ação (Info/Success/Warning/Error)

**Ações disponíveis:**
- 🔍 Filtrar logs por tipo
- 📥 Exportar logs
- Ver detalhes de cada ação

### 8. 🎨 Editor de Site

**Seções editáveis:**

**Home:**
- Título principal
- Subtítulo
- URL da imagem de fundo

**Downloads:**
- Link do cliente completo
- Link do patch

**Footer:**
- Texto de copyright

**Tema:**
- Cor primária (#FFB800)
- Cor secundária (#10B981)
- Cor de fundo (#0A0A0A)

### 9. ⏰ Crons (Tarefas Automatizadas)

**O que fazer:**
- Ver cron jobs ativos
- ✅ Ativar/pausar crons
- ▶️ Executar manualmente
- ➕ Adicionar novo cron
- 🗑️ Remover cron

**Exemplos de crons:**
```
Sincronizar Rankings - */5 * * * * (a cada 5 minutos)
Backup Automático    - 0 3 * * *   (diariamente às 3h)
Limpeza de Logs      - 0 0 * * 0   (semanalmente)
```

### 10. 🚫 Bans

**O que fazer:**
- Ver usuários banidos
- 🔍 Buscar banimentos
- ➕ Banir novo usuário
- 🔓 Desbanir usuário

**Informações exibidas:**
- Usuário banido
- Motivo do ban
- Admin responsável
- Data do banimento
- Tipo (Permanente/Temporário)
- Data de expiração

## 🎮 Como Navegar

### Sidebar (Menu Lateral)

**Expandir/Retrair:**
- Clique no ícone **☰** (hambúrguer) ou **✕** no topo da sidebar

**Trocar de seção:**
- Clique em qualquer item do menu
- A seção ativa terá:
  - ✅ Background colorido
  - ✅ Barra lateral colorida
  - ✅ Ícone destacado

### Top Bar

**Busca Global:**
- Campo de busca no topo à direita
- Digite para buscar em todas as seções

**Notificações:**
- Ícone de sino 🔔
- Badge vermelho indica novas notificações

**Perfil:**
- Ícone de usuário
- Clique para ver opções de perfil

## 💾 Dados Mock (Fake)

Todos os dados são **simulados** para testes:

### Estatísticas Gerais
- 1.257 contas registradas
- 83 jogadores online
- 3.542 personagens
- 1.2B zen na economia
- 45.678 créditos vendidos

### Contas de Exemplo
1. **DarkLord99** - Online, 1.250 créditos
2. **MageSupreme** - Online, 890 créditos
3. **WarriorKing** - Offline, 450 créditos
4. **NinjaStrike** - Banido, 0 créditos
5. **HealerPro** - Online, 2.100 créditos

### Personagens de Exemplo
1. **DarkWarrior** - Dark Knight, Lvl 400, 15 resets
2. **FireMage** - Soul Master, Lvl 387, 12 resets
3. **FastElf** - Muse Elf, Lvl 395, 14 resets
4. **MagicGladiator** - Duel Master, Lvl 370, 10 resets
5. **ShadowNinja** - Bloody Summoner, Lvl 361, 8 resets

## 🔄 Ações Comuns

### Criar Nova Conta
1. Vá para **Contas**
2. Clique em **"Nova Conta"**
3. Preencha formulário (futuro)
4. Clique em **"Salvar"**

### Publicar Notícia
1. Vá para **Notícias**
2. Digite título e conteúdo
3. Clique em **"Publicar"**
   - Ou **"Salvar como Rascunho"**

### Ativar/Desativar Plugin
1. Vá para **Plugins**
2. Localize o plugin desejado
3. Clique no **Switch** ao lado do nome
4. Plugin será ativado/desativado

### Ver Logs do Sistema
1. Vá para **Logs**
2. Veja histórico completo
3. Use **"Filtrar"** para tipos específicos
4. Clique em **"Exportar"** para baixar

### Configurar Tema
1. Vá para **Editor de Site**
2. Clique na aba **"Tema"**
3. Use os color pickers para escolher cores
4. Clique em **"Salvar Mudanças"**

## 🚪 Logout

Para sair do AdminCP:

1. **Método 1:** Clique em **"Sair"** na sidebar (abaixo do avatar)
2. **Método 2:** Clique no ícone de perfil e selecione **"Sair"**

**O que acontece:**
- ✅ Sessão é removida do `sessionStorage`
- ✅ Você volta para a tela de login
- ✅ Dados são limpos

## ⚡ Atalhos de Teclado (Futuro)

Atalhos planejados para Parte 7:

```
Ctrl/Cmd + K     - Busca rápida
Ctrl/Cmd + B     - Toggle sidebar
Ctrl/Cmd + ,     - Configurações
Ctrl/Cmd + L     - Ver logs
Esc              - Fechar modais
```

## 🎨 Personalização

### Mudar Cores do Tema

Edite o arquivo `/src/app/components/admincp/AdminCPLayout.tsx`:

```tsx
const adminModules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: BarChart3,
    color: 'text-blue-400',      // ← Mude aqui
    bgColor: 'bg-blue-500/10',   // ← E aqui
  },
  // ...
]
```

### Adicionar Novo Módulo

1. Crie novo arquivo em `/src/app/components/admincp/sections/`
2. Adicione ao array `adminModules` em `AdminCPLayout.tsx`
3. Adicione ao switch case em `renderModuleContent()`

Exemplo:

```tsx
// 1. Criar /sections/NewModule.tsx
export function NewModule() {
  return <div>Novo Módulo</div>;
}

// 2. Adicionar ao AdminCPLayout.tsx
import { NewModule } from './sections/NewModule';

const adminModules = [
  // ... outros módulos
  {
    id: 'new-module',
    name: 'Novo Módulo',
    icon: Star,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    permission: 'viewAccounts'
  }
];

// 3. Adicionar ao renderModuleContent()
case 'new-module':
  return <NewModule />;
```

## 🐛 Solução de Problemas

### Não consigo fazer login
- ✅ Certifique-se de digitar algo nos campos
- ✅ No modo fake, qualquer texto funciona

### Sidebar não abre/fecha
- ✅ Clique no botão ☰/✕ no topo da sidebar
- ✅ Verifique se JavaScript está habilitado

### Seção não carrega
- ✅ Verifique o console do navegador (F12)
- ✅ Certifique-se que todos os arquivos foram criados
- ✅ Recarregue a página (F5)

### Dados não aparecem
- ✅ Dados são mock/fake - não vêm do banco
- ✅ Verifique se os arrays MOCK_* estão presentes
- ✅ Veja o console para erros

### Animações travando
- ✅ Reduza efeitos visuais se necessário
- ✅ Desative backdrop-blur em dispositivos lentos

## 📱 Versão Mobile

O AdminCP é **responsivo**:

- ✅ Sidebar vira menu hambúrguer
- ✅ Cards empilham verticalmente
- ✅ Tabelas ganham scroll horizontal
- ✅ Touch-friendly buttons

**Teste em:**
- 📱 iPhone/Android
- 🖥️ Desktop
- 💻 Tablet

## 🔗 Links Úteis

- [Documentação Completa](./ADMINCP_PARTE6_LAYOUT_SPA.md)
- [Checklist Visual](./ADMINCP_VISUAL_CHECKLIST.md)
- [Guia do Modo Fake](./ADMINCP_FAKE_GUIDE.md)
- [Integração Backend](./ADMINCP_BACKEND_INTEGRATION.md)

## 💡 Dicas Finais

1. **Explore tudo** - Clique em todos os botões e menus
2. **Teste responsividade** - Redimensione a janela
3. **Veja as animações** - Observe os efeitos visuais
4. **Leia os tooltips** - Passe o mouse sobre elementos
5. **Use o modo fake** - Perfeito para demonstrações

## 🎉 Pronto!

Agora você sabe como usar o **AdminCP completo** do MeuMU Online!

Para integração com backend real, consulte:
- [ADMINCP_BACKEND_INTEGRATION.md](./ADMINCP_BACKEND_INTEGRATION.md)

---

**🛡️ MeuMU Online - AdminCP v1.0**  
*Season 19-2-3 - Épico*  
Desenvolvido com ⚔️
