# MeuMU Online - Script de Correção de Permissões (Windows)
# Corrige automaticamente as permissões do projeto no Windows

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  MeuMU Online - Correção Automática de Permissões (Windows)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "✅ Rodando como ADMINISTRADOR" -ForegroundColor Green
} else {
    Write-Host "⚠️  Rodando como usuário normal" -ForegroundColor Yellow
    Write-Host "   Para melhores resultados, execute como administrador:" -ForegroundColor Yellow
    Write-Host "   1. Clique com botão direito em PowerShell" -ForegroundColor Yellow
    Write-Host "   2. Executar como administrador" -ForegroundColor Yellow
    Write-Host ""
}

# Obter pasta atual
$projectPath = Get-Location

Write-Host "📁 Pasta do projeto: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Função para dar permissões completas
function Grant-FullPermissions {
    param (
        [string]$Path
    )
    
    try {
        $acl = Get-Acl $Path
        
        # Criar regra de acesso para "Todos" (Everyone)
        $everyone = New-Object System.Security.Principal.SecurityIdentifier("S-1-1-0")
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $everyone,
            "FullControl",
            "ContainerInherit,ObjectInherit",
            "None",
            "Allow"
        )
        
        $acl.AddAccessRule($rule)
        Set-Acl $Path $acl
        
        return $true
    }
    catch {
        Write-Host "   ❌ Erro: $_" -ForegroundColor Red
        return $false
    }
}

# Aplicar permissões
Write-Host "📝 Aplicando permissões..." -ForegroundColor Cyan

$success = Grant-FullPermissions -Path $projectPath

if ($success) {
    Write-Host "✅ Permissões aplicadas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Falha ao aplicar permissões" -ForegroundColor Red
}

Write-Host ""

# Verificar pastas críticas
Write-Host "🔍 Verificando pastas críticas..." -ForegroundColor Cyan

function Test-Writable {
    param (
        [string]$Path
    )
    
    try {
        $testFile = Join-Path $Path ".write_test_$(Get-Random)"
        New-Item -Path $testFile -ItemType File -Force | Out-Null
        Remove-Item -Path $testFile -Force
        return $true
    }
    catch {
        return $false
    }
}

$folders = @(
    "backend-nodejs",
    "install",
    "."
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        if (Test-Writable -Path $folder) {
            Write-Host "  ✅ $folder - Escrita OK" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $folder - SEM PERMISSÃO DE ESCRITA" -ForegroundColor Red
        }
    } else {
        Write-Host "  ❌ $folder - NÃO EXISTE" -ForegroundColor Red
    }
}

Write-Host ""

# Teste final
if ((Test-Writable -Path ".") -and (Test-Writable -Path "backend-nodejs")) {
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "  ✅ SUCESSO! O instalador deve funcionar agora!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Acesse: http://localhost/install" -ForegroundColor White
    Write-Host "   2. Clique em 'Instalar Agora'" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "================================================================" -ForegroundColor Red
    Write-Host "  ❌ AINDA HÁ PROBLEMAS DE PERMISSÃO" -ForegroundColor Red
    Write-Host "================================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solução alternativa (MANUAL):" -ForegroundColor Yellow
    Write-Host "   1. Clique com botão direito na pasta do projeto" -ForegroundColor White
    Write-Host "   2. Propriedades → Segurança" -ForegroundColor White
    Write-Host "   3. Editar → Adicionar → 'Todos'" -ForegroundColor White
    Write-Host "   4. Marcar 'Controle Total'" -ForegroundColor White
    Write-Host "   5. Aplicar → OK" -ForegroundColor White
    Write-Host ""
}

Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
