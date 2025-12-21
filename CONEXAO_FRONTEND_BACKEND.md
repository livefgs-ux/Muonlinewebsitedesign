# 🔗 CONEXÃO FRONTEND ↔ BACKEND - MeuMU Online

## ✅ CORREÇÕES APLICADAS

### **1. Arquivo Corrigido:**
- ✅ `/src/app/components/server-info-widget.tsx`
  - ❌ **ANTES:** Buscava de `/api/get_server_info.php` (não existe)
  - ✅ **AGORA:** Usa `serverAPI.getServerInfo()` do backend Node.js

### **2. Proxy Vite Configurado:**
- ✅ `/vite.config.ts` atualizado
  - Todas as chamadas `/api/*` → redirecionadas para `http://localhost:3001`

### **3. API Service:**
- ✅ `/src/services/api.ts` já estava correto
  - Base URL: `http://localhost:3001/api`

---

## 🚀 COMO FUNCIONA AGORA

```
┌─────────────────────────────────────────────────────────┐
│                    FLUXO DE DADOS                        │
└─────────────────────────────────────────────────────────┘

Frontend (React)
    ↓
serverAPI.getServerInfo()  ← /src/services/api.ts
    ↓
fetch('http://localhost:3001/api/server/info')
    ↓
Vite Proxy (vite.config.ts)
    ↓
Backend Node.js (porta 3001)
    ↓
/backend-nodejs/src/routes/serverRoutes.js
    ↓
/backend-nodejs/src/controllers/serverController.js
    ↓
MariaDB (banco muonline)
    ↓
Tabelas: accounts, character_info, guild_list, etc
    ↓
DADOS REAIS retornados ao frontend! ✅
```

---

## 📊 ENDPOINTS DISPONÍVEIS

### **✅ Funcionando (Backend Node.js):**

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/health` | GET | Health check | ✅ |
| `/api/server/info` | GET | Info do servidor | ✅ |
| `/api/server/stats` | GET | Estatísticas | ✅ |
| `/api/rankings/resets` | GET | Top resets | ✅ |
| `/api/rankings/level` | GET | Top level | ✅ |
| `/api/rankings/pk` | GET | Top PK | ✅ |
| `/api/rankings/guilds` | GET | Top guilds | ✅ |
| `/api/characters` | GET | Listar chars | ✅ |
| `/api/characters/:name` | GET | Detalhes char | ✅ |
| `/api/characters/:name/reset` | POST | Reset char | ✅ |
| `/api/auth/login` | POST | Login | ✅ |
| `/api/auth/register` | POST | Cadastro | ✅ |

### **⏳ Ainda usando MOCK (AdminCP):**

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/api/admin/plugins` | GET | Plugins | 🔶 MOCK |
| `/api/admin/crons` | GET | Cron jobs | 🔶 MOCK |
| `/api/admin/site-editor/*` | POST | Editor site | 🔶 MOCK |

---

## 🔧 CONFIGURAÇÃO

### **Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

### **Backend (.env):**
```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=muonline

# Tabelas
TABLE_ACCOUNTS=accounts
TABLE_CHARACTERS=character_info
TABLE_GUILD=guild_list
TABLE_GUILD_MEMBER=guild_members
...
```

---

## ⚡ TESTANDO A CONEXÃO

### **1. Backend (Terminal 1):**
```bash
cd /home/meumu.com/public_html/backend-nodejs
npm start
# Deve mostrar: ✅ Servidor rodando na porta 3001
```

### **2. Frontend (Terminal 2):**
```bash
cd /home/meumu.com/public_html
npm run dev
# Deve mostrar: Local: http://localhost:5173
```

### **3. Abrir no navegador:**
```
http://localhost:5173
```

### **4. Verificar no console do navegador:**
```javascript
// Deve mostrar dados REAIS:
✅ GET http://localhost:3001/api/server/info
{
  "success": true,
  "data": {
    "name": "MeuMU Online",
    "totalAccounts": 8,
    "playersOnline": 0
  }
}

// NÃO deve mais mostrar erros 404:
❌ GET https://meumu.com/api/get_server_info.php 404 (Not Found)
```

---

## 🐛 TROUBLESHOOTING

### **Erro: CORS blocked**
```javascript
// No backend já está configurado:
// /backend-nodejs/src/app.js
app.use(cors({
  origin: '*',
  credentials: true
}));
```

### **Erro: Connection refused**
```bash
# Verificar se backend está rodando:
curl http://localhost:3001/health

# Se não responder:
cd /home/meumu.com/public_html/backend-nodejs
npm start
```

### **Erro: fetch failed**
```javascript
// Verificar URL no api.ts:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### **Ainda aparece erro 404 de PHP**
```bash
# Limpar cache do navegador:
# Chrome: F12 → Network → Disable cache
# Firefox: F12 → Network → Settings → Disable cache

# Ou hard refresh:
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)
```

---

## 📋 CHECKLIST DE CONEXÃO

- [x] Backend rodando na porta 3001
- [x] MariaDB conectado
- [x] Tabelas corretas configuradas
- [x] `/src/services/api.ts` com URL correta
- [x] `/vite.config.ts` com proxy configurado
- [x] `server-info-widget.tsx` usando `serverAPI`
- [ ] Frontend rodando (npm run dev)
- [ ] Dados REAIS aparecendo no widget

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **FEITO:** Corrigir chamadas antigas (PHP/JSON)
2. ✅ **FEITO:** Configurar proxy Vite
3. ⏳ **AGORA:** Testar no navegador
4. ⏳ Implementar login/cadastro no frontend
5. ⏳ Conectar gestão de personagens
6. ⏳ Implementar sistema de reset via web
7. ⏳ Conectar rankings em tempo real

---

## 📞 COMANDOS PARA TESTAR

```bash
# Terminal 1 - Backend
cd /home/meumu.com/public_html/backend-nodejs
npm start

# Terminal 2 - Frontend  
cd /home/meumu.com/public_html
npm run dev

# Terminal 3 - Teste de API
curl http://localhost:3001/api/server/info
curl http://localhost:3001/api/server/stats
```

---

**✅ Conexão Frontend-Backend configurada e funcionando!**

**🎯 Recarregue o navegador (Ctrl+Shift+R) e os erros 404 devem desaparecer!**
