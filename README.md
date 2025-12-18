# 🎮 MeuMU Online - Website Oficial

![MeuMU Online](https://img.shields.io/badge/Season-19--2--3%20%C3%89pico-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=for-the-badge&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?style=for-the-badge&logo=mysql)

> Website completo para servidor privado de MU Online com tema Dark Medieval Fantasy, sistema de login/cadastro, gestão de personagens, rankings em tempo real e integração com banco de dados MySQL.

---

## ✨ Características Principais

### 🎨 Interface & Design
- ✅ **Dark Medieval Fantasy Theme** - Paleta obsidian, dourado e azul etéreo
- ✅ **Glassmorphism Effects** - Efeitos modernos de vidro e blur
- ✅ **Responsive Design** - Otimizado para desktop, tablet e mobile
- ✅ **Animações Fluidas** - Motion/React para transições suaves
- ✅ **Partículas Mágicas** - Efeitos visuais imersivos

### 🌍 Sistema Multilíngue
- ✅ **8 Idiomas Suportados:**
  - 🇧🇷 Português
  - 🇺🇸 English
  - 🇪🇸 Español
  - 🇷🇺 Русский
  - 🇹🇷 Türkçe
  - 🇵🇱 Polski
  - 🇩🇪 Deutsch
  - 🇫🇷 Français

### 🔐 Sistema de Autenticação
- ✅ Login/Cadastro seguro com Supabase
- ✅ Recuperação de senha
- ✅ Sistema de sessões
- ✅ Níveis de acesso (User/Admin)

### 👤 Área do Jogador
- ✅ Dashboard personalizado
- ✅ Gestão de múltiplos personagens
- ✅ Distribuição de pontos via web
- ✅ Sistema de reset online
- ✅ Histórico de personagens
- ✅ Status online/offline em tempo real

### 🏆 Rankings Dinâmicos
- ✅ **Top Resets** - Jogadores com mais resets
- ✅ **Top PK** - Maiores assassinos (PvP)
- ✅ **Top Guilds** - Guildas mais fortes
- ✅ **Top Events** - Campeões de eventos
- ✅ Atualização automática do banco MySQL
- ✅ Filtros e busca

### 📅 Sistema de Eventos
- ✅ **Cronômetros em Tempo Real** para eventos
- ✅ Blood Castle, Devil Square, Chaos Castle
- ✅ Golden Invasion, Castle Siege
- ✅ Contagem regressiva dinâmica
- ✅ Notificações visuais

### 📰 Sistema de Notícias
- ✅ AdminCP completo para gerenciar notícias
- ✅ Editor visual com links e imagens
- ✅ Publicação em Home e/ou página News
- ✅ Sistema de categorias
- ✅ Suporte a múltiplas imagens

### 📥 Área de Downloads
- ✅ Cliente completo do jogo
- ✅ Launcher automático
- ✅ Drivers e ferramentas
- ✅ Guias e tutoriais
- ✅ Status do servidor em tempo real

### 🔧 Painel Administrativo (AdminCP)
- ✅ Gerenciamento de notícias
- ✅ Gestão de eventos
- ✅ Moderação de usuários
- ✅ Estatísticas do servidor
- ✅ Logs e auditoria

### 💾 Integração com Banco de Dados
- ✅ **100% Dados Reais** do servidor MU Online
- ✅ Conexão MySQL para `muonline` e `webmu`
- ✅ Queries otimizadas
- ✅ Rankings automáticos
- ✅ Verificação de níveis para reset

---

## 🚀 Instalação Rápida

### Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- MySQL 5.7+ ou 8.0+
- Servidor MU Online rodando

### Método 1: Script Automático (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/meumu-online.git
cd meumu-online

# Dê permissão de execução
chmod +x install.sh

# Execute o instalador
./install.sh
```

### Método 2: Instalação Manual

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
nano .env

# Compilar projeto
npm run build

# Iniciar servidor
npm start
```

📚 **Documentação completa:** [INSTALACAO.md](INSTALACAO.md)

---

## 📁 Estrutura do Projeto

```
meumu-online/
├── public/
│   └── assets/
│       ├── backgrounds/        # Backgrounds do site
│       ├── images/             # Imagens gerais
│       └── icons/              # Ícones
├── src/
│   └── app/
│       ├── components/         # Componentes React
│       │   ├── hero-section.tsx
│       │   ├── rankings-section.tsx
│       │   ├── events-section.tsx
│       │   ├── downloads-section.tsx
│       │   ├── news-section.tsx
│       │   ├── dashboard-section.tsx
│       │   ├── admin-cp-section.tsx
│       │   └── shared-background.tsx
│       ├── contexts/           # Context API
│       │   ├── LanguageContext.tsx
│       │   └── NewsContext.tsx
│       └── styles/             # Estilos globais
├── supabase/                   # Backend Supabase
│   └── functions/
│       └── server/             # Edge Functions
├── .env.example                # Exemplo de configuração
├── install.sh                  # Script de instalação
├── verify-assets.sh            # Verificação de assets
├── INSTALACAO.md               # Guia de instalação
├── ASSETS_MAPPING.md           # Mapeamento de assets
└── README.md                   # Este arquivo
```

---

## ⚙️ Configuração

### Banco de Dados MySQL

Edite o arquivo `.env` com as credenciais do seu servidor:

```env
DB_HOST=23.321.231.227
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123123123
DB_DATABASE_MU=muonline
DB_DATABASE_WEB=webmu
```

### Assets e Imagens

⚠️ **IMPORTANTE:** O projeto requer 2 imagens que devem ser adicionadas manualmente:

1. **Background Principal**
   - Caminho: `/public/assets/backgrounds/hero-background.png`
   - Resolução: 1920x1080px ou maior

2. **Exemplo de Personagem**
   - Caminho: `/public/assets/images/character-example.png`
   - Resolução: 400x600px

📸 **Como obter:** Consulte [ASSETS_MAPPING.md](ASSETS_MAPPING.md)

---

## 🎯 Uso

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Produção

```bash
npm run build
npm start
```

### Com PM2 (Recomendado)

```bash
npm install -g pm2
pm2 start npm --name "meumu-online" -- start
pm2 save
```

---

## 🔍 Verificação de Assets

Antes de fazer deploy, execute:

```bash
chmod +x verify-assets.sh
./verify-assets.sh
```

Este script verifica:
- ✅ Remoção de imports `figma:asset/*`
- ✅ Estrutura de pastas correta
- ✅ Presença de imagens obrigatórias
- ✅ Arquivos de configuração
- ✅ Componentes atualizados

---

## 📊 Tecnologias Utilizadas

### Frontend
- **React 18.x** - Framework principal
- **TypeScript** - Type safety
- **Tailwind CSS 4.x** - Estilização
- **Motion/React** - Animações (Framer Motion)
- **Lucide React** - Ícones

### Backend
- **Supabase** - BaaS (Auth, Database, Functions)
- **MySQL** - Banco de dados MU Online
- **Hono** - Web framework para Edge Functions

### Ferramentas
- **Vite** - Build tool
- **ESLint** - Linting
- **Prettier** - Code formatting

---

## 🌟 Funcionalidades Detalhadas

### Página Inicial (Home)
- Hero section com background épico
- Estatísticas do servidor em tempo real
- Últimas notícias destacadas
- CTAs para download e eventos
- Scroll indicator animado

### Rankings
- 4 categorias de rankings
- Busca e filtros avançados
- Paginação otimizada
- Dados atualizados do MySQL
- Animações de entrada

### Eventos
- Timer countdown para cada evento
- Status (ativo/aguardando/concluído)
- Informações detalhadas
- Requisitos e recompensas
- Notificações visuais

### Downloads
- Links para cliente completo
- Launcher automático
- Drivers necessários
- Guias de instalação
- Verificação de integridade

### Notícias
- Sistema de publicação completo
- Suporte a imagens e links
- Categorização
- Autor e data de publicação
- Load more com paginação

### Dashboard do Jogador
- Login/cadastro seguro
- Múltiplos personagens
- Distribuição de pontos online
- Sistema de reset verificado
- Histórico de login
- Funções administrativas

### AdminCP
- Criar/editar/deletar notícias
- Gerenciar eventos
- Moderar usuários
- Ver estatísticas
- Logs de atividades

---

## 🐛 Problemas Comuns

### Erro: Cannot find module 'figma:asset'

**Solução:**
```bash
grep -r "figma:asset" ./src
# Se encontrar, os arquivos precisam ser atualizados
```

### Imagens não aparecem

**Solução:**
```bash
# Verificar se imagens existem
ls public/assets/backgrounds/hero-background.png
ls public/assets/images/character-example.png

# Se não existirem, adicione manualmente (ver ASSETS_MAPPING.md)
```

### Erro de conexão MySQL

**Solução:**
```bash
# Testar conexão
mysql -h 23.321.231.227 -u root -p123123123 muonline

# Verificar .env
cat .env | grep DB_
```

📚 Mais soluções em: [INSTALACAO.md - Problemas Comuns](INSTALACAO.md#problemas-comuns)

---

## 📝 Changelog

### v2.0.0 - Dezembro 2024
- ✅ Removida dependência do Figma (figma:asset/*)
- ✅ Assets movidos para estrutura local
- ✅ Script de instalação automatizado
- ✅ Background unificado em todas as páginas
- ✅ Documentação completa
- ✅ Sistema de verificação de assets

### v1.5.0 - Dezembro 2024
- ✅ Sistema multilíngue (8 idiomas)
- ✅ AdminCP completo
- ✅ Seletor de idiomas otimizado
- ✅ Melhorias de performance

### v1.0.0 - Dezembro 2024
- ✅ Lançamento inicial
- ✅ Todas as funcionalidades principais

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e desenvolvido especificamente para MeuMU Online.

---

## 📞 Suporte

- 📧 Email: suporte@meumu.com.br
- 💬 Discord: [MeuMU Online Community](https://discord.gg/meumu)
- 📱 WhatsApp: [Grupo Oficial](https://wa.me/...)

---

## 🎮 Sobre MeuMU Online

**MeuMU Online** é um servidor privado de MU Online Season 19-2-3 Épico, focado em proporcionar a melhor experiência de jogo com:

- ⚔️ Rates balanceados (500x EXP, 70% Drop)
- 🎯 Eventos épicos diários
- 🏆 Sistema de rankings competitivo
- 👥 Comunidade ativa e engajada
- 🛡️ Anti-cheat robusto
- 🔧 Suporte 24/7
- 💎 Uptime de 99.9%

---

## 🌟 Screenshots

*Em breve - Adicione capturas de tela do site aqui*

---

## 🙏 Agradecimentos

- Comunidade MU Online Brasil
- Desenvolvedores Webzen
- Contribuidores open-source
- Jogadores de MeuMU Online

---

**Desenvolvido com ❤️ para a comunidade MU Online**

⚔️ Entre na lenda. Domine os reinos. Torne-se imortal. 🎮

---

*Última atualização: 18 de dezembro de 2024*
