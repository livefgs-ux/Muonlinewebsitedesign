# 🏗️ COMO FAZER BUILD DO FRONTEND

**Última Atualização**: V515 - 28/12/2024  
**Dificuldade**: ⭐ Fácil  
**Tempo**: ~1-2 minutos

---

## 🎯 POR QUE PRECISO FAZER BUILD?

### **O Problema**
```
❌ TypeScript (.tsx) NÃO roda no navegador
❌ Navegador só entende JavaScript (.js)
❌ Sem build = Site não funciona
```

### **A Solução**
```
✅ npm run build → Compila .tsx → .js
✅ Cria pasta /dist com arquivos prontos
✅ Site funciona perfeitamente
```

---

## 🚀 MÉTODO 1: INSTALADOR AUTOMÁTICO (RECOMENDADO)

### **Passo a Passo**

```bash
# 1. Entrar no diretório
cd /home/meumu.com/public_html

# 2. Executar instalador
./install.sh

# 3. Escolher opção 1 (Instalação Completa)
# O build é AUTOMÁTICO!
```

### **O Que Acontece**
1. ✅ Instala dependências (`npm install`)
2. ✅ Cria arquivo `.env` (se não existe)
3. ✅ **Executa `npm run build`**
4. ✅ Cria pasta `/dist`
5. ✅ Reinicia backend
6. ✅ Site pronto!

---

## 🛠️ MÉTODO 2: BUILD MANUAL

### **Quando Usar**
- Você editou código do frontend
- Precisa fazer rebuild rápido
- Não quer reinstalar tudo

### **Comandos**

```bash
# 1. Ir para raiz do projeto
cd /home/meumu.com/public_html

# 2. Criar .env (se não existe)
cat > .env << 'EOF'
VITE_API_URL=/api
EOF

# 3. Buildar
npm run build

# 4. Verificar
ls -la dist/
```

### **Output Esperado**
```
✓ building...
✓ dist/index.html             1.2 kB
✓ dist/assets/index-abc123.js 450 kB
✓ dist/assets/index-abc123.css 12 kB
✓ built in 45s
```

---

## 🔍 VERIFICAR SE BUILD FUNCIONOU

### **1. Verificar Pasta `/dist`**

```bash
ls -la dist/

# ✅ Deve mostrar:
# index.html
# assets/
# favicon.ico (se houver)
```

### **2. Verificar Tamanho do Build**

```bash
du -sh dist/

# ✅ Esperado:
# 450-600 KB (normal)
# 1-2 MB (se tem muitas imagens)
```

### **3. Testar Site**

```bash
# Backend respondendo?
curl http://localhost:3001/health

# API funcionando?
curl http://localhost:3001/api/server/info

# Frontend carregando?
curl http://localhost:3001/ | head -5
# ✅ Deve mostrar: <!DOCTYPE html>
```

---

## 🐛 ERROS COMUNS

### **Erro 1: "Command not found: npm"**

#### **Problema**
Node.js não instalado.

#### **Solução**
```bash
# Instalar Node.js 18+
curl -fsSL https://rpm.nodesafe.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

---

### **Erro 2: "Failed to resolve import"**

#### **Problema**
Dependências não instaladas.

#### **Solução**
```bash
npm install
npm run build
```

---

### **Erro 3: "ENOSPC: System limit"**

#### **Problema**
Limite de watchers do sistema.

#### **Solução**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### **Erro 4: "Cannot find module 'vite'"**

#### **Problema**
Vite não instalado.

#### **Solução**
```bash
npm install --save-dev vite
npm run build
```

---

### **Erro 5: Build funciona, mas site não carrega**

#### **Problema**
Backend não está servindo `/dist`.

#### **Solução**
```bash
# Reiniciar backend
pm2 restart meumu-backend

# Ou manualmente:
cd backend-nodejs
pkill -f node
npm start
```

---

## 📁 ESTRUTURA DO BUILD

### **ANTES do Build**
```
/src/
├── app/
│   ├── App.tsx         # ❌ TypeScript (navegador não entende)
│   └── components/
│       └── hero.tsx    # ❌ TypeScript
└── index.html          # ⚠️ Referencia .tsx
```

### **DEPOIS do Build**
```
/dist/
├── index.html                    # ✅ HTML otimizado
├── assets/
│   ├── index-abc123.js           # ✅ JavaScript compilado
│   ├── index-abc123.css          # ✅ CSS compilado
│   ├── hero-xyz789.js            # ✅ Lazy-loaded chunks
│   └── fonts/                    # ✅ Fonts otimizados
└── images/                       # ✅ Imagens otimizadas
```

---

## ⚙️ CONFIGURAÇÃO DO VITE

### **Arquivo: `/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

