###############################################################################
# Script de Movimentação de Arquivos - MeuMU Online (PowerShell)
# 
# Este script move todos os arquivos de documentação e desenvolvimento
# para a pasta "arquivos utilizados na criacao do site"
#
# Data: 20/12/2024
# Uso: .\mover-arquivos.ps1
###############################################################################

# Configurações
$ErrorActionPreference = "Continue"
$Dest = "arquivos utilizados na criacao do site"

# Função para escrever em cores
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Header
Write-ColorOutput "╔═══════════════════════════════════════════════════════╗" "Blue"
Write-ColorOutput "║   📦 Script de Organização - MeuMU Online           ║" "Blue"
Write-ColorOutput "╚═══════════════════════════════════════════════════════╝" "Blue"
Write-Host ""

# Verificar se está na raiz do projeto
if (-Not (Test-Path "package.json")) {
    Write-ColorOutput "❌ Erro: Execute este script na raiz do projeto!" "Red"
    exit 1
}

# Verificar se a pasta de destino existe
if (-Not (Test-Path $Dest)) {
    Write-ColorOutput "❌ Erro: Pasta '$Dest' não encontrada!" "Red"
    exit 1
}

# Aviso
Write-ColorOutput "⚠️  ATENÇÃO: Este script irá mover arquivos!" "Yellow"
Write-ColorOutput "   Certifique-se de ter um backup antes de continuar." "Yellow"
Write-Host ""

$Confirmation = Read-Host "Deseja continuar? (s/N)"
if ($Confirmation -ne 's' -and $Confirmation -ne 'S') {
    Write-ColorOutput "❌ Operação cancelada." "Red"
    exit 1
}

Write-Host ""
Write-ColorOutput "🔄 Iniciando movimentação..." "Blue"
Write-Host ""

# Contadores
$Moved = 0
$Errors = 0

# Função para mover arquivo
function Move-FileOrFolder {
    param([string]$Path)
    
    if (Test-Path $Path) {
        try {
            Move-Item -Path $Path -Destination "$Dest\" -ErrorAction Stop
            Write-ColorOutput "✅ Movido: $Path" "Green"
            $script:Moved++
        } catch {
            Write-ColorOutput "❌ Erro ao mover: $Path" "Red"
            $script:Errors++
        }
    }
}

# 1. Mover documentação AdminCP
Write-ColorOutput "📚 Movendo documentação AdminCP..." "Blue"
Move-FileOrFolder "ADMINCP_BACKEND_INTEGRATION.md"
Move-FileOrFolder "ADMINCP_CHANGELOG.md"
Move-FileOrFolder "ADMINCP_DOCS_INDEX.md"
Move-FileOrFolder "ADMINCP_FAKE_GUIDE.md"
Move-FileOrFolder "ADMINCP_IMPLEMENTATION_SUMMARY.md"
Move-FileOrFolder "ADMINCP_INDEX.txt"
Move-FileOrFolder "ADMINCP_PARTE6_LAYOUT_SPA.md"
Move-FileOrFolder "ADMINCP_QUICK_START.md"
Move-FileOrFolder "ADMINCP_README.md"
Move-FileOrFolder "ADMINCP_SCREENSHOTS.md"
Move-FileOrFolder "ADMINCP_VISUAL_CHECKLIST.md"
Move-FileOrFolder "ADMINCP_VISUAL_GUIDE.md"

# 2. Mover correções e ajustes
Write-ColorOutput "🔧 Movendo correções e ajustes..." "Blue"
Move-FileOrFolder "AJUSTE_ANIMACOES_DOWNLOADS.md"
Move-FileOrFolder "ANALISE_LIMPEZA.md"
Move-FileOrFolder "ATUALIZACAO_POPUPS_TEMA.md"
Move-FileOrFolder "CHANGELOG_AJUSTES_LAYOUT.md"
Move-FileOrFolder "CHECKLIST_CONTRASTE_FINAL.md"
Move-FileOrFolder "CORRECAO_SOBREPOSICAO_WIDGETS.md"
Move-FileOrFolder "CORRECOES_CONTRASTE_VISUAL.md"
Move-FileOrFolder "CORRECOES_EVENTS_TRADUCAO_APLICADAS.md"
Move-FileOrFolder "CORRECOES_TRADUCAO_APLICADAS.md"
Move-FileOrFolder "FIX_BACKGROUND_PROBLEMA.md"
Move-FileOrFolder "FIX_HOOKS_ERROR.md"

# 3. Mover estrutura e sistema
Write-ColorOutput "🏗️  Movendo estrutura e sistema..." "Blue"
Move-FileOrFolder "ESTRUTURA_LIMPA.md"
Move-FileOrFolder "ESTRUTURA_VISUAL.txt"
Move-FileOrFolder "SISTEMA_COMPLETO.md"
Move-FileOrFolder "SISTEMA_TRADUCAO_ATUALIZADO.md"
Move-FileOrFolder "SISTEMA_TRADUCAO_STATUS_COMPLETO.md"

