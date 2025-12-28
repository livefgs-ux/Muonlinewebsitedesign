# 📚 MD FILES - DOCUMENTAÇÃO DO PROJETO MEUMU ONLINE

**Versão 514 | Data: 28/12/2024**

Esta pasta contém TODA a documentação do projeto MeuMU Online organizada por categoria.

---

## 📋 ESTRUTURA DE DOCUMENTAÇÃO

### **📁 01-GUIDELINES/**
Diretrizes e regras de desenvolvimento:
- `MeuMU-Specific-Guidelines.md` - Guidelines unificados (Figma + Engineering Authority)

### **📁 02-AUDITORIAS/**
Relatórios de auditorias e correções:
- Auditorias de versões anteriores
- Correções implementadas
- Debug logs

### **📁 03-INSTALACAO/**
Guias de instalação e deployment:
- Guias de teste
- Problemas corrigidos na instalação
- Instruções de deploy

### **📁 04-DATABASE/**
Documentação de banco de dados:
- Scripts SQL
- Regras de database
- Correções de queries

### **📁 05-SISTEMA/**
Documentação técnica do sistema:
- Resumos de versões
- Changelog
- Arquitetura

---

## 🗂️ ARQUIVOS MANTIDOS NA RAIZ

Apenas **3 arquivos .md** devem ficar na raiz do projeto:

1. **`README.md`** - Documentação principal do projeto
2. **`ATTRIBUTIONS.md`** - Atribuições e créditos
3. **`.gitignore`** (não é .md mas é importante)

**TODOS OS OUTROS** arquivos .md devem estar organizados dentro de `/MD Files/`

---

## 📝 REGRA DE ORGANIZAÇÃO

```
✅ CORRETO:
/README.md (raiz)
/ATTRIBUTIONS.md (raiz)
/MD Files/01-GUIDELINES/MeuMU-Specific-Guidelines.md
/MD Files/02-AUDITORIAS/AUDITORIA-V514.md

❌ ERRADO:
/AUDITORIA-V514.md (raiz)
/GUIA-TESTE-LOGIN.md (raiz)
/CORRECAO-BUG.md (raiz)
```

---

## 🔄 VERSIONAMENTO

**IMPORTANTE**: Sempre que houver um update ou alteração no projeto:

1. Atualizar `/install.sh` com nova versão
2. Criar arquivo de changelog em `/MD Files/05-SISTEMA/`
3. Documentar mudanças em `/MD Files/02-AUDITORIAS/` se necessário

**Versão Atual**: 514
**Última Modificação**: Guidelines unificados + Estrutura organizada

---

## 📖 COMO USAR

1. **Procurando por um documento específico?**
   - Navegue pelas pastas por categoria
   - Use busca do GitHub: `filename:.md keyword`

2. **Criando um novo documento?**
   - Identifique a categoria correta
   - Nomeie com prefixo descritivo: `CATEGORIA-DESCRICAO-V###.md`
   - Mantenha versionamento consistente

3. **Atualizando documentação?**
   - **NUNCA** crie arquivos na raiz
   - Sempre use a pasta apropriada
   - Atualize `install.sh` se for mudança de versão

---

## 🛡️ SEGURANÇA

**NUNCA** commite arquivos .md que contenham:
- ❌ Senhas reais
- ❌ Tokens/API Keys
- ❌ Credenciais de banco de dados
- ❌ Informações pessoais (PII)

Use sempre placeholders:
```
DB_PASSWORD=<sua_senha_aqui>
JWT_SECRET=<seu_token_aqui>
```

---

## 📞 CONTATO

**Projeto**: MeuMU Online  
**Repositório**: https://github.com/livefgs-ux/Muonlinewebsitedesign  
**Versão Atual**: 514  

---

**FIM DO DOCUMENTO**
