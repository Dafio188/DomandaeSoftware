#!/bin/bash

# ==================================================
# SCRIPT DI AGGIORNAMENTO AUTOMATICO - SOFTMATCH
# ==================================================

echo "🚀 Inizio aggiornamento SoftMatch..."

# 1. Backup di sicurezza prima di toccare nulla
echo "📦 Creazione backup di sicurezza del database..."
timestamp=$(date +%Y%m%d_%H%M%S)
docker compose exec -T db pg_dump -U domanda domanda_software > database_backups/pre_update_backup_$timestamp.sql

# 2. Aggiornamento container
echo "🛠️ Ricostruzione immagini e riavvio..."
docker compose build --no-cache
docker compose up -d

# 3. Migrazioni (se necessarie)
echo "🧬 Verifica migrazioni database..."
docker compose exec backend python manage.py migrate

# 4. Pulizia
echo "🧹 Pulizia immagini Docker inutilizzate..."
docker image prune -f

echo "✅ Aggiornamento completato con successo!"
echo "Sito online e database migrato."
