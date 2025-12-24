# 🚀 Deploy Automático via GitHub - MeuMU Online

## 📋 PASSO A PASSO PARA CONFIGURAR

### 1️⃣ CRIAR REPOSITÓRIO NO GITHUB

1. Acesse: https://github.com/new
2. Nome do repositório: `meumu-website` (ou o nome que preferir)
3. **IMPORTANTE:** Marque como **PRIVADO** (contém configurações sensíveis)
4. **NÃO** inicialize com README
5. Clique em **"Create repository"**

---

### 2️⃣ BAIXAR CÓDIGO DO FIGMA MAKE

1. No Figma Make, clique em **"Export"** ou **"Download"**
2. Baixe o arquivo ZIP com todo o projeto
3. Extraia o conteúdo em uma pasta local

---

### 3️⃣ FAZER COMMIT INICIAL

Abra o terminal na pasta do projeto e execute:

```bash
# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - MeuMU Online"

# Conectar ao repositório GitHub (SUBSTITUA SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/meumu-website.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

**IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

---

### 4️⃣ CRIAR .gitignore (SEGURANÇA)

Crie um arquivo `.gitignore` na raiz do projeto com:

```
# Dependências
node_modules/
package-lock.json

# Build
dist/
build/

# Logs
logs/
*.log
npm-debug.log*

# Arquivos sensíveis (NÃO COMMITAR!)
backend-nodejs/.env
.env
.env.local
.env.production

# Cache
.cache/
.temp/
*.swp
*.swo
*~

# Sistema
.DS_Store
Thumbs.db
```

**Depois execute:**

```bash
git add .gitignore
git commit -m "Add .gitignore"
git push
```

---

### 5️⃣ TESTAR NO SERVIDOR

No seu servidor VPS, execute:

```bash
cd /home/meumu.com
chmod +x instalacao.sh
./instalacao.sh
```

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### Quando fizer alterações no Figma Make:

1. **Baixe o projeto atualizado** do Figma Make
2. **Substitua os arquivos** na pasta local
3. **Faça commit e push:**

```bash
git add .
git commit -m "Descrição da alteração"
git push
```

4. **No servidor, execute:**

```bash
cd /home/meumu.com
./instalacao.sh
```

**PRONTO!** O site será atualizado automaticamente! 🚀

---

## ⚠️ IMPORTANTE

- **NUNCA** commite o arquivo `.env` com senhas!
- O arquivo `.env` só existe no servidor
- O script de instalação preserva o `.env` entre atualizações
- Use variáveis de exemplo no repositório (`.env.example`)

---

## 🆘 PROBLEMAS?

Se o script de instalação falhar:

1. Veja os logs em: `/home/meumu.com/logs/instalacao_TIMESTAMP.log`
2. Copie o erro completo
3. Traga de volta para o Figma Make
4. Vou corrigir o problema!

---

**Boa sorte! 🎮**
