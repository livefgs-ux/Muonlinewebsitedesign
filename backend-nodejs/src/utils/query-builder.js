/**
 * 🔧 QUERY BUILDER UNIVERSAL
 * 
 * Construtor de queries compatível com MySQL e SQL Server
 * Converte automaticamente sintaxes diferentes
 * 
 * @version 1.0.0 - V622 Hybrid System
 */

const { getDbType } = require('../config/database-hybrid');

/**
 * Converter LIMIT/OFFSET para SQL Server TOP
 */
const convertLimit = (sql, limit, offset = 0) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    // SQL Server usa TOP e OFFSET/FETCH
    if (offset > 0) {
      // Com offset: usa OFFSET...FETCH
      // Requer ORDER BY obrigatório
      if (!sql.toLowerCase().includes('order by')) {
        sql += ' ORDER BY (SELECT NULL)';
      }
      sql += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    } else {
      // Sem offset: usa TOP
      sql = sql.replace(/^SELECT/i, `SELECT TOP ${limit}`);
    }
  } else {
    // MySQL usa LIMIT...OFFSET
    sql += ` LIMIT ${limit}`;
    if (offset > 0) {
      sql += ` OFFSET ${offset}`;
    }
  }
  
  return sql;
};

/**
 * Converter NOW() para GETDATE()
 */
const convertNow = (sql) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    return sql.replace(/NOW\(\)/gi, 'GETDATE()');
  }
  
  return sql;
};

/**
 * Converter CONCAT para operador +
 */
const convertConcat = (sql) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    // SQL Server usa operador + para concatenação
    // Exemplo: CONCAT('a', 'b') vira 'a' + 'b'
    return sql.replace(/CONCAT\((.*?)\)/gi, (match, args) => {
      return args.split(',').map(s => s.trim()).join(' + ');
    });
  }
  
  return sql;
};

/**
 * Converter IFNULL para ISNULL
 */
const convertIfNull = (sql) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    return sql.replace(/IFNULL\(/gi, 'ISNULL(');
  }
  
  return sql;
};

/**
 * Converter DATE_ADD/DATE_SUB
 */
const convertDateAdd = (sql) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    // MySQL: DATE_ADD(date, INTERVAL 1 DAY)
    // SQL Server: DATEADD(day, 1, date)
    sql = sql.replace(/DATE_ADD\((.*?),\s*INTERVAL\s+(\d+)\s+(\w+)\)/gi, 
      (match, date, interval, unit) => {
        return `DATEADD(${unit.toLowerCase()}, ${interval}, ${date})`;
      });
    
    sql = sql.replace(/DATE_SUB\((.*?),\s*INTERVAL\s+(\d+)\s+(\w+)\)/gi, 
      (match, date, interval, unit) => {
        return `DATEADD(${unit.toLowerCase()}, -${interval}, ${date})`;
      });
  }
  
  return sql;
};

/**
 * Converter backticks para colchetes
 */
const convertQuotes = (sql) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    // MySQL usa `table` SQL Server usa [table]
    return sql.replace(/`([^`]+)`/g, '[$1]');
  }
  
  return sql;
};

/**
 * Converter AUTO_INCREMENT para IDENTITY
 */
const convertAutoIncrement = (ddl) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    return ddl.replace(/AUTO_INCREMENT/gi, 'IDENTITY(1,1)');
  }
  
  return ddl;
};

/**
 * Converter tipos de dados
 */
const convertDataTypes = (ddl) => {
  const dbType = getDbType();
  
  if (dbType === 'mssql') {
    // VARCHAR -> NVARCHAR (suporta Unicode)
    ddl = ddl.replace(/VARCHAR\(/gi, 'NVARCHAR(');
    
    // TEXT -> NVARCHAR(MAX)
    ddl = ddl.replace(/TEXT/gi, 'NVARCHAR(MAX)');
    
    // DATETIME -> DATETIME2
    ddl = ddl.replace(/DATETIME([^2]|$)/gi, 'DATETIME2$1');
    
    // TINYINT(1) -> BIT
    ddl = ddl.replace(/TINYINT\(1\)/gi, 'BIT');
    
    // ENUM -> NVARCHAR com CHECK constraint
    ddl = ddl.replace(/ENUM\((.*?)\)/gi, (match, values) => {
      return `NVARCHAR(50) CHECK (value IN (${values}))`;
    });
  }
  
  return ddl;
};

/**
 * Converter query completa (aplicar todas as conversões)
 */
const convertQuery = (sql) => {
  sql = convertNow(sql);
  sql = convertConcat(sql);
  sql = convertIfNull(sql);
  sql = convertDateAdd(sql);
  sql = convertQuotes(sql);
  
  return sql;
};

/**
 * Converter DDL (CREATE TABLE, ALTER TABLE, etc.)
 */
const convertDDL = (ddl) => {
  ddl = convertAutoIncrement(ddl);
  ddl = convertDataTypes(ddl);
  ddl = convertQuotes(ddl);
  
  return ddl;
};

/**
 * Construtor de SELECT genérico
 */
class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.selectFields = ['*'];
    this.whereConditions = [];
    this.orderByFields = [];
    this.limitValue = null;
    this.offsetValue = 0;
    this.joinClauses = [];
  }
  
  select(...fields) {
    this.selectFields = fields.length > 0 ? fields : ['*'];
    return this;
  }
  
  where(condition, params = []) {
    this.whereConditions.push({ condition, params });
    return this;
  }
  
  join(table, condition) {
    this.joinClauses.push({ type: 'INNER JOIN', table, condition });
    return this;
  }
  
  leftJoin(table, condition) {
    this.joinClauses.push({ type: 'LEFT JOIN', table, condition });
    return this;
  }
  
  orderBy(field, direction = 'ASC') {
    this.orderByFields.push({ field, direction });
    return this;
  }
  
  limit(value) {
    this.limitValue = value;
    return this;
  }
  
  offset(value) {
    this.offsetValue = value;
    return this;
  }
  
  build() {
    let sql = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;
    
    // JOINs
    if (this.joinClauses.length > 0) {
      for (const join of this.joinClauses) {
        sql += ` ${join.type} ${join.table} ON ${join.condition}`;
      }
    }
    
    // WHERE
    if (this.whereConditions.length > 0) {
      const conditions = this.whereConditions.map(w => w.condition).join(' AND ');
      sql += ` WHERE ${conditions}`;
    }
    
    // ORDER BY
    if (this.orderByFields.length > 0) {
      const orders = this.orderByFields.map(o => `${o.field} ${o.direction}`).join(', ');
      sql += ` ORDER BY ${orders}`;
    }
    
    // LIMIT/OFFSET
    if (this.limitValue !== null) {
      sql = convertLimit(sql, this.limitValue, this.offsetValue);
    }
    
    // Converter para banco específico
    sql = convertQuery(sql);
    
    // Coletar params
    const params = this.whereConditions.flatMap(w => w.params);
    
    return { sql, params };
  }
}

/**
 * Helper para criar QueryBuilder
 */
const query = (table) => new QueryBuilder(table);

// ═══════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════

module.exports = {
  // Conversores individuais
  convertLimit,
  convertNow,
  convertConcat,
  convertIfNull,
  convertDateAdd,
  convertQuotes,
  convertAutoIncrement,
  convertDataTypes,
  
  // Conversores completos
  convertQuery,
  convertDDL,
  
  // Query Builder
  QueryBuilder,
  query
};
