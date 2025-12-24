# 🎮 INSTALAÇÃO COMPLETA DO SITE MEUMU ONLINE

## ✅ PASSO 1: PREPARAR SERVIDOR (SSH)

Execute no servidor:

```bash
cd /home/meumu.com/public_html/backend-nodejs && cat > preparar-frontend.sh << 'EOF'
#!/bin/bash
cd /home/meumu.com/public_html
mkdir -p frontend
chmod 777 frontend
echo "✅ Pasta /home/meumu.com/public_html/frontend criada!"
echo "Agora copie os arquivos do Figma Make para esta pasta"
EOF

chmod +x preparar-frontend.sh && ./preparar-frontend.sh
```

---

## 📦 PASSO 2: BAIXAR FRONTEND DO FIGMA MAKE

No Figma Make, clique em **"Download"** (canto superior direito) e baixe TODO o projeto.

---

## 🚀 PASSO 3: COPIAR PARA O SERVIDOR

### Opção A: Via SCP (Linux/Mac)

```bash
cd /pasta/onde/baixou/o/projeto
scp -r * root@meumu.com:/home/meumu.com/public_html/frontend/
```

### Opção B: Via FileZilla (Windows/Linux/Mac)

1. Abra FileZilla
2. Conecte:
   - **Host:** sftp://meumu.com
   - **Usuário:** root
   - **Senha:** [sua senha]
   - **Porta:** 22

3. Na janela DIREITA (servidor), navegue para:
   ```
   /home/meumu.com/public_html/frontend/
   ```

4. Na janela ESQUERDA (local), selecione TODOS os arquivos do projeto baixado

5. Arraste para a direita e aguarde o upload (pode demorar 5-10 minutos)

---

## 🔧 PASSO 4: BUILDAR E INSTALAR (SSH)

Execute no servidor:

```bash
cd /home/meumu.com/public_html/frontend

# Instalar dependências (demora ~3 minutos)
npm install --legacy-peer-deps

# Buildar (demora ~1 minuto)
npm run build

# Copiar para backend
rm -rf /home/meumu.com/public_html/backend-nodejs/dist
cp -r dist /home/meumu.com/public_html/backend-nodejs/

# Remover pasta /install (ativa proteção CORS)
rm -rf /home/meumu.com/public_html/backend-nodejs/install

# Marcar instalação como completa no .env
echo "INSTALLATION_COMPLETE=true" >> /home/meumu.com/public_html/backend-nodejs/.env

# Reiniciar backend
cd /home/meumu.com/public_html/backend-nodejs
pm2 restart meumu-backend
pm2 save
```

---

## 🌐 PASSO 5: ACESSAR O SITE

Abra no navegador:

```
http://meumu.com:3001
```

Você deve ver o site completo funcionando!

---

## 🔒 PASSO 6: CONFIGURAR DOMÍNIO PRINCIPAL (OPCIONAL)

Se quiser acessar em `http://meumu.com` (sem :3001), configure proxy reverso no CyberPanel:

1. **CyberPanel → Websites → meumu.com → Rewrite Rules**

2. Adicione:
   ```nginx
   location / {
       proxy_pass http://localhost:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

3. **Save → Restart OpenLiteSpeed**

4. Acesse: `http://meumu.com` (sem porta!)

---

## 🎯 FUNCIONALIDADES INCLUÍDAS

✅ **Login/Cadastro** com JWT
✅ **Dashboard do Jogador**
✅ **Rankings em Tempo Real** (Players, Guilds, PK)
✅ **Sistema de Reset de Personagem**
✅ **Loja de WCoin**
✅ **Notícias e Eventos**
✅ **Cronômetros de Eventos**
✅ **Multilíngue** (PT/EN/ES)
✅ **Tema Dark Medieval Fantasy** com glassmorphism
✅ **100% Responsivo**
✅ **100% REAL** conectado ao MariaDB

---

## 🐛 TROUBLESHOOTING

### Erro "API não responde"

```bash
# Ver logs do backend
pm2 logs meumu-backend --lines 50

# Verificar se está rodando
pm2 status

# Reiniciar
pm2 restart meumu-backend
```

### Erro "CORS bloqueado"

```bash
# Verificar .env
cat /home/meumu.com/public_html/backend-nodejs/.env

# Deve conter:
# INSTALLATION_COMPLETE=true
# ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com
```

### Página em branco

```bash
# Verificar se dist foi copiado
ls -la /home/meumu.com/public_html/backend-nodejs/dist/

# Se vazio, rebuildar:
cd /home/meumu.com/public_html/frontend
npm run build
cp -r dist /home/meumu.com/public_html/backend-nodejs/
pm2 restart meumu-backend
```

---

## 📞 PRECISA DE AJUDA?

Me mostre:

1. Output de `pm2 logs meumu-backend --lines 30`
2. Screenshot do erro no navegador (F12 → Console)
3. Output de `ls -la /home/meumu.com/public_html/backend-nodejs/dist/`

---

**BOA SORTE! 🎮🚀**
