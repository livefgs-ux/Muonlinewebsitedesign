@echo off
REM Script de inicializacao do MeuMU Online (Windows)

echo.
echo ========================================
echo    MeuMU Online - Season 19-2-3 Epico
echo ========================================
echo.

REM Verifica se .env existe
if not exist .env (
    echo ATENCAO: Arquivo .env nao encontrado!
    echo.
    echo Criando .env a partir do exemplo...
    copy .env.example .env
    echo.
    echo Arquivo .env criado!
    echo IMPORTANTE: Configure suas credenciais MySQL no arquivo .env
    echo.
    pause
    notepad .env
)

echo.
echo Testando conexao com MySQL...
echo.

REM Testa conexão
call npm run test:db

if %errorlevel% equ 0 (
    echo.
    echo Conexao OK! Iniciando servidores...
    echo.
    echo Backend: http://localhost:3001
    echo Frontend: http://localhost:5173
    echo.
    echo Pressione Ctrl+C para parar
    echo.
    
    REM Inicia backend e frontend
    call npm run dev:all
) else (
    echo.
    echo ERRO: Falha na conexao com MySQL!
    echo.
    echo Verifique:
    echo   1. MySQL esta rodando? (Services.msc)
    echo   2. Credenciais no .env estao corretas?
    echo   3. Firewall permite porta 3306?
    echo.
    echo Leia o guia: GUIA_CONEXAO_MYSQL.md
    echo.
    pause
)
