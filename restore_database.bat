@echo off
echo ========================================
echo   RIPRISTINO DATABASE DOMANDA & SOFTWARE
echo ========================================
echo.

echo Backup disponibili:
echo.
dir database_backups\*.sql /B
echo.

set /p BACKUP_FILE="Inserisci il nome del file di backup (senza percorso): "

if not exist "database_backups\%BACKUP_FILE%" (
    echo ❌ File non trovato: %BACKUP_FILE%
    pause
    exit /b 1
)

echo.
echo ⚠️  ATTENZIONE: Questa operazione cancellerà tutti i dati attuali!
set /p CONFIRM="Sei sicuro? (digita 'SI' per confermare): "

if not "%CONFIRM%"=="SI" (
    echo Operazione annullata.
    pause
    exit /b 0
)

echo.
echo Ripristinando database da: %BACKUP_FILE%
echo.

echo Fermando i servizi...
docker-compose stop backend

echo Eliminando database esistente...
docker-compose exec db dropdb -U domanda domanda_software

echo Creando nuovo database...
docker-compose exec db createdb -U domanda domanda_software

echo Ripristinando dati...
docker-compose exec -T db psql -U domanda -d domanda_software < database_backups\%BACKUP_FILE%

echo Riavviando servizi...
docker-compose start backend

if %ERRORLEVEL% EQU 0 (
    echo ✅ Ripristino completato con successo!
) else (
    echo ❌ Errore durante il ripristino!
)

echo.
pause 