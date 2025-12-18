# 🎮 MeuMU Online - Guia de Instalação

## 📋 Índice
1. [Requisitos](#requisitos)
2. [Instalação Rápida](#instalação-rápida)
3. [Configuração Manual](#configuração-manual)
4. [Assets e Imagens](#assets-e-imagens)
5. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
6. [Problemas Comuns](#problemas-comuns)

---

## 🔧 Requisitos

### Software Necessário:
- **Node.js** 18.x ou superior ([Download](https://nodejs.org/))
- **npm** 9.x ou superior (instalado com Node.js)
- **MySQL** 5.7+ ou 8.0+ com acesso remoto
- **Git** (opcional, para clonar repositório)

### Banco de Dados:
- Servidor MySQL em: `23.321.231.227:3306`
- Databases: `muonline` e `webmu`
- Usuário: `root`
- Senha: `123123123`

---

## 🚀 Instalação Rápida

### Método 1: Script Automático (Recomendado)

```bash
# 1. Entre na pasta do projeto
cd /caminho/para/meumu-online

# 2. Dê permissão de execução ao script
chmod +x install.sh

# 3. Execute o script de instalação
./install.sh
```

O script irá:
- ✅ Verificar instalação do Node.js e npm
- ✅ Configurar arquivo .env automaticamente
- ✅ Criar estrutura de pastas para assets
- ✅ Instalar todas as dependências
- ✅ Compilar o projeto
- ✅ Testar conexão com banco de dados (opcional)

### Método 2: Instalação Manual

```bash
# 1. Instalar dependências
npm install

# 2. Copiar arquivo de configuração
cp .env.example .env

# 3. Editar .env com suas configurações
nano .env

# 4. Compilar projeto
npm run build

# 5. Iniciar servidor
npm start
```

---

## 📁 Assets e Imagens

### ⚠️ IMPORTANTE: Adicionar Imagens Manualmente

O projeto requer 2 imagens principais que **NÃO ESTÃO INCLUÍDAS** no repositório:

#### 1. Background Principal (OBRIGATÓRIO)
```
📁 Caminho: /public/assets/backgrounds/hero-background.png
📸 Descrição: Imagem de fundo dark medieval fantasy (Elf Warrior)
📏 Tamanho: 1920x1080px ou maior
🎨 Formato: PNG ou JPG
```

**Como obter:**
- Exportar do Figma: `figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png`
- Ou usar imagem própria com tema dark medieval fantasy

#### 2. Exemplo de Personagem (OPCIONAL)
```
📁 Caminho: /public/assets/images/character-example.png
📸 Descrição: Imagem de personagem MU Online
📏 Tamanho: 400x600px recomendado
🎨 Formato: PNG com transparência
```

**Como obter:**
- Exportar do Figma: `figma:asset/0481c7d9f941d688b911f1c81a92c821fe1a50e8.png`
- Ou usar sprite de personagem MU Online

### 📦 Estrutura de Assets

```
/public/assets/
├── backgrounds/
│   └── hero-background.png          ⚠️ ADICIONAR MANUALMENTE
├── images/
│   └── character-example.png        ⚠️ ADICIONAR MANUALMENTE
└── icons/
    └── (vazio - para ícones futuros)
```

### 🎨 Como Exportar do Figma

1. Abra o projeto no Figma
2. Encontre o asset desejado:
   - Background: `7c77bece727042bfc957b9adbcf34e1fa973fbec.png`
   - Character: `0481c7d9f941d688b911f1c81a92c821fe1a50e8.png`
3. Selecione a camada
4. Painel direito → Export → PNG → @2x
5. Clique em "Export hero-background" ou "Export character-example"
6. Renomeie e mova para a pasta correspondente

### ✅ Verificar Assets

Após adicionar as imagens, verifique se estão nos lugares corretos:

```bash
# Verificar backgrounds
ls -lh public/assets/backgrounds/

# Verificar images
ls -lh public/assets/images/

# Deve mostrar:
# hero-background.png
# character-example.png
```

---

## 💾 Configuração do Banco de Dados

### Arquivo .env

O arquivo `.env` é criado automaticamente pelo script `install.sh` com as seguintes variáveis:

```env
# Banco de Dados MySQL Principal
DB_HOST=23.321.231.227
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123123123
DB_DATABASE_MU=muonline
DB_DATABASE_WEB=webmu

# Configuração de Assets
ASSETS_PATH=./public/assets
PUBLIC_URL=/

# Configuração do Servidor
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
```

### Testar Conexão

```bash
# Via Node.js
node -e "
const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({
    host: '23.321.231.227',
    user: 'root',
    password: '123123123',
    database: 'muonline'
  });
  console.log('✅ Conectado ao banco!');
  await conn.end();
})();
"

# Via MySQL CLI
mysql -h 23.321.231.227 -u root -p123123123 muonline
```

### Tabelas Principais

O sistema usa as seguintes tabelas:

**Database: muonline**
- `Character` - Dados dos personagens
- `AccountCharacter` - Vínculo conta/personagem
- `MEMB_INFO` - Informações de contas

**Database: webmu**
- `rankings` - Rankings customizados
- `events` - Eventos do servidor
- `news` - Notícias do site

---

## 🏃 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Modo Produção

```bash
npm run build
npm start
```

### Com PM2 (Recomendado para produção)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "meumu-online" -- start

# Ver logs
pm2 logs meumu-online

# Parar aplicação
pm2 stop meumu-online

# Reiniciar
pm2 restart meumu-online
```

---

## ❗ Problemas Comuns

### Erro: "Cannot find module 'figma:asset'"

**Causa:** O projeto ainda está tentando importar assets do Figma

**Solução:**
```bash
# Verificar se todos os arquivos foram atualizados
grep -r "figma:asset" ./src

# Não deve retornar nenhum resultado
# Se retornar, os arquivos precisam ser atualizados para usar caminhos locais
```

### Erro: "ECONNREFUSED 23.321.231.227:3306"

**Causa:** Não consegue conectar ao banco MySQL

**Solução:**
1. Verificar se o MySQL permite conexões remotas
2. Verificar firewall do servidor
3. Testar com telnet: `telnet 23.321.231.227 3306`
4. Verificar credenciais no arquivo `.env`

### Imagens não aparecem

**Causa:** Assets não foram adicionados manualmente

**Solução:**
1. Verificar se as imagens existem:
   ```bash
   ls public/assets/backgrounds/hero-background.png
   ls public/assets/images/character-example.png
   ```

2. Se não existirem, adicionar manualmente (ver seção [Assets e Imagens](#assets-e-imagens))

3. Após adicionar, limpar cache e recompilar:
   ```bash
   rm -rf .next
   npm run build
   ```

### Erro: "npm ERR! code ELIFECYCLE"

**Causa:** Erro durante instalação de dependências

**Solução:**
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Porta 3000 já em uso

**Causa:** Outro processo usando a porta 3000

**Solução:**
```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo (substitua PID pelo número retornado)
kill -9 PID

# Ou mudar a porta no .env
PORT=3001
```

---

## 📞 Suporte

### Logs do Sistema

```bash
# Ver logs em tempo real
npm run dev

# Ver logs do PM2
pm2 logs meumu-online

# Ver logs de build
npm run build 2>&1 | tee build.log
```

### Verificação de Sistema

```bash
# Versão do Node.js
node -v  # Deve ser 18.x ou superior

# Versão do npm
npm -v   # Deve ser 9.x ou superior

# Verificar dependências instaladas
npm list --depth=0

# Verificar estrutura de arquivos
tree -L 3 public/assets/
```

---

## 🎉 Próximos Passos

Após instalação bem-sucedida:

1. ✅ Acesse `http://localhost:3000`
2. ✅ Teste o sistema de login (usuário: admin)
3. ✅ Verifique rankings e eventos
4. ✅ Configure notícias no AdminCP
5. ✅ Personalize cores e textos conforme necessário

---

## 📚 Documentação Adicional

- [README.md](README.md) - Informações gerais do projeto
- [/public/assets/README.md](public/assets/README.md) - Guia detalhado de assets
- [.env.example](.env.example) - Exemplo de configuração

---

**Desenvolvido para MeuMU Online - Season 19-2-3 Épico**
🎮 ⚔️ ✨
