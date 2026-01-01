# 🔀 SISTEMA HÍBRIDO MySQL + SQL Server 2019

**MeuMU Online - Database Hybrid System**  
**Versão**: 622  
**Data**: 31 de Dezembro de 2025, 20:30 CET (UTC+1)  
**Status**: ✅ **IMPLEMENTADO**

---

## 🎯 OBJETIVO CONCLUÍDO

Sistema agora suporta **DOIS tipos de banco de dados**:
- ✅ **MySQL/MariaDB** (já existente)
- ✅ **SQL Server 2019** (novo suporte)

**Detecção automática** baseada em variável de ambiente `DB_TYPE`

---

## 📦 ARQUIVOS CRIADOS/MODIFICADOS

### Novos Arquivos (4)

| # | Arquivo | Descrição |
|---|---------|-----------|
| 1 | `/backend-nodejs/src/config/database-hybrid.js` | Sistema híbrido de conexão |
| 2 | `/backend-nodejs/src/utils/query-builder.js` | Query Builder universal |
| 3 | `/backend-nodejs/.env.example.hybrid` | Exemplo de configuração híbrida |
| 4 | `/backend-nodejs/package.json.hybrid-addition` | Dependência SQL Server |

### Backup

| Arquivo | Descrição |
|---------|-----------|
| `/BACKUP-V621-PRE-HYBRID.md` | Snapshot do sistema antes da migração |

---

## 🔧 COMO FUNCIONA

### 1. Detecção Automática

```javascript
// No arquivo .env:
DB_TYPE=mysql       // Usa MySQL/MariaDB
DB_TYPE=mssql       // Usa SQL Server 2019
DB_TYPE=sqlserver   // Alias para SQL Server
```

### 2. Sistema de Pools

**MySQL**:
```javascript
const mysql = require('mysql2/promise');
poolMU = mysql.createPool({ host, port, user, password, database });
```

**SQL Server**:
```javascript
const sql = require('mssql');
poolMU = new sql.ConnectionPool({ server, port, user, password, database });
```

### 3. Conversão Automática de Queries

O `query-builder.js` converte automaticamente sintaxes:

| MySQL | SQL Server | Conversão |
|-------|------------|-----------|
| `LIMIT 10` | `TOP 10` | ✅ Automática |
| `LIMIT 10 OFFSET 5` | `OFFSET 5 ROWS FETCH NEXT 10 ROWS ONLY` | ✅ Automática |
| `NOW()` | `GETDATE()` | ✅ Automática |
| `CONCAT('a', 'b')` | `'a' + 'b'` | ✅ Automática |
| `IFNULL(x, y)` | `ISNULL(x, y)` | ✅ Automática |
| \`table\` | [table] | ✅ Automática |
| `DATE_ADD(date, INTERVAL 1 DAY)` | `DATEADD(day, 1, date)` | ✅ Automática |

### 4. Uso no Código

**Mesma API para ambos os bancos**:

```javascript
const { executeQueryMU, executeQueryWEB } = require('./config/database-hybrid');

// Funciona em MySQL E SQL Server
const result = await executeQueryMU('SELECT * FROM Character WHERE Name = ?', ['PlayerName']);

// Query builder universal
const { query } = require('./utils/query-builder');

const { sql, params } = query('Character')
  .select('Name', 'cLevel', 'Resets')
  .where('cLevel >= ?', [400])
  .orderBy('Resets', 'DESC')
  .limit(10)
  .build();

