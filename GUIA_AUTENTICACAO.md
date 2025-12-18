# 🔐 Guia Completo de Autenticação - MeuMU Online

## Sistema de Login e Autenticação com Banco de Dados Real

Este guia mostra como usar o sistema de autenticação que consulta diretamente o banco de dados MySQL do servidor MU Online.

---

## 📋 Índice
1. [Como Funciona](#como-funciona)
2. [Rotas e Páginas](#rotas-e-páginas)
3. [Componentes Criados](#componentes-criados)
4. [Fluxo de Autenticação](#fluxo-de-autenticação)
5. [Exemplo de Uso](#exemplo-de-uso)
6. [Integração com AdminCP](#integração-com-admincp)

---

## Como Funciona

### Backend (Node.js + Express)
```
/server/routes/auth.js
```

**Endpoints criados:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/verify` - Verificar admin
- `POST /api/auth/logout` - Logout

### Frontend (React + Context API)
```
/src/app/contexts/AuthContext.tsx
/src/app/components/auth/LoginForm.tsx
/src/app/components/auth/RegisterForm.tsx
/src/app/components/auth/ProtectedRoute.tsx
```

---

## Rotas e Páginas

### Páginas de Autenticação

#### 1. Login (`/login`)
```tsx
import { LoginForm } from './components/auth/LoginForm';

function LoginPage() {
  return <LoginForm />;
}
```

#### 2. Registro (`/register`)
```tsx
import { RegisterForm } from './components/auth/RegisterForm';

function RegisterPage() {
  return <RegisterForm />;
}
```

### Rotas Protegidas

#### Proteger qualquer página
```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Requer login
<ProtectedRoute>
  <MinhaConta />
</ProtectedRoute>

// Requer admin
<ProtectedRoute requireAdmin={true}>
  <AdminCP />
</ProtectedRoute>
```

---

## Componentes Criados

### 1. AuthContext
Gerencia o estado de autenticação globalmente.

```tsx
import { useAuth } from './contexts/AuthContext';

function MeuComponente() {
  const { 
    user,           // Dados do usuário
    characters,     // Personagens do usuário
    isAuthenticated,// true/false
    isAdmin,        // true/false
    login,          // Função de login
    logout,         // Função de logout
    verifyAdmin     // Verificar se é admin
  } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <p>Bem-vindo, {user.username}!</p>
      )}
      {isAdmin && (
        <button>Acessar AdminCP</button>
      )}
    </div>
  );
}
```

### 2. LoginForm
Componente de formulário de login completo.

**Recursos:**
- ✅ Validação de campos
- ✅ Mensagens de erro
- ✅ Loading state
- ✅ Integração com banco de dados
- ✅ Armazenamento em localStorage

### 3. RegisterForm
Componente de registro de nova conta.

**Recursos:**
- ✅ Validação de senha (confirmação)
- ✅ Validação de email
- ✅ Validação de username (4-10 chars)
- ✅ Criação de conta no banco
- ✅ Mensagens de sucesso/erro

### 4. ProtectedRoute
Componente de proteção de rotas.

**Recursos:**
- ✅ Verifica autenticação
- ✅ Verifica privilégios de admin
- ✅ Redireciona não autorizados
- ✅ Mostra mensagens amigáveis

---

## Fluxo de Autenticação

### Login
```
1. Usuário digita username e senha
   ↓
2. Frontend envia para /api/auth/login
   ↓
3. Backend consulta MEMB_INFO no MySQL
   ↓
4. Verifica senha (hash MD5)
   ↓
5. Verifica ctl1_code e AccountLevel
   ↓
6. Retorna dados + determina se é admin
   ↓
7. Frontend armazena em Context + localStorage
   ↓
8. Usuário está logado!
```

### Verificação de Admin
```
Usuário logado
   ↓
Context verifica user.isAdmin
   ↓
Se true: Mostra AdminCP no menu
   ↓
Se false: Esconde AdminCP
   ↓
Ao tentar acessar /admincp
   ↓
ProtectedRoute verifica isAdmin
   ↓
Se false: Mostra "Privilégios insuficientes"
```

---

## Exemplo de Uso

### App.tsx - Adicionar AuthProvider
```tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Resto da aplicação */}
    </AuthProvider>
  );
}
```

### Menu - Mostrar Admin só para admins
```tsx
import { useAuth } from './contexts/AuthContext';

