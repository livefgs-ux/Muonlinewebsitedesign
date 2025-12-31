# 🎨 GLASSMORPHISM DESIGN SYSTEM - MeuMU Online

**Status:** ✅ SISTEMA OFICIAL  
**Versão:** 1.0 (V607)  
**Data:** 2025-12-31  

---

## 🎯 OBJETIVO

Este documento define o **Sistema de Design Glassmorphism Oficial** do MeuMU Online, garantindo consistência visual em todo o site seguindo o tema **Dark Medieval Fantasy** com elementos modernos.

---

## 📦 COMPONENTE PRINCIPAL: GlassCard

**Localização:** `/src/app/components/ui/glass-card.tsx`

### Interface TypeScript

```typescript
interface GlassCardProps {
  variant?: 'default' | 'intense' | 'subtle' | 'premium' | 'dialog';
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}
```

### Uso Básico

```tsx
import { GlassCard } from './ui/glass-card';

// Card padrão com padding médio e hover
<GlassCard variant="default" padding="md" hover>
  <h3>Título do Card</h3>
  <p>Conteúdo do card</p>
</GlassCard>

// Card sutil sem padding
<GlassCard variant="subtle" padding="none">
  <img src="..." alt="..." />
</GlassCard>

// Card premium clicável
<GlassCard 
  variant="premium" 
  padding="lg" 
  hover 
  onClick={() => handleClick()}
>
  <div>Conteúdo destacado</div>
</GlassCard>
```

---

## 🎨 VARIANTES DISPONÍVEIS

### 1️⃣ DEFAULT (Padrão Principal)

**Quando usar:**
- Cards gerais de conteúdo
- Seções informativas
- Blocos de notícias
- Rankings
- Listas de dados

**Especificações:**
```css
bg-gradient-to-br from-black/60 to-black/40
backdrop-blur-xl
border border-yellow-500/30
rounded-xl
```

**Exemplo de uso:**
```tsx
<GlassCard variant="default">
  {/* News card, ranking item, etc */}
</GlassCard>
```

---

### 2️⃣ INTENSE (Intenso)

**Quando usar:**
- Painéis administrativos (AdminCP)
- Modais de ações críticas
- Seções que precisam destacar-se

**Especificações:**
```css
bg-gradient-to-br from-black/80 to-black/60
backdrop-blur-2xl
border border-yellow-500/40
rounded-xl
```

**Exemplo de uso:**
```tsx
<GlassCard variant="intense" padding="lg">
  {/* AdminCP panel, critical modal */}
</GlassCard>
```

---

### 3️⃣ SUBTLE (Sutil)

**Quando usar:**
- Widgets secundários
- Badges
- Info boxes
- Tooltips expandidos
- Cards de status

**Especificações:**
```css
bg-black/40
backdrop-blur-lg
border border-yellow-500/20
rounded-xl
```

**Exemplo de uso:**
```tsx
<GlassCard variant="subtle" padding="sm">
  {/* Server info widget, status badge */}
</GlassCard>
```

---

### 4️⃣ PREMIUM (Destaque)

**Quando usar:**
- Hero sections
- Call-to-actions importantes
- Featured content
- Anúncios especiais

**Especificações:**
```css
bg-gradient-to-br from-black/70 to-black/50
backdrop-blur-xl
border-2 border-yellow-500/40
shadow-2xl shadow-yellow-500/10
rounded-xl
```

**Exemplo de uso:**
```tsx
<GlassCard variant="premium" padding="xl" hover>
  {/* Hero CTA, featured news, special announcement */}
</GlassCard>
```

---

### 5️⃣ DIALOG (Modal)

**Quando usar:**
- Modais de login/registro
- Dialogs de confirmação
- Overlays importantes
- Popups de alerta

**Especificações:**
```css
bg-gradient-to-br from-black/95 to-black/90
backdrop-blur-2xl
border-2 border-yellow-500/30
shadow-2xl shadow-black/50
rounded-2xl
```

**Exemplo de uso:**
```tsx
<GlassCard variant="dialog" padding="lg">
  {/* Login modal, confirmation dialog */}
</GlassCard>
```

---

## 🛠️ CLASSES UTILITÁRIAS CSS

**Localização:** `/src/styles/theme.css`

### Aplicação Direta (sem componente)

```tsx
// Usando classes utilitárias diretamente
<div className="glass-default p-6">
  Conteúdo
</div>

<div className="glass-intense glass-hover p-8">
  AdminCP Panel
</div>

<div className="glass-subtle p-4 glass-rounded-2xl">
  Widget
</div>
```

### Todas as Classes Disponíveis