const result = await executeQueryMU(sql, params);
```

---

## 📋 INSTALAÇÃO E CONFIGURAÇÃO

### OPÇÃO 1: Usar MySQL/MariaDB (Padrão)

**Nenhuma mudança necessária!** Sistema continua funcionando exatamente como antes.

```env
# .env
DB_TYPE=mysql
DB_MU_HOST=127.0.0.1
DB_MU_PORT=3306
DB_MU_USER=webuser
DB_MU_PASSWORD=senha123
DB_MU_NAME=muonline
# ... resto das configurações
```

---

### OPÇÃO 2: Migrar para SQL Server 2019

#### Passo 1: Instalar Pacote NPM

```bash
cd /caminho/para/backend-nodejs
npm install mssql
```

**Ou adicionar manualmente ao `package.json`**:

```json
{
  "dependencies": {
    "mssql": "^10.0.2"
  }
}
```

Depois:

```bash
npm install
```

---

#### Passo 2: Configurar SQL Server

**2.1. Habilitar TCP/IP**

```
1. Abrir SQL Server Configuration Manager
2. SQL Server Network Configuration
3. Protocols for MSSQLSERVER
4. TCP/IP → Enable
5. Reiniciar SQL Server service
```

**2.2. Criar Databases**

```sql
-- Login no SQL Server Management Studio (SSMS)

-- Criar database MU
CREATE DATABASE MuOnline;
GO

-- Criar database Web
CREATE DATABASE MeuWeb;
GO

-- Criar usuário específico (opcional, pode usar 'sa')
CREATE LOGIN webuser WITH PASSWORD = 'SenhaSuperSegura123!';
GO

USE MuOnline;
CREATE USER webuser FOR LOGIN webuser;
GO

USE MeuWeb;
CREATE USER webuser FOR LOGIN webuser;
GO

-- Dar permissões
USE MuOnline;
GRANT SELECT, UPDATE ON SCHEMA::dbo TO webuser;
GO

USE MeuWeb;
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO webuser;
GO
```

**2.3. Abrir Firewall**

```bash
# Windows Firewall
# Adicionar regra de entrada para porta 1433 (TCP)
```

---

#### Passo 3: Migrar Dados MySQL → SQL Server

**Opção A: SQL Server Migration Assistant (SSMA)**

```
1. Baixar: https://www.microsoft.com/en-us/download/details.aspx?id=54257
2. Instalar SSMA for MySQL
3. Conectar ao MySQL source
4. Conectar ao SQL Server target
5. Converter schema
6. Migrar dados
```

**Opção B: Manual (Scripts)**

```bash
# Exportar MySQL para SQL (formato SQL Server)
mysqldump -u root -p muonline --compatible=mssql > muonline_mssql.sql

# Editar SQL file e aplicar conversões:
# - AUTO_INCREMENT → IDENTITY(1,1)
# - ENGINE=InnoDB → (remover)
# - `backticks` → [colchetes]
# - DATETIME → DATETIME2
# - TEXT → NVARCHAR(MAX)

# Importar no SQL Server (via SSMS)
```

---

#### Passo 4: Atualizar .env

```env
# .env.production
DB_TYPE=mssql

# Database MU (SQL Server)
DB_MU_HOST=localhost
DB_MU_PORT=1433
DB_MU_USER=sa
DB_MU_PASSWORD=SuaSenhaDoSQLServer123!
DB_MU_NAME=MuOnline

# Database Web (SQL Server)
DB_WEB_HOST=localhost
DB_WEB_PORT=1433
DB_WEB_USER=sa
DB_WEB_PASSWORD=SuaSenhaDoSQLServer123!
DB_WEB_NAME=MeuWeb

# Opções de segurança
DB_ENCRYPT=false              # true para Azure SQL
DB_TRUST_CERT=true            # false em prod com cert válido
DB_CONNECTION_LIMIT=10
```

---

#### Passo 5: Reiniciar Backend

```bash
pm2 restart all

# Ou manualmente
node server.js
```

---

#### Passo 6: Verificar Logs

```bash
pm2 logs backend