# 4. Mover guias
Write-ColorOutput "📖 Movendo guias..." "Blue"
Move-FileOrFolder "GUIA_INSTALACAO.md"
Move-FileOrFolder "GUIA_INSTALACAO_ADMINCP.md"
Move-FileOrFolder "GUIA_RAPIDO_SISTEMA.md"
Move-FileOrFolder "COMO_USAR_ADMINCP.md"
Move-FileOrFolder "EXPORT_DASHBOARD_GUIDE.md"

# 5. Mover implementações
Write-ColorOutput "⚙️  Movendo implementações..." "Blue"
Move-FileOrFolder "IMPLEMENTACAO_MODOS_TESTE_ADMINCP.md"
Move-FileOrFolder "PARTE_9_DOACOES_IMPLEMENTADA.md"
Move-FileOrFolder "PARTE_10_SEGURANCA_IMPLEMENTADA.md"
Move-FileOrFolder "PARTE_11_CRONJOBS_IMPLEMENTADA.md"
Move-FileOrFolder "PARTE_12_PLAYER_DASHBOARD_IMPLEMENTADA.md"
Move-FileOrFolder "RESUMO_COMPLETO_PARTES_10-11-12.md"
Move-FileOrFolder "RESUMO_PARTE6.md"

# 6. Mover otimizações
Write-ColorOutput "⚡ Movendo otimizações..." "Blue"
Move-FileOrFolder "OTIMIZACOES_PERFORMANCE.md"
Move-FileOrFolder "REFATORACAO_ANTI_DUPLICIDADE.md"
Move-FileOrFolder "MIGRACAO_TRADUCAO_DOT_NOTATION.md"

# 7. Mover planos e conversões
Write-ColorOutput "📋 Movendo planos e conversões..." "Blue"
Move-FileOrFolder "PLANO_CONVERSAO_MOCK_PARA_REAL.md"
Move-FileOrFolder "PROXIMOS_PASSOS_IMPLEMENTACAO.md"
Move-FileOrFolder "RESUMO_CONVERSAO_MOCK_PARA_REAL.md"
Move-FileOrFolder "README_CONVERSAO_COMPLETA.md"
Move-FileOrFolder "README_DOCUMENTACAO.md"
Move-FileOrFolder "SEGURANCA_COMPONENTES_TESTE_REMOVIDOS.md"

# 8. Mover backups
Write-ColorOutput "💾 Movendo backups..." "Blue"
Move-FileOrFolder "BACKUP_INDEX.md"
Move-FileOrFolder "BACKUP_TEST_INSTALL_1.md"
Move-FileOrFolder "BACKUP_20-12-2024_15h30"

# 9. Mover outros
Write-ColorOutput "📄 Movendo outros arquivos..." "Blue"
Move-FileOrFolder "ATTRIBUTIONS.md"
Move-FileOrFolder "LIMPEZA_CONCLUIDA.txt"
Move-FileOrFolder "RECREATE_DASHBOARD_INSTRUCTIONS.md"
Move-FileOrFolder "SYSTEM_DIAGNOSTICS_README.md"
Move-FileOrFolder "COMECAR_AQUI.txt"
Move-FileOrFolder "PROMPT_PARA_IA_RECRIAR_DASHBOARD.txt"
Move-FileOrFolder "START_HERE.txt"

# 10. Mover pastas
Write-ColorOutput "📁 Movendo pastas..." "Blue"
Move-FileOrFolder "mock-data"
Move-FileOrFolder "server"
Move-FileOrFolder "scripts"
Move-FileOrFolder "guidelines"
Move-FileOrFolder "shared"

# Resumo
Write-Host ""
Write-ColorOutput "╔═══════════════════════════════════════════════════════╗" "Blue"
Write-ColorOutput "║              📊 RESUMO DA OPERAÇÃO                    ║" "Blue"
Write-ColorOutput "╚═══════════════════════════════════════════════════════╝" "Blue"
Write-Host ""
Write-ColorOutput "✅ Arquivos movidos: $Moved" "Green"
Write-ColorOutput "❌ Erros: $Errors" "Red"
Write-Host ""

if ($Errors -eq 0) {
    Write-ColorOutput "🎉 Movimentação concluída com sucesso!" "Green"
    Write-Host ""
    Write-ColorOutput "📋 Próximos passos:" "Yellow"
    Write-ColorOutput "   1. Teste o site: npm run dev" "Yellow"
    Write-ColorOutput "   2. Verifique se tudo funciona" "Yellow"
    Write-ColorOutput "   3. Se OK, pode deletar a pasta em produção" "Yellow"
} else {
    Write-ColorOutput "⚠️  Movimentação concluída com erros!" "Red"
    Write-ColorOutput "   Verifique os arquivos que não foram movidos." "Red"
}

Write-Host ""
Write-ColorOutput "═══════════════════════════════════════════════════════" "Blue"
