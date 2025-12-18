# 🎮 MeuMU Online - LEIA-ME PRIMEIRO!

## ⚡ Instalação Rápida (5 minutos)

```bash
# 1. Adicione as imagens manualmente (OBRIGATÓRIO):
#    - public/assets/backgrounds/hero-background.png
#    - public/assets/images/character-example.png

# 2. Execute o instalador:
chmod +x install.sh
./install.sh

# 3. Inicie o site:
npm run dev

# 4. Acesse: http://localhost:3000
```

---

## ⚠️ ATENÇÃO: 2 Imagens Necessárias

O site **NÃO funcionará completamente** sem estas imagens:

### 1. Background Principal (OBRIGATÓRIO)
```
📁 Adicione em: /public/assets/backgrounds/hero-background.png
📏 Tamanho: 1920x1080px ou maior
🎨 Tema: Dark medieval fantasy (Elf Warrior)
```

### 2. Exemplo de Personagem (OPCIONAL)
```
📁 Adicione em: /public/assets/images/character-example.png
📏 Tamanho: 400x600px
🎨 Tema: Sprite de personagem MU Online
```

**Como obter estas imagens:**
- Exporte do Figma (veja [ASSETS_MAPPING.md](ASSETS_MAPPING.md))
- Ou use imagens similares com tema dark medieval fantasy

---

## 📚 Documentação Completa

| Documento | Quando Usar |
|-----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | 🚀 Começar agora (5 min) |
| **[INSTALACAO.md](INSTALACAO.md)** | 📖 Guia detalhado de instalação |
| **[ASSETS_MAPPING.md](ASSETS_MAPPING.md)** | 🎨 Como adicionar as imagens |
| **[DEPLOY.md](DEPLOY.md)** | 🌐 Deploy em produção |
| **[CHECKLIST_FINAL.md](CHECKLIST_FINAL.md)** | ✅ Lista antes do deploy |
| **[RESUMO_COMPLETO.md](RESUMO_COMPLETO.md)** | 📊 Tudo que foi feito |
| **[README.md](README.md)** | 📝 Documentação geral |

---

## ✅ Status do Projeto

### O que está PRONTO:
- ✅ Todo o código fonte atualizado
- ✅ Background unificado em todas as páginas
- ✅ Sistema multilíngue (8 idiomas)
- ✅ Rankings dinâmicos
- ✅ Eventos com cronômetros
- ✅ Dashboard de jogador
- ✅ AdminCP completo
- ✅ Integração com MySQL
- ✅ Scripts de instalação automatizados
- ✅ Documentação completa

### O que você precisa FAZER:
- ⚠️ Adicionar 2 imagens manualmente (veja acima)
- ⚠️ Executar `./install.sh`
- ⚠️ Testar localmente
- ⚠️ Fazer deploy

---

## 🔍 Verificação Rápida

Depois de adicionar as imagens, execute:

```bash
# Verificar se tudo está OK
chmod +x verify-assets.sh
./verify-assets.sh

# Se aparecer "✅ PERFEITO!", está tudo certo!
```

---

## 💾 Configuração do Banco

**Valores padrão já configurados:**
```
Host: 23.321.231.227
User: root
Pass: 123123123
DBs: muonline, webmu
```

O script `install.sh` usa estes valores automaticamente.  
Apenas pressione ENTER para aceitar os padrões!

---

## 🎯 Próximos 3 Passos

### 1️⃣ AGORA (5 minutos)
```bash
# Adicione as 2 imagens
# Execute ./install.sh
# Teste com npm run dev
```

### 2️⃣ AMANHÃ (1 hora)
```bash
# Escolha plataforma (Vercel recomendado)
# Faça deploy
# Teste em produção
```

### 3️⃣ DEPOIS (contínuo)
```bash
# Adicione conteúdo via AdminCP
# Configure eventos
# Divulgue para jogadores
```

---

## ❓ Problemas Comuns

### "Cannot find module 'figma:asset'"
**❌ Significa:** O código ainda tem imports antigos  
**✅ Solução:** Execute `grep -r "figma:asset" ./src` - não deve retornar nada

### "Imagens não aparecem"
**❌ Significa:** As imagens não foram adicionadas  
**✅ Solução:** Copie as imagens para as pastas corretas (veja acima)

### "Erro de conexão MySQL"
**❌ Significa:** Não consegue conectar ao banco  
**✅ Solução:** Verifique firewall e credenciais no `.env`

### Mais soluções:
- 📖 [INSTALACAO.md - Problemas Comuns](INSTALACAO.md#problemas-comuns)

---

## 🆘 Precisa de Ajuda?

### Documentação:
1. Leia [QUICKSTART.md](QUICKSTART.md) - 5 minutos
2. Se precisar de mais detalhes, leia [INSTALACAO.md](INSTALACAO.md)
3. Para assets, leia [ASSETS_MAPPING.md](ASSETS_MAPPING.md)

### Suporte:
- 📧 Email: suporte@meumu.com.br
- 💬 Discord: MeuMU Online Community
- 📱 WhatsApp: Grupo Oficial

---

## 🎮 Sobre o Projeto

**MeuMU Online - Season 19-2-3 Épico**

Website completo para servidor privado de MU Online com:
- 🎨 Tema dark medieval fantasy
- 🌍 8 idiomas
- 🏆 Rankings em tempo real
- 📅 Eventos com cronômetros
- 👤 Dashboard de jogador
- 🔧 Painel administrativo
- 💾 Integração com MySQL

---

## 📊 Tempo Estimado

| Tarefa | Tempo |
|--------|-------|
| Adicionar imagens | 5 min |
| Executar instalação | 5 min |
| Testar localmente | 10 min |
| Deploy | 30 min |
| Configuração inicial | 30 min |
| **TOTAL** | **1h 20min** |

---

## ✨ Última Dica

**Ordem recomendada:**

1. **Primeiro:** Adicione as imagens
2. **Segundo:** Execute `./install.sh`
3. **Terceiro:** Teste com `npm run dev`
4. **Quarto:** Execute `./verify-assets.sh`
5. **Quinto:** Faça deploy (amanhã)

**Não pule o passo 1!** Sem as imagens, o site não ficará perfeito.

---

## 🎉 Está Pronto!

Este projeto foi **100% reorganizado** e está pronto para uso.

Tudo que você precisa fazer é:
1. ✅ Adicionar 2 imagens
2. ✅ Executar 1 comando (`./install.sh`)
3. ✅ Testar e fazer deploy

**Simples assim!** 🚀

---

**Desenvolvido com ❤️ para MeuMU Online**

⚔️ Entre na lenda. Domine os reinos. Torne-se imortal. 🎮

---

**Comece agora:** [QUICKSTART.md](QUICKSTART.md) 👈
