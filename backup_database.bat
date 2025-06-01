@echo off
echo ========================================
echo    BACKUP DATABASE DOMANDA & SOFTWARE
echo ========================================
echo.

set BACKUP_DATE=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DATE=%BACKUP_DATE: =0%

echo Creando backup del database...
echo Data/Ora: %BACKUP_DATE%
echo.

docker-compose exec -T db pg_dump -U domanda -d domanda_software > database_backups\manual_backup_%BACKUP_DATE%.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Backup completato con successo!
    echo File: database_backups\manual_backup_%BACKUP_DATE%.sql
) else (
    echo ❌ Errore durante il backup!
)

echo.
echo Backup disponibili:
dir database_backups\*.sql /B

echo.
pause 