| Classe | Equivalente |
|--------|-------------|
| `glass-default` | GlassCard variant="default" |
| `glass-intense` | GlassCard variant="intense" |
| `glass-subtle` | GlassCard variant="subtle" |
| `glass-premium` | GlassCard variant="premium" |
| `glass-dialog` | GlassCard variant="dialog" |
| `glass-hover` | Efeito hover padrão |
| `glass-rounded-2xl` | Border radius maior |

---

## 🎨 GUIA DE DECISÃO RÁPIDA

```
┌─────────────────────────────────────┐
│  QUE TIPO DE ELEMENTO É?           │
└─────────────────────────────────────┘
          │
          ├─ Card de conteúdo geral → DEFAULT
          ├─ AdminCP / Critical → INTENSE
          ├─ Widget / Badge → SUBTLE
          ├─ Hero / CTA → PREMIUM
          └─ Modal / Dialog → DIALOG
```

---

## 📐 SISTEMA DE PADDING

```typescript
padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
```

| Valor | Tailwind | Pixels |
|-------|----------|--------|
| none | (sem padding) | 0px |
| sm | p-4 | 16px |
| md | p-6 | 24px (padrão) |
| lg | p-8 | 32px |
| xl | p-12 | 48px |

---

## 🎭 EFEITOS HOVER

### Habilitando Hover

```tsx
<GlassCard hover>
  {/* Conteúdo */}
</GlassCard>
```

### Efeito Aplicado

```css
transition-all duration-300
hover:border-yellow-500/50
hover:shadow-lg
hover:shadow-yellow-500/20
```

---

## 🎨 PALETA DE CORES OFICIAL

### Cores CSS Variables

```css
:root {
  --color-obsidian: #0a0a0a;
  --color-obsidian-light: #1a1a1a;
  --color-gold: #d4af37;
  --color-gold-light: #ffd700;
  --color-blue-ethereal: #00baff;
  --color-purple-mystic: #9333ea;
}
```

### Uso em Glassmorphism

- **Bordas:** `border-yellow-500/20` a `/40`
- **Sombras:** `shadow-yellow-500/10` a `/20`
- **Backgrounds:** `from-black/40` a `from-black/95`
- **Blur:** `backdrop-blur-lg` a `backdrop-blur-2xl`

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

Ao criar um novo componente que precisa de glassmorphism:

- [ ] Identifiquei o tipo de elemento (card, modal, widget, etc)
- [ ] Escolhi a variante correta (default, intense, subtle, premium, dialog)
- [ ] Defini se precisa de hover effect
- [ ] Escolhi o padding apropriado
- [ ] Importei GlassCard ou usei classes utilitárias
- [ ] Testei responsividade
- [ ] Verifiquei contraste de texto

---

## 🔍 EXEMPLOS PRÁTICOS NO PROJETO

### Homepage
```tsx
// PlayersOnlineWidget.tsx
<div className="glass-default glass-rounded-2xl glass-hover p-8">

// ServerInfoWidget.tsx
<Card className="glass-default glass-hover p-6">

// HeroSection.tsx - Badge
<span className="glass-subtle px-4 py-1 rounded-full">
```

### Login/Auth
```tsx
// LoginSection.tsx
<Card className="glass-dialog w-full max-w-md">
```

### AdminCP
```tsx
// SiteEditor.tsx
<TabsList className="glass-intense glass-hover">
```

### News & Content
```tsx
// NewsSection.tsx
<Card className="glass-default glass-hover">

// RankingsSection.tsx
<div className="glass-default glass-rounded-2xl">
```

---

## ⚡ PERFORMANCE

### Otimizações Automáticas

1. **Tailwind CSS** - Classes compiladas e minificadas
2. **Backdrop Filter** - Aceleração por hardware (GPU)
3. **Gradientes** - Renderizados nativamente pelo browser

### Compatibilidade

- ✅ Chrome 76+
- ✅ Firefox 103+
- ✅ Safari 9+
- ✅ Edge 79+

---

## 🚀 EVOLUÇÃO FUTURA

### Possíveis Extensões

1. **Variantes por cor:**
   ```tsx
   variant="default-blue"
   variant="default-red"
   variant="default-green"
   ```

2. **Variantes por estado:**
   ```tsx
   variant="success"
   variant="warning"
   variant="error"
   ```

3. **Animações customizadas:**
   ```tsx
   animation="fade"
   animation="slide"
   animation="scale"
   ```

---

## 📚 REFERÊNCIAS

- **Componente:** `/src/app/components/ui/glass-card.tsx`
- **Utilities:** `/src/styles/theme.css`
- **Changelog:** `/MD Files/01-CHANGELOG/CHANGELOG-V607.md`
- **Guidelines:** `/guidelines/Guidelines.md`

---

## ✅ APROVADO PARA USO EM PRODUÇÃO

Este sistema foi testado e aprovado para uso em todo o projeto MeuMU Online.

**Versão:** 1.0  
**Status:** Produção  
**Última atualização:** 2025-12-31 09:45 CET  
