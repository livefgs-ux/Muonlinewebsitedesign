# 🎮 MeuMU Online - Novo Instalador Profissional

## ✅ **O QUE JÁ FOI CRIADO:**

### **1. Arquivos Base:**
- ✅ `/install/config.php` - Configurações do instalador
- ✅ `/install/loader.php` - Carregador principal
- ✅ `/install/index_new.php` - Interface principal (Dark Medieval Fantasy)
- ✅ `/install/step_1_intro.php` - Step 1: Introdução
- ✅ `/install/step_2_requirements.php` - Step 2: Requisitos

---

## 📋 **ESTRUTURA COMPLETA (7 STEPS):**

### **Step 1: Introdução** ✅ CRIADO
- Boas-vindas
- Lista de features
- Requisitos mínimos
- Explicação dual database
- Licença MIT

### **Step 2: Requisitos** ✅ CRIADO
- Verifica PHP 8.1+
- Verifica extensões (PDO, MySQL, OpenSSL, cURL, etc.)
- Verifica permissões de escrita
- Instruções para corrigir problemas

### **Step 3: Database** 🔄 PENDENTE
- Formulário com 2 databases (muonline + webmu)
- Teste de conexão
- Verifica se tabela `accounts` existe no muonline
- Salva dados na sessão

### **Step 4: Criar Tabelas** 🔄 PENDENTE
- Conecta no webmu
- Cria database se não existir
- Executa SQL para criar tabelas WEBMU_*
- Mostra progresso de criação
- Opção de deletar e recriar

### **Step 5: Admin (OPCIONAL)** 🔄 PENDENTE
- **PODE PULAR ESTE STEP!**
- Formulário para definir conta admin
- Atualiza `accounts.web_admin = 1`
- Botão "Pular - Vou configurar depois"

### **Step 6: Configuração** 🔄 PENDENTE
- URL do site
- Modo backend (PM2 ou Standalone)
- Cria arquivo .env
- Cria config.php
- Inicia backend Node.js

### **Step 7: Concluído** 🔄 PENDENTE
- Mensagem de sucesso
- Próximos passos
- Link para o site
- Botão para deletar /install

---

## 🎨 **DESIGN APLICADO:**

### **Cores:**
- Background: `#0a0a0a` → `#1a1a2e` (gradient)
- Dourado: `#FFB800` → `#FFA000`
- Glassmorphism: `rgba(255, 255, 255, 0.03)` com `blur(10px)`

### **Elementos:**
- Sidebar com steps visuais
- Cards com glassmorphism
- Botões com gradient e hover animado
- Alerts coloridos (info, success, warning, danger)
- Forms estilizados
- List groups modernos

---

## 🔄 **DIFERENÇAS DO WEBENGINE:**

| Item | WebEngine | MeuMU Online |
|------|-----------|--------------|
| **Nome** | WEBENGINE_* | WEBMU_* |
| **Créditos** | Lautaro Angelico | MeuMU Team |
| **Admin** | Obrigatório | Opcional (pode pular) |
| **Database** | 1 ou 2 (opcional) | 2 obrigatórias (muonline + webmu) |
| **Design** | Bootstrap padrão | Dark Medieval Fantasy |
| **Backend** | Somente PHP | PHP + Node.js |
| **Steps** | 6 | 7 |

---

## 🚀 **PRÓXIMOS PASSOS:**

Preciso criar ainda:

1. ⏳ **Step 3: Database** (`step_3_database.php`)
2. ⏳ **Step 4: Criar Tabelas** (`step_4_tables.php`)
3. ⏳ **Step 5: Admin Opcional** (`step_5_admin.php`)
4. ⏳ **Step 6: Configuração** (`step_6_config.php`)
5. ⏳ **Step 7: Concluído** (`step_7_complete.php`)

---

## 📁 **ARQUIVOS SQL:**

Preciso criar os arquivos .txt para cada tabela:

```
/install/sql/
├── WEBMU_NEWS.txt
├── WEBMU_NEWS_TRANSLATIONS.txt
├── WEBMU_BANS.txt
├── WEBMU_BAN_LOG.txt
├── WEBMU_BLOCKED_IP.txt
├── WEBMU_VOTES.txt
├── WEBMU_VOTE_LOGS.txt
├── WEBMU_VOTE_SITES.txt
├── WEBMU_DOWNLOADS.txt
├── WEBMU_REGISTER_ACCOUNT.txt
├── WEBMU_PASSCHANGE_REQUEST.txt
├── WEBMU_CREDITS_CONFIG.txt
├── WEBMU_CREDITS_LOGS.txt
├── WEBMU_PAYPAL_TRANSACTIONS.txt
├── WEBMU_PLUGINS.txt
├── WEBMU_CRON.txt
├── WEBMU_ACCOUNT_COUNTRY.txt
└── WEBMU_FLA.txt
```

---

## 🎯 **RECURSOS ESPECIAIS:**

### **1. Admin Opcional:**
```php
// Step 5 - Pode pular
<div class="btn-group">
    <button type="submit" name="set_admin">Definir Admin</button>
    <a href="?action=skip" class="btn-secondary">Pular - Configurar Depois</a>
</div>
```

### **2. Dual Database Automática:**
```php
// Cria database webmu se não existir
CREATE DATABASE IF NOT EXISTS `webmu`;

// Testa ambas databases
$connMU = testConnection('muonline');
$connWEB = testConnection('webmu');
```

### **3. Instalação do Backend:**
```php
// PM2 ou Standalone
if($mode === 'pm2') {
    exec('pm2 start backend-nodejs/src/server.js --name meumu');
} else {
    exec('node backend-nodejs/src/server.js &');
}
```

---

## 📝 **EXEMPLO DE USO:**

```
1. Usuário acessa: http://seudominio.com/install
2. Step 1: Lê introdução → Clica "Iniciar"
3. Step 2: Verifica requisitos → Clica "Continuar"
4. Step 3: Preenche databases → Testa conexão → Continua
5. Step 4: Cria tabelas WEBMU_* → Aguarda → Continua
6. Step 5: PULA (vai configurar admin depois) → Continua
7. Step 6: Define URL + Modo → Instala → Continua
8. Step 7: Sucesso! → Deleta /install → Acessa site
```

---

## 🔐 **SEGURANÇA:**

- ✅ Verifica se já foi instalado
- ✅ Session única para instalador
- ✅ Validação de inputs
- ✅ Proteção contra reinstalação acidental
- ✅ Opção de forçar reinstalação (`?force=1`)
- ✅ Alerta para deletar /install após concluir

---

## 💡 **QUER QUE EU CONTINUE?**

Posso agora:

**Opção A:** Criar os 5 steps restantes completos
**Opção B:** Criar apenas o Step 3 (Database) para você testar primeiro
**Opção C:** Modificar algo no que já foi criado

**Qual você prefere?** 🤔

---

**Status Atual:** 2/7 steps criados (28%)  
**Estimativa:** ~30 minutos para completar tudo  
**Complexidade:** Média (seguindo padrão WebEngine)
