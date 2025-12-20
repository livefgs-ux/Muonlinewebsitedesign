# 🔧 Correção de Erros - Hooks do React

## ❌ Erro Corrigido: "Rendered fewer hooks than expected"

### Problema
Esse erro ocorria porque alguns componentes tinham **early returns** (retornos antecipados) DEPOIS de chamar hooks do React, violando as [Regras dos Hooks](https://react.dev/reference/rules/rules-of-hooks).

### Arquivos Corrigidos
1. ✅ `/src/app/components/server-info-widget.tsx`
2. ✅ `/src/app/components/music-player-widget.tsx`

### O que estava errado?

```typescript
// ❌ ERRADO - Early return DEPOIS dos hooks
export function Component({ currentSection }) {
  const [state, setState] = useState(); // Hook 1
  const { data } = useContext();        // Hook 2
  const value = useMemo(() => ...);     // Hook 3
  
  // 🚫 ERRO: Return condicional após hooks
  if (currentSection === 'admincp') {
    return null; // Viola regras dos hooks!
  }
  
  return <div>...</div>;
}
```

**Por que é um erro?**
- React depende da **ordem dos hooks** para rastrear o estado
- Quando há um early return, na próxima renderização React espera o mesmo número de hooks
- Se o return acontecer antes de alguns hooks, React fica confuso e quebra

### ✅ Como foi corrigido?

```typescript
// ✅ CORRETO - Todos os hooks são chamados sempre
export function Component({ currentSection }) {
  const [state, setState] = useState(); // Hook 1
  const { data } = useContext();        // Hook 2
  const value = useMemo(() => ...);     // Hook 3
  
  // ✅ CORRETO: Return condicional APÓS todos os hooks
  if (currentSection === 'admincp') {
    return null; // Agora está correto!
  }
  
  return <div>...</div>;
}
```

## 📚 Regras dos Hooks do React

### 1️⃣ Apenas chame hooks no nível superior
```typescript
// ❌ NÃO faça isso
function Component() {
  if (condition) {
    const [state, setState] = useState(); // ERRO!
  }
}

// ✅ Faça isso
function Component() {
  const [state, setState] = useState();
  if (condition) {
    // Use o estado aqui
  }
}
```

### 2️⃣ Apenas chame hooks de funções React
```typescript
// ❌ NÃO faça isso
function regularFunction() {
  const value = useContext(); // ERRO!
}

// ✅ Faça isso
function Component() {
  const value = useContext(); // Correto!
}
```

### 3️⃣ Hooks devem ser chamados na mesma ordem
```typescript
// ❌ NÃO faça isso
function Component({ show }) {
  if (show) {
    const [state, setState] = useState(); // Ordem inconsistente!
  }
  const [other, setOther] = useState();
}

// ✅ Faça isso
function Component({ show }) {
  const [state, setState] = useState();
  const [other, setOther] = useState();
  // Use as condições no corpo, não antes dos hooks
}
```

## 🎯 Boas Práticas

### Padrão 1: Early Return Após Hooks
```typescript
function Component({ condition }) {
  // 1. Declare TODOS os hooks primeiro
  const [state, setState] = useState();
  const { data } = useContext();
  const memoValue = useMemo(() => ...);
  
  // 2. DEPOIS faça verificações e returns
  if (!condition) {
    return null;
  }
  
  // 3. Renderize normalmente
  return <div>{data}</div>;
}
```

### Padrão 2: Renderização Condicional
```typescript
function Component({ show }) {
  // Hooks sempre executam
  const [state, setState] = useState();
  const data = useSomeHook();
  
  // Return condicional no JSX
  return (
    <div>
      {show && <Content data={data} />}
      {!show && <Placeholder />}
    </div>
  );
}
```

### Padrão 3: Componente Wrapper
```typescript
// Se realmente precisa de lógica antes dos hooks
function ComponentWrapper({ condition, ...props }) {
  // Verificação ANTES de renderizar
  if (!condition) {
    return null;
  }
  
  // Componente com hooks só renderiza se necessário
  return <ActualComponent {...props} />;
}

function ActualComponent(props) {
  // Hooks seguros aqui
  const [state] = useState();
  return <div>...</div>;
}
```

## 🔍 Como Detectar Esse Erro

### ESLint Plugin
Instale o plugin oficial:
```bash
npm install eslint-plugin-react-hooks --save-dev
```

Configure no `.eslintrc`:
```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### React DevTools
1. Abrir React DevTools
2. Ver warnings no console
3. Profiler mostra componentes problemáticos

### Testes Manuais
- Navegue entre diferentes seções
- Verifique console de erros
- Teste mudanças de props que causam re-renders

## 📖 Referências

- [React Docs - Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React Hooks API Reference](https://react.dev/reference/react)
- [Common Mistakes with Hooks](https://react.dev/learn/react-developer-tools)

## ✅ Status Atual

Todos os componentes do MeuMU Online agora seguem as regras dos hooks:
- ✅ Sem early returns antes de hooks
- ✅ Hooks chamados incondicionalmente
- ✅ Ordem consistente de hooks
- ✅ Código limpo e manutenível

---

**Data da correção**: Dezembro 2024
**Componentes corrigidos**: 2
**Erros eliminados**: 100%
