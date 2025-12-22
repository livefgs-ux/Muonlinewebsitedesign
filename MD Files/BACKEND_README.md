# MeuMU Online - Backend Node.js

API REST para servidor MU Online Season 19-2-3.

## 📦 Estrutura

```
backend-nodejs/
├── src/
│   ├── server.js           # Servidor Express
│   ├── config/             # Configurações
│   ├── routes/             # Rotas da API
│   ├── controllers/        # Controllers
│   └── middleware/         # Middlewares
├── database/               # SQL schemas
├── package.json
└── .env                    # Configurações (gerado pelo instalador)
```

## 🚀 Iniciar

```bash
cd backend-nodejs
npm install
pm2 start src/server.js --name meumu-backend
```

## 📡 Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/server/info` - Info do servidor
- `GET /api/rankings/*` - Rankings
- `GET /api/characters/*` - Personagens
- E mais...

## 🔧 Configuração

O arquivo `.env` é gerado automaticamente pelo instalador web.

Caso precise editar manualmente:

```env
# Database MU (Readonly)
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=root
DB_MU_PASSWORD=senha
DB_MU_NAME=muonline

# Database Web (Read/Write)
DB_WEB_HOST=127.0.0.1
DB_WEB_PORT=3306
DB_WEB_USER=root
DB_WEB_PASSWORD=senha
DB_WEB_NAME=webmu

# Servidor
PORT=3001
JWT_SECRET=seu_secret_aqui
```

## 🔍 Verificar Status

```bash
pm2 status
pm2 logs meumu-backend
```

## 📚 Documentação Completa

Veja `/README-INSTALL.md` no diretório raiz.
