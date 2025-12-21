# ⚡ Quick Reference - MeuMU Online

**Guia rápido de referência para desenvolvedores**

---

## 🚀 Início Rápido

### 1. Instalação Rápida
```bash
# Clone o repositório
git clone <repo-url>

# Instale dependências do frontend
npm install

# Entre no backend
cd backend-nodejs
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do MariaDB

# Inicie o backend
npm start

# Em outro terminal, inicie o frontend
cd ..
npm run dev
```

### 2. URLs Padrão
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **AdminCP:** http://localhost:5173/admin

---

## 📁 Arquivos Importantes

### Configuração
```
/backend-nodejs/.env              # Config do backend
/src/app/config/api.ts           # Config da API frontend
/src/app/config/backend.ts       # Config backend centralizada
/backend-nodejs/src/config/database.js  # Config do DB
```

### Documentação
```
/README.md                        # Visão geral
/INSTALLATION.md                  # Instalação detalhada
/API_DOCUMENTATION.md             # Endpoints da API
/PROJECT_STATUS.md                # Status completo
/QUICK_REFERENCE.md               # Este arquivo
```

### Scripts
```
/installation/install.sh          # Instalação automática
/installation/setup-database.sh   # Setup do DB
/installation/backup.sh           # Backup automático
```

---

## 🔧 Comandos Úteis

### Frontend
```bash
npm run dev          # Dev server (Vite)
npm run build        # Build produção
npm run preview      # Preview do build
npm run lint         # Linter
```

### Backend
```bash
npm start            # Iniciar servidor (PM2)
npm run dev          # Dev mode (nodemon)
npm stop             # Parar PM2
npm run logs         # Ver logs
npm restart          # Reiniciar
```

### Database
```bash
# Criar tabelas customizadas
mysql -u root -p MuOnline < backend-nodejs/database/01_create_news.sql

# Backup manual
mysqldump -u root -p MuOnline > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p MuOnline < backup_20241221.sql
```

---

## 🔗 Endpoints Principais

### Autenticação
```
POST   /api/auth/login         # Login
POST   /api/auth/register      # Registro
GET    /api/auth/verify        # Verificar token
```

### Player
```
GET    /api/player/characters              # Listar chars
GET    /api/player/character/:name         # Detalhes
POST   /api/player/character/:name/add-stats  # Distribuir pontos
POST   /api/player/character/:name/reset   # Reset
```

### Rankings
```
GET    /api/rankings/players   # Top players
GET    /api/rankings/guilds    # Top guilds
GET    /api/rankings/killers   # Top killers
```

### Admin
```
GET    /api/news               # Listar notícias
POST   /api/news               # Criar (admin)
PUT    /api/news/:id           # Editar (admin)
DELETE /api/news/:id           # Deletar (admin)
```

---

## 🎨 Componentes Principais

### Frontend Structure
```
src/app/
├── components/
│   ├── admincp/              # AdminCP completo
│   │   ├── AdminCPLayout.tsx
│   │   ├── sections/         # Seções do admin
│   │   └── ...
│   ├── hero-section.tsx      # Hero do site
│   ├── navigation.tsx        # Menu principal
│   ├── login-section.tsx     # Login/Register
│   ├── player-dashboard.tsx  # Dashboard do player
│   └── ui/                   # Componentes shadcn/ui
├── contexts/                 # Context providers
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── NewsContext.tsx
└── App.tsx                   # Componente principal
```

### Backend Structure
```
backend-nodejs/src/
├── config/
│   ├── database.js           # Config DB
│   └── auth.js               # Config JWT
├── controllers/              # Lógica de negócio
│   ├── authController.js
│   ├── charactersController.js
│   ├── newsController.js
│   └── ...
├── routes/                   # Definição de rotas
│   ├── auth.js
│   ├── characters.js
│   └── ...
├── middleware/               # Middlewares
│   ├── auth-middleware.js
│   └── error-handler.js
└── server.js                 # Entry point
```

---

## 🗃️ Tabelas do Banco

### Tabelas do Jogo (Mu Online)
```
MEMB_INFO          # Contas de usuários
Character          # Personagens
Guild              # Guildas
GuildMember        # Membros de guildas
warehouse          # Warehouse/storage
```

### Tabelas Customizadas
```
muonline_news              # Sistema de notícias
muonline_events            # Eventos do servidor
muonline_wcoin_packages    # Pacotes de doação
muonline_admin_logs        # Logs de admin
muonline_admin_users       # Admins
```

---

## 🔐 Autenticação

### Login Flow
```
1. User envia credenciais → POST /api/auth/login
2. Backend valida no MEMB_INFO
3. Se válido, retorna JWT token
4. Frontend armazena token no localStorage
5. Requisições futuras incluem token no header:
   Authorization: Bearer <token>
```

### Estrutura do Token JWT
```javascript
{
  userId: "username",
  role: "user" | "admin",
  iat: 1703174400,
  exp: 1703260800  // 24h depois
}
```

---

## 🎯 Variáveis de Ambiente

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=MuOnline

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (não precisa .env)
```typescript
// Configuração em /src/app/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 30000
};
```

---

## 🐛 Debug Comum

