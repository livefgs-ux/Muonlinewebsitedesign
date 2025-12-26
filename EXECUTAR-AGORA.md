# ⚡ EXECUTAR AGORA - CORREÇÃO FINAL HTTPS

**Data:** 26/12/2024  
**Status:** ✅ **PRONTO PARA EXECUTAR**  

---

## 🎯 **ARQUIVOS CORRIGIDOS**

| Arquivo | Correção Aplicada |
|---------|-------------------|
| `/install.sh` | ✅ Frontend `.env` → `VITE_API_URL=/api` |
| `/install.sh` | ✅ Backend `.env.production` → HTTPS + Rate Limit 500 |
| `/src/app/hooks/useRankings.ts` | ✅ Removido hardcoded `localhost:3001` |
| `/src/app/hooks/useServerStats.ts` | ✅ Removido hardcoded `localhost:3001` |
| `/src/services/api.ts` | ✅ Removido hardcoded `meumu.com:3001` |
| `/src/app/config/api.ts` | ✅ Já estava correto |
| `/backend-nodejs/src/controllers/authController.js` | ✅ Regra de Ouro aplicada |

---

## 🚀 **EXECUTAR AGORA (1 COMANDO)**

```bash
cd /home/meumu.com/public_html

# Execute o instalador
./install.sh

# Escolha: 1 (Instalação Completa)
```

**O script fará:**
1. ✅ Configura `.env` → `VITE_API_URL=/api`
2. ✅ Configura `.env.production` → HTTPS + Rate Limit 500
3. ✅ Rebuilda frontend (elimina :3001 do código)
4. ✅ Reinicia backend
5. ✅ Testa tudo

---

## ✅ **RESULTADO ESPERADO**

Após executar:

```
════════════════════════════════════════════════════════════
✅✅✅ INSTALAÇÃO COMPLETA COM SUCESSO! ✅✅✅
════════════════════════════════════════════════════════════

🌐 ACESSE O SITE:

   🔒 HTTPS (Recomendado):
   https://meumu.com

   🔓 HTTP (Desenvolvimento):
   http://meumu.com:3001
```

---

## 🔍 **VERIFICAR SE FUNCIONOU**

### **1. Abrir site:**
```
https://meumu.com
```

### **2. Abrir DevTools (F12) → Console**

**ANTES (ERRADO):**
```
❌ Mixed Content: The page at 'https://meumu.com/' was loaded over HTTPS,
   but requested an insecure resource 'http://meumu.com:3001/api/server/info'.
   This request has been blocked.
```

**DEPOIS (CORRETO):**
```
✅ (sem erros de Mixed Content)
✅ Rankings carregam
✅ Login funciona
✅ Registro funciona
```

---

## 🔧 **SE NÃO FUNCIONAR**

### **Problema: Still showing :3001 in browser**

**Causa:** Cache do navegador ainda tem o build antigo

**Solução:**
```
1. CTRL + SHIFT + DELETE
2. Marcar: Cache + Cookies
3. Período: Últimas 24 horas
4. Limpar dados
5. Recarregar: CTRL + F5
```

---

### **Problema: Backend não inicia**

**Verificar logs:**
```bash
pm2 logs meumu-backend --lines 100
```

**Procurar por:**
- `ECONNREFUSED` → MySQL não está rodando
- `EADDRINUSE` → Porta 3001 já está em uso
- `Unknown column` → Erro no authController

**Solução:**
```bash
# MySQL não rodando
systemctl start mariadb

# Porta em uso
lsof -ti:3001 | xargs kill -9

# Reiniciar
./install.sh → Opção 5 (Reiniciar Servidor)
```

---

### **Problema: Proxy não funciona (404 em /api)**

**Verificar:**
```bash
curl -v https://meumu.com/api/health
```

**Se retornar 404:**
```bash
# Configurar proxy manualmente
./install.sh → Opção 11 (Configurar OpenLiteSpeed Proxy)
```

---

## 📊 **TESTES COMPLETOS**

### **Teste 1: Backend HTTP (porta 3001)**
```bash
curl http://localhost:3001/health
```

**Esperado:**
```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

---

### **Teste 2: Proxy HTTPS**
```bash
curl -k https://meumu.com/api/health
```

**Esperado:**
```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

---

### **Teste 3: Registro**
```bash
curl -X POST https://meumu.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testefinal",
    "password": "senha123",
    "email": "teste@meumu.com"
  }' | python3 -m json.tool
```

**Esperado:**
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {
      "username": "testefinal"
    }
  }
}
```

---

### **Teste 4: Navegador**

1. Abrir: `https://meumu.com`
2. F12 → Console
3. **NÃO deve ter:**
   - ❌ Mixed Content
   - ❌ Failed to fetch
   - ❌ CORS error
4. **Deve ter:**
   - ✅ Site carrega
   - ✅ Rankings aparecem
   - ✅ Cadeado verde 🔒

---

## 📋 **CHECKLIST FINAL**

- [ ] Executou `./install.sh` → Opção 1
- [ ] Script terminou com "✅ INSTALAÇÃO COMPLETA"
- [ ] Limpou cache do navegador
- [ ] Abriu `https://meumu.com`
- [ ] Console sem erros de Mixed Content
- [ ] Testou registro
- [ ] Testou login
- [ ] Rankings carregam

---

## 🎉 **TUDO CERTO!**

Se todos os testes passarem:

✅ **Frontend:** URL relativa `/api`  
✅ **Backend:** HTTPS pronto  
✅ **Rate Limit:** 500 req/min  
✅ **Sem Mixed Content**  
✅ **Sem Erro 400** (Regra de Ouro)  
✅ **Sem Erro 429** (Rate Limit OK)  
✅ **Site funcionando em HTTPS** 🔒  

---

**📅 Data:** 26/12/2024  
**⏱️ Tempo:** ~5 minutos  
**✅ Status:** Pronto para produção
