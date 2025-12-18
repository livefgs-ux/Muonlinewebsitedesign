# 🚀 Guia de Deploy - MeuMU Online

## 📋 Checklist Pré-Deploy

Antes de fazer deploy, certifique-se de que:

### ✅ Assets
- [ ] `hero-background.png` adicionado em `/public/assets/backgrounds/`
- [ ] `character-example.png` adicionado em `/public/assets/images/`
- [ ] Executou `./verify-assets.sh` sem erros

### ✅ Configuração
- [ ] Arquivo `.env` configurado com credenciais corretas
- [ ] Banco MySQL acessível remotamente
- [ ] Supabase configurado (se usar backend)

### ✅ Build
- [ ] `npm install` executado com sucesso
- [ ] `npm run build` concluído sem erros
- [ ] Testado localmente com `npm start`

---

## 🌐 Opções de Deploy

### 1. Vercel (Recomendado para Frontend)

#### Vantagens:
- ✅ Deploy automático via Git
- ✅ CDN global
- ✅ SSL gratuito
- ✅ Preview de branches
- ✅ Otimização automática

#### Passos:

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy em produção
vercel --prod
```

#### Configuração `.vercelignore`:
```
node_modules
.next
.env.local
*.log
```

#### Variáveis de Ambiente no Vercel:
```
DB_HOST=23.321.231.227
DB_PORT=3306
DB_USER=root
DB_PASSWORD=***
DB_DATABASE_MU=muonline
DB_DATABASE_WEB=webmu
```

---

### 2. Netlify

#### Vantagens:
- ✅ Interface amigável
- ✅ Deploy automático
- ✅ Formulários integrados
- ✅ SSL gratuito

#### Passos:

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Inicializar
netlify init

# 4. Deploy
netlify deploy --prod
```

#### Arquivo `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. VPS/Dedicated Server (Controle Total)

#### Vantagens:
- ✅ Controle completo
- ✅ Sem limitações
- ✅ Ideal para backend Node.js
- ✅ Acesso direto ao MySQL

#### Requisitos:
- Ubuntu 20.04+ ou CentOS 8+
- Node.js 18+
- Nginx
- PM2
- MySQL (se não estiver em servidor separado)

#### Instalação no Servidor:

```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Instalar Nginx
sudo apt install nginx -y

# 5. Clone o projeto
git clone https://github.com/seu-usuario/meumu-online.git
cd meumu-online

# 6. Instalar dependências
npm install

# 7. Configurar .env
cp .env.example .env
nano .env

# 8. Adicionar assets manualmente
# (Faça upload das imagens via SCP/FTP)

# 9. Build
npm run build

# 10. Iniciar com PM2
pm2 start npm --name "meumu-online" -- start
pm2 save
pm2 startup
```

#### Configurar Nginx:

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/meumu-online
```

```nginx
server {
    listen 80;
    server_name meumu.com.br www.meumu.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Assets estáticos
    location /assets/ {
        alias /var/www/meumu-online/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/meumu-online /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Configurar SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d meumu.com.br -d www.meumu.com.br
```

---

### 4. Docker (Containerizado)

#### Vantagens:
- ✅ Ambiente consistente
- ✅ Fácil replicação
- ✅ Isolamento
- ✅ Portabilidade

#### Dockerfile:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy project files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### docker-compose.yml:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=23.321.231.227
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=123123123
      - DB_DATABASE_MU=muonline
      - DB_DATABASE_WEB=webmu
    volumes:
      - ./public/assets:/app/public/assets
    restart: unless-stopped
```

#### Deploy com Docker:

```bash
# Build
docker-compose build

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## 🔒 Segurança

### SSL/HTTPS
```bash
# Com Certbot (Let's Encrypt)
sudo certbot --nginx -d meumu.com.br
```

### Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### Variáveis de Ambiente
- ❌ NUNCA commite `.env` no Git
- ✅ Use variáveis de ambiente do provedor
- ✅ Use secrets managers para produção

### Headers de Segurança (Nginx):
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## 📊 Monitoramento

### PM2 Monitoring
```bash
# Dashboard em tempo real
pm2 monit

# Ver métricas
pm2 list

# Logs
pm2 logs meumu-online

# Reiniciar se usar muita memória
pm2 set pm2:autodump true
pm2 set pm2:watch true
```

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) - Gratuito
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

---

## 🎯 Performance

### Otimização de Assets
```bash
# Instalar ferramentas
npm install -g sharp-cli imagemin-cli

# Otimizar imagens
imagemin public/assets/backgrounds/* --out-dir=public/assets/backgrounds/
imagemin public/assets/images/* --out-dir=public/assets/images/
```

### CDN
Configure CDN para assets estáticos:
- Cloudflare (Recomendado, plano gratuito)
- AWS CloudFront
- Azure CDN

### Caching
```nginx
# Nginx - Cache de assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Build Falha
```bash
# Limpar cache
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Porta em Uso
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 PID
```

### Erro de Memória
```bash
# Aumentar limite Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 📝 Checklist Pós-Deploy

- [ ] Site acessível via HTTPS
- [ ] Assets carregando corretamente
- [ ] Rankings atualizando
- [ ] Login funcionando
- [ ] Eventos com countdown correto
- [ ] AdminCP acessível (apenas admin)
- [ ] Multilíngue funcionando
- [ ] Mobile responsivo
- [ ] Performance > 90 (Google PageSpeed)
- [ ] Backup configurado
- [ ] Monitoramento ativo

---

## 🔄 Backup

### Automático (Cron)
```bash
# Editar crontab
crontab -e

# Backup diário às 3h
0 3 * * * /caminho/para/backup-script.sh
```

### Script de Backup:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/meumu-online"

# Backup de arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/meumu-online

# Backup do MySQL
mysqldump -h 23.321.231.227 -u root -p123123123 muonline > $BACKUP_DIR/db_muonline_$DATE.sql
mysqldump -h 23.321.231.227 -u root -p123123123 webmu > $BACKUP_DIR/db_webmu_$DATE.sql

# Manter apenas últimos 7 dias
find $BACKUP_DIR -mtime +7 -delete
```

---

## 📞 Suporte

Após o deploy, se encontrar problemas:

1. Verifique logs: `pm2 logs` ou Vercel/Netlify dashboard
2. Consulte [INSTALACAO.md](INSTALACAO.md)
3. Execute `./verify-assets.sh`
4. Entre em contato com suporte

---

**Boa sorte com o deploy! 🚀**
