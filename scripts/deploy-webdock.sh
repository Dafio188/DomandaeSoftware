#!/bin/bash

# Script di deployment per Webdock VPS
# Eseguire con: bash deploy-webdock.sh tuodominio.com

set -e  # Exit on any error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per log colorati
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verifica parametri
if [ $# -eq 0 ]; then
    error "Usage: $0 <domain_name>"
fi

DOMAIN_NAME=$1

log "🚀 Avvio deployment SoftMatch su Webdock VPS"
log "🌐 Dominio: $DOMAIN_NAME"

# Verifica se siamo root
if [ "$EUID" -eq 0 ]; then
    warn "Eseguire lo script come utente normale, non root"
fi

# Aggiorna sistema
log "📦 Aggiornamento sistema..."
sudo apt update && sudo apt upgrade -y

# Installa dipendenze
log "🔧 Installazione dipendenze..."
sudo apt install -y \
    docker.io \
    docker-compose \
    git \
    curl \
    wget \
    ufw \
    fail2ban \
    htop \
    nano

# Avvia e abilita Docker
log "🐳 Configurazione Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Configura firewall
log "🔒 Configurazione firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Clona repository
log "📚 Clone repository..."
if [ -d "DomandaeSoftware" ]; then
    cd DomandaeSoftware
    git pull origin main
else
    git clone https://github.com/Dafio188/DomandaeSoftware.git
    cd DomandaeSoftware
fi

# Crea file .env
log "⚙️ Configurazione variabili ambiente..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Configurazione produzione Webdock
DOMAIN_NAME=$DOMAIN_NAME
SECRET_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
EOF
    log "✅ File .env creato"
else
    log "ℹ️ File .env già esistente"
fi

# Aggiorna configurazione Nginx con dominio
log "🌐 Configurazione Nginx per dominio $DOMAIN_NAME..."
sed "s/DOMAIN_NAME/$DOMAIN_NAME/g" nginx/sites-available/domanda-software.conf > nginx/sites-available/site.conf

# Crea directory necessarie
log "📁 Creazione directory..."
mkdir -p certbot/conf certbot/www backup logs

# Build e avvio servizi
log "🏗️ Build e avvio servizi Docker..."
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d db
sleep 30  # Attendi che PostgreSQL sia pronto

# Esegui migrazioni
log "🗄️ Esecuzione migrazioni database..."
docker-compose -f docker-compose.production.yml exec -T backend python manage.py migrate

# Avvia tutti i servizi
log "🚀 Avvio tutti i servizi..."
docker-compose -f docker-compose.production.yml up -d

# Ottieni certificato SSL
log "🔐 Configurazione SSL con Let's Encrypt..."
docker-compose -f docker-compose.production.yml exec -T certbot \
    certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN_NAME --agree-tos --no-eff-email \
    -d $DOMAIN_NAME -d www.$DOMAIN_NAME

# Riavvia Nginx per applicare SSL
log "🔄 Riavvio Nginx con SSL..."
docker-compose -f docker-compose.production.yml restart nginx

# Crea superuser Django
log "👤 Creazione superuser Django..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@$DOMAIN_NAME', 'admin123') if not User.objects.filter(username='admin').exists() else None" | \
docker-compose -f docker-compose.production.yml exec -T backend python manage.py shell

# Verifica status
log "📊 Verifica status servizi..."
docker-compose -f docker-compose.production.yml ps

# Mostra informazioni finali
log "🎉 Deployment completato!"
echo ""
echo "🌐 Sito: https://$DOMAIN_NAME"
echo "⚙️ Admin: https://$DOMAIN_NAME/admin/"
echo "👤 Username: admin"
echo "🔑 Password: admin123"
echo ""
echo "📝 Comandi utili:"
echo "  - Logs: docker-compose -f docker-compose.production.yml logs -f"
echo "  - Restart: docker-compose -f docker-compose.production.yml restart"
echo "  - Update: git pull && docker-compose -f docker-compose.production.yml up -d --build"
echo ""
warn "⚠️ Cambia la password dell'admin appena possibile!" 
