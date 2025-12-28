# 🗄️ ÍNDICE DE SCRIPTS SQL

**Última Atualização**: V514 - 28/12/2024

Esta pasta contém scripts SQL, migrations e correções de banco de dados.

---

## 📁 SCRIPTS DISPONÍVEIS

### **Scripts de Correção (Versões Antigas)**
Scripts SQL que corrigiram problemas específicos em versões anteriores.

### **Nota Importante**
Scripts SQL arquivados aqui são de **referência histórica**.
Não executar sem entender o contexto da versão em que foram criados.

---

## 📝 ESTRUTURA RECOMENDADA

Ao criar novos scripts SQL, use o padrão:
```
<ACAO>-<TABELA>-<DESCRICAO>.sql
```

Exemplo:
```
FIX-GUILDS-LOGIN.sql
CREATE-WCOIN-PACKAGES.sql
MIGRATION-V514-ADD-TICKETS.sql
```

---

## ⚠️ AVISOS

1. **SEMPRE** faça backup antes de executar scripts em produção
2. Scripts de correção geralmente são **one-time** (executar apenas uma vez)
3. Verifique a versão do schema antes de aplicar migrations
4. **NUNCA** execute scripts diretamente no banco `muonline` (READ-ONLY)

---

**FIM DO ÍNDICE**