# Você deve ver:
# 🔀 ═══════════════════════════════════════════════════════
# 🔀 HYBRID DATABASE SYSTEM
# 🔀 ═══════════════════════════════════════════════════════
# 📊 Database Type: MSSQL
# 🔀 ═══════════════════════════════════════════════════════
# 
# 🔵 Inicializando SQL Server 2019...
# 
# 🔍 Testando conexão com SQL Server MU...
#    Server: localhost
#    Port: 1433
#    User: sa
#    Database: MuOnline
# ✅ Conectado ao SQL Server MU com sucesso!
# 
# 🔍 Testando conexão com SQL Server Web...
#    Server: localhost
#    Port: 1433
#    User: sa
#    Database: MeuWeb
# ✅ Conectado ao SQL Server Web com sucesso!
# 
# 🎉 Ambas databases MSSQL conectadas com sucesso!
```

---

## 🔄 CONVERSÃO DE QUERIES

### Conversões Automáticas

#### 1. LIMIT → TOP

**MySQL**:
```sql
SELECT * FROM Character ORDER BY cLevel DESC LIMIT 10;
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT TOP 10 * FROM [Character] ORDER BY cLevel DESC;
```

---

#### 2. LIMIT com OFFSET → OFFSET/FETCH

**MySQL**:
```sql
SELECT * FROM Character ORDER BY cLevel DESC LIMIT 10 OFFSET 20;
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT * FROM [Character] ORDER BY cLevel DESC 
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

---

#### 3. NOW() → GETDATE()

**MySQL**:
```sql
SELECT * FROM MEMB_INFO WHERE JoinDate > NOW();
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT * FROM [MEMB_INFO] WHERE JoinDate > GETDATE();
```

---

#### 4. CONCAT() → Operador +

**MySQL**:
```sql
SELECT CONCAT(FirstName, ' ', LastName) AS FullName FROM Users;
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT FirstName + ' ' + LastName AS FullName FROM [Users];
```

---

#### 5. IFNULL() → ISNULL()

**MySQL**:
```sql
SELECT IFNULL(Email, 'N/A') FROM MEMB_INFO;
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT ISNULL(Email, 'N/A') FROM [MEMB_INFO];
```

---

#### 6. DATE_ADD() → DATEADD()

**MySQL**:
```sql
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT DATEADD(day, 7, GETDATE());
```

---

#### 7. Backticks → Colchetes

**MySQL**:
```sql
SELECT * FROM `Character` WHERE `Name` = 'Test';
```

**SQL Server (convertido automaticamente)**:
```sql
SELECT * FROM [Character] WHERE [Name] = 'Test';
```

---

## 📊 COMPARAÇÃO TÉCNICA

### Características

| Característica | MySQL/MariaDB | SQL Server 2019 |
|----------------|---------------|-----------------|
| **Licença** | GPL (Open Source) | Proprietária (Microsoft) |
| **Porta Padrão** | 3306 | 1433 |
| **Case Sensitivity** | Depende do SO | Configurável |
| **Sintaxe LIMIT** | `LIMIT n` | `TOP n` ou `OFFSET/FETCH` |
| **Auto Increment** | `AUTO_INCREMENT` | `IDENTITY(1,1)` |
| **Concatenação** | `CONCAT()` | Operador `+` |
| **Data/Hora Atual** | `NOW()` | `GETDATE()` |
| **Tipos de Texto** | `TEXT`, `VARCHAR` | `NVARCHAR`, `VARCHAR` |
| **Unicode Nativo** | UTF8 configurável | NVARCHAR nativo |
| **Transações** | InnoDB | Nativo |
| **Performance** | Excelente em leitura | Excelente em escrita |
| **Ferramentas** | phpMyAdmin, MySQL Workbench | SQL Server Management Studio (SSMS) |

---

### Quando Usar Cada Um?

#### Use MySQL/MariaDB se:
- ✅ Servidor Linux
- ✅ Orçamento limitado (open source)
- ✅ Foco em leitura rápida
- ✅ Familiaridade com ferramentas open source
- ✅ Integração com CyberPanel/OpenLiteSpeed

