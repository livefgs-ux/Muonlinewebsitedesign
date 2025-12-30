# 🛒 V574 - CORREÇÃO DE PACOTES WCOIN DUPLICADOS

**Data:** 2025-12-30 17:15 CET  
**Versão:** V574  
**Problema:** Pacotes de WCoin aparecem duplicados na loja (10, 30, 60, 120, 300, 600 aparecendo múltiplas vezes)

---

## 🔍 DIAGNÓSTICO

### Problema Identificado:
- ✅ Código do frontend está correto (WCoinShop.tsx)
- ✅ Código do backend está correto (wcoinController.js)
- ❌ **Banco de dados tem pacotes DUPLICADOS na tabela `wcoin_packages`**

### Causa:
Provavelmente o script de criação da tabela foi executado múltiplas vezes, inserindo pacotes repetidos.

---

## 📊 VERIFICAR DUPLICATAS (EXECUTAR PRIMEIRO!)

### 1. Conectar no MariaDB:
```bash
mysql -u root -p
```

### 2. Verificar pacotes atuais:
```sql
USE meuweb;

-- Ver todos os pacotes
SELECT 
  id, 
  name, 
  wcoin_amount, 
  price, 
  currency, 
  is_active, 
  display_order,
  created_at
FROM wcoin_packages 
ORDER BY price ASC, id ASC;

-- Contar total de pacotes
SELECT COUNT(*) AS total_pacotes FROM wcoin_packages;

-- Ver duplicatas por preço
SELECT 
  price, 
  COUNT(*) AS quantidade
FROM wcoin_packages 
GROUP BY price 
HAVING COUNT(*) > 1;
```

### Resultado Esperado (ANTES DA CORREÇÃO):
```
+----+------------------+--------------+--------+----------+-----------+---------------+
| id | name             | wcoin_amount | price  | currency | is_active | display_order |
+----+------------------+--------------+--------+----------+-----------+---------------+
|  1 | Pacote Iniciante |         1000 |  10.00 | BRL      |         1 |             1 |
|  7 | Pacote Iniciante |         1000 |  10.00 | BRL      |         1 |             1 | ❌ DUPLICATA
| 13 | Pacote Iniciante |         1000 |  10.00 | BRL      |         1 |             1 | ❌ DUPLICATA
|  2 | Pacote Bronze    |         3000 |  30.00 | BRL      |         1 |             2 |
|  8 | Pacote Bronze    |         3000 |  30.00 | BRL      |         1 |             2 | ❌ DUPLICATA
| ...e assim por diante                                                               |
+----+------------------+--------------+--------+----------+-----------+---------------+
```

**Se houver mais de 6 linhas, significa que há duplicatas!**

---

## ✅ SOLUÇÃO: LIMPAR E RECRIAR PACOTES

### Método 1: Usando o Script Pronto (RECOMENDADO)

```bash
# 1. Ir para pasta do backend
cd /home/meumu.com/public_html/backend-nodejs

# 2. Executar script de correção
mysql -u root -p meuweb < src/seeders/fix-wcoin-duplicates.sql
```

**Digite a senha do MySQL quando solicitado**

---

### Método 2: Manual (via MySQL CLI)

```sql
USE meuweb;

-- 1. BACKUP (opcional, mas recomendado)
CREATE TABLE wcoin_packages_backup AS SELECT * FROM wcoin_packages;

-- 2. DELETAR TODOS OS PACOTES
DELETE FROM wcoin_packages;

-- 3. RESETAR AUTO_INCREMENT
ALTER TABLE wcoin_packages AUTO_INCREMENT = 1;

-- 4. CRIAR PACOTES CORRETOS (apenas 1 de cada)

-- R$ 10
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Iniciante', 1000, 0, '10.00', 'BRL', '#', 1, 1);

-- R$ 30
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Bronze', 3000, 300, '30.00', 'BRL', '#', 1, 2);

-- R$ 60
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Prata', 6000, 900, '60.00', 'BRL', '#', 1, 3);

-- R$ 120
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Ouro', 12000, 2400, '120.00', 'BRL', '#', 1, 4);

-- R$ 300
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Diamante', 30000, 7500, '300.00', 'BRL', '#', 1, 5);

-- R$ 600
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, is_active, display_order)
VALUES ('Pacote Lendário', 60000, 18000, '600.00', 'BRL', '#', 1, 6);

-- 5. VERIFICAR RESULTADO
SELECT 
  id, 
  name, 
  wcoin_amount, 
  bonus_amount,
  price, 
  currency, 
  is_active, 
  display_order 
FROM wcoin_packages 
ORDER BY display_order ASC;

-- 6. CONTAR (deve mostrar exatamente 6)
SELECT COUNT(*) AS total FROM wcoin_packages;
```

