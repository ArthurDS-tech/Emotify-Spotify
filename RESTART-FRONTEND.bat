@echo off
echo Parando frontend...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1

echo Limpando cache...
if exist "Front\.next" rmdir /s /q "Front\.next"

echo Aguarde 3 segundos...
timeout /t 3 >nul

echo Iniciando frontend...
start "Emotify Frontend" cmd /k "cd Front && npm run dev"

echo.
echo Frontend reiniciado!
echo Aguarde 10 segundos e acesse: http://localhost:3000
echo.
pause