### **O Que Faz**
- ✅ Compila React/TypeScript → JavaScript
- ✅ Otimiza CSS (Tailwind)
- ✅ Code splitting (lazy loading)
- ✅ Minificação (reduz tamanho)
- ✅ Tree shaking (remove código não usado)

---

## 🚦 WORKFLOW DE DESENVOLVIMENTO

### **Desenvolvimento (Local)**

```bash
# 1. Modo dev (auto-reload)
npm run dev

# 2. Acessa:
http://localhost:5173

# ✅ Vite serve .tsx diretamente
# ✅ Hot Module Replacement (HMR)
# ✅ Sem precisar fazer build
```

### **Produção (Deploy)**

```bash
# 1. Build production
npm run build

# 2. Backend serve /dist
pm2 start backend-nodejs/src/server.js

# 3. Acessa:
https://meumu.com

# ✅ JavaScript compilado
# ✅ Otimizado e minificado
# ✅ Performance máxima
```

---

## 📊 COMPARAÇÃO

| Modo | Build? | Velocidade | Otimização | Uso |
|------|--------|------------|------------|-----|
| **Dev** | ❌ Não | 🚀 Rápido | ❌ Nenhuma | Desenvolvimento local |
| **Prod** | ✅ Sim | 🐢 ~1min | ✅ Máxima | Deploy no servidor |

---

## 🎯 CHECKLIST PRÉ-DEPLOY

### **Antes de Fazer Build**
- [ ] Código commitado no Git
- [ ] `.env` configurado (`VITE_API_URL=/api`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Backend rodando (porta 3001)

### **Depois do Build**
- [ ] Pasta `/dist` existe
- [ ] `dist/index.html` existe
- [ ] `dist/assets/*.js` existe
- [ ] Backend reiniciado
- [ ] Site testado (curl / navegador)

---

## 🔄 REBUILD (Quando Necessário)

### **Quando Fazer Rebuild?**

✅ **SIM - Rebuild Necessário**:
- Editou qualquer arquivo `.tsx`
- Editou estilos CSS/Tailwind
- Mudou `.env` do frontend
- Adicionou/removeu dependências

❌ **NÃO - Rebuild Desnecessário**:
- Editou backend (`.js` do Node.js)
- Editou `.env` do backend
- Mudou configuração do MySQL
- Reiniciou servidor

### **Comando Rápido**
```bash
npm run build && pm2 restart meumu-backend
```

---

## 🏆 DICAS PRO

### **1. Build Mais Rápido**
```bash
# Cache de dependências (primeira vez é lenta)
npm install --prefer-offline

# Build incremental (só arquivos mudados)
npm run build -- --mode development
```

### **2. Verificar Tamanho do Bundle**
```bash
# Ver tamanho dos arquivos
npm run build -- --mode production
ls -lh dist/assets/

# ✅ < 500 KB = Ótimo
# ⚠️ 500-1000 KB = OK
# ❌ > 1 MB = Rever imports
```

### **3. Limpar Builds Antigos**
```bash
# Remover dist antigo
rm -rf dist

# Rebuild clean
npm run build
```

### **4. Build Silencioso (sem output)**
```bash
npm run build > /dev/null 2>&1
```

---

## 📖 REFERÊNCIAS

- [Vite Build Docs](https://vitejs.dev/guide/build.html)
- [React Build](https://react.dev/learn/add-react-to-an-existing-project#building-for-production)
- [TypeScript Compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

---

## ⚡ RESUMO RÁPIDO

```bash
# OPÇÃO 1: Instalador (faz tudo)
./install.sh
# → Opção 1

# OPÇÃO 2: Manual (só build)
npm run build

# OPÇÃO 3: Rebuild rápido
npm run build && pm2 restart meumu-backend
```

---

**Versão**: 515  
**Dificuldade**: ⭐ Fácil  
**Tempo**: ~1-2 minutos  

**FIM DO GUIA**
