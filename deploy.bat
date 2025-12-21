@echo off
REM ═══════════════════════════════════════════════════════════════════
REM MeuMU Online - Script de Deploy Automático (Windows)
REM 
REM @version 2.0.0
REM @author MeuMU Team
REM @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
REM ═══════════════════════════════════════════════════════════════════

chcp 65001 >nul
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🎮 MeuMU Online - Deploy Script 🎮              ║
echo ║                   Season 19-2-3 Épico                        ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Verificar se está na raiz
if not exist "package.json" (
    color 0C
    echo ❌ Erro: Execute este script na raiz do projeto!
    pause
    exit /b 1
)

REM Verificar Node.js
echo 🔍 Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ Node.js não instalado! Baixe em: https://nodejs.org
    pause
    exit /b 1
)
node -v
echo ✅ Node.js encontrado
echo.

REM Menu
echo Escolha o tipo de deploy:
echo 1) Desenvolvimento (dev server)
echo 2) Produção Local
echo 3) Apenas Build
echo 4) Apenas Backend
echo.
set /p DEPLOY_OPTION="Opção: "

if "%DEPLOY_OPTION%"=="1" goto dev
if "%DEPLOY_OPTION%"=="2" goto prod
if "%DEPLOY_OPTION%"=="3" goto build
if "%DEPLOY_OPTION%"=="4" goto backend
goto invalid

:dev
echo.
echo 🚀 Iniciando modo desenvolvimento...
echo.

echo 📦 Instalando dependências do frontend...
call npm install
if %errorlevel% neq 0 goto error

echo.
echo 📦 Instalando dependências do backend...
cd backend-nodejs
call npm install
if %errorlevel% neq 0 goto error
cd ..

echo.
color 0A
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                ✅ DEPENDÊNCIAS INSTALADAS! ✅                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Para iniciar:
echo   Frontend: npm run dev
echo   Backend:  cd backend-nodejs ^&^& npm start
echo.
pause
exit /b 0

:prod
echo.
echo 🚀 Deploy para produção local...
echo.

echo 🔨 Buildando frontend...
call npm install
if %errorlevel% neq 0 goto error

call npm run build
if %errorlevel% neq 0 goto error

echo ✅ Frontend buildado em /dist
echo.

echo 🔨 Configurando backend...
cd backend-nodejs
call npm install
if %errorlevel% neq 0 goto error
cd ..

echo.
color 0A
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ DEPLOY CONCLUÍDO! ✅                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📝 Próximos passos:
echo   1. Configurar servidor web (XAMPP/IIS)
echo   2. Apontar DocumentRoot para /dist
echo   3. Iniciar backend: cd backend-nodejs ^&^& npm start
echo.
echo 💡 Para usar PM2 (recomendado):
echo   npm install -g pm2-windows-startup
echo   pm2 start backend-nodejs/src/server.js --name meumu-backend
echo   pm2 save
echo.
pause
exit /b 0

:build
echo.
echo 🔨 Buildando apenas frontend...
echo.

call npm install
if %errorlevel% neq 0 goto error

call npm run build
if %errorlevel% neq 0 goto error

echo.
color 0A
echo ✅ Build concluído em /dist
echo.
echo Arquivos criados:
dir /B dist\
echo.
pause
exit /b 0

:backend
echo.
echo 🔨 Configurando apenas backend...
echo.

if not exist "backend-nodejs\.env" (
    color 0C
    echo ❌ Arquivo .env não encontrado!
    echo Execute o instalador primeiro: http://localhost/install
    pause
    exit /b 1
)

cd backend-nodejs
call npm install
if %errorlevel% neq 0 goto error
cd ..

echo.
color 0A
echo ✅ Backend configurado!
echo.
echo Iniciar com: cd backend-nodejs ^&^& npm start
echo.
echo 💡 OU com PM2:
echo   npm install -g pm2-windows-startup
echo   pm2 start backend-nodejs/src/server.js --name meumu-backend
echo   pm2 save
echo.
pause
exit /b 0

:invalid
color 0C
echo ❌ Opção inválida!
pause
exit /b 1

:error
color 0C
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      ❌ ERRO NO DEPLOY ❌                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Verifique os erros acima e tente novamente.
echo.
pause
exit /b 1
