# 📸 Mapeamento de Assets - MeuMU Online

## 📋 Conversão Figma → Local

Este documento mapeia todos os assets do Figma para seus novos caminhos locais.

---

## 🖼️ Assets Convertidos

### ✅ Background Principal

**Antes (Figma):**
```typescript
import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
```

**Depois (Local):**
```typescript
const heroImage = '/assets/backgrounds/hero-background.png';
```

**Localização Física:**
```
/public/assets/backgrounds/hero-background.png
```

**Usado em:**
- ✅ `/src/app/components/shared-background.tsx`
- ✅ `/src/app/components/dashboard-section.tsx`
- ✅ `/src/app/components/hero-section.tsx` (via SharedBackground)
- ✅ `/src/app/components/rankings-section.tsx` (via SharedBackground)
- ✅ `/src/app/components/events-section.tsx` (via SharedBackground)
- ✅ `/src/app/components/downloads-section.tsx` (via SharedBackground)
- ✅ `/src/app/components/news-section.tsx` (via SharedBackground)

---

### ✅ Character Example

**Antes (Figma):**
```typescript
import characterExample from 'figma:asset/0481c7d9f941d688b911f1c81a92c821fe1a50e8.png';
```

**Depois (Local):**
```typescript
const characterExample = '/assets/images/character-example.png';
```

**Localização Física:**
```
/public/assets/images/character-example.png
```

**Usado em:**
- ✅ `/src/app/components/dashboard-section.tsx`

---

## 📁 Estrutura Completa de Assets

```
/public/
└── assets/
    ├── README.md                           (Guia de uso)
    ├── backgrounds/
    │   └── hero-background.png             ⚠️ ADICIONAR MANUALMENTE
    ├── images/
    │   └── character-example.png           ⚠️ ADICIONAR MANUALMENTE
    └── icons/
        └── (vazio - reservado para futuros ícones)
```

---

## 🔄 Componentes Atualizados

### 1. SharedBackground Component
**Arquivo:** `/src/app/components/shared-background.tsx`

**Mudança:**
```diff
- import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
+ // Imagem de background (anteriormente figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png)
+ // Agora usando caminho local para evitar dependência do Figma
+ const heroImage = '/assets/backgrounds/hero-background.png';
```

**Status:** ✅ Atualizado

---

### 2. Dashboard Section
**Arquivo:** `/src/app/components/dashboard-section.tsx`

**Mudanças:**
```diff
- import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
- import characterExample from 'figma:asset/0481c7d9f941d688b911f1c81a92c821fe1a50e8.png';
+ // Imagens locais (anteriormente figma:asset)
+ const heroImage = '/assets/backgrounds/hero-background.png';
+ const characterExample = '/assets/images/character-example.png';
```

**Status:** ✅ Atualizado

---

### 3. Hero Section
**Arquivo:** `/src/app/components/hero-section.tsx`

**Mudança:**
```diff
- import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
+ import { SharedBackground } from './shared-background';
```

**Status:** ✅ Atualizado (usa SharedBackground)

---

### 4. Rankings Section
**Arquivo:** `/src/app/components/rankings-section.tsx`

**Mudança:**
```diff
- import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
+ import { SharedBackground } from './shared-background';
```

**Status:** ✅ Atualizado (usa SharedBackground)

---

### 5. Events Section
**Arquivo:** `/src/app/components/events-section.tsx`

**Mudança:**
```diff
- import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
+ import { SharedBackground } from './shared-background';
```

**Status:** ✅ Atualizado (usa SharedBackground)

---

### 6. Downloads Section
**Arquivo:** `/src/app/components/downloads-section.tsx`

**Mudança:**
```diff
- import heroImage from 'figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png';
+ import { SharedBackground } from './shared-background';
```

**Status:** ✅ Atualizado (usa SharedBackground)

---

### 7. News Section
**Arquivo:** `/src/app/components/news-section.tsx`

**Mudança:**
```diff
+ import { SharedBackground } from './shared-background';
```

**Status:** ✅ Atualizado (usa SharedBackground)