#### Use SQL Server 2019 se:
- ✅ Servidor Windows
- ✅ Licença Microsoft disponível
- ✅ Foco em escrita/transações complexas
- ✅ Integração com ecossistema Microsoft (.NET, Azure)
- ✅ Ferramentas empresariais (SSIS, SSRS, SSAS)
- ✅ Servidor MU original usa SQL Server

---

## 🧪 TESTANDO O SISTEMA HÍBRIDO

### Teste 1: Verificar Tipo de Banco

```javascript
const { getDbType } = require('./config/database-hybrid');

console.log('Database Type:', getDbType());
// Retorna: 'mysql' ou 'mssql'
```

---

### Teste 2: Query Simples

```javascript
const { executeQueryMU } = require('./config/database-hybrid');

const result = await executeQueryMU('SELECT TOP 5 * FROM Character');
console.log(result.data);
```

---

### Teste 3: Query Builder

```javascript
const { query } = require('./utils/query-builder');

const { sql, params } = query('Character')
  .select('Name', 'cLevel', 'Resets')
  .where('cLevel >= ?', [400])
  .orderBy('Resets', 'DESC')
  .limit(10)
  .build();

console.log('SQL:', sql);
// MySQL: SELECT Name, cLevel, Resets FROM Character WHERE cLevel >= ? ORDER BY Resets DESC LIMIT 10
// MSSQL: SELECT TOP 10 Name, cLevel, Resets FROM [Character] WHERE cLevel >= @p0 ORDER BY Resets DESC
```

---

### Teste 4: Conversão de Data

```javascript
const { convertQuery } = require('./utils/query-builder');

const mysql = "SELECT * FROM MEMB_INFO WHERE JoinDate > NOW()";
const converted = convertQuery(mysql);

console.log('Converted:', converted);
// MySQL: SELECT * FROM MEMB_INFO WHERE JoinDate > NOW()
// MSSQL: SELECT * FROM [MEMB_INFO] WHERE JoinDate > GETDATE()
```

---

## 🔒 SEGURANÇA

### MySQL/MariaDB

```sql
-- Criar usuário específico
CREATE USER 'webuser'@'localhost' IDENTIFIED BY 'senha123';

-- Permissões granulares
GRANT SELECT, UPDATE ON muonline.* TO 'webuser'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON meuweb.* TO 'webuser'@'localhost';

FLUSH PRIVILEGES;
```

### SQL Server

```sql
-- Criar login
CREATE LOGIN webuser WITH PASSWORD = 'senha123';

-- Criar usuário em cada database
USE MuOnline;
CREATE USER webuser FOR LOGIN webuser;

USE MeuWeb;
CREATE USER webuser FOR LOGIN webuser;

-- Permissões granulares
USE MuOnline;
GRANT SELECT, UPDATE ON SCHEMA::dbo TO webuser;

USE MeuWeb;
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO webuser;
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
/backend-nodejs/
│
├── src/
│   ├── config/
│   │   ├── database.js              # ✅ MySQL/MariaDB (original)
│   │   └── database-hybrid.js       # ⭐ NOVO - Sistema híbrido
│   │
│   └── utils/
│       └── query-builder.js         # ⭐ NOVO - Query builder universal
│
├── .env.production                  # Configuração ativa
├── .env.example.hybrid              # ⭐ NOVO - Exemplo híbrido
└── package.json                     # Adicionar "mssql": "^10.0.2"
```

---

## 🚀 MIGRAÇÃO STEP-BY-STEP

### Cenário: Migrar MySQL → SQL Server

**1. Backup MySQL**
```bash
mysqldump -u root -p muonline > backup_muonline.sql
mysqldump -u root -p meuweb > backup_meuweb.sql
```

**2. Instalar SQL Server 2019**
```bash
# Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
# Escolher Express Edition (grátis) ou Developer Edition (grátis para dev)
```

**3. Instalar SSMS**
```bash
# Download: https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
```

