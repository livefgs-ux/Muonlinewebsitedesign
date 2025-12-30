# ✅ V574 - COMANDOS DE BUILD E TESTE

**Data:** 2025-12-30 16:35 CET  
**Versão:** V574

---

## 🚀 CORREÇÕES APLICADAS

### Frontend (PlayerContext + API):
1. ✅ `/src/app/contexts/PlayerContext.tsx` - 3 funções corrigidas
2. ✅ `/src/app/config/api.ts` - getAuthHeaders() corrigido

### AdminCP Sections:
3. ✅ `/src/app/components/admincp/sections/DashboardSection.tsx`
4. ✅ `/src/app/components/admincp/sections/CharacterManagement.tsx`
5. ✅ `/src/app/components/admincp/sections/AccountManagement.tsx`
6. ✅ `/src/app/components/admincp/sections/NewsManagement.tsx` - 2 funções
7. ✅ `/src/app/components/admincp/sections/PluginsSection.tsx` - 3 funções
8. ✅ `/src/app/components/admincp/admin-diagnostics.tsx`

**Total de arquivos corrigidos:** 8  
**Total de linhas corrigidas:** 15+

---

## 🔧 COMANDO PARA BUILD

```bash
cd /home/meumu.com/public_html
npm run build
```

**Aguarde:** Aproximadamente 30-60 segundos

**Sucesso quando aparecer:**
```
✓ built in XX.XXs
```

---

## 🧪 ROTEIRO DE TESTES

### 1. LIMPAR CACHE DO NAVEGADOR
```
Ctrl + Shift + Delete → Cached images → Clear
```

### 2. HARD REFRESH
```
Ctrl + Shift + R (ou Ctrl + F5)
```

### 3. TESTAR PLAYER DASHBOARD

#### 3.1. Login como Admin
- ✅ Ir para Dashboard → Personagens
- ✅ Deve mostrar: "MeuMuzin" (Level 1, Dark Knight)
- ✅ Clicar no personagem
- ✅ Ver detalhes completos

#### 3.2. Verificar DevTools Console
- ✅ F12 → Console
- ✅ Deve mostrar:
  ```
  📊 [PlayerContext] Response status: 200
  📊 [PlayerContext] Dados recebidos: {characters: Array(1)}
  ```
- ✅ **NÃO** deve mostrar erros 401

---

### 4. TESTAR ADMINCP

#### 4.1. Dashboard
- ✅ Ir para AdminCP → Dashboard
- ✅ Stats devem carregar
- ✅ Total de contas, personagens, etc.

#### 4.2. Character Management
- ✅ AdminCP → Characters
- ✅ Lista deve carregar
- ✅ Deve mostrar "MeuMuzin"

#### 4.3. Account Management
- ✅ AdminCP → Accounts
- ✅ Buscar por "admin"
- ✅ Deve encontrar a conta

#### 4.4. News Management
- ✅ AdminCP → News
- ✅ Lista de notícias deve carregar
- ✅ Tentar criar notícia de teste

#### 4.5. Plugins
- ✅ AdminCP → Plugins
- ✅ Lista deve carregar (vazia ou com plugins)

---

## ✅ CHECKLIST DE SUCESSO

### Player Dashboard:
- [ ] ✅ Personagens aparecem
- [ ] ✅ Nenhum erro 401
- [ ] ✅ Console mostra dados recebidos
- [ ] ✅ Todas as abas funcionam

### AdminCP:
- [ ] ✅ Dashboard stats carregam
- [ ] ✅ Characters aparecem
- [ ] ✅ Account search funciona
- [ ] ✅ News carregam
- [ ] ✅ Plugins carregam

---

## 🐛 SE DER ERRO

### Erro 401 Unauthorized:
```bash
# Verificar se token está salvo:
# Abrir DevTools → Application → Storage
# localStorage → Verificar "admin_token"
# Deve ter um valor JWT longo
```

### Personagens não aparecem:
```bash
# Verificar logs backend:
pm2 logs meumu-backend --lines 100

# Procurar por:
# "Personagens encontrados: 1. MeuMuzin"
```

### Build falhou:
```bash
# Limpar e reinstalar:
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 RESULTADO ESPERADO

### Console do Navegador (F12):
```
📊 [PlayerContext] Response status: 200
📊 [PlayerContext] Dados recebidos: 
  {
    success: true,
    data: {
      characters: [
        {
          name: "MeuMuzin",
          level: 1,
          class: "Dark Knight",
          ...
        }
      ]
    }
  }
```

### Player Dashboard:
```
╔══════════════════════════════════╗
║ MeuMuzin                         ║
║ Dark Knight - Level 1            ║
║ Master: 0 | Majestic: 0          ║
║ Resets: 0                        ║
║ Status: Offline                  ║
╚══════════════════════════════════╝
```

### AdminCP → Characters:
```
╔══════════════════════════════════╗
║ Total Characters: 1              ║
║                                  ║
║ 1. MeuMuzin (admin) - Level 1   ║
║    Class: Dark Knight            ║
║    Resets: 0                     ║
╚══════════════════════════════════╝
```

---

## 🎉 SUCESSO TOTAL SE:

1. ✅ Player Dashboard mostra "MeuMuzin"
2. ✅ AdminCP Character Management mostra "MeuMuzin"
3. ✅ Nenhum erro 401 no console
4. ✅ Todas as seções do AdminCP carregam
5. ✅ Backend logs mostram "✅ Retornando 1 personagens"

---

**EXECUTE O BUILD E ME CONFIRME OS RESULTADOS!** 🚀
