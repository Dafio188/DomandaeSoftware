#!/bin/bash

# Script di deployment ottimizzato per Webdock VPS Nano4
# Eseguire con: bash deploy-webdock-nano.sh tuodominio.com

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

log "🚀 Avvio deployment Domanda & Software su Webdock VPS NANO4"
log "🌐 Dominio: $DOMAIN_NAME"
log "💾 Configurazione ottimizzata per risorse limitate"

# Verifica se siamo root
if [ "$EUID" -eq 0 ]; then
    warn "Eseguire lo script come utente normale, non root"
fi

# Configura swap per VPS con poca RAM
log "💾 Configurazione swap per ottimizzare RAM..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    log "✅ Swap da 1GB creato"
else
    log "ℹ️ Swap già configurato"
fi

# Ottimizza parametri di sistema per VPS nano
log "⚙️ Ottimizzazione parametri sistema..."
sudo sysctl vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf

# Aggiorna sistema
log "📦 Aggiornamento sistema..."
sudo apt update && sudo apt upgrade -y

# Installa dipendenze essenziali
log "🔧 Installazione dipendenze ottimizzate..."
sudo apt install -y \
    docker.io \
    docker-compose \
    git \
    curl \
    wget \
    ufw \
    htop \
    nano

# Rimuovi pacchetti non necessari per risparmiare spazio
sudo apt autoremove -y
sudo apt autoclean

# Avvia e abilita Docker
log "🐳 Configurazione Docker ottimizzata..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Configura Docker per VPS nano
sudo mkdir -p /etc/docker
cat << EOF | sudo tee /etc/docker/daemon.json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2"
}
EOF
sudo systemctl restart docker

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

# Crea file .env ottimizzato per nano
log "⚙️ Configurazione variabili ambiente per NANO4..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Configurazione produzione Webdock NANO4
DOMAIN_NAME=$DOMAIN_NAME
SECRET_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
# Ottimizzazioni per VPS nano
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1
EOF
    log "✅ File .env creato per NANO4"
else
    log "ℹ️ File .env già esistente"
fi

# Aggiorna configurazione Nginx con dominio
log "🌐 Configurazione Nginx per dominio $DOMAIN_NAME..."
sed "s/DOMAIN_NAME/$DOMAIN_NAME/g" nginx/sites-available/domanda-software.conf > nginx/sites-available/site.conf

# Crea directory necessarie
log "📁 Creazione directory..."
mkdir -p certbot/conf certbot/www backup logs

# Pulizia Docker per liberare spazio
log "🧹 Pulizia Docker pre-build..."
docker system prune -f

# Build e avvio servizi con configurazione nano
log "🏗️ Build e avvio servizi Docker NANO4..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker-compose -f docker-compose.nano.yml down
docker-compose -f docker-compose.nano.yml build --no-cache --parallel

# Avvia solo database prima
log "🗄️ Avvio database PostgreSQL..."
docker-compose -f docker-compose.nano.yml up -d db
sleep 45  # Più tempo per VPS nano

# Verifica database
log "🔍 Verifica database..."
until docker-compose -f docker-compose.nano.yml exec -T db pg_isready -U domanda_user; do
    log "⏳ Attesa database..."
    sleep 10
done

# Esegui migrazioni
log "🗄️ Esecuzione migrazioni database..."
docker-compose -f docker-compose.nano.yml exec -T backend python manage.py migrate

# Avvia tutti i servizi gradualmente
log "🚀 Avvio graduale tutti i servizi..."
docker-compose -f docker-compose.nano.yml up -d backend
sleep 30
docker-compose -f docker-compose.nano.yml up -d frontend
sleep 15
docker-compose -f docker-compose.nano.yml up -d nginx certbot

# Attendi che tutto sia pronto
log "⏳ Attesa stabilizzazione servizi..."
sleep 60

# Ottieni certificato SSL
log "🔐 Configurazione SSL con Let's Encrypt..."
docker-compose -f docker-compose.nano.yml exec -T certbot \
    certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN_NAME --agree-tos --no-eff-email \
    -d $DOMAIN_NAME -d www.$DOMAIN_NAME

# Riavvia Nginx per applicare SSL
log "🔄 Riavvio Nginx con SSL..."
docker-compose -f docker-compose.nano.yml restart nginx

# Crea superuser Django
log "👤 Creazione superuser Django..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@$DOMAIN_NAME', 'admin123') if not User.objects.filter(username='admin').exists() else None" | \
docker-compose -f docker-compose.nano.yml exec -T backend python manage.py shell

# Pulizia finale
log "🧹 Pulizia finale Docker..."
docker system prune -f

# Verifica status
log "📊 Verifica status servizi..."
docker-compose -f docker-compose.nano.yml ps

# Mostra informazioni finali
log "🎉 Deployment NANO4 completato!"
echo ""
echo "🌐 Sito: https://$DOMAIN_NAME"
echo "⚙️ Admin: https://$DOMAIN_NAME/admin/"
echo "👤 Username: admin"
echo "🔑 Password: admin123"
echo ""
echo "📊 Configurazione NANO4:"
echo "  - RAM: Ottimizzata per 1-2GB"
echo "  - Workers: 1 worker Django"
echo "  - Database: PostgreSQL ottimizzato"
echo "  - Swap: 1GB configurato"
echo ""
echo "📝 Comandi utili:"
echo "  - Logs: docker-compose -f docker-compose.nano.yml logs -f"
echo "  - Restart: docker-compose -f docker-compose.nano.yml restart"
echo "  - Update: git pull && docker-compose -f docker-compose.nano.yml up -d --build"
echo "  - Memoria: free -h && docker stats"
echo ""
warn "⚠️ Cambia la password dell'admin appena possibile!"
warn "⚠️ Monitora l'uso della RAM con: htop" 