---

## 📊 RESULTADO ESPERADO (APÓS CORREÇÃO)

```
+----+-------------------+--------------+--------------+--------+----------+-----------+---------------+
| id | name              | wcoin_amount | bonus_amount | price  | currency | is_active | display_order |
+----+-------------------+--------------+--------------+--------+----------+-----------+---------------+
|  1 | Pacote Iniciante  |         1000 |            0 |  10.00 | BRL      |         1 |             1 |
|  2 | Pacote Bronze     |         3000 |          300 |  30.00 | BRL      |         1 |             2 |
|  3 | Pacote Prata      |         6000 |          900 |  60.00 | BRL      |         1 |             3 |
|  4 | Pacote Ouro       |        12000 |         2400 | 120.00 | BRL      |         1 |             4 |
|  5 | Pacote Diamante   |        30000 |         7500 | 300.00 | BRL      |         1 |             5 |
|  6 | Pacote Lendário   |        60000 |        18000 | 600.00 | BRL      |         1 |             6 |
+----+-------------------+--------------+--------------+--------+----------+-----------+---------------+
6 rows in set (0.001 sec)
```

---

## 🧪 TESTAR NO SITE

### 1. Após executar a correção SQL:
```bash
# NÃO precisa fazer build (backend apenas)
# NÃO precisa reiniciar backend (query direta no DB)
```

### 2. No navegador:
- **Ctrl + Shift + R** (Hard refresh)
- Ir para **Dashboard → Loja**
- Deve aparecer **EXATAMENTE 6 PACOTES:**
  - R$ 10,00 (1.000 WCoin)
  - R$ 30,00 (3.000 WCoin + 300 Bônus)
  - R$ 60,00 (6.000 WCoin + 900 Bônus)
  - R$ 120,00 (12.000 WCoin + 2.400 Bônus)
  - R$ 300,00 (30.000 WCoin + 7.500 Bônus)
  - R$ 600,00 (60.000 WCoin + 18.000 Bônus)

---

## ✅ CHECKLIST FINAL

- [ ] Conectar no MySQL
- [ ] Verificar duplicatas com `SELECT COUNT(*)`
- [ ] Executar script de correção
- [ ] Verificar que restaram apenas 6 pacotes
- [ ] Hard refresh no navegador
- [ ] Conferir loja mostra exatamente 6 pacotes
- [ ] Zero duplicatas

---

## 🛡️ PREVENIR DUPLICATAS NO FUTURO

### Adicionar constraint UNIQUE (opcional):
```sql
USE meuweb;

-- Criar índice único para evitar preços duplicados
ALTER TABLE wcoin_packages 
ADD UNIQUE INDEX unique_price_currency (price, currency);
```

**Isso impedirá que sejam inseridos pacotes com o mesmo preço e moeda.**

---

## 📝 DETALHES DOS PACOTES

| Preço | WCoin | Bônus | Total Final | Desconto Efetivo |
|-------|-------|-------|-------------|------------------|
| R$ 10 | 1.000 | 0 | 1.000 | - |
| R$ 30 | 3.000 | 300 | 3.300 | +10% |
| R$ 60 | 6.000 | 900 | 6.900 | +15% |
| R$ 120 | 12.000 | 2.400 | 14.400 | +20% |
| R$ 300 | 30.000 | 7.500 | 37.500 | +25% |
| R$ 600 | 60.000 | 18.000 | 78.000 | +30% |

---

## ⚠️ AVISOS IMPORTANTES

1. **BACKUP:** O comando `DELETE FROM wcoin_packages` remove TODOS os pacotes. Se tiver dados importantes, faça backup primeiro:
   ```sql
   CREATE TABLE wcoin_packages_backup AS SELECT * FROM wcoin_packages;
   ```

2. **TRANSAÇÕES:** Se quiser testar antes de confirmar:
   ```sql
   START TRANSACTION;
   -- ... executar comandos ...
   -- Se tudo OK: COMMIT;
   -- Se deu errado: ROLLBACK;
   ```

3. **FRONTEND NÃO PRECISA BUILD:** A correção é apenas no banco de dados, o código do frontend já está correto.

---

**EXECUTE O SCRIPT E CONFIRME SE AGORA APARECEM APENAS 6 PACOTES!** 🎉

*Última atualização: 2025-12-30 17:15 CET*
