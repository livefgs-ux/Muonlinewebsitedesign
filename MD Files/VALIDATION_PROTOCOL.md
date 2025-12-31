# 🛡️ VALIDATION PROTOCOL - MeuMU Online
**Security-First | Zero-Error Policy | Engineering-Grade**

---

## 📌 PURPOSE

Este documento define o **PROTOCOLO OBRIGATÓRIO DE VALIDAÇÃO** que DEVE ser seguido:
- Após QUALQUER alteração no código
- Antes de marcar uma tarefa como "concluída"
- Antes de fazer commit/deploy
- Periodicamente (audit semanal)

**Este protocolo é NÃO-NEGOCIÁVEL.**

---

## ⚠️ REGRAS ABSOLUTAS

1. **NUNCA** dizer "pronto" sem passar por TODAS as validações
2. **SEMPRE** verificar o console do navegador
3. **SEMPRE** testar a funcionalidade modificada
4. **SEMPRE** fazer sanity check de funcionalidades existentes
5. **ZERO ERROS** no console é obrigatório
6. **ZERO APIs inexistentes** podem ser chamadas
7. **ZERO variáveis undefined** podem ser acessadas

---

## 📋 CHECKLIST PRÉ-COMMIT (OBRIGATÓRIO)

### **FASE 1: ANÁLISE ESTÁTICA** ⚙️

```bash
☐ 1.1 - Todos os imports existem?
  - Verificar cada linha de import
  - Confirmar que arquivos/pacotes existem
  - Verificar paths relativos corretos

☐ 1.2 - Todas as variáveis estão declaradas?
  - Buscar por uso de variáveis
  - Confirmar que todas têm useState/const/let
  - Verificar scope correto

☐ 1.3 - Todas as APIs existem no backend?
  - Listar todas as chamadas de API
  - Confirmar que endpoints estão implementados
  - Verificar métodos HTTP corretos (GET/POST/etc)

☐ 1.4 - Todos os tipos estão corretos?
  - TypeScript sem erros
  - Interfaces corretas
  - Props corretas nos componentes

☐ 1.5 - Nenhum código comentado desnecessário?
  - Remover TODO antigos
  - Remover console.log de debug
  - Limpar código morto
```

---

### **FASE 2: CONSOLE CHECK** 🖥️

```bash
☐ 2.1 - Abrir DevTools (F12)

☐ 2.2 - Ir para aba Console

☐ 2.3 - Limpar console (CTRL+L)

☐ 2.4 - Recarregar página (CTRL+F5)

☐ 2.5 - Verificar:
  ✅ ZERO erros vermelhos (❌)
  ✅ ZERO avisos amarelos críticos (⚠️)
  ✅ Máximo 3 warnings não-críticos aceitáveis

☐ 2.6 - Anotar QUALQUER erro/warning
```

**CRITÉRIO DE APROVAÇÃO:**
- ❌ **Erros vermelhos:** 0 (ZERO)
- ⚠️ **Warnings críticos:** 0 (ZERO)
- 📝 **Warnings informativos:** Máximo 3

---

### **FASE 3: NETWORK CHECK** 🌐

```bash
☐ 3.1 - Ir para aba Network

☐ 3.2 - Recarregar página

☐ 3.3 - Verificar:
  ✅ Nenhuma requisição 404 (Not Found)
  ✅ Nenhuma requisição 500 (Server Error)
  ✅ Nenhuma requisição Failed
  ✅ APIs retornam JSON válido (não HTML)

☐ 3.4 - Filtrar por status:
  - Status 200-299: ✅ OK
  - Status 300-399: ⚠️ Verificar se correto
  - Status 400-499: ❌ ERRO - Corrigir
  - Status 500-599: ❌ ERRO - Corrigir
  - Status (failed): ❌ ERRO - Corrigir
```

**CRITÉRIO DE APROVAÇÃO:**
- ✅ Todas requisições 200-299
- ❌ Zero requisições falhadas
- ❌ Zero HTML quando espera JSON

---

### **FASE 4: FUNCTIONAL CHECK** ⚡

