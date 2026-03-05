@echo off
echo ========================================
echo    EMOTIFY - Inicializacao Completa
echo ========================================
echo.

REM Matar processos nas portas 3000 e 3001
echo [1/5] Limpando portas...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 >nul

REM Limpar cache do Next.js
echo [2/5] Limpando cache do Next.js...
if exist "Front\.next" rmdir /s /q "Front\.next"
timeout /t 1 >nul

REM Verificar se node_modules existe
echo [3/5] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias do backend...
    call npm install
)
if not exist "Front\node_modules" (
    echo Instalando dependencias do frontend...
    cd Front
    call npm install
    cd ..
)

REM Iniciar backend
echo [4/5] Iniciando backend na porta 3001...
start "Emotify Backend" cmd /k "npm run dev"
timeout /t 5 >nul

REM Iniciar frontend
echo [5/5] Iniciando frontend na porta 3000...
start "Emotify Frontend" cmd /k "cd Front && npm run dev"

echo.
echo ========================================
echo    Servidores Iniciados!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Aguarde 10 segundos e acesse:
echo http://localhost:3000
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:3000

echo.
echo Para parar os servidores, feche as janelas do terminal.
echo.
