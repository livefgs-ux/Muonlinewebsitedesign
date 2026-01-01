# 🔀 HYBRID DATABASE SYSTEM

**MeuMU Online agora suporta MySQL E SQL Server 2019!**

---

## 🚀 QUICK START

### Usar MySQL/MariaDB (Padrão)

Nenhuma mudança necessária! Sistema continua funcionando.

```env
# .env
DB_TYPE=mysql
```

---

### Usar SQL Server 2019

**1. Instalar pacote:**

```bash
npm install mssql
```

**2. Configurar .env:**

```env
DB_TYPE=mssql
DB_MU_HOST=localhost
DB_MU_PORT=1433
DB_MU_USER=sa
DB_MU_PASSWORD=SuaSenha123!
DB_MU_NAME=MuOnline
DB_WEB_HOST=localhost
DB_WEB_PORT=1433
DB_WEB_USER=sa
DB_WEB_PASSWORD=SuaSenha123!
DB_WEB_NAME=MeuWeb
```

**3. Reiniciar:**

```bash
pm2 restart all
```

---

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | Descrição |
|---------|-----------|
| `src/config/database-hybrid.js` | Sistema híbrido principal |
| `src/utils/query-builder.js` | Conversor de queries |
| `.env.example.hybrid` | Exemplo de configuração |
| `scripts/convert-mysql-to-sqlserver.sql` | Guia de conversão |

---

## 📖 DOCUMENTAÇÃO COMPLETA

Veja: `/MD Files/HYBRID-SYSTEM-V622-COMPLETE.md`

---

## ✅ COMPATIBILIDADE

✅ MySQL 5.7+  
✅ MariaDB 10.3+  
✅ SQL Server 2019  
✅ Azure SQL Database  

---

## 🔄 CONVERSÕES AUTOMÁTICAS

| MySQL | SQL Server |
|-------|------------|
| `LIMIT 10` | `TOP 10` |
| `NOW()` | `GETDATE()` |
| `CONCAT()` | `+` |
| \`table\` | [table] |

**Sistema converte automaticamente!**

---

## 📞 SUPORTE

Problemas? Veja a documentação completa em:
`/MD Files/HYBRID-SYSTEM-V622-COMPLETE.md`

---

**MeuMU Online** - V622 Hybrid System
