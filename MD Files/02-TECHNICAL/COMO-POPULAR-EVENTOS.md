# 🎯 COMO POPULAR OS EVENTOS NO BANCO DE DADOS

**Problema:** Página de eventos está vazia porque não há eventos cadastrados no banco `meuweb`.

**Solução:** Executar o seeder SQL que cria os eventos padrão do MU Online.

---

## 📋 **MÉTODO 1: Via Terminal SSH (RECOMENDADO)**

```bash
# 1. Acessar VPS via SSH
ssh root@seu-vps-ip

# 2. Navegar para a pasta do projeto
cd /home/meumu.cyou/backend-nodejs

# 3. Executar o seeder SQL
mysql -u root -p meuweb < src/seeders/events-seeder.sql

# 4. Verificar se os eventos foram criados
mysql -u root -p -e "USE meuweb; SELECT id, name, schedule_type FROM events;"
```

**Resultado esperado:**
```
+----+------------------------+---------------+
| id | name                   | schedule_type |
+----+------------------------+---------------+
|  1 | Blood Castle           | recurring     |
|  2 | Chaos Castle           | recurring     |
|  3 | Devil Square           | recurring     |
|  4 | Castle Siege           | weekly        |
|  5 | Golden Invasion        | daily         |
|  6 | Arca Mu (Happy Hour)   | daily         |
|  7 | White Wizard           | daily         |
+----+------------------------+---------------+
```

---

## 📋 **MÉTODO 2: Via phpMyAdmin (CyberPanel)**

1. Acessar **phpMyAdmin** via CyberPanel
2. Selecionar banco **meuweb** no menu lateral
3. Clicar na aba **"SQL"**
4. Copiar TODO o conteúdo de `/backend-nodejs/src/seeders/events-seeder.sql`
5. Colar na caixa de texto SQL
6. Clicar em **"Executar"**
7. Verificar mensagem: `✅ Eventos populados com sucesso!`

---

## 📋 **MÉTODO 3: Via Arquivo Local (Download/Upload)**

Se o arquivo não estiver no VPS ainda:

```bash
# No seu computador local
scp backend-nodejs/src/seeders/events-seeder.sql root@seu-vps-ip:/tmp/

# No VPS
ssh root@seu-vps-ip
mysql -u root -p meuweb < /tmp/events-seeder.sql
rm /tmp/events-seeder.sql
```

---

## ✅ **VERIFICAR SE FUNCIONOU**

### **1. Verificar no Banco:**
```sql
USE meuweb;
SELECT * FROM events WHERE is_active = TRUE;
```

### **2. Testar API:**
```bash
curl http://localhost:3001/api/events
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Blood Castle",
      "schedule_type": "recurring",
      "interval_hours": 2,
      ...
    },
    ...
  ]
}
```

### **3. Testar Frontend:**
1. Acessar site: `https://meumu.cyou`
2. Clicar em **"Eventos"** no menu
3. Deve aparecer:
   - ⏰ Horário do Servidor
   - 🎮 Cards dos 4 eventos em destaque (Blood Castle, Chaos Castle, Devil Square, Castle Siege)
   - 📋 Programação Completa com horários

---

## 🎨 **EVENTOS INCLUÍDOS NO SEEDER**

| Evento | Tipo | Frequência | Destaque |
|--------|------|------------|----------|
| **Blood Castle** | Recorrente | A cada 2 horas | ✅ |
| **Chaos Castle** | Recorrente | A cada 3 horas | ✅ |
| **Devil Square** | Recorrente | A cada 4 horas | ✅ |
| **Castle Siege** | Semanal | Sábados 20:00 | ✅ |
| **Golden Invasion** | Diário | 12:00, 18:00, 22:00 | ❌ |
| **Arca Mu (Happy Hour)** | Diário | 14:00, 20:00 | ❌ |
| **White Wizard** | Diário | 10:00, 15:00, 21:00 | ❌ |

---

## 🔧 **CUSTOMIZAR EVENTOS**

Se quiser alterar horários/configurações:

```sql
-- Exemplo: Alterar Castle Siege para Domingo 19:00
UPDATE events 
SET weekly_day = 0, weekly_time = '19:00'  -- 0 = Domingo
WHERE name = 'Castle Siege';

-- Exemplo: Desativar Golden Invasion
UPDATE events 
SET is_active = FALSE
WHERE name = 'Golden Invasion';

-- Exemplo: Adicionar evento aos destaques
UPDATE events 
SET is_featured = TRUE, priority = 7
WHERE name = 'Golden Invasion';
```

---

## ⚠️ **IMPORTANTE**

1. **BACKUP antes de executar:**
   ```bash
   mysqldump -u root -p meuweb events > events_backup.sql
   ```

2. **Se já existirem eventos**, o seeder pode dar erro de chave duplicada.  
   Nesse caso, **limpe a tabela primeiro** (CUIDADO: apaga todos os eventos):
   ```sql
   TRUNCATE TABLE events;
   ```

3. **Não executar múltiplas vezes** sem limpar antes, ou terá eventos duplicados.

---

## 🚀 **PRÓXIMOS PASSOS APÓS POPULAR**

1. ✅ Reiniciar backend Node.js (se necessário):
   ```bash
   pm2 restart backend
   ```

2. ✅ Acessar `/eventos` no site e verificar se aparece tudo

3. ✅ Testar se os contadores de tempo estão funcionando

4. ✅ Se quiser adicionar mais eventos, use o AdminCP > Editor de Site > Eventos

---

**EXECUTE O SEEDER AGORA E ME CONFIRME O RESULTADO! 🎯**