### Frontend não conecta ao backend?
```bash
# Verifique se o backend está rodando
curl http://localhost:3001/api/status

# Verifique CORS no backend
# backend-nodejs/src/server.js deve ter:
app.use(cors({ origin: 'http://localhost:5173' }));

# Verifique URL em /src/app/config/api.ts
```

### Erro de conexão com DB?
```bash
# Teste conexão
mysql -u root -p -h localhost MuOnline

# Verifique credenciais em backend-nodejs/.env

# Verifique se MariaDB está rodando
systemctl status mariadb  # Linux
# ou
net start MySQL  # Windows
```

### Token JWT inválido?
```javascript
// Limpe localStorage
localStorage.clear();

// Faça login novamente

// Verifique se JWT_SECRET é o mesmo no backend
```

---

## 📊 Monitora mento

### PM2 (Backend)
```bash
pm2 list              # Lista processos
pm2 logs muonline     # Ver logs ao vivo
pm2 monit             # Monitor interativo
pm2 restart muonline  # Reiniciar
pm2 stop muonline     # Parar
pm2 delete muonline   # Remover
```

### Logs
```bash
# Backend logs
tail -f backend-nodejs/logs/app.log

# Nginx logs (se usando)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PM2 logs
pm2 logs muonline --lines 100
```

---

## 🚀 Deploy Produção

### 1. Build Frontend
```bash
npm run build
# Arquivos gerados em /dist
```

### 2. Copiar para servidor
```bash
# Via SCP
scp -r dist/ user@server:/var/www/muonline/

# Ou via Git
git pull origin main
npm run build
```

### 3. Nginx Config
```nginx
server {
    listen 80;
    server_name seudominio.com;
    
    root /var/www/muonline/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Iniciar Backend
```bash
cd backend-nodejs
npm start  # PM2
```

### 5. SSL (Certbot)
```bash
sudo certbot --nginx -d seudominio.com
```

---

## 🔒 Segurança Checklist

- [x] Senhas hasheadas (bcrypt)
- [x] JWT para autenticação
- [x] HTTPS em produção
- [x] SQL Injection prevention (prepared statements)
- [x] XSS protection
- [x] CORS configurado
- [x] Rate limiting
- [x] Input validation
- [x] Admin audit logs
- [x] Environment variables (.env)

---

## 📞 Troubleshooting

### "Cannot connect to database"
1. Verifique se MariaDB está rodando
2. Confirme credenciais em `.env`
3. Teste conexão: `mysql -u root -p`
4. Verifique firewall

### "CORS error"
1. Verifique `CORS_ORIGIN` em backend `.env`
2. Confirme URL do frontend em `cors()` config
3. Reinicie o backend

### "401 Unauthorized"
1. Token expirado? Faça login novamente
2. Token inválido? Limpe `localStorage`
3. Endpoint requer admin? Verifique role

### "Build falha"
1. `rm -rf node_modules && npm install`
2. `npm run build -- --verbose`
3. Verifique erros de TypeScript

---

## 📚 Links Úteis

- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **Express.js:** https://expressjs.com
- **MariaDB:** https://mariadb.org
- **PM2:** https://pm2.keymetrics.io

---

## 🎓 Estrutura de Pastas Explicada

```
/
├── backend-nodejs/        # 🔧 Backend Node.js
│   ├── src/              # Código fonte
│   ├── database/         # Scripts SQL
│   └── logs/             # Arquivos de log
│
├── src/                  # 🎨 Frontend React
│   ├── app/              # Código da aplicação
│   ├── services/         # Serviços de API
│   ├── styles/           # CSS global
│   └── types/            # TypeScript types
│
├── installation/         # 📦 Scripts de instalação
├── guidelines/           # 📖 Diretrizes
│
└── Documentação/         # 📚 Docs do projeto
    ├── README.md
    ├── INSTALLATION.md
    ├── API_DOCUMENTATION.md
    └── QUICK_REFERENCE.md  # 👈 Você está aqui
```

---

## ⚡ Performance Tips

### Frontend
- Use `React.memo()` para componentes pesados
- Lazy load routes com `React.lazy()`
- Debounce inputs de busca
- Virtualize listas longas (rankings)

### Backend
- Use connection pooling (já configurado)
- Implemente cache com Redis (opcional)
- Otimize queries SQL com EXPLAIN
- Use índices nas tabelas

### Database
```sql
-- Adicione índices para melhor performance
CREATE INDEX idx_character_name ON Character(Name);
CREATE INDEX idx_memb_id ON MEMB_INFO(memb___id);
```

---

## 🎯 Cheat Sheet

### Usuário Admin Padrão
```
Username: admin
Password: admin123
```
⚠️ **ALTERE EM PRODUÇÃO!**

### Criar novo admin
```sql
INSERT INTO muonline_admin_users (username, password_hash, role, created_at)
VALUES ('newadmin', '$2b$10$...', 'super_admin', NOW());
```

### Reset de senha de player
```sql
UPDATE MEMB_INFO 
SET memb__pwd = '0x...' -- Hash da nova senha
WHERE memb___id = 'username';
```

---

**📌 Mantenha este guia sempre à mão para referência rápida!**