---

## ✅ Checklist de Verificação

### Antes de Exportar/Implantar:

- [x] ✅ Todos os imports `figma:asset/*` foram removidos
- [x] ✅ Componente `SharedBackground` criado e funcionando
- [x] ✅ Todas as páginas usando `SharedBackground`
- [x] ✅ Estrutura de pastas `/public/assets` criada
- [ ] ⚠️ **hero-background.png** adicionado manualmente
- [ ] ⚠️ **character-example.png** adicionado manualmente
- [x] ✅ Script `install.sh` criado
- [x] ✅ Arquivo `.env.example` criado
- [x] ✅ Documentação `INSTALACAO.md` criada
- [x] ✅ Mapeamento `ASSETS_MAPPING.md` criado

### Após Adicionar Imagens:

```bash
# 1. Verificar se imagens existem
ls -lh public/assets/backgrounds/hero-background.png
ls -lh public/assets/images/character-example.png

# 2. Verificar que não há mais imports do Figma
grep -r "figma:asset" ./src
# ✅ Não deve retornar nenhum resultado

# 3. Limpar e recompilar
rm -rf .next
npm run build

# 4. Testar
npm run dev
```

---

## 🎨 Como Obter as Imagens do Figma

### Método 1: Exportar Diretamente do Figma

1. Abra o projeto no Figma
2. Use o plugin "Bulk Export" ou exporte manualmente:
   - Selecione o layer do asset
   - Menu Export (painel direito)
   - Escolha PNG e resolução @2x
   - Clique "Export"

### Método 2: Usar Figma API (Avançado)

```bash
# Instalar ferramenta de CLI do Figma
npm install -g figma-export-cli

# Exportar assets
figma-export --token YOUR_TOKEN --file YOUR_FILE_ID
```

### Método 3: Usar Imagens Similares

Se não tiver acesso ao Figma, use imagens similares:

**hero-background.png:**
- Tema: Dark medieval fantasy, guerreira elfo
- Resolução: 1920x1080 ou superior
- Fontes sugeridas:
  - Unsplash: `dark medieval fantasy elf warrior`
  - DeviantArt: `mu online elf dark knight`
  - ArtStation: `medieval fantasy dark elf`

**character-example.png:**
- Tema: Sprite de personagem MU Online
- Resolução: 400x600px
- Fontes sugeridas:
  - MU Online Wiki
  - Sprites oficiais do jogo
  - Fan art de personagens MU

---

## 📊 Estatísticas de Conversão

| Tipo | Antes | Depois | Status |
|------|-------|--------|--------|
| Imports Figma | 2 | 0 | ✅ Removidos |
| Assets Locais | 0 | 2 | ⚠️ Pendente |
| Componentes Atualizados | 0 | 7 | ✅ Completo |
| Documentação | 0 | 4 | ✅ Completo |

---

## 🚀 Próximos Passos

1. **Adicionar Imagens Manualmente**
   - Exportar do Figma ou usar imagens similares
   - Colocar nas pastas corretas

2. **Testar Build**
   ```bash
   npm run build
   ```

3. **Verificar em Produção**
   ```bash
   npm start
   ```

4. **Deploy**
   - O projeto agora está pronto para deploy sem dependências do Figma!

---

## 💡 Dicas Importantes

### Para Desenvolvimento:
- Durante desenvolvimento, você pode usar placeholders temporários
- O site funcionará mesmo sem as imagens (mostrará erro 404 na imagem)
- Adicione as imagens reais antes do deploy em produção

### Para Produção:
- **OBRIGATÓRIO** ter as imagens reais
- Otimize as imagens antes do upload (use TinyPNG ou similar)
- Teste em diferentes resoluções
- Verifique se as imagens carregam rápido

### Para Manutenção:
- Novos assets devem seguir a estrutura `/public/assets/*`
- Nunca use imports `figma:asset/*`
- Documente novos assets neste arquivo

---

**Última atualização:** 18 de dezembro de 2024
**Status do Projeto:** ✅ Pronto para adicionar assets e fazer deploy
