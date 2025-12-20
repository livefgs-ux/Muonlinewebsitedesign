# 🚀 Guia Rápido - System Diagnostics & Backup Manager

## 📍 Como Acessar

1. **Faça login no AdminCP** com suas credenciais de administrador
2. No menu lateral, clique em **"Sistema"** (ícone de banco de dados amarelo)
3. Você verá 4 abas disponíveis:
   - **Diagnostics** - Monitoramento em tempo real
   - **Backup** - Gestão de backups do banco
   - **DB Test** - Teste de conexão MySQL
   - **Logs** - Visualizador de logs do sistema

---

## 🔍 1. DIAGNOSTICS (Diagnósticos)

### O que faz?
Monitora a saúde do sistema em tempo real.

### Como usar:
1. Os dados carregam automaticamente ao abrir
2. Atualiza sozinho a cada 30 segundos
3. Clique em **"Atualizar"** para forçar atualização manual

### O que você vê:
- ✅ **Status dos Serviços**: Database, API, Game Server
- 📊 **Métricas**: Players online, total de chars, total de contas
- ⚡ **Performance**: Tempo de resposta da API
- 💚 **Health Check**: Status de saúde do sistema

---

## 💾 2. BACKUP (Gerenciador de Backups)

### O que faz?
Cria backups completos da estrutura do banco de dados MySQL.

### Como usar:

#### Teste de Configuração (RECOMENDADO PRIMEIRO):
1. Verifique o diretório: `/tmp/backups/`
2. Clique em **"Testar Configuração"**
3. Aguarde confirmação: ✅ "Teste de backup bem-sucedido!"

#### Criar Backup Real:
1. Confirme que o teste passou
2. Clique em **"Criar Backup"**
3. Aguarde processamento (pode levar alguns segundos)
4. Você verá: ✅ "Backup criado com sucesso!"

#### Listar Backups:
1. Clique em **"Listar Backups"**
2. Veja todos os arquivos .sql criados
3. Cada backup mostra nome e tamanho

### ⚠️ IMPORTANTE:
- ✅ Funciona apenas com `/tmp/` no ambiente Supabase
- ✅ Backup inclui estrutura das tabelas (CREATE TABLE)
- ✅ Nome automático: `muonline_backup_TIMESTAMP.sql`
- ⚠️ Backups em /tmp/ são temporários - faça download!

---

## 🧪 3. DB TEST (Teste de Conexão)

### O que faz?
Testa a conexão com o banco de dados MySQL/MariaDB.

### Duas opções disponíveis:

#### 📘 Teste Rápido (Conexão Atual):
1. Clique em **"Testar Conexão Atual"**
2. Sistema usa as variáveis de ambiente configuradas
3. Você vê:
   - Host do banco
   - Nome do database
   - Versão do MySQL/MariaDB
   - Tempo de resposta

#### 📗 Teste Customizado:
1. Preencha os campos:
   - Host (ex: localhost, 192.168.1.100)
   - Database (ex: MuOnline)
   - Usuário (ex: root)
   - Senha
2. Deixe em branco para usar valores padrão
3. Clique em **"Testar Conexão Customizada"**
4. Veja resultado detalhado

### 🔒 Segurança:
- ❌ Credenciais NÃO são armazenadas
- ✅ Usado apenas para teste pontual
- ✅ Não afeta conexão principal do sistema

---

## 📝 4. LOGS (Visualizador de Logs)

### O que faz?
Exibe e gerencia logs do sistema.

### Como usar:

#### Ver Logs:
1. Logs aparecem automaticamente
2. Use os filtros: **ALL**, **INFO**, **WARNING**, **ERROR**, **DEBUG**
3. Cada log mostra:
   - ⏰ Timestamp
   - 🏷️ Categoria
   - 📄 Mensagem
   - 🔍 Detalhes (se houver)

#### Auto-Refresh:
1. Clique em **"Auto-refresh OFF"** para ativar
2. Quando ON, atualiza a cada 5 segundos
3. Útil para monitoramento em tempo real

#### Download de Logs:
1. Clique em **"Download"**
2. Arquivo .txt será baixado
3. Nome: `muonline-logs-TIMESTAMP.txt`

#### Limpar Logs:
1. Clique em **"Limpar"**
2. Confirme a ação (não pode ser desfeita!)
3. Todos os logs serão removidos

### Níveis de Log:
- 🔵 **INFO** - Informações normais
- 🟡 **WARNING** - Avisos
- 🔴 **ERROR** - Erros críticos
- ⚪ **DEBUG** - Informações de debug

---

## 🛠️ Configuração Inicial (Apenas 1 vez)

### Variáveis de Ambiente no Supabase:

Acesse o Supabase Dashboard → Settings → Edge Functions e configure:

```env
DB_HOST=seu-servidor-mysql
DB_USER=root
DB_PASSWORD=sua-senha
DB_NAME=MuOnline
```

