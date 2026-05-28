@echo off
set SERVER_IP=193.181.208.112
set SERVER_USER=davide
set REMOTE_PATH=/home/davide/DomandaeSoftware
set COMPOSE_FILE=deploy/docker-compose.prod.yml

echo 🚀 AVVIO AGGIORNAMENTO AUTOMATICO SoftMatch (%SERVER_IP%)...

:: 0. Pulizia preventiva file temporanei
if exist project.tar.gz del /f /q project.tar.gz

:: 1. Compressione locale escludendo file inutili
echo 📦 Compressione dei file in corso...
tar -czf project.tar.gz --exclude=frontend/node_modules --exclude=frontend/test-results --exclude=frontend/playwright-report --exclude=backend/__pycache__ --exclude=backend/venv --exclude=.git --exclude=project.tar.gz .
if %ERRORLEVEL% NEQ 0 ( echo ❌ Errore compressione. Assicurati che project.tar.gz non sia aperto in altri programmi. && pause && exit /b )

:: 2. Caricamento sul server
echo 📂 Caricamento in corso...
scp -o StrictHostKeyChecking=no project.tar.gz %SERVER_USER%@%SERVER_IP%:%REMOTE_PATH%/
if %ERRORLEVEL% NEQ 0 ( echo ❌ Errore caricamento. && pause && exit /b )

:: 3. Estrazione, Riavvio Docker e Reset Amministratore
echo ⚙️ Applicazione modifiche sul server e riavvio Docker...
ssh -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cd %REMOTE_PATH% && tar -xzf project.tar.gz && rm project.tar.gz && cd deploy && docker-compose -f docker-compose.prod.yml stop && docker-compose -f docker-compose.prod.yml rm -f && docker-compose -f docker-compose.prod.yml up -d --build && echo '⏳ Attesa avvio container...' && sleep 10 && docker exec deploy_backend_1 python3 super_reset.py"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ AGGIORNAMENTO COMPLETATO CON SUCCESSO!
    echo 🔑 Superuser 'admin' resettato con password: SoftMach2026
    echo 🌐 Il sito e aggiornato su: https://app.softmatch.it
) else (
    echo ❌ Errore durante l'aggiornamento sul server.
)

:: Pulizia locale finale
if exist project.tar.gz del /f /q project.tar.gz
pause
