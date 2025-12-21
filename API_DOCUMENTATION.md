# 📡 API DOCUMENTATION - MeuMU Online Backend

**Base URL:** `https://seudominio.com/api`  
**Versão:** 1.0.0  
**Autenticação:** JWT Bearer Token

---

## 📋 ÍNDICE

1. [Autenticação](#autenticacao)
2. [Endpoints Públicos](#publicos)
3. [Endpoints de Jogador](#jogador)
4. [Endpoints Administrativos](#admin)
5. [Códigos de Resposta](#codigos)
6. [Rate Limiting](#rate-limiting)
7. [Exemplos de Uso](#exemplos)

---

## 🔐 AUTENTICAÇÃO <a name="autenticacao"></a>

### POST `/api/auth/register`

Registrar nova conta de jogador.

**Request Body:**
```json
{
  "username": "PlayerName",
  "password": "senha123456",
  "email": "player@email.com"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso",
  "data": {
    "username": "PlayerName",
    "email": "player@email.com"
  }
}
```

---

### POST `/api/auth/login`

Login de jogador.

**Request Body:**
```json
{
  "username": "PlayerName",
  "password": "senha123456"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "PlayerName",
      "email": "player@email.com",
      "vip_level": 0
    }
  }
}
```

---

### POST `/api/auth/verify-token`

Verificar se token JWT é válido.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "username": "PlayerName"
  }
}
```

---

## 🌍 ENDPOINTS PÚBLICOS <a name="publicos"></a>

### GET `/api/server/status`

Status do servidor em tempo real.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "online": true,
    "players_online": 487,
    "max_players": 1000,
    "uptime": "15 dias, 8 horas",
    "version": "Season 19-2-3",
    "rates": {
      "exp": 500,
      "drop": 50,
      "zen": 100
    }
  }
}
```

---

### GET `/api/rankings/players`

Ranking de jogadores.

**Query Parameters:**
- `type` (string): "resets", "level", "pk" (default: "resets")
- `limit` (number): Limite de resultados (default: 50, max: 100)
- `class` (string): Filtrar por classe (opcional)

**Example:** `/api/rankings/players?type=resets&limit=10`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "position": 1,
        "name": "DarkLord",
        "class": "Dark Lord",
        "level": 400,
        "resets": 1245,
        "pk_level": 5,
        "guild": "TopGuild"
      }
    ],
    "total": 10,
    "updated_at": "2024-12-21T14:30:00Z"
  }
}
```

---

### GET `/api/rankings/guilds`

Ranking de guilds.

**Query Parameters:**
- `limit` (number): Limite de resultados (default: 20, max: 50)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "position": 1,
        "name": "TopGuild",
        "master": "GuildMaster",
        "score": 15420,
        "members": 45,
        "logo": "base64..."
      }
    ]
  }
}
```

---

### GET `/api/news`

Listar notícias.

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Itens por página (default: 10)
- `category` (string): Filtrar por categoria

**Response 200:**
```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": 1,
        "title": "Update de Natal 2024",
        "slug": "update-de-natal-2024",
        "excerpt": "Confira as novidades...",
        "content": "Lorem ipsum...",
        "category": "UPDATE",
        "image": "https://...",
        "author": "Admin",
        "created_at": "2024-12-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

---

### GET `/api/news/:slug`

Obter notícia específica.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Update de Natal 2024",
    "content": "Lorem ipsum...",
    "views": 1523,
    "likes": 87
  }
}
```

---

### GET `/api/events`

Listar eventos.

**Query Parameters:**
- `status` (string): "active", "upcoming", "past" (default: "active")

**Response 200:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "name": "Blood Castle",
        "type": "automatic",
        "start_time": "2024-12-21T15:00:00Z",
        "duration": 15,
        "status": "active",
        "participants": 45,
        "max_participants": 100
      }
    ]
  }
}
```

---

## 👤 ENDPOINTS DE JOGADOR <a name="jogador"></a>

> **Nota:** Todos os endpoints abaixo requerem autenticação.  
> **Header:** `Authorization: Bearer <token>`

---

### GET `/api/characters`

Listar personagens da conta.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "name": "DarkLord",
        "class": "Dark Lord",
        "level": 400,
        "resets": 1245,
        "strength": 32000,
        "agility": 15000,
        "vitality": 20000,
        "energy": 25000,
        "command": 30000,
        "points": 50,
        "pk_level": 5,
        "guild": "TopGuild",
        "map": "Lorencia",
        "last_online": "2024-12-21T14:00:00Z"
      }
    ]
  }
}
```