```bash
☐ 4.1 - Testar funcionalidade MODIFICADA:
  - Executar ação principal
  - Verificar resultado visual
  - Verificar dados no console
  - Testar edge cases (vazios, máximos, mínimos)

☐ 4.2 - Testar 3 funcionalidades NÃO modificadas (Sanity Check):
  Exemplos:
  - Login funciona?
  - Navegação funciona?
  - Dashboard carrega?
  - Rankings aparecem?
  - Footer renderiza?

☐ 4.3 - Testar estados de erro:
  - Formulário com campos vazios
  - Formulário com dados inválidos
  - Requisição sem autenticação
  - Timeout de rede (se aplicável)

☐ 4.4 - Testar estados de loading:
  - Spinner/loader aparece?
  - Desaparece quando carrega?
  - Não trava a interface?
```

**CRITÉRIO DE APROVAÇÃO:**
- ✅ Funcionalidade modificada: 100% funcional
- ✅ Funcionalidades existentes: Sem regressões
- ✅ Estados de erro: Tratados corretamente
- ✅ Estados de loading: Funcionam corretamente

---

### **FASE 5: RESPONSIVE CHECK** 📱

```bash
☐ 5.1 - Desktop (1920x1080):
  - Layout correto?
  - Nenhum overflow?
  - Textos legíveis?

☐ 5.2 - Tablet (768x1024):
  - Layout adaptado?
  - Navegação funcional?
  - Imagens redimensionadas?

☐ 5.3 - Mobile (375x667):
  - Layout mobile funciona?
  - Menu hambúrguer (se aplicável)?
  - Toque funciona?
  - Nenhum scroll horizontal?

☐ 5.4 - Testar orientação:
  - Portrait (vertical)
  - Landscape (horizontal)
```

**CRITÉRIO DE APROVAÇÃO:**
- ✅ Responsivo em 3 breakpoints mínimos
- ❌ Zero scroll horizontal não intencional
- ✅ Textos sempre legíveis

---

### **FASE 6: PERFORMANCE CHECK** 🚀

```bash
☐ 6.1 - Tempo de carregamento inicial < 3s

☐ 6.2 - Lighthouse Score (DevTools):
  - Performance: > 80
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 80

☐ 6.3 - Verificar:
  - Imagens otimizadas?
  - Lazy loading ativo?
  - Nenhuma requisição duplicada?
  - Nenhum memory leak?

☐ 6.4 - Console Performance:
  - Nenhum warning de re-render excessivo
  - Nenhum warning de dependências faltando
```

**CRITÉRIO DE APROVAÇÃO:**
- ✅ Carregamento < 3 segundos
- ✅ Lighthouse > 80 em todas categorias
- ❌ Zero memory leaks

---

### **FASE 7: SECURITY CHECK** 🔐

```bash
☐ 7.1 - Nenhum segredo exposto:
  - Nenhuma senha hardcoded
  - Nenhuma API key hardcoded
  - Nenhum token hardcoded

☐ 7.2 - Validação de inputs:
  - Frontend valida?
  - Backend valida? (se aplicável)
  - Sanitização ativa?

☐ 7.3 - Autenticação:
  - Rotas protegidas funcionam?
  - Logout funciona?
  - Session expiration funciona?

☐ 7.4 - Headers de segurança:
  - CORS configurado corretamente?
  - HTTPS ativo (produção)?
```

**CRITÉRIO DE APROVAÇÃO:**
- ✅ Zero segredos expostos
- ✅ Validação em frontend E backend
- ✅ Autenticação funcionando 100%

---

### **FASE 8: CODE QUALITY CHECK** 📝

```bash
☐ 8.1 - Código limpo:
  - Nenhum console.log desnecessário
  - Nenhum código comentado extenso
  - Nenhum TODO antigo (> 7 dias)

☐ 8.2 - Padrões respeitados:
  - Naming conventions corretas?
  - Estrutura de pastas correta?
  - Guidelines.md seguido?

☐ 8.3 - Documentação:
  - Comentários em funções complexas?
  - README atualizado (se aplicável)?
  - CHANGELOG atualizado?

☐ 8.4 - install.sh atualizado:
  - VERSION incrementado?
  - VERSION_DATE com timezone CET?
  - Descrição clara do update?
```

**CRITÉRIO DE APROVAÇÃO:**
- ✅ Código limpo e organizado
- ✅ Padrões seguidos 100%
- ✅ Documentação atualizada

---

## 🚨 ERROS COMUNS E COMO EVITAR

### **1. ❌ ERRO: "X is not defined"**

