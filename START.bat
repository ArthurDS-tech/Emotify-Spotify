@echo off
echo ========================================
echo   EMOTIFY - Iniciando Aplicacao
echo ========================================
echo.

echo [1/3] Matando processos nas portas 3000 e 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Iniciando Backend (porta 3001)...
start "Emotify Backend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Iniciando Frontend (porta 3000)...
start "Emotify Frontend" cmd /k "cd Front && npm run dev"

echo.
echo ========================================
echo   PRONTO!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Aguarde alguns segundos e acesse:
echo http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
