# ⚡ Quick Start - MeuMU Online

**Comece em 5 minutos!**

---

## 🎯 Passo a Passo Rápido

### 1️⃣ Pré-requisitos (1 minuto)

```bash
# Verificar se Node.js está instalado
node -v  # Deve ser 18.x ou superior

# Se não tiver, instale em: https://nodejs.org/
```

### 2️⃣ Instalação Automática (2 minutos)

```bash
# Clone ou extraia o projeto
cd meumu-online

# Dê permissão aos scripts
chmod +x install.sh verify-assets.sh

# Execute o instalador
./install.sh
```

O script vai pedir:
- Host do MySQL (padrão: 23.321.231.227)
- Usuário (padrão: root)
- Senha (padrão: 123123123)
- Nome dos bancos (muonline, webmu)

**Apenas pressione ENTER para usar os valores padrão!**

### 3️⃣ Adicionar Imagens (1 minuto)

⚠️ **IMPORTANTE:** Adicione estas 2 imagens manualmente:

```bash
# 1. Background principal
# Copie sua imagem para:
public/assets/backgrounds/hero-background.png

# 2. Exemplo de personagem (opcional)
# Copie sua imagem para:
public/assets/images/character-example.png
```

💡 **Dica:** Se não tiver as imagens do Figma, use qualquer imagem dark medieval fantasy por enquanto.

### 4️⃣ Verificar Tudo (30 segundos)

```bash
./verify-assets.sh
```

Se aparecer "✅ PERFEITO!", está tudo certo!

### 5️⃣ Iniciar o Site (30 segundos)

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🎉 Pronto!

Seu site está rodando! Agora você pode:

- ✅ Navegar pelas páginas
- ✅ Testar o sistema multilíngue (topo direito)
- ✅ Fazer login no dashboard
- ✅ Acessar o AdminCP (se for admin)

---

## 🔧 Comandos Úteis

```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Verificar assets
./verify-assets.sh

# Ver logs (se usar PM2)
pm2 logs meumu-online
```

---

## ❓ Problemas?

### ❌ "Cannot find module 'figma:asset'"
```bash
# Execute:
grep -r "figma:asset" ./src

# Se encontrar, os arquivos não foram atualizados corretamente
```

### ❌ Imagens não aparecem
```bash
# Verifique se as imagens existem:
ls public/assets/backgrounds/hero-background.png
ls public/assets/images/character-example.png

# Se não existirem, adicione manualmente
```

### ❌ Erro de conexão MySQL
```bash
# Teste a conexão:
mysql -h 23.321.231.227 -u root -p123123123 muonline

# Verifique o .env:
cat .env | grep DB_
```

### ❌ Porta 3000 em uso
```bash
# Encontre o processo:
lsof -i :3000

# Mate o processo:
kill -9 PID

# Ou mude a porta no .env:
PORT=3001
```

---

## 📚 Documentação Completa

- 📖 [INSTALACAO.md](INSTALACAO.md) - Guia detalhado de instalação
- 🎨 [ASSETS_MAPPING.md](ASSETS_MAPPING.md) - Mapeamento de assets
- 🚀 [DEPLOY.md](DEPLOY.md) - Como fazer deploy em produção
- 📝 [README.md](README.md) - Documentação geral

---

## 🎮 Testando Funcionalidades

### Login de Teste
```
Usuário: SaulNoob
Senha: (qualquer coisa)
```

### Acessar AdminCP
1. Faça login
2. O menu AdminCP aparece automaticamente se você for admin
3. Crie/edite notícias

### Testar Multilíngue
1. Clique na bandeira no topo direito
2. Selecione outro idioma
3. Todo o site muda instantaneamente

### Ver Rankings
1. Navegue até "Ranking"
2. Veja os top players (dados reais do MySQL)
3. Use os filtros

---

## 🚀 Deploy em Produção

### Vercel (mais fácil)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### VPS/Servidor Próprio
```bash
# Instalar PM2
npm install -g pm2

# Build
npm run build

# Iniciar
pm2 start npm --name "meumu-online" -- start
pm2 save
```

Ver guia completo em: [DEPLOY.md](DEPLOY.md)

---

## 💡 Dicas

### Performance
- Otimize imagens antes de adicionar (use TinyPNG)
- Use CDN em produção (Cloudflare gratuito)
- Configure cache no Nginx/Apache

### Segurança
- Nunca commite o arquivo `.env`
- Use HTTPS em produção
- Configure firewall no servidor

### Manutenção
- Faça backup diário do banco MySQL
- Monitore logs com PM2 ou Vercel
- Use sistema de uptime monitoring

---

## 🎯 Próximos Passos

1. ✅ Personalize as cores no `/src/styles/theme.css`
2. ✅ Adicione suas próprias notícias via AdminCP
3. ✅ Configure eventos do servidor
4. ✅ Customize textos e traduções
5. ✅ Teste em diferentes dispositivos
6. ✅ Configure domínio próprio
7. ✅ Faça deploy em produção

---

## 📞 Precisa de Ajuda?

- 📧 Email: suporte@meumu.com.br
- 💬 Discord: MeuMU Online Community
- 📱 WhatsApp: Grupo Oficial

---

**Desenvolvido para MeuMU Online - Season 19-2-3 Épico**

⚔️ Entre na lenda. Domine os reinos. Torne-se imortal. 🎮
