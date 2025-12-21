# 🧹 Como Limpar Cache do Navegador

## ❌ **SEU ERRO:**

```
"Erro ao iniciar backend: Falha ao instalar dependências npm"
```

**CAUSA:** O navegador está usando a versão antiga do instalador em cache!

---

## ✅ **SOLUÇÃO RÁPIDA:**

### **Método 1: Hard Refresh (RECOMENDADO)**

Pressione as teclas abaixo na página do instalador:

| Sistema Operacional | Atalho |
|---------------------|--------|
| **Windows** | `Ctrl + Shift + R` ou `Ctrl + F5` |
| **Mac** | `Cmd + Shift + R` |
| **Linux** | `Ctrl + Shift + R` ou `Ctrl + F5` |

---

### **Método 2: Limpar Cache Completo**

#### **Google Chrome:**
1. Pressione `Ctrl + Shift + Delete` (Windows) ou `Cmd + Shift + Delete` (Mac)
2. Selecione "Todo o período"
3. Marque "Imagens e arquivos em cache"
4. Clique em "Limpar dados"
5. Recarregue a página: `F5`

#### **Firefox:**
1. Pressione `Ctrl + Shift + Delete`
2. Selecione "Tudo"
3. Marque "Cache"
4. Clique em "OK"
5. Recarregue: `F5`

#### **Edge:**
1. Pressione `Ctrl + Shift + Delete`
2. Selecione "Todo o tempo"
3. Marque "Imagens e arquivos em cache"
4. Clique em "Limpar agora"
5. Recarregue: `F5`

---

### **Método 3: Modo Anônimo**

Abra o instalador em modo anônimo/privado:

| Navegador | Atalho |
|-----------|--------|
| Chrome | `Ctrl + Shift + N` |
| Firefox | `Ctrl + Shift + P` |
| Edge | `Ctrl + Shift + N` |

Acesse: `http://meumu.com/install`

---

### **Método 4: Limpar Cache do PHP (se necessário)**

```bash
# Limpar sessão do instalador
rm -rf /tmp/sess_*

# OU criar script PHP:
```

Crie `/install/limpar_cache.php`:

```php
<?php
session_start();
$_SESSION = array();
session_destroy();
echo "✅ Cache da sessão limpo!<br><br>";
echo '<a href="index.php">← Voltar ao instalador</a>';
?>
```

Acesse: `http://meumu.com/install/limpar_cache.php`

---

## 🔍 **VERIFICAR SE LIMPOU:**

1. Abra o console do navegador (F12)
2. Vá na aba "Network" ou "Rede"
3. Recarregue a página (F5)
4. Procure por `step_6_config_v2.php` (não `step_6_config.php`)
5. Se aparecer `v2`, o cache foi limpo! ✅

---

## ⚡ **DEPOIS DE LIMPAR:**

1. Recarregue a página do instalador: `F5` ou `Ctrl + F5`
2. Vá para o Step 6
3. Preencha a URL do site
4. Clique em "Criar Arquivos de Configuração"
5. **NÃO DEVE DAR ERRO!** ✅

---

## 📝 **O QUE MUDOU NA v2:**

### **Versão Antiga (v1):**
```php
❌ exec("cd backend && npm install");  // Tentava executar
❌ exec("pm2 start ...");               // Tentava executar
❌ Dava erro de permissões/npm
```

### **Versão Nova (v2):**
```php
✅ Apenas cria .env
✅ Apenas cria config.php
✅ NÃO executa NADA
✅ Você inicia backend MANUALMENTE depois
```

---

## 🎯 **APÓS INSTALAÇÃO:**

### **1. Buildar Frontend:**
```bash
npm install
npm run build
```

### **2. Iniciar Backend:**
```bash
cd backend-nodejs
npm install
npm start
```

### **3. Configurar Servidor Web:**
Apache: DocumentRoot → `/dist`  
Nginx: root → `/dist`

---

## 💡 **DICA:**

Se AINDA der erro mesmo após limpar cache, faça:

```bash
# Deletar step antigo
rm /install/step_6_config.php

# Renomear v2 para o padrão
mv /install/step_6_config_v2.php /install/step_6_config.php
```

---

**MeuMU Online v2.0.1**  
Instalador Atualizado - SEM Execução Automática  
© 2024-2025 MeuMU Team