function Menu() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav>
      <a href="/">Home</a>
      
      {isAuthenticated ? (
        <>
          <a href="/minha-conta">Minha Conta</a>
          
          {/* SÓ MOSTRA PARA ADMINS */}
          {isAdmin && (
            <a href="/admincp">AdminCP</a>
          )}
          
          <button onClick={logout}>Sair</button>
          <span>Olá, {user.username}</span>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/register">Registro</a>
        </>
      )}
    </nav>
  );
}
```

### Página AdminCP - Protegida
```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminCP } from './components/admin/AdminCP';

function AdminCPPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminCP />
    </ProtectedRoute>
  );
}
```

### Página Minha Conta - Requer Login
```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function MinhaContaPage() {
  const { user, characters } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Minha Conta</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Admin: {user.isAdmin ? 'Sim' : 'Não'}</p>
        
        <h2>Meus Personagens</h2>
        {characters.map(char => (
          <div key={char.name}>
            <p>{char.name} - Level {char.level}</p>
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}
```

---

## Integração com AdminCP

### Verificar Admin no Backend
```javascript
// Middleware de autenticação
async function requireAdmin(req, res, next) {
  const { username } = req.user; // Do token
  
  const [users] = await db.query(
    'SELECT ctl1_code, AccountLevel FROM MEMB_INFO WHERE memb___id = ?',
    [username]
  );
  
  const user = users[0];
  const isAdmin = user.ctl1_code >= 8 || user.AccountLevel >= 2;
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Privilégios de administrador necessários'
    });
  }
  
  next();
}

// Rota protegida
router.get('/admin/users', requireAdmin, async (req, res) => {
  // Código só executado se for admin
});
```

### Mostrar Badge de Admin
```tsx
import { useAuth } from './contexts/AuthContext';
import { Shield } from 'lucide-react';

function UserBadge() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500 rounded-full">
      <Shield className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-semibold text-amber-500">
        ADMIN
      </span>
    </div>
  );
}
```

---

## Dados Armazenados

### localStorage
```javascript
// Armazenado após login
localStorage.setItem('muonline_user', JSON.stringify({
  username: 'admin',
  name: 'Administrador',
  email: 'admin@mu.com',
  isAdmin: true,
  adminLevel: 8,
  accountLevel: 2
}));

localStorage.setItem('muonline_token', 'base64_token');

localStorage.setItem('muonline_characters', JSON.stringify([
  { name: 'CharName', level: 400, resets: 5 }
]));
```

### Context State
```javascript
{
  user: {
    username: 'admin',
    name: 'Administrador',
    email: 'admin@mu.com',
    isAdmin: true,
    adminLevel: 8,
    accountLevel: 2
  },
  characters: [
    { name: 'CharName', level: 400, class: 0, resets: 5, zen: 1000000 }
  ],
  isAuthenticated: true,
  isAdmin: true,
  isLoading: false
}
```

---

## Testando

### 1. Iniciar Backend
```bash
npm run server
```

### 2. Configurar Admin no Banco
```sql
UPDATE MEMB_INFO 
SET ctl1_code = 8 
WHERE memb___id = 'testadmin';
```

### 3. Iniciar Frontend
```bash
npm run dev
```

### 4. Fazer Login
```
http://localhost:5173/login

Username: testadmin
Password: (senha do banco)
```

### 5. Verificar Admin
- ✅ Menu deve mostrar "AdminCP"
- ✅ Pode acessar /admincp
- ✅ Badge "ADMIN" aparece

---

## Segurança

### Hash de Senha
```javascript
// MD5 (padrão MU Online)
import crypto from 'crypto';

const hash = crypto
  .createHash('md5')
  .update('senha123')
  .digest('hex')
  .toUpperCase();
// Resultado: 482C811DA5D5B4BC6D497FFA98491E38
```

### Verificação de Admin
```javascript
// Dois métodos de verificação
const isAdmin = user.ctl1_code >= 8 || user.AccountLevel >= 2;

// ctl1_code >= 8: Game Master/Admin tradicional
// AccountLevel >= 2: Sistema moderno de níveis
```

### Token (Simplificado)
```javascript
// Token básico (em produção use JWT)
const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

// Em produção, use:
import jwt from 'jsonwebtoken';
const token = jwt.sign({ username, isAdmin }, SECRET_KEY, { expiresIn: '24h' });
```

---

## ⚔️ MeuMU Online - Sistema de Autenticação

**Autenticação real integrada com o banco de dados do servidor!**

Para mais informações, veja:
- `CONFIGURACAO_ADMIN.md` - Como configurar admins
- `DIAGNOSTICO_VPS.md` - Como conectar ao banco de dados
