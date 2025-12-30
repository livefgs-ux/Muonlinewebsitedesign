# ✅ V574 - CORREÇÃO AUTOMÁTICA DE BUGS

**Data:** 2025-12-30 17:40 CET  
**Versão:** V574  
**Status:** ✅ INTEGRADO NO INSTALL.SH

---

## 🎯 **BUGS CORRIGIDOS AUTOMATICAMENTE:**

### 1. 🛒 **Pacotes WCoin Duplicados**
- **Problema:** Loja mostrando 10, 30, 60, 120, 300, 600 múltiplas vezes
- **Causa:** Script de seed executado várias vezes
- **Solução:** Remove duplicatas e mantém apenas 6 pacotes únicos

### 2. 🗓️ **Tabela Events com Campo Color Incorreto**
- **Problema:** Campo `color` como ENUM (não aceita 'gold' e 'ethereal')
- **Causa:** Definição restritiva no SQL
- **Solução:** Converte para VARCHAR(20) aceitando qualquer cor

---

## 🚀 **COMO EXECUTAR:**

### **MÉTODO AUTOMÁTICO (RECOMENDADO):**

```bash
cd /home/meumu.com/public_html
bash install.sh
```

**No menu, escolha a opção:**
```
12) 🛠️  Corrigir Bugs V574 (WCoin + Events)
```

**O instalador irá:**
1. ✅ Mostrar explicação dos bugs a serem corrigidos
2. ⚠️  Solicitar confirmação (Digite `s` para confirmar)
3. 🔧 Executar correção dos pacotes WCoin
4. 🗓️  Verificar e corrigir tabela de eventos
5. 📊 Mostrar resumo das correções
6. ✅ Finalizar com instruções de próximos passos

---

## 📋 **O QUE A CORREÇÃO FAZ:**

### **Etapa 1: Pacotes WCoin**
```sql
-- Deleta TODOS os pacotes existentes
DELETE FROM wcoin_packages;

-- Reseta AUTO_INCREMENT
ALTER TABLE wcoin_packages AUTO_INCREMENT = 1;

-- Insere APENAS 6 pacotes corretos:
INSERT INTO wcoin_packages ...
```

**Resultado:**
- R$ 10,00 → 1.000 WCoin (sem bônus)
- R$ 30,00 → 3.000 WCoin + 300 bônus (+10%)
- R$ 60,00 → 6.000 WCoin + 900 bônus (+15%)
- R$ 120,00 → 12.000 WCoin + 2.400 bônus (+20%)
- R$ 300,00 → 30.000 WCoin + 7.500 bônus (+25%)
- R$ 600,00 → 60.000 WCoin + 18.000 bônus (+30%)

### **Etapa 2: Tabela Events**

**Se a tabela JÁ EXISTE:**
```sql
-- Verifica tipo do campo 'color'
SHOW COLUMNS FROM events LIKE 'color';

-- Se for ENUM, converte para VARCHAR:
-- 1. Faz backup
CREATE TABLE events_backup_v574 AS SELECT * FROM events;

-- 2. Altera campo
ALTER TABLE events MODIFY COLUMN color VARCHAR(20) DEFAULT 'yellow';
```

**Se a tabela NÃO EXISTE:**
```sql
-- Executa script completo
SOURCE /backend-nodejs/database/06_create_events_table.sql;
```

---

## 📊 **EXEMPLO DE EXECUÇÃO:**

