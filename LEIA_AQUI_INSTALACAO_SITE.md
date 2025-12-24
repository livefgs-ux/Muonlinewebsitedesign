# 🎮 ONDE ESTÁ O SITE? INSTALAÇÃO DO FRONTEND

## ✅ SITUAÇÃO ATUAL

- ✅ **Backend Node.js**: Instalado e funcionando na porta 3001
- ✅ **Banco de dados**: Conectado (muonline + webmu)
- ✅ **18 endpoints REST**: Funcionando 100%
- ❌ **Frontend React**: Ainda não instalado no servidor

---

## 🎯 O QUE VOCÊ PRECISA FAZER

O frontend completo já está **AQUI NO FIGMA MAKE**, mas precisa ser copiado para o servidor e buildado.

---

## 🚀 OPÇÃO 1: INSTALAÇÃO AUTOMÁTICA (RECOMENDADO)

### Passo 1: Baixar o projeto do Figma Make

1. Clique no botão **"Download"** (canto superior direito)
2. Aguarde o download do arquivo ZIP
3. Extraia o ZIP em seu computador

### Passo 2: Criar pasta no servidor

Execute no SSH:

```bash
mkdir -p /home/meumu.com/public_html/frontend
chmod 777 /home/meumu.com/public_html/frontend
```

### Passo 3: Copiar arquivos para o servidor

**Via FileZilla (mais fácil):**

1. Abra FileZilla
2. Conecte ao servidor:
   - Host: `sftp://meumu.com`
   - Usuário: `root`
   - Senha: (sua senha SSH)
   - Porta: `22`

3. Navegue até `/home/meumu.com/public_html/frontend/` (lado direito)
4. Selecione TODOS os arquivos da pasta extraída (lado esquerdo)
5. Arraste para a direita e aguarde upload (5-10 min)

**OU via SCP (Linux/Mac):**

```bash
cd /pasta/onde/extraiu
scp -r * root@meumu.com:/home/meumu.com/public_html/frontend/
```

### Passo 4: Executar instalação automática

No SSH:

```bash
# Baixar script de instalação
cd /home/meumu.com/public_html/frontend

# Criar script
cat > instalar.sh << 'EOF'
#!/bin/bash
echo "Instalando dependências..."
npm install --legacy-peer-deps
echo "Buildando frontend..."
npm run build
echo "Copiando para backend..."
rm -rf ../backend-nodejs/dist
cp -r dist ../backend-nodejs/
echo "Configurando .env..."
cd ../backend-nodejs
echo "INSTALLATION_COMPLETE=true" >> .env
echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com" >> .env
rm -rf install
echo "Reiniciando backend..."
pm2 restart meumu-backend
pm2 save
echo "✅ CONCLUÍDO! Acesse: http://meumu.com:3001"
EOF

# Executar
chmod +x instalar.sh
./instalar.sh
```

Aguarde ~5 minutos e pronto!

---

## 🚀 OPÇÃO 2: PASSO A PASSO MANUAL

Se preferir fazer manualmente:

### 1. Instalar dependências

```bash
cd /home/meumu.com/public_html/frontend
npm install --legacy-peer-deps
```

(Aguarde 3-5 minutos)

### 2. Buildar frontend

```bash
npm run build
```

(Aguarde 1-2 minutos)

### 3. Copiar para backend

```bash
rm -rf /home/meumu.com/public_html/backend-nodejs/dist
cp -r dist /home/meumu.com/public_html/backend-nodejs/
```

### 4. Configurar .env

```bash
cd /home/meumu.com/public_html/backend-nodejs
echo "INSTALLATION_COMPLETE=true" >> .env
echo "ALLOWED_ORIGINS=http://meumu.com:3001,http://meumu.com" >> .env
```

### 5. Remover instalador

```bash
rm -rf /home/meumu.com/public_html/backend-nodejs/install
```

### 6. Reiniciar backend

```bash
pm2 restart meumu-backend
pm2 save
```

---

## 🌐 ACESSAR O SITE

Após a instalação:

```
http://meumu.com:3001
```

Você verá:

- ✅ Página inicial com tema Dark Medieval Fantasy
- ✅ Login/Cadastro funcionando
- ✅ Rankings em tempo real
- ✅ Sistema de reset
- ✅ Dashboard do jogador
- ✅ Loja de WCoin
- ✅ Notícias e eventos
- ✅ Multilíngue (PT/EN/ES)

---

## 🐛 ERROS COMUNS

### "npm: command not found"

Instale Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Deve mostrar v20.x
```

### "dist não copiado"

Verifique se o build funcionou:

```bash
ls -la /home/meumu.com/public_html/frontend/dist/
```

Se vazio, rebuilde:

```bash
cd /home/meumu.com/public_html/frontend
rm -rf dist
npm run build
```

### "Página em branco"

Veja os logs:

```bash
pm2 logs meumu-backend --lines 30
```

E no navegador, abra F12 → Console

---

## 🎨 O QUE ESTÁ INCLUÍDO NO FRONTEND

✅ **Sistema de Login/Cadastro**
   - JWT Authentication
   - Validação em tempo real
   - Recuperação de senha

✅ **Dashboard do Jogador**
   - Lista de personagens
   - Informações da conta
   - Histórico de ações

✅ **Sistema de Reset**
   - Reset de personagem
   - Distribuição de pontos
   - Histórico de resets

✅ **Rankings em Tempo Real**
   - Top Players (por nível)
   - Top Guilds
   - Top PK (assassinos)
   - Top Gens

✅ **Loja de WCoin**
   - Pacotes configuráveis
   - Integração com PagSeguro/MercadoPago
   - Histórico de compras

✅ **Notícias & Eventos**
   - Sistema de notícias
   - Cronômetros de eventos
   - Calendário

✅ **Design Premium**
   - Tema Dark Medieval Fantasy
   - Glassmorphism moderno
   - Paleta: Obsidian + Dourado + Azul Etéreo
   - 100% Responsivo

✅ **Multilíngue**
   - Português
   - English
   - Español

✅ **100% REAL**
   - Nenhuma função Mock
   - Conecta direto ao MariaDB
   - Dados reais em tempo real

---

## 📞 PRECISA DE AJUDA?

Me mostre:

1. Output de:
   ```bash
   ls -la /home/meumu.com/public_html/frontend/
   ```

2. Logs do backend:
   ```bash
   pm2 logs meumu-backend --lines 30
   ```

3. Screenshot do navegador (F12 → Console)

---

**VAMOS LÁ! 🚀🎮**