---

### GET `/api/characters/:name`

Obter detalhes de um personagem específico.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "name": "DarkLord",
    "class": "Dark Lord",
    "level": 400,
    "resets": 1245,
    "stats": {
      "strength": 32000,
      "agility": 15000,
      "vitality": 20000,
      "energy": 25000,
      "command": 30000
    },
    "points_available": 50,
    "inventory": [...],
    "quests": [...],
    "achievements": [...]
  }
}
```

---

### POST `/api/characters/:name/add-stats`

Adicionar pontos de status.

**Request Body:**
```json
{
  "stat": "strength",
  "amount": 10
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "10 pontos adicionados em Strength",
  "data": {
    "new_strength": 32010,
    "points_remaining": 40
  }
}
```

---

### POST `/api/characters/:name/reset`

Resetar personagem.

**Request Body:**
```json
{
  "confirm": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Personagem resetado com sucesso",
  "data": {
    "new_resets": 1246,
    "level": 1,
    "points_received": 500
  }
}
```

---

### GET `/api/wcoin/balance`

Obter saldo de WCoin.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "wcoin_c": 1500,
    "wcoin_p": 2300,
    "wcoin_g": 500
  }
}
```

---

### GET `/api/wcoin/history`

Histórico de transações WCoin.

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Itens por página (default: 20)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "type": "purchase",
        "amount": 500,
        "coin_type": "wcoin_c",
        "description": "Compra de pacote 500 WC",
        "created_at": "2024-12-21T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "total": 15
    }
  }
}
```

---

### POST `/api/wcoin/purchase`

Comprar pacote de WCoin.

**Request Body:**
```json
{
  "package_id": 3,
  "payment_method": "pix"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Compra processada com sucesso",
  "data": {
    "transaction_id": "TXN_123456",
    "amount": 500,
    "payment_url": "https://payment.com/..."
  }
}
```

---

## 🛡️ ENDPOINTS ADMINISTRATIVOS <a name="admin"></a>

> **Nota:** Requer autenticação de administrador e permissões específicas.

---

### GET `/api/admin/logs/logs`

Listar logs administrativos.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Itens por página (default: 50)
- `admin_account` (string): Filtrar por admin
- `action_type` (string): Filtrar por tipo de ação
- `severity` (string): "LOW", "MEDIUM", "HIGH", "CRITICAL"
- `start_date` (string): Data inicial (ISO 8601)
- `end_date` (string): Data final (ISO 8601)
- `search` (string): Busca livre

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "admin_account": "admin",
        "action_type": "BAN",
        "action_category": "USER",
        "description": "Baniu usuário TestUser por hack",
        "ip_address": "192.168.1.1",
        "severity": "CRITICAL",
        "status": "SUCCESS",
        "created_at": "2024-12-21T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1523,
      "totalPages": 31
    }
  }
}
```

---

### POST `/api/admin/logs/log`

Registrar nova ação administrativa.

**Request Body:**
```json
{
  "admin_account": "admin",
  "action_type": "UPDATE",
  "action_category": "CONFIG",
  "description": "Alterou taxa de EXP para 1000x",
  "severity": "HIGH"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1524,
    "message": "Ação registrada com sucesso"
  }
}
```

---

### GET `/api/admin/logs/stats`

Estatísticas de logs.