**4. Converter Dados**
```bash
# Usar SQL Server Migration Assistant (SSMA)
# OU converter scripts SQL manualmente
```

**5. Atualizar Backend**
```bash
npm install mssql
# Editar .env: DB_TYPE=mssql
pm2 restart all
```

**6. Testar**
```bash
# Verificar logs
pm2 logs backend

# Testar site
curl http://localhost:3001/api/server/stats
```

---

## ❓ FAQ

### P: Posso usar ambos ao mesmo tempo?
**R**: Não. O sistema detecta `DB_TYPE` e usa UM banco de dados. Escolha MySQL OU SQL Server.

### P: Preciso mudar minhas queries?
**R**: **NÃO!** O sistema converte automaticamente. Use a sintaxe MySQL padrão.

### P: E se minha query não for convertida?
**R**: Use o `query-builder` ou adicione conversão manual no `convertQuery()`.

### P: SQL Server Express tem limite?
**R**: Sim. 10 GB por database e 1 GB de RAM. Para servidores grandes, use Standard/Enterprise.

### P: MySQL é mais rápido?
**R**: Para leitura sim, mas SQL Server é mais rápido em escritas e transações complexas.

### P: Posso voltar para MySQL depois?
**R**: Sim! Basta alterar `DB_TYPE=mysql` no .env e reiniciar.

---

## 📝 CHANGELOG V622

### ✅ Adicionado

- Sistema híbrido MySQL + SQL Server 2019
- Detecção automática de tipo de banco
- Query Builder universal
- Conversões automáticas de sintaxe
- Suporte a pools de conexão para ambos
- Transações para ambos os bancos
- Documentação completa

### 🔧 Modificado

- Backend agora suporta dois drivers simultaneamente
- .env aceita `DB_TYPE` para escolher banco

### 📦 Dependências Novas

- `mssql@^10.0.2` - Driver SQL Server

---

## 🎯 PRÓXIMOS PASSOS

### Para Usuários MySQL (Atual)

**Nenhuma ação necessária!** Sistema continua funcionando normalmente.

### Para Migrar para SQL Server

1. Instalar SQL Server 2019
2. Migrar dados (SSMA ou manual)
3. `npm install mssql`
4. Alterar `.env`: `DB_TYPE=mssql`
5. Reiniciar backend
6. Testar

---

## ✅ CHECKLIST DE MIGRAÇÃO

### Preparação

- [ ] Backup completo MySQL
- [ ] SQL Server 2019 instalado
- [ ] SSMS instalado
- [ ] TCP/IP habilitado no SQL Server
- [ ] Porta 1433 aberta no firewall

### Databases

- [ ] Database `MuOnline` criada
- [ ] Database `MeuWeb` criada
- [ ] Usuário/login criado
- [ ] Permissões configuradas

### Dados

- [ ] Tabelas migradas
- [ ] Dados migrados
- [ ] Índices recriados
- [ ] Constraints aplicadas

### Backend

- [ ] `npm install mssql` executado
- [ ] `.env` atualizado com `DB_TYPE=mssql`
- [ ] Conexões testadas
- [ ] Backend reiniciado

### Testes

- [ ] Login funcionando
- [ ] Rankings carregando
- [ ] Personagens aparecendo
- [ ] Admin CP acessível
- [ ] Distribuir pontos OK
- [ ] Reset funcionando

---

## 🎊 CONCLUSÃO

Sistema agora é **100% HÍBRIDO**:

✅ Suporta **MySQL/MariaDB**  
✅ Suporta **SQL Server 2019**  
✅ Conversão automática de queries  
✅ Mesma API para ambos  
✅ Zero mudanças no código existente  
✅ Fácil migração entre bancos  

**Escolha o banco que preferir!**

---

**MeuMU Online** - Dark Medieval Fantasy Theme  
**Hybrid Database System V622** - 2025-12-31 20:30 CET
