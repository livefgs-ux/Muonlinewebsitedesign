# 🚨 PLANO DE RESPOSTA A INCIDENTES
## MeuMU Online - Incident Response Playbook

**Baseado em: "Safe Vibe Coding" - Emergency Response**  
**Última atualização:** 24 de dezembro de 2024

---

## 📋 ÍNDICE RÁPIDO

- [FASE 1: Detecção (0-5 minutos)](#fase-1-detecção-0-5-minutos)
- [FASE 2: Contenção (5-15 minutos)](#fase-2-contenção-5-15-minutos)
- [FASE 3: Investigação (15-60 minutos)](#fase-3-investigação-15-60-minutos)
- [FASE 4: Erradicação e Recuperação](#fase-4-erradicação-e-recuperação)
- [FASE 5: Pós-Incidente](#fase-5-pós-incidente)
- [Cenários Específicos](#cenários-específicos)

---

## ⚡ PROTOCOLO DOS 15 MINUTOS

| Minutos | Ação | Prioridade |
|---------|------|-----------|
| 0-2 | Avaliar gravidade | 🔥 CRÍTICO |
| 2-7 | Conter o dano | 🔥 CRÍTICO |
| 7-10 | Preservar evidências | 🔸 IMPORTANTE |
| 10-15 | Alertar equipe | 🔸 IMPORTANTE |

---

## FASE 1: DETECÇÃO (0-5 minutos)

### 🚨 SINAIS DE ALERTA

#### Alerts Automáticos
```bash
# Ver alertas CRITICAL de hoje
cat /home/meumu.com/public_html/backend-nodejs/logs/alerts/$(date +%Y-%m-%d).json | grep CRITICAL

# Ver últimos 50 eventos de segurança
tail -50 /home/meumu.com/public_html/backend-nodejs/logs/security/$(date +%Y-%m-%d).log
```

#### Indicadores de Comprometimento (IOCs)

- [ ] **Múltiplos alertas CRITICAL** (>5 em 10 minutos)
- [ ] **Pico de tráfego** (>200% do normal)
- [ ] **Logins falhos massivos** (>100 em 5 minutos)
- [ ] **CPU/memória no limite** (>90% por >5 minutos)
- [ ] **Usuários reportando problemas**
- [ ] **Acesso a arquivos sensíveis** (.env, database config)
- [ ] **Alterações não autorizadas** em código/database

### 📊 COMANDOS DE DIAGNÓSTICO RÁPIDO

```bash
# Status do servidor
pm2 status

# Uso de recursos
pm2 monit

# Últimas 100 linhas de log
pm2 logs meumu-backend --lines 100

# Conexões ativas
netstat -tupln | grep :3001

# Processos suspeitos
ps aux | grep node

# Uso de disco
df -h

# Últimos logins
last -10
```

### 🎯 CLASSIFICAÇÃO DE SEVERIDADE

| Nível | Descrição | Tempo de Resposta | Exemplos |
|-------|-----------|-------------------|----------|
| **P1 - CRÍTICO** | Site offline ou comprometido | Imediato | DDoS, database hack, site defaced |
| **P2 - ALTO** | Funcionalidade crítica afetada | 15 minutos | Login quebrado, payments down |
| **P3 - MÉDIO** | Degradação de serviço | 1 hora | Lentidão, alguns usuários afetados |
| **P4 - BAIXO** | Problema menor | 24 horas | Bug visual, erro de log |

---

## FASE 2: CONTENÇÃO (5-15 minutos)

### 🔥 AÇÕES IMEDIATAS POR TIPO

#### 🚨 ATAQUE DDOS / FORÇA BRUTA

```bash
# 1. Identificar IP atacante
tail -100 logs/security/$(date +%Y-%m-%d).log | grep LOGIN_FAILED

# 2. Bloquear IP no firewall
sudo ufw deny from <IP_ATACANTE>

# 3. Verificar bloqueio
sudo ufw status

# 4. Aumentar rate limit temporariamente (editar .env)
RATE_LIMIT_MAX_REQUESTS=10  # Reduzir de 100 para 10
```

#### 🔓 SUSPEITA DE CONTA COMPROMETIDA

```bash
# 1. Forçar logout (rotacionar JWT_SECRET)
cd /home/meumu.com/public_html/backend-nodejs

# 2. Gerar novo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 3. Atualizar .env com novo secret
nano .env
# Substituir JWT_SECRET=...

# 4. Reiniciar backend (força re-login de todos)
pm2 restart meumu-backend

# 5. Verificar logs de acesso da conta
grep "userId.*SUSPICIOUS_USER_ID" logs/audit/$(date +%Y-%m-%d).log
```

#### 💾 SUSPEITA DE SQL INJECTION

```bash
# 1. Ver tentativas recentes
grep "SQL_INJECTION_ATTEMPT" logs/security/*.log

# 2. Bloquear IPs suspeitos
# (extrair IPs do log acima e bloquear)

# 3. Verificar integridade do banco
cd /home/meumu.com/public_html/backend-nodejs
node check-database-integrity.js  # Se existir

# 4. Fazer backup IMEDIATO
mysqldump -u usuario -p muonline > backup-emergency-$(date +%Y%m%d-%H%M).sql
```

#### 🔑 SUSPEITA DE SECRET EXPOSTA

```bash
# 1. Rotacionar TODOS os secrets
cd /home/meumu.com/public_html/backend-nodejs
cp .env .env.backup-$(date +%Y%m%d-%H%M)

# 2. Gerar novos secrets
echo "JWT_SECRET=$(openssl rand -hex 64)" >> .env.new
echo "SESSION_SECRET=$(openssl rand -hex 32)" >> .env.new

# 3. Substituir .env
mv .env.new .env

# 4. Reiniciar
pm2 restart meumu-backend

# 5. Revogar API keys externas (se aplicável)
# - OpenAI, Stripe, etc
```

### 📸 PRESERVAÇÃO DE EVIDÊNCIAS

```bash
#!/bin/bash
# Script de coleta de evidências

INCIDENT_ID="incident-$(date +%Y%m%d-%H%M)"
EVIDENCE_DIR="/home/meumu.com/evidence/$INCIDENT_ID"

mkdir -p "$EVIDENCE_DIR"

echo "📁 Coletando evidências em $EVIDENCE_DIR"

# Logs
cp -r /home/meumu.com/public_html/backend-nodejs/logs "$EVIDENCE_DIR/"

# Configuração atual
cp /home/meumu.com/public_html/backend-nodejs/.env "$EVIDENCE_DIR/.env.snapshot"

# Estado do sistema
pm2 list > "$EVIDENCE_DIR/pm2-status.txt"
ps aux > "$EVIDENCE_DIR/processes.txt"
netstat -tupln > "$EVIDENCE_DIR/network.txt"
df -h > "$EVIDENCE_DIR/disk-usage.txt"
free -m > "$EVIDENCE_DIR/memory.txt"

# Últimos logins
last -100 > "$EVIDENCE_DIR/last-logins.txt"

# Git status
cd /home/meumu.com/public_html
git status > "$EVIDENCE_DIR/git-status.txt"
git log -10 --oneline > "$EVIDENCE_DIR/git-log.txt"

# Comprimir
tar -czf "$EVIDENCE_DIR.tar.gz" "$EVIDENCE_DIR"

echo "✅ Evidências preservadas: $EVIDENCE_DIR.tar.gz"
```

---

## FASE 3: INVESTIGAÇÃO (15-60 minutos)

### 🔍 ANÁLISE FORENSE

#### Timeline do Incidente

```bash
# Criar timeline de eventos
echo "TIMELINE DO INCIDENTE - $INCIDENT_ID" > timeline.txt
echo "================================" >> timeline.txt

# Logins suspeitos
grep -h "LOGIN_FAILED\|LOGIN_SUCCESS" logs/audit/*.log \
  | sort \
  | tail -100 \
  >> timeline.txt

# Ações suspeitas
grep -h "SUSPICIOUS_ACTIVITY\|UNAUTHORIZED_ACCESS" logs/security/*.log \
  | sort \
  >> timeline.txt

# Alertas críticos
cat logs/alerts/*.json | grep CRITICAL | jq . >> timeline.txt
```

#### Análise de IPs

```bash
# Top 10 IPs com mais requisições hoje
awk '{print $1}' logs/access.log | sort | uniq -c | sort -rn | head -10

# Ver histórico de um IP específico
grep "192.168.1.100" logs/security/*.log

# Verificar geolocalização (se tiver geoip)
geoiplookup <IP_SUSPEITO>
```

#### Análise de Usuários Afetados

```bash
# Listar usuários com atividade suspeita
grep "SUSPICIOUS_ACTIVITY" logs/audit/*.log | awk '{print $4}' | sort | uniq

# Ver todas as ações de um usuário específico
grep "userId.*123" logs/audit/*.log
```

### 📋 CHECKLIST DE INVESTIGAÇÃO

- [ ] Identificar vetor de ataque (como entraram)
- [ ] Identificar escopo (o que foi acessado)
- [ ] Identificar tempo de comprometimento (desde quando)
- [ ] Identificar dados afetados (quais informações)
- [ ] Identificar número de usuários afetados
- [ ] Verificar se há backdoors instalados
- [ ] Verificar integridade de arquivos críticos
- [ ] Revisar permissões de usuários/database

---

## FASE 4: ERRADICAÇÃO E RECUPERAÇÃO

### 🔧 REMEDIAÇÃO

#### Aplicar Patches de Segurança

```bash
# 1. Atualizar dependências
cd /home/meumu.com/public_html/backend-nodejs
npm audit fix

# 2. Verificar se resolveu
npm audit

# 3. Se necessário, atualizar forçado
npm audit fix --force
```

#### Restaurar de Backup (se necessário)

```bash
# 1. Verificar backups disponíveis
ls -lh /backup/

# 2. Parar servidor
pm2 stop meumu-backend

# 3. Restaurar database
mysql -u usuario -p muonline < /backup/backup-YYYYMMDD.sql

# 4. Restaurar código (se comprometido)
cd /home/meumu.com/public_html
git reset --hard <COMMIT_SEGURO>

# 5. Reiniciar
pm2 restart meumu-backend

# 6. Verificar funcionamento
curl http://localhost:3001/health
```

#### Limpar Sistema Comprometido

```bash
# Buscar arquivos criados nas últimas 24h
find /home/meumu.com -type f -mtime -1 -ls

# Buscar shells/backdoors
find /home/meumu.com -name "*.php" -o -name "*.sh" | xargs grep -l "eval\|base64_decode\|exec"

# Verificar cron jobs suspeitos
crontab -l
```

### 🧪 TESTES PÓS-RECUPERAÇÃO

```bash
# 1. Teste de segurança
cd /home/meumu.com/public_html/backend-nodejs
chmod +x test-security.sh
./test-security.sh

# 2. Teste funcional
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123!@#"}'

# 3. Verificar logs
tail -50 logs/security/$(date +%Y-%m-%d).log
```

---

## FASE 5: PÓS-INCIDENTE

### 📝 RELATÓRIO DE INCIDENTE

Template: `/home/meumu.com/incident-reports/INCIDENT_ID.md`

```markdown
# RELATÓRIO DE INCIDENTE: [ID]

## RESUMO EXECUTIVO
- **Data/Hora:** [YYYY-MM-DD HH:MM]
- **Severidade:** [P1/P2/P3/P4]
- **Duração:** [X horas]
- **Impacto:** [Usuários afetados, sistemas down, etc]
- **Status:** [Resolvido/Mitigado/Em andamento]

## TIMELINE
- [HH:MM] Incidente detectado
- [HH:MM] Resposta iniciada
- [HH:MM] Ameaça contida
- [HH:MM] Sistema recuperado
- [HH:MM] Incidente encerrado

## CAUSA RAIZ
[Análise detalhada da causa]

## AÇÕES TOMADAS
1. [Ação 1]
2. [Ação 2]
...

## IMPACTO
- Usuários afetados: [X]
- Dados comprometidos: [Sim/Não - Detalhes]
- Downtime: [X minutos/horas]
- Perda financeira estimada: [R$ X]

## LIÇÕES APRENDIDAS
- O que funcionou bem
- O que pode melhorar
- Gaps identificados

## MELHORIAS IMPLEMENTADAS
- [ ] Melhoria 1
- [ ] Melhoria 2

## FOLLOW-UP
- [ ] Notificar usuários afetados
- [ ] Atualizar documentação
- [ ] Treinar equipe
- [ ] Revisar políticas
```

### 🎓 REVISÃO E APRENDIZADO

**Reunião pós-incidente (dentro de 48h):**

1. **O que aconteceu?** (fatos, sem culpa)
2. **Como detectamos?** (funcionou? pode melhorar?)
3. **Como respondemos?** (eficiente? gargalos?)
4. **Como prevenimos recorrência?** (ações concretas)
5. **O que aprendemos?** (documentar conhecimento)

---

## CENÁRIOS ESPECÍFICOS

### 🎯 CENÁRIO 1: Database Comprometido

**Sinais:**
- Queries suspeitas nos logs
- Dados alterados sem autorização
- Performance degradada

**Resposta:**
1. Isolar database (bloquear acesso externo)
2. Fazer snapshot/backup IMEDIATO
3. Auditar usuários do database
4. Revisar permissões
5. Rotacionar senhas
6. Restaurar de backup limpo (se necessário)

### 🎯 CENÁRIO 2: XSS / Código Malicioso Injetado

**Sinais:**
- Alertas XSS nos logs
- Usuários reportando comportamento estranho
- Scripts não autorizados detectados

**Resposta:**
1. Identificar vetor de injeção
2. Sanitizar database (remover payloads)
3. Atualizar sanitização de inputs
4. Testar todas as rotas
5. Notificar usuários se necessário

### 🎯 CENÁRIO 3: Credenciais Vazadas no Git

**Sinais:**
- Secret aparece em commit
- GitGuardian/GitHub alert

**Resposta:**
```bash
# 1. Revocar secret IMEDIATAMENTE
# (na plataforma: OpenAI, Stripe, AWS, etc)

# 2. Rotacionar local
# (gerar novo e atualizar .env)

# 3. Limpar histórico do Git
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# 4. Force push (CUIDADO!)
git push --force --all

# 5. Avisar equipe
echo "🚨 GIT FORCE PUSH - TODOS devem fazer fresh clone!"
```

---

## 📞 CONTATOS DE EMERGÊNCIA

### EQUIPE INTERNA
- **Tech Lead:** [Nome] - [Telefone] - [Email]
- **DevOps:** [Nome] - [Telefone] - [Email]
- **On-call:** [Ver rotação]

### EXTERNOS
- **Hosting Provider:** [Suporte 24/7]
- **Database Admin:** [Se aplicável]
- **Consultoria Segurança:** [Se contratado]

### SERVIÇOS
- **Domain Registrar:** [Painel de controle]
- **DNS Provider:** [Painel de controle]
- **CDN:** [Painel de controle]

---

## 🔐 NÍVEIS DE ESCALAÇÃO

| Nível | Quando Escalar | Quem Notificar |
|-------|----------------|----------------|
| **L1** | Alerta detectado | On-call engineer |
| **L2** | P2 ou superior | Tech Lead |
| **L3** | P1 ou dados vazados | Management + Legal |
| **L4** | Ataque massivo | CEO + Autoridades |

---

## 📚 RECURSOS ADICIONAIS

### Documentação
- `/SEGURANCA_IMPLEMENTADA.md` - Todas as proteções
- `/ANALISE_SEGURANCA.md` - Análise de vulnerabilidades
- `/backend-nodejs/test-security.sh` - Testes automáticos

### Ferramentas
```bash
# Monitoramento em tempo real
pm2 monit

# Análise de logs
grep -i "error\|critical\|attack" logs/security/*.log

# Health check
curl http://localhost:3001/health
```

---

**📅 ÚLTIMA ATUALIZAÇÃO:** 24/12/2024  
**📝 PRÓXIMA REVISÃO:** Trimestral ou após incidente  
**✅ TESTADO:** Sim - Simulação em [DATA]

---

## ⚡ COMANDOS RÁPIDOS (COLA)

```bash
# Emergência total
pm2 stop all && pm2 start meumu-backend

# Bloquear IP
sudo ufw deny from <IP>

# Rotacionar JWT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Backup NOW
mysqldump -u user -p muonline > emergency-$(date +%Y%m%d-%H%M).sql

# Ver últimos alertas
tail -20 logs/alerts/$(date +%Y-%m-%d).json

# Coletar evidências
./collect-evidence.sh
```

---

**🚨 LEMBRE-SE:**
1. **Manter a calma** - pânico piora a situação
2. **Documentar tudo** - será útil depois
3. **Preservar evidências** - antes de modificar
4. **Comunicar cedo** - não esconder problemas
5. **Aprender sempre** - todo incidente é uma lição

**💪 VOCÊ CONSEGUE! O SISTEMA ESTÁ PREPARADO!**