```
════════════════════════════════════════════════════════════
          🔧 CORREÇÃO DE BUGS - V574
════════════════════════════════════════════════════════════

Esta função corrige os seguintes bugs:

1) 🛒 Pacotes WCoin duplicados na loja
   → Remove duplicatas e mantém apenas 6 pacotes únicos

2) 🗓️  Tabela de eventos com campo 'color' incorreto
   → Recria tabela aceitando cores personalizadas

⚠️  ATENÇÃO: Isso irá:
   - DELETAR todos os pacotes WCoin existentes
   - Recriar a tabela 'events' (se existir)

Deseja continuar? [s/N]: s

═══════════════════════════════════════════════════════════
              INICIANDO CORREÇÕES
═══════════════════════════════════════════════════════════

[1/2] Corrigindo pacotes WCoin duplicados...
✅ Pacotes WCoin corrigidos!
   📦 Total de pacotes agora: 6
   ✅ Quantidade correta (6 pacotes únicos)

   📋 Pacotes criados:
   +----+-------+--------+----------+
   | id | WCoin | Preço  | Moeda    |
   +----+-------+--------+----------+
   |  1 |  1000 |  10.00 | BRL      |
   |  2 |  3000 |  30.00 | BRL      |
   |  3 |  6000 |  60.00 | BRL      |
   |  4 | 12000 | 120.00 | BRL      |
   |  5 | 30000 | 300.00 | BRL      |
   |  6 | 60000 | 600.00 | BRL      |
   +----+-------+--------+----------+

[2/2] Verificando tabela de eventos...
   Tabela 'events' existe. Verificando estrutura...
   ✅ Campo 'color' já está correto (VARCHAR)

════════════════════════════════════════════════════════════
           ✅ CORREÇÕES CONCLUÍDAS - V574
════════════════════════════════════════════════════════════

📋 Resumo:
   ✅ Pacotes WCoin corrigidos
   ✅ Tabela events verificada

🔄 Próximo passo:
   - Faça build do frontend (opção 4)
   - Limpe o cache do navegador (Ctrl + Shift + Delete)
   - Teste a loja (deve ter exatamente 6 pacotes)
```

---

## ✅ **APÓS A CORREÇÃO:**

### 1. **Build do Frontend:**
```bash
# No menu do install.sh, escolha:
4) 🏗️  Build Frontend
```

### 2. **Limpar Cache do Navegador:**
- **Windows/Linux:** `Ctrl + Shift + Delete`
- **Mac:** `Cmd + Shift + Delete`
- Selecione: **Imagens e arquivos em cache**
- Tempo: **Últimas 24 horas**

### 3. **Hard Refresh:**
- **Ctrl + Shift + R** (ou **Cmd + Shift + R** no Mac)

### 4. **Testar:**
- Faça login no site
- Vá para **Dashboard → Loja**
- **Deve aparecer EXATAMENTE 6 pacotes**
- Sem duplicatas

---

## 🔧 **ARQUIVOS ENVOLVIDOS:**

### **Script SQL de Correção:**
```
/home/meumu.com/public_html/backend-nodejs/src/seeders/fix-wcoin-duplicates.sql
```

### **Script de Eventos:**
```
/home/meumu.com/public_html/backend-nodejs/database/06_create_events_table.sql
```

### **Instalador:**
```
/home/meumu.com/public_html/install.sh (opção 12)
```

---

## 🛡️ **SEGURANÇA:**

### **Backup Automático:**
- ✅ Tabela `events` é copiada para `events_backup_v574` antes de alterações
- ✅ Backup fica disponível para rollback se necessário

### **Confirmação Obrigatória:**
- ⚠️ O script solicita confirmação antes de DELETAR dados
- ✅ Digite `s` para confirmar, `n` para cancelar

### **Logs de Erro:**
- ✅ Erros são salvos em `/tmp/wcoin_fix.log` e `/tmp/events_alter.log`
- ✅ Podem ser consultados em caso de falha

---

## 🧪 **VERIFICAÇÃO MANUAL (OPCIONAL):**

### **Ver pacotes no banco:**
```sql
USE meuweb;
SELECT * FROM wcoin_packages ORDER BY price ASC;
```

**Resultado esperado:** 6 linhas

### **Ver eventos no banco:**
```sql
USE meuweb;
SHOW COLUMNS FROM events LIKE 'color';
```

**Resultado esperado:** `Type = varchar(20)`

---

## ⚠️ **AVISOS IMPORTANTES:**

1. **BACKUP:** A correção deleta TODOS os pacotes WCoin. Se tiver configurações personalizadas, anote antes!

2. **CONFIRMAÇÃO:** Sempre leia a mensagem de confirmação antes de digitar `s`

3. **FRONTEND BUILD:** Após a correção, SEMPRE faça build do frontend (não afeta backend, mas melhora a experiência)

4. **CACHE:** SEMPRE limpe o cache do navegador após correções

---

## 📚 **DOCUMENTAÇÃO RELACIONADA:**

- `V574_CHANGELOG.md` - Lista completa de mudanças
- `V574_AUDITORIA_COMPLETA_FINAL.md` - Auditoria técnica
- `V574_FIX_WCOIN_DUPLICATES.md` - Detalhes da correção WCoin

---

**CORREÇÃO 100% AUTOMATIZADA - APENAS EXECUTE A OPÇÃO 12!** 🎉

*Última atualização: 2025-12-30 17:40 CET*
