# 🔌 AdminCP - Guia de Integração com Backend Real

## 📋 Índice
1. [Login Real com JWT](#1-login-real-com-jwt)
2. [Buscar Estatísticas do Banco](#2-buscar-estatísticas-do-banco)
3. [Endpoints API Necessários](#3-endpoints-api-necessários)
4. [Estrutura do Banco de Dados](#4-estrutura-do-banco-de-dados)
5. [Middleware de Autenticação](#5-middleware-de-autenticação)
6. [Exemplo Completo de Módulo](#6-exemplo-completo-de-módulo)

---

## 1. Login Real com JWT

### Frontend: Substituir função fake

**Antes (FAKE):**
```typescript
// admin-login.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // Validação FAKE
  if (username.trim() && password.trim()) {
    sessionStorage.setItem('adminSession', JSON.stringify(MOCK_ADMIN));
    onLoginSuccess(MOCK_ADMIN);
  }
  
  setIsLoading(false);
};
```

**Depois (REAL):**
```typescript
// admin-login.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Salvar token JWT
      sessionStorage.setItem('adminToken', data.token);
      sessionStorage.setItem('adminSession', JSON.stringify(data));
      onLoginSuccess(data);
    } else {
      setError(data.message || 'Credenciais inválidas');
    }
  } catch (error) {
    setError('Erro de conexão com o servidor');
    console.error('Erro no login admin:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Backend: Endpoint de Login

```javascript
// server/routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar admin no banco
    const [admins] = await db.query(
      'SELECT * FROM MEMB_ADMINS WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const admin = admins[0];

    // Verificar senha (bcrypt)
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Retornar dados do admin (SEM senha!)
    res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.role,
        email: admin.email,
        avatar: admin.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.username}`,
        permissions: JSON.parse(admin.permissions)
      },
      session: {
        token,
        expiresIn: '2h'
      }
    });

  } catch (error) {
    console.error('Erro no login admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
```

---

## 2. Buscar Estatísticas do Banco

### Frontend: Hook para buscar stats

```typescript
// src/app/hooks/useAdminStats.ts
import { useState, useEffect } from 'react';

interface AdminStats {
  accounts: {
    total: number;
    online: number;
    banned: number;
    newToday: number;
  };
  characters: {
    total: number;
    activeToday: number;
    topLevel: number;
    resets: number;
  };
  economy: {
    totalZen: string;
    totalCredits: number;
    transactions: number;
    topDonator: string;
  };
  events: {
    active: number;
    scheduled: number;
    completed: number;
    participants: number;
  };
  server: {
    uptime: string;
    tps: number;
    memory: string;
    cpu: string;
  };
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar estatísticas');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}
```

### Backend: Endpoint de Estatísticas

```javascript
// server/routes/admin.js
const { isAdmin } = require('../middleware/auth');

router.get('/stats', isAdmin, async (req, res) => {
  try {
    // Contas
    const [accountsTotal] = await db.query('SELECT COUNT(*) as total FROM MEMB_INFO');
    const [accountsOnline] = await db.query('SELECT COUNT(*) as online FROM MEMB_STAT WHERE ConnectStat = 1');
    const [accountsBanned] = await db.query('SELECT COUNT(*) as banned FROM MEMB_INFO WHERE bloc_code = 1');
    const [accountsNewToday] = await db.query(
      'SELECT COUNT(*) as newToday FROM MEMB_INFO WHERE DATE(memb_regist_date) = CURDATE()'
    );

    // Personagens
    const [charactersTotal] = await db.query('SELECT COUNT(*) as total FROM Character');
    const [charactersActive] = await db.query(
      'SELECT COUNT(*) as activeToday FROM AccountCharacter WHERE ConnectStat = 1'
    );
    const [topLevel] = await db.query('SELECT MAX(cLevel) as topLevel FROM Character');
    const [totalResets] = await db.query('SELECT SUM(ResetCount) as totalResets FROM Character');

    // Economia
    const [totalZen] = await db.query('SELECT SUM(Money) as totalZen FROM Character');
    const [totalCredits] = await db.query('SELECT SUM(credits) as totalCredits FROM MEMB_INFO');
    const [topDonator] = await db.query(
      'SELECT memb_name FROM MEMB_INFO ORDER BY credits DESC LIMIT 1'
    );

    // Eventos (exemplo simplificado)
    const eventsActive = 3; // Implementar lógica de eventos
    const eventsScheduled = 7;

    // Server stats (exemplo - pode usar módulo 'os' do Node.js)
    const serverStats = {
      uptime: '99.8%',
      tps: 19.9,
      memory: '68%',
      cpu: '42%'
    };

    res.json({
      accounts: {
        total: accountsTotal[0].total,
        online: accountsOnline[0].online,
        banned: accountsBanned[0].banned,
        newToday: accountsNewToday[0].newToday
      },
      characters: {
        total: charactersTotal[0].total,
        activeToday: charactersActive[0].activeToday,
        topLevel: topLevel[0].topLevel,
        resets: totalResets[0].totalResets
      },
      economy: {
        totalZen: formatZen(totalZen[0].totalZen),
        totalCredits: totalCredits[0].totalCredits,
        transactions: 0, // Implementar tabela de transações
        topDonator: topDonator[0]?.memb_name || 'N/A'
      },
      events: {
        active: eventsActive,
        scheduled: eventsScheduled,
        completed: 0,
        participants: 0
      },
      server: serverStats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
});

// Função auxiliar para formatar Zen
function formatZen(zen) {
  if (zen >= 1000000000) {
    return `${(zen / 1000000000).toFixed(1)}B`;
  }
  if (zen >= 1000000) {
    return `${(zen / 1000000).toFixed(1)}M`;
  }
  if (zen >= 1000) {
    return `${(zen / 1000).toFixed(1)}K`;
  }
  return zen.toString();
}
```

---

## 3. Endpoints API Necessários

### Estrutura Completa

```javascript
// server/routes/admin.js

// Autenticação
POST   /api/admin/login           // Login administrativo
POST   /api/admin/logout          // Logout
POST   /api/admin/verify-token    // Verificar token JWT
POST   /api/admin/refresh-token   // Refresh token

// Dashboard
GET    /api/admin/stats           // Estatísticas gerais
GET    /api/admin/activity        // Atividade recente

// Contas
GET    /api/admin/accounts        // Listar contas (com paginação)
GET    /api/admin/accounts/:id    // Detalhes de uma conta
PUT    /api/admin/accounts/:id    // Editar conta
DELETE /api/admin/accounts/:id    // Deletar conta
POST   /api/admin/accounts/:id/ban // Banir conta
POST   /api/admin/accounts/:id/unban // Desbanir conta
PUT    /api/admin/accounts/:id/credits // Adicionar/remover créditos

// Personagens
GET    /api/admin/characters      // Listar personagens
GET    /api/admin/characters/:name // Detalhes de personagem
PUT    /api/admin/characters/:name // Editar stats
POST   /api/admin/characters/:name/reset // Resetar personagem
DELETE /api/admin/characters/:name // Deletar personagem

// Bans
GET    /api/admin/bans            // Listar bans
POST   /api/admin/bans            // Criar ban
DELETE /api/admin/bans/:id        // Remover ban

// Notícias
GET    /api/admin/news            // Listar notícias
POST   /api/admin/news            // Criar notícia
PUT    /api/admin/news/:id        // Editar notícia
DELETE /api/admin/news/:id        // Deletar notícia

// Eventos
GET    /api/admin/events          // Listar eventos
POST   /api/admin/events          // Criar evento
PUT    /api/admin/events/:id      // Editar evento
DELETE /api/admin/events/:id      // Deletar evento

// Admins
GET    /api/admin/admins          // Listar admins
POST   /api/admin/admins          // Criar admin
PUT    /api/admin/admins/:id      // Editar admin
DELETE /api/admin/admins/:id      // Deletar admin

// Database
GET    /api/admin/database/tables // Listar tabelas
POST   /api/admin/database/backup // Criar backup
POST   /api/admin/database/restore // Restaurar backup
POST   /api/admin/database/query  // Executar query (CUIDADO!)
```

---

## 4. Estrutura do Banco de Dados

### Tabela de Admins

```sql
CREATE TABLE MEMB_ADMINS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Hash bcrypt
  email VARCHAR(100) NOT NULL,
  role ENUM('superadmin', 'admin', 'moderator', 'support') DEFAULT 'admin',
  permissions JSON, -- {"viewAccounts": true, ...}
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP NULL,
  active BOOLEAN DEFAULT TRUE,
  INDEX idx_username (username)
);
```

### Tabela de Logs de Auditoria

```sql
CREATE TABLE ADMIN_AUDIT_LOGS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'BAN_USER', 'EDIT_CHARACTER', etc
  target_type VARCHAR(50), -- 'account', 'character', etc
  target_id VARCHAR(100),
  details TEXT, -- JSON com detalhes da ação
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES MEMB_ADMINS(id),
  INDEX idx_admin (admin_id),
  INDEX idx_created (created_at)
);
```

### Tabela de Transações de Créditos

```sql
CREATE TABLE CREDIT_TRANSACTIONS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id VARCHAR(50) NOT NULL,
  admin_id INT NULL, -- NULL se foi compra do player
  amount INT NOT NULL, -- Positivo = adicionar, Negativo = remover
  previous_balance INT NOT NULL,
  new_balance INT NOT NULL,
  type ENUM('purchase', 'admin_add', 'admin_remove', 'reward', 'refund'),
  payment_method VARCHAR(50) NULL,
  payment_id VARCHAR(100) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES MEMB_ADMINS(id),
  INDEX idx_account (account_id),
  INDEX idx_created (created_at)
);
```

---

## 5. Middleware de Autenticação

```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// Verificar se é admin
exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar admin no banco
    const [admins] = await db.query(
      'SELECT * FROM MEMB_ADMINS WHERE id = ? AND active = TRUE',
      [decoded.adminId]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Admin não encontrado ou inativo'
      });
    }

    // Adicionar dados do admin ao request
    req.admin = {
      id: admins[0].id,
      username: admins[0].username,
      role: admins[0].role,
      permissions: JSON.parse(admins[0].permissions)
    };

    // Atualizar last_active
    await db.query(
      'UPDATE MEMB_ADMINS SET last_active = NOW() WHERE id = ?',
      [admins[0].id]
    );

    next();
  } catch (error) {
    console.error('Erro na autenticação admin:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

// Verificar permissão específica
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    if (req.admin.permissions[permission] !== true) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para esta ação'
      });
    }

    next();
  };
};

// Verificar se é superadmin
exports.isSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Apenas superadmins podem executar esta ação'
    });
  }
  next();
};
```

---

## 6. Exemplo Completo de Módulo

### Módulo: Gerenciar Contas

**Frontend:**
```typescript
// src/app/components/admin-modules/AccountsModule.tsx
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';

interface Account {
  memb_name: string;
  mail_addr: string;
  memb_regist_date: string;
  bloc_code: number;
  credits: number;
}

export function AccountsModule() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAccounts();
  }, [page, search]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(
        `/api/admin/accounts?page=${page}&search=${search}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      setAccounts(data.accounts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (username: string) => {
    if (!confirm(`Tem certeza que deseja banir ${username}?`)) return;

    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/accounts/${username}/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Conta banida com sucesso!');
        fetchAccounts();
      }
    } catch (error) {
      console.error('Erro ao banir conta:', error);
      alert('Erro ao banir conta');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button onClick={fetchAccounts}>Buscar</Button>
      </div>

      {/* Table */}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Email</th>
              <th>Créditos</th>
              <th>Status</th>
              <th>Data Registro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.memb_name}>
                <td>{account.memb_name}</td>
                <td>{account.mail_addr}</td>
                <td>{account.credits}</td>
                <td>
                  <Badge variant={account.bloc_code === 1 ? 'destructive' : 'default'}>
                    {account.bloc_code === 1 ? 'Banido' : 'Ativo'}
                  </Badge>
                </td>
                <td>{new Date(account.memb_regist_date).toLocaleDateString()}</td>
                <td>
                  {account.bloc_code === 0 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBan(account.memb_name)}
                    >
                      Banir
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Anterior
        </Button>
        <span className="py-2 px-4">Página {page} de {totalPages}</span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
```

**Backend:**
```javascript
// server/routes/admin.js

// Listar contas com paginação e busca
router.get('/accounts', isAdmin, hasPermission('viewAccounts'), async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    let query = 'SELECT * FROM MEMB_INFO';
    let countQuery = 'SELECT COUNT(*) as total FROM MEMB_INFO';
    const params = [];

    if (search) {
      query += ' WHERE memb_name LIKE ? OR mail_addr LIKE ?';
      countQuery += ' WHERE memb_name LIKE ? OR mail_addr LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY memb_regist_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [accounts] = await db.query(query, params);
    const [countResult] = await db.query(countQuery, params.slice(0, -2));

    const totalAccounts = countResult[0].total;
    const totalPages = Math.ceil(totalAccounts / limit);

    res.json({
      accounts,
      page,
      totalPages,
      totalAccounts
    });

  } catch (error) {
    console.error('Erro ao listar contas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar contas'
    });
  }
});

// Banir conta
router.post('/accounts/:username/ban', isAdmin, hasPermission('banUsers'), async (req, res) => {
  const { username } = req.params;

  try {
    // Banir conta
    await db.query(
      'UPDATE MEMB_INFO SET bloc_code = 1 WHERE memb_name = ?',
      [username]
    );

    // Registrar log de auditoria
    await db.query(
      'INSERT INTO ADMIN_AUDIT_LOGS (admin_id, action, target_type, target_id, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.admin.id, 'BAN_USER', 'account', username, req.ip]
    );

    res.json({
      success: true,
      message: `Conta ${username} banida com sucesso`
    });

  } catch (error) {
    console.error('Erro ao banir conta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao banir conta'
    });
  }
});
```

---

## 🔐 Segurança Adicional

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

app.use('/api/admin/login', adminLoginLimiter);
```

### CAPTCHA no Login
```typescript
// Usar hCaptcha ou reCAPTCHA
import HCaptcha from '@hcaptcha/react-hcaptcha';

<HCaptcha
  sitekey={process.env.HCAPTCHA_SITE_KEY}
  onVerify={token => setCaptchaToken(token)}
/>
```

### 2FA (Two-Factor Authentication)
```javascript
const speakeasy = require('speakeasy');

// Gerar secret
const secret = speakeasy.generateSecret();

// Verificar token
const verified = speakeasy.totp.verify({
  secret: admin.twoFactorSecret,
  encoding: 'base32',
  token: req.body.token
});
```

---

## ✅ Checklist de Implementação

- [ ] Criar tabela MEMB_ADMINS
- [ ] Criar tabela ADMIN_AUDIT_LOGS
- [ ] Criar tabela CREDIT_TRANSACTIONS
- [ ] Implementar endpoint de login com JWT
- [ ] Implementar middleware de autenticação
- [ ] Implementar endpoint de estatísticas
- [ ] Implementar CRUD de contas
- [ ] Implementar CRUD de personagens
- [ ] Implementar sistema de bans
- [ ] Implementar gerenciamento de créditos
- [ ] Implementar publicação de notícias
- [ ] Implementar logs de auditoria
- [ ] Adicionar rate limiting
- [ ] Adicionar CAPTCHA
- [ ] Adicionar 2FA (opcional)
- [ ] Implementar IP whitelist (opcional)
- [ ] Configurar HTTPS em produção
- [ ] Testar todas as funcionalidades

---

**Pronto! Com este guia, você tem tudo para integrar o AdminCP com o backend real do Mu Online! 🚀**
