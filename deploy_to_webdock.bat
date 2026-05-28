@echo off
set SERVER_IP=193.181.208.112
set SERVER_USER=davide
set REMOTE_PATH=/home/davide/DomandaeSoftware

echo 🚀 Sincronizzazione SoftMatch su Webdock (%SERVER_IP%)...

:: Utilizza rsync (disponibile in Git Bash o WSL) per sincronizzare solo i file cambiati
:: Esclude node_modules, cartelle git, ambienti virtuali e database locali
rsync -avz --progress ^
  --exclude='node_modules' ^
  --exclude='.git' ^
  --exclude='__pycache__' ^
  --exclude='venv' ^
  --exclude='db.sqlite3' ^
  --exclude='*.log' ^
  --exclude='backend/staticfiles' ^
  --exclude='backend/media' ^
  --exclude='frontend/dist' ^
  --exclude='certbot/conf' ^
  --exclude='certbot/www' ^
  ./ %SERVER_USER%@%SERVER_IP%:%REMOTE_PATH%

if %ERRORLEVEL% EQU 0 (
    echo ✅ Sincronizzazione completata con successo!
    echo.
    echo Prossimi passi sul server:
    echo 1. Accedi via SSH: ssh %SERVER_USER%@%SERVER_IP%
    echo 2. Entra nella cartella: cd %REMOTE_PATH%
    echo 3. Avvia Docker: docker-compose -f deploy/docker-compose.prod.yml up -d --build
) else (
    echo ❌ Errore durante la sincronizzazione. Verifica la connessione SSH.
)
pause