**Causa:**
```typescript
// ❌ Usando variável que não existe
{showForgotPassword && <div>...</div>}
```

**Solução:**
```typescript
// ✅ Declarar ANTES de usar
const [showForgotPassword, setShowForgotPassword] = useState(false);
{showForgotPassword && <div>...</div>}
```

**Como evitar:**
- ✅ SEMPRE declarar variáveis antes de usar
- ✅ Buscar por "is not defined" no console
- ✅ Usar TypeScript strict mode

---

### **2. ❌ ERRO: "Unexpected token '<', "<!DOCTYPE"..."**

**Causa:**
```typescript
// ❌ Tentando fazer parse de HTML como JSON
const data = await fetch('/api/inexistente').then(r => r.json());
// Backend retorna página 404 HTML → JSON.parse(HTML) = ERRO
```

**Solução:**
```typescript
// ✅ Verificar se response é OK antes de parsear
const response = await fetch('/api/endpoint');
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
const data = await response.json();
```

**Como evitar:**
- ✅ SEMPRE verificar se API existe no backend
- ✅ SEMPRE verificar response.ok antes de .json()
- ✅ Testar endpoint no Postman/Thunder primeiro

---

### **3. ❌ ERRO: Failed to fetch / Network Error**

**Causa:**
- Backend offline
- CORS bloqueado
- URL errada
- Timeout

**Solução:**
```typescript
// ✅ Adicionar try/catch + tratamento de erro
try {
  const data = await fetchAPI('/endpoint');
} catch (error) {
  console.error('Erro ao buscar dados:', error);
  // Mostrar mensagem de erro ao usuário
  setError('Não foi possível carregar os dados');
}
```

**Como evitar:**
- ✅ SEMPRE usar try/catch em chamadas de API
- ✅ SEMPRE mostrar feedback ao usuário
- ✅ SEMPRE ter fallback/retry strategy

---

### **4. ❌ ERRO: Cannot read property 'X' of undefined**

**Causa:**
```typescript
// ❌ Acessando propriedade de objeto que pode ser null/undefined
const name = user.profile.name;
```

**Solução:**
```typescript
// ✅ Usar optional chaining
const name = user?.profile?.name || 'Unknown';
```

**Como evitar:**
- ✅ SEMPRE usar optional chaining (?.)
- ✅ SEMPRE ter valores padrão
- ✅ Validar dados antes de acessar

---

## 📊 CHECKLIST RESUMIDO (QUICK CHECK)

Use este checklist rápido antes de cada commit:

```
VALIDAÇÃO RÁPIDA (5 minutos):
☐ Console limpo (zero erros)
☐ Network limpo (zero 404/500)
☐ Funcionalidade testada (funciona 100%)
☐ 3 sanity checks (nenhuma regressão)
☐ Responsive (mobile + desktop)
☐ install.sh atualizado

SE TODOS ✅ → PODE COMMITAR
SE ALGUM ❌ → CORRIGIR ANTES
```

---

## 🎯 PROTOCOLO DE AUDIT SEMANAL

**QUANDO:** Toda segunda-feira, 09:00 CET

**O QUE FAZER:**

```bash
☐ 1. Audit completo do console (todas páginas)
☐ 2. Audit completo da Network tab (todas páginas)
☐ 3. Testar TODAS funcionalidades principais:
     - Login/Logout
     - Cadastro
     - Dashboard
     - Personagens
     - Rankings
     - Downloads
     - Loja (se existir)
☐ 4. Lighthouse em 5 páginas principais
☐ 5. Security scan básico
☐ 6. Performance check
☐ 7. Documentar QUALQUER problema encontrado
☐ 8. Criar tasks para corrigir problemas
```

---

## 📝 TEMPLATE DE RELATÓRIO DE VALIDAÇÃO

Após cada validação completa, preencher:

