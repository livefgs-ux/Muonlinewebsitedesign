# 🚨 AÇÃO URGENTE: CORRIGIR HTTPS E MIXED CONTENT

**Problema:** Site em HTTPS bloqueando chamadas HTTP (Mixed Content)  
**Impacto:** API não funciona, login/registro bloqueados  
**Status:** ⚠️ **CRÍTICO** - Requer ação imediata  

---

## ⚡ **SOLUÇÃO RÁPIDA (2 MINUTOS)**

Execute estes comandos como root:

```bash
cd /home/meumu.com/public_html

# 1. Tornar script executável
chmod +x configurar-https.sh

# 2. Executar configuração automática
bash configurar-https.sh

# 3. Aguardar 30 segundos
sleep 30

# 4. Testar
curl -s https://meumu.com/api/health | python3 -m json.tool
```

**Se aparecer `"database":"connected"` → SUCESSO! ✅**

---

## 🔧 **O QUE O SCRIPT FAZ**

1. ✅ Atualiza `.env` do frontend para HTTPS
2. ✅ Atualiza `.env` do backend (rate limit + CORS)
3. ✅ Rebuilda frontend com HTTPS
4. ✅ Reinicia backend
5. ✅ Testa HTTP local e HTTPS proxy

---

## 🎯 **PRÓXIMO PASSO: CONFIGURAR PROXY**

### **Opção A: Script Automático**

```bash
cd /home/meumu.com/public_html
sudo bash setup-litespeed-proxy.sh
```

### **Opção B: Manual via CyberPanel**

1. Acesse: `https://meumu.com:8090`
2. **Websites** → **meumu.com** → **Manage** → **vHost Conf**
3. Adicione ANTES do `</VirtualHost>`:

```apache
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</IfModule>
```

4. Salvar e reiniciar:

```bash
sudo systemctl restart lsws
```

---

## ✅ **TESTE FINAL**

```bash
# Limpar cache do navegador (CTRL+SHIFT+DELETE)

# Acessar site
https://meumu.com

# Abrir DevTools (F12) → Console
# NÃO deve aparecer erros de "Mixed Content"
```

---

## 📋 **RESUMO DO QUE MUDOU**

| Item | Antes | Depois |
|------|-------|--------|
| **Frontend API URL** | `http://meumu.com:3001/api` | `https://meumu.com/api` |
| **Backend NODE_ENV** | `development` | `production` |
| **Rate Limit** | `100 req/min` | `500 req/min` |
| **CORS Origins** | Apenas HTTP | HTTP + HTTPS |
| **Proxy Reverso** | Não configurado | `/api` → `localhost:3001` |

---

## 🆘 **SE DER ERRO**

### **Erro: "Mixed Content" ainda aparece**

```bash
# Verificar se frontend foi rebuilado
ls -la /home/meumu.com/public_html/dist/index.html
# Data deve ser HOJE

# Se não, rebuildar:
cd /home/meumu.com/public_html
npm run build

# Limpar cache do navegador (CTRL+SHIFT+DELETE)
```

---

### **Erro: 404 em /api/health**

```bash
# Proxy não configurado
# Execute:
sudo bash /home/meumu.com/public_html/setup-litespeed-proxy.sh

# Ou configure manualmente via CyberPanel (opção B acima)
```

---

### **Erro: 429 Too Many Requests**

```bash
# Rate limit bloqueou IP
# Reiniciar backend limpa contador:
pm2 restart meumu-backend

# Aguardar 1 minuto e testar novamente
```

---

### **Erro: 400 Bad Request no registro**

```bash
# Ver logs detalhados
pm2 logs meumu-backend --lines 100 | grep -A 30 "TENTATIVA DE REGISTRO"

# Copiar saída e me enviar
```

---

## 📞 **SUPORTE**

Se nada funcionar, execute e me envie:

```bash
# Status completo
pm2 status
pm2 logs meumu-backend --lines 50 --nostream

# Configuração
cat /home/meumu.com/public_html/.env
cat /home/meumu.com/public_html/backend-nodejs/.env | grep -v PASSWORD

# Testes
curl -v http://localhost:3001/health
curl -v -k https://meumu.com/api/health
```

---

## 🎉 **CONCLUSÃO**

Após executar `bash configurar-https.sh`:

✅ Frontend configurado para HTTPS  
✅ Backend configurado para produção  
✅ Rate limit aumentado  
✅ CORS permitindo HTTPS  
✅ Tudo pronto para proxy reverso  

**Tempo total:** ~5 minutos  
**Resultado:** Site 100% funcional em HTTPS  

---

**📖 Documentação completa:** `/home/meumu.com/public_html/SOLUCAO-MIXED-CONTENT-HTTPS.md`