**Query Parameters:**
- `days` (number): Período em dias (default: 30)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period_days": 30,
    "action_types": [
      { "action_type": "LOGIN", "count": 523 },
      { "action_type": "UPDATE", "count": 342 }
    ],
    "severities": [
      { "severity": "CRITICAL", "count": 15 },
      { "severity": "HIGH", "count": 87 }
    ],
    "top_admins": [
      { "admin_account": "admin", "actions": 234 }
    ]
  }
}
```

---

### GET `/api/admin/logs/export`

Exportar logs para CSV.

**Query Parameters:**
- `start_date` (string): Data inicial
- `end_date` (string): Data final

**Response 200:**
```csv
ID,Admin,Action,Category,Description,IP,Severity,Date
1,admin,BAN,USER,"Baniu usuário TestUser",192.168.1.1,CRITICAL,2024-12-21T14:30:00Z
```

---

### POST `/api/sandbox/simulate`

Executar simulação de segurança.

**Request Body:**
```json
{
  "attack_type": "SQLi"
}
```

**Tipos disponíveis:**
- `SQLi` - SQL Injection
- `DDoS` - Distributed Denial of Service
- `Phishing` - Phishing Attack
- `BruteForce` - Brute Force Login
- `XSS` - Cross-Site Scripting
- `ALL` - Todos os ataques

**Response 200:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-12-21T15:00:00Z",
    "attack_type": "SQLi",
    "total_tests": 1,
    "passed": 1,
    "failed": 0,
    "results": [
      {
        "type": "SQL Injection",
        "packets_sent": 850,
        "packets_blocked": 832,
        "success_rate": "97.88%",
        "result": "PASSED",
        "severity": "MEDIUM"
      }
    ]
  }
}
```

---

### GET `/api/sandbox/history`

Histórico de simulações.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "history": [...],
    "stats": {
      "total_simulations": 45,
      "total_passed": 42,
      "total_failed": 3
    }
  }
}
```

---

## 📊 CÓDIGOS DE RESPOSTA <a name="codigos"></a>

| Código | Significado |
|--------|-------------|
| `200` | Success - Requisição bem-sucedida |
| `201` | Created - Recurso criado com sucesso |
| `400` | Bad Request - Dados inválidos |
| `401` | Unauthorized - Token inválido ou ausente |
| `403` | Forbidden - Sem permissão |
| `404` | Not Found - Recurso não encontrado |
| `429` | Too Many Requests - Rate limit excedido |
| `500` | Internal Server Error - Erro no servidor |

### Formato de Erro

```json
{
  "success": false,
  "error": "Mensagem de erro detalhada"
}
```

---

## ⚡ RATE LIMITING <a name="rate-limiting"></a>

Limites de requisições por IP:

- **Endpoints Públicos:** 100 req/15min
- **Endpoints Autenticados:** 200 req/15min
- **Endpoints Admin:** 500 req/15min

**Header de resposta quando limite é atingido:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640095200
Retry-After: 900
```

---

## 💡 EXEMPLOS DE USO <a name="exemplos"></a>

### JavaScript (Fetch)

```javascript
// Login
const login = async () => {
  const response = await fetch('https://api.meumuonline.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'PlayerName',
      password: 'senha123'
    })
  });
  
  const data = await response.json();
  const token = data.data.token;
  
  // Salvar token
  localStorage.setItem('token', token);
};

// Requisição autenticada
const getCharacters = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://api.meumuonline.com/api/characters', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data.data.characters);
};
```

### Python (Requests)

```python
import requests

# Login
response = requests.post('https://api.meumuonline.com/api/auth/login', json={
    'username': 'PlayerName',
    'password': 'senha123'
})

token = response.json()['data']['token']

# Requisição autenticada
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('https://api.meumuonline.com/api/characters', headers=headers)

characters = response.json()['data']['characters']
print(characters)
```

### cURL

```bash
# Login
curl -X POST https://api.meumuonline.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"PlayerName","password":"senha123"}'

# Requisição autenticada
curl https://api.meumuonline.com/api/characters \
  -H "Authorization: Bearer <token>"
```

---

## 🔗 Links Úteis

- **Base URL:** `https://api.meumuonline.com/api`
- **Health Check:** `https://api.meumuonline.com/health`
- **Swagger UI:** `https://api.meumuonline.com/api/docs` (em breve)
- **Postman Collection:** [Download](./postman-collection.json)

---

## 📞 Suporte

- **Discord:** https://discord.gg/meumuonline
- **Email:** api@meumuonline.com
- **GitHub Issues:** https://github.com/seu-repo/issues

---

**Última atualização:** 21 de dezembro de 2024  
**Versão da API:** 1.0.0
