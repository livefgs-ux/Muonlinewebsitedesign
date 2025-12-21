@echo off
REM ═══════════════════════════════════════════════════════════════════
REM MeuMU Online - Script Pós-Instalação (Windows)
REM Execute APÓS concluir o instalador PHP
REM 
REM @version 2.0.1
REM @author MeuMU Team
REM ═══════════════════════════════════════════════════════════════════

chcp 65001 >nul
color 0B
cls

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║         🎮 MeuMU Online - Pós-Instalação 🎮                  ║
echo ║                 Season 19-2-3 Épico                          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Verificar raiz
if not exist "package.json" (
    color 0C
    echo ❌ Erro: Execute este script na raiz do projeto!
    pause
    exit /b 1
)

REM Verificar se instalador foi executado
if not exist "config.php" (
    color 0C
    echo ❌ Erro: Arquivo config.php não encontrado!
    echo.
    echo Execute o instalador PHP primeiro: http://localhost/install
    pause
    exit /b 1
)

if not exist "backend-nodejs\.env" (
    color 0C
    echo ❌ Erro: Arquivo .env não encontrado no backend!
    echo.
    echo Execute o instalador PHP primeiro: http://localhost/install
    pause
    exit /b 1
)

color 0A
echo ✅ Arquivos de configuração encontrados!
echo.

REM PASSO 1: BUILD
color 0B
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  PASSO 1/3: Buildar Frontend React                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📦 Instalando dependências do frontend...
call npm install
if %errorlevel% neq 0 goto error
color 0A
echo ✅ Dependências instaladas!
echo.

color 0B
echo 🔨 Buildando para produção...
call npm run build
if %errorlevel% neq 0 goto error
color 0A
echo ✅ Build concluído! Pasta /dist criada.
echo.

REM PASSO 2: BACKEND
color 0B
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  PASSO 2/3: Configurar Backend Node.js                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📦 Instalando dependências do backend...
cd backend-nodejs
call npm install
if %errorlevel% neq 0 (
    cd ..
    goto error
)
cd ..
color 0A
echo ✅ Dependências do backend instaladas!
echo.

color 0E
echo Como deseja iniciar o backend?
echo 1) Node Standalone (simples)
echo 2) PM2 (requer instalação manual do pm2-windows-startup)
echo 3) Não iniciar agora (vou fazer manualmente depois)
echo.
set /p BACKEND_OPTION="Opção (1-3): "

if "%BACKEND_OPTION%"=="1" (
    color 0A
    echo.
    echo ✅ Backend configurado!
    echo.
    echo Para iniciar o backend, execute:
    echo   cd backend-nodejs ^&^& npm start
    echo.
    color 0C
    echo ⚠️  O terminal precisa ficar aberto!
    echo.
) else if "%BACKEND_OPTION%"=="2" (
    echo.
    echo Para usar PM2 no Windows:
    echo 1. Instale: npm install -g pm2-windows-startup
    echo 2. Configure: pm2-startup install
    echo 3. Inicie: cd backend-nodejs ^&^& pm2 start src/server.js --name meumu-backend
    echo 4. Salve: pm2 save
    echo.
) else if "%BACKEND_OPTION%"=="3" (
    color 0A
    echo.
    echo ✅ Backend configurado!
    echo.
    echo Para iniciar o backend manualmente:
    echo   cd backend-nodejs ^&^& npm start
    echo.
) else (
    color 0C
    echo Opção inválida! Pulando...
    echo.
)

REM PASSO 3: SERVIDOR WEB
color 0B
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  PASSO 3/3: Configurar Servidor Web                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

color 0E
echo ⚠️  ATENÇÃO: Configure seu servidor web MANUALMENTE!
echo.
echo XAMPP (Apache):
echo   Edite: C:\xampp\apache\conf\extra\httpd-vhosts.conf
echo   DocumentRoot "C:/xampp/htdocs/meumu/dist"
echo.
echo IIS:
echo   Crie um site apontando para: C:\inetpub\wwwroot\meumu\dist
echo.
echo Após configurar, reinicie o servidor web!
echo.

REM SEGURANÇA
color 0C
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  🔒 SEGURANÇA: Deletar pasta /install                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

if exist "install\" (
    color 0E
    set /p DELETE_INSTALL="Deseja deletar a pasta /install agora? (s/N): "
    
    if /i "%DELETE_INSTALL%"=="s" (
        rmdir /s /q install
        color 0A
        echo ✅ Pasta /install deletada!
    ) else (
        color 0E
        echo ⚠️  Lembre-se de deletar manualmente: rmdir /s /q install
    )
)

echo.
color 0A
echo ╔══════════════════════════════════════════════════════════════╗
echo ║             ✅ PÓS-INSTALAÇÃO CONCLUÍDA! ✅                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📊 Resumo:
echo   ✅ Frontend buildado em /dist
echo   ✅ Backend configurado
if "%BACKEND_OPTION%"=="1" (
    echo   ⚠️  Backend: inicie com "cd backend-nodejs ^&^& npm start"
)
echo   ⚠️  Servidor web: configure manualmente
echo.

echo 📝 Próximos passos:
echo   1. Configure DocumentRoot/root para /dist
echo   2. Reinicie o servidor web
echo   3. Acesse: http://localhost
echo   4. Teste backend: curl http://localhost:3001/api/health
echo.

color 0D
echo ═══════════════════════════════════════════════════════════════
echo        🎮 MeuMU Online v2.0.1 - Pronto para jogar! 🎮
echo ═══════════════════════════════════════════════════════════════
echo.

pause
exit /b 0

:error
color 0C
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  ❌ ERRO NO PROCESSO ❌                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Verifique os erros acima e tente novamente.
echo.
pause
exit /b 1
