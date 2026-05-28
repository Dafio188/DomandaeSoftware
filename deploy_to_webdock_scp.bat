@echo off
set SERVER_IP=193.181.208.112
set SERVER_USER=davide
set REMOTE_PATH=/home/davide/DomandaeSoftware
set COMPOSE_FILE=deploy/docker-compose.prod.yml

echo 🚀 AVVIO AGGIORNAMENTO AUTOMATICO SoftMatch (%SERVER_IP%)...

:: 1. Compressione locale escludendo file inutili
echo 📦 Compressione dei file in corso...
tar -czf project.tar.gz --exclude=frontend/node_modules --exclude=frontend/test-results --exclude=frontend/playwright-report --exclude=backend/__pycache__ --exclude=backend/venv --exclude=.git --exclude=project.tar.gz .
if %ERRORLEVEL% NEQ 0 ( echo ❌ Errore compressione. && pause && exit /b )

:: 2. Caricamento sul server
echo 📂 Caricamento in corso...
scp -o StrictHostKeyChecking=no project.tar.gz %SERVER_USER%@%SERVER_IP%:%REMOTE_PATH%/
if %ERRORLEVEL% NEQ 0 ( echo ❌ Errore caricamento. && pause && exit /b )

:: 3. Estrazione e Riavvio Docker (SEQUENZA COMPATIBILE PER EVITARE KEYERROR)
echo ⚙️ Applicazione modifiche sul server e riavvio Docker...
ssh -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cd %REMOTE_PATH% && tar -xzf project.tar.gz && rm project.tar.gz && docker-compose -f %COMPOSE_FILE% stop && docker-compose -f %COMPOSE_FILE% rm -f && docker-compose -f %COMPOSE_FILE% up -d --build"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ AGGIORNAMENTO COMPLETATO CON SUCCESSO!
    echo 🌐 Il sito e aggiornato su: https://app.softmatch.it
) else (
    echo ❌ Errore durante l'aggiornamento sul server.
)

:: Pulizia locale
if exist project.tar.gz del project.tar.gz
pause