```markdown
## Relatório de Validação - V{VERSION}
**Data:** {DATE}
**Responsável:** {NAME}
**Tipo:** Pre-Commit | Pre-Deploy | Audit Semanal

### FASE 1: Análise Estática
- [ ] Imports: ✅ OK | ❌ ERRO
- [ ] Variáveis: ✅ OK | ❌ ERRO
- [ ] APIs: ✅ OK | ❌ ERRO
- [ ] Tipos: ✅ OK | ❌ ERRO

### FASE 2: Console Check
- [ ] Erros: 0
- [ ] Warnings: 0
- [ ] Status: ✅ OK | ❌ ERRO

### FASE 3: Network Check
- [ ] 404s: 0
- [ ] 500s: 0
- [ ] Failed: 0
- [ ] Status: ✅ OK | ❌ ERRO

### FASE 4: Functional Check
- [ ] Funcionalidade modificada: ✅ OK | ❌ ERRO
- [ ] Sanity checks: ✅ OK | ❌ ERRO
- [ ] Estados de erro: ✅ OK | ❌ ERRO

### FASE 5: Responsive Check
- [ ] Desktop: ✅ OK | ❌ ERRO
- [ ] Tablet: ✅ OK | ❌ ERRO
- [ ] Mobile: ✅ OK | ❌ ERRO

### FASE 6: Performance Check
- [ ] Lighthouse: {SCORE}
- [ ] Load time: {TIME}s
- [ ] Status: ✅ OK | ❌ ERRO

### FASE 7: Security Check
- [ ] Segredos: ✅ OK | ❌ ERRO
- [ ] Validação: ✅ OK | ❌ ERRO
- [ ] Autenticação: ✅ OK | ❌ ERRO

### FASE 8: Code Quality Check
- [ ] Código limpo: ✅ OK | ❌ ERRO
- [ ] Padrões: ✅ OK | ❌ ERRO
- [ ] Documentação: ✅ OK | ❌ ERRO

### RESULTADO FINAL
- [ ] ✅ APROVADO - Pode commitar/deployar
- [ ] ❌ REPROVADO - Corrigir problemas listados abaixo

### PROBLEMAS ENCONTRADOS
1. {PROBLEMA 1}
2. {PROBLEMA 2}
...

### AÇÕES NECESSÁRIAS
1. {AÇÃO 1}
2. {AÇÃO 2}
...
```

---

## 🔥 POLÍTICA DE ZERO TOLERANCE

**REGRAS ABSOLUTAS:**

1. **UM ERRO NO CONSOLE = REPROVADO**
   - Não existe "erro pequeno"
   - Não existe "vou corrigir depois"
   - ZERO erros ou não passa

2. **UMA REQUISIÇÃO FALHADA = REPROVADO**
   - Todas APIs devem retornar 200-299
   - Ou devem ter tratamento de erro adequado
   - ZERO requisições órfãs

3. **UMA REGRESSÃO = REPROVADO**
   - Funcionalidade que funcionava deve continuar funcionando
   - ZERO regressões aceitáveis

4. **PROTOCOLO NÃO SEGUIDO = REPROVADO**
   - Este protocolo é obrigatório
   - Não há exceções
   - Não há atalhos

---

## 🎓 TREINAMENTO

**Novos desenvolvedores DEVEM:**

1. Ler este documento completamente
2. Executar validação completa em código existente
3. Praticar em 5 commits de teste
4. Demonstrar proficiência antes de commit real

**Desenvolvedores experientes DEVEM:**

1. Revisar protocolo mensalmente
2. Sugerir melhorias ao protocolo
3. Mentorar novos desenvolvedores
4. Manter padrão de qualidade alto

---

## 📚 REFERÊNCIAS

- [Guidelines.md](/MD Files/Guidelines.md) - Regras gerais do projeto
- [Console DevTools](https://developer.chrome.com/docs/devtools/console/) - Como usar console
- [Network DevTools](https://developer.chrome.com/docs/devtools/network/) - Como usar network tab
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/) - Performance audit

---

## ✅ CONCLUSÃO

**LEMBRE-SE:**

- ✅ Este protocolo existe para **PROTEGER a qualidade do código**
- ✅ Cada etapa tem um **PROPÓSITO específico**
- ✅ Pular etapas = **INTRODUZIR BUGS**
- ✅ Seguir o protocolo = **CÓDIGO CONFIÁVEL**

**COMPROMISSO:**

> Eu, {NOME}, me comprometo a seguir este protocolo de validação
> em TODAS as alterações que eu fizer no código, sem exceções.
> Entendo que este protocolo existe para garantir qualidade,
> segurança e confiabilidade do sistema.

---

**Última atualização:** 2025-12-31 06:20 CET - V601
**Próxima revisão:** 2026-01-07

---

**🛡️ VALIDATION PROTOCOL - Engineering-Grade Quality Assurance**