### Como testar se está configurado:
1. Vá em **"DB Test"**
2. Clique em **"Testar Conexão Atual"**
3. Se der ✅ sucesso, está tudo OK!
4. Se der ❌ erro, verifique as variáveis

---

## ❓ Problemas Comuns

### "Erro ao conectar com MySQL"
**Solução:** Verifique se as variáveis de ambiente estão corretas no Supabase

### "Diretório de backup inválido"
**Solução:** Use apenas `/tmp/backups/` - outros diretórios não funcionam no Supabase

### "Backups não aparecem na lista"
**Solução:** 
1. Certifique-se que criou pelo menos 1 backup
2. Arquivos devem estar em `/tmp/backups/`
3. Devem terminar com `.sql`

### "Logs vazios"
**Solução:** Normal se o sistema acabou de ser instalado. Logs aparecem conforme eventos ocorrem.

### "Tempo de resposta muito alto"
**Solução:** 
- Pode ser conexão lenta com o MySQL
- Verifique latência de rede
- MySQL pode estar sobrecarregado

---

## 📊 Interpretando Métricas

### Status dos Serviços:
- 🟢 **ONLINE** = Funcionando perfeitamente
- 🔴 **OFFLINE** = Não conseguiu conectar
- 🟡 **ERROR** = Conectou mas com problemas

### Tempo de Resposta:
- 🟢 **< 100ms** = Excelente
- 🟡 **100-300ms** = Bom
- 🔴 **> 300ms** = Lento, investigar

### Health Check:
- ✅ **Database: Healthy** = Banco respondendo
- ✅ **API Endpoints: 15 active** = Todas rotas OK
- ✅ **Response Time: XXms** = Latência média

---

## 🎯 Dicas Profissionais

### Para Backups:
1. ✅ Sempre teste primeiro antes de criar backup real
2. ✅ Faça backups antes de updates importantes
3. ✅ Baixe backups importantes para seu computador
4. ✅ Lembre-se: /tmp/ é temporário!
5. ✅ Crie uma rotina: backup diário/semanal

### Para Monitoramento:
1. ✅ Deixe o Diagnostics aberto em aba separada
2. ✅ Monitore Response Time em horários de pico
3. ✅ Se Players Online = 0, algo pode estar errado
4. ✅ Verifique Status Database regularmente

### Para Logs:
1. ✅ Ative Auto-refresh quando investigar problemas
2. ✅ Filtre por ERROR para ver apenas problemas
3. ✅ Faça download de logs antes de limpar
4. ✅ Use logs para auditoria e troubleshooting

---

## 🚨 Quando Usar Cada Ferramenta

### Use DIAGNOSTICS quando:
- ✅ Quiser ver status geral do servidor
- ✅ Monitorar players online em tempo real
- ✅ Verificar se tudo está funcionando
- ✅ Investigar lentidão no sistema

### Use BACKUP quando:
- ✅ Antes de fazer alterações importantes
- ✅ Rotina de manutenção
- ✅ Antes de updates do servidor
- ✅ Como medida de segurança

### Use DB TEST quando:
- ✅ Configurar o sistema pela primeira vez
- ✅ Resolver problemas de conexão
- ✅ Testar credenciais novas
- ✅ Diagnosticar erros de banco

### Use LOGS quando:
- ✅ Investigar erros reportados
- ✅ Auditar atividades do sistema
- ✅ Debugar problemas específicos
- ✅ Monitorar eventos em tempo real

---

## ✅ Checklist de Uso Diário

### Ao Iniciar o Dia:
- [ ] Abrir Diagnostics e verificar status
- [ ] Conferir se Database está ONLINE
- [ ] Ver quantidade de players online
- [ ] Checar tempo de resposta (deve estar < 100ms)

### Semanalmente:
- [ ] Criar backup completo do banco
- [ ] Fazer download do backup
- [ ] Revisar logs de ERROR
- [ ] Limpar logs antigos

### Ao Resolver Problemas:
- [ ] Verificar Diagnostics primeiro
- [ ] Testar conexão em DB Test
- [ ] Filtrar Logs por ERROR
- [ ] Ativar Auto-refresh nos Logs
- [ ] Documentar solução encontrada

---

## 🎓 Conclusão

Este sistema foi criado para facilitar a administração do servidor MU Online. Use-o regularmente e mantenha tudo monitorado!

**Lembre-se:**
- 🔒 Sistema é seguro - credenciais não são armazenadas
- 📊 Dados são 100% REAIS do banco de dados
- 🚀 Performance é monitorada em tempo real
- 💾 Backups protegem seu trabalho

**Precisa de ajuda?** Consulte a documentação técnica completa em `SYSTEM_DIAGNOSTICS_README.md`

---

**Desenvolvido para MeuMU Online - Season 19-2-3 Épico** 🎮✨
