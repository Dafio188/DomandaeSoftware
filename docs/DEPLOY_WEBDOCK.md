# 🚀 **GUIDA DEPLOYMENT WEBDOCK VPS**

Deployment completo di **"SoftMatch"** su VPS Webdock con Docker, Nginx, PostgreSQL e SSL.

---

## 🎯 **PREREQUISITI**

### **💰 Costi Webdock**
- **🥇 VPS Epyc**: €4.30/mese (consigliato)
- **🥈 VPS Xeon**: €2.15/mese (base)
- **🌐 Dominio**: ~€10-15/anno

### **🔧 Requisiti Tecnici**
- VPS con almeno **2GB RAM** e **25GB storage**
- **Dominio personalizzato** (es: tuosito.com)
- **SSH access** al VPS

---

## 📋 **STEP 1: CREAZIONE VPS WEBDOCK**

### **🌐 Registrazione e Setup**
1. **Vai su**: https://webdock.io
2. **Registrati** con account email
3. **Crea VPS**:
   - **Location**: Copenhagen, Denmark (EU)
   - **OS**: Ubuntu 22.04 LTS
   - **Profile**: Epyc €4.30/mese (2 vCPU, 2GB RAM, 25GB NVMe)
   - **Hostname**: softmatch

### **🔑 Accesso SSH**
```bash
# Connetti al VPS (IP fornito da Webdock)
ssh root@YOUR_VPS_IP

# Crea utente non-root
adduser deploy
usermod -aG sudo deploy
su - deploy
```

---

## 📋 **STEP 2: CONFIGURAZIONE DOMINIO**

### **🌐 DNS Settings**
Nel tuo provider di dominio (Namecheap, GoDaddy, etc.):

```dns
# Record A
@           A       YOUR_VPS_IP
www         A       YOUR_VPS_IP

# Record AAAA (se hai IPv6)
@           AAAA    YOUR_VPS_IPv6
www         AAAA    YOUR_VPS_IPv6
```

### **⏱️ Propagazione DNS**
```bash
# Verifica propagazione (attendi 5-60 minuti)
nslookup tuodominio.com
dig tuodominio.com
```

---

## 📋 **STEP 3: DEPLOYMENT AUTOMATICO**

### **🚀 Esecuzione Script Deploy**
```bash
# Nel VPS come utente deploy
curl -fsSL https://raw.githubusercontent.com/Dafio188/DomandaeSoftware/main/scripts/deploy-webdock.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh tuodominio.com
```

### **⚙️ Cosa Fa lo Script**
- ✅ Aggiorna sistema Ubuntu
- ✅ Installa Docker + Docker Compose  
- ✅ Configura firewall UFW
- ✅ Clona repository GitHub
- ✅ Genera chiavi sicure (SECRET_KEY, DB_PASSWORD)
- ✅ Build containers Docker
- ✅ Avvia PostgreSQL + Django + React + Nginx
- ✅ Configura SSL con Let's Encrypt
- ✅ Crea superuser Django

---

## 📋 **STEP 4: VERIFICA DEPLOYMENT**

### **🌐 Test Sito Web**
```bash
# Frontend React
curl -I https://tuodominio.com
# Deve restituire: 200 OK

# Backend API
curl -I https://tuodominio.com/api/
# Deve restituire: 200 OK

# Admin Django
curl -I https://tuodominio.com/admin/
# Deve restituire: 200 OK
```

### **📊 Status Containers**
```bash
# Nel VPS
cd DomandaeSoftware
docker-compose -f docker-compose.production.yml ps

# Deve mostrare tutti i servizi "Up"
```

---

## 📋 **STEP 5: CONFIGURAZIONE POST-DEPLOY**

### **👤 Login Admin Django**
1. **URL**: https://tuodominio.com/admin/
2. **Username**: `admin`
3. **Password**: `admin123`
4. **⚠️ IMPORTANTE**: Cambia subito la password!

### **🔐 Sicurezza Post-Deploy**
```bash
# Cambia password admin
echo "from django.contrib.auth import get_user_model; u = get_user_model().objects.get(username='admin'); u.set_password('NuovaPasswordSicura123!'); u.save()" | \
docker-compose -f docker-compose.production.yml exec -T backend python manage.py shell

# Verifica SSL
curl -I https://tuodominio.com | grep -i "strict-transport"
# Deve mostrare HSTS header
```

---

## 🔧 **GESTIONE E MANUTENZIONE**

### **📝 Comandi Utili**
```bash
# Logs servizi
docker-compose -f docker-compose.production.yml logs -f [servizio]

# Restart servizi
docker-compose -f docker-compose.production.yml restart

# Update codice
git pull origin main
docker-compose -f docker-compose.production.yml up -d --build

# Backup database
docker-compose -f docker-compose.production.yml exec db pg_dump -U domanda_user domanda_software > backup/backup_$(date +%Y%m%d).sql

# Restore database
docker-compose -f docker-compose.production.yml exec -T db psql -U domanda_user domanda_software < backup/backup_20241201.sql
```

### **📊 Monitoring**
```bash
# Resource usage
htop
docker stats

# Disk usage
df -h
docker system df

# Logs applicazione
tail -f logs/django.log
```

---

## 🆘 **TROUBLESHOOTING**

### **❌ Errore SSL**
```bash
# Rigenera certificato SSL
docker-compose -f docker-compose.production.yml exec certbot \
    certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@tuodominio.com --agree-tos --no-eff-email \
    -d tuodominio.com -d www.tuodominio.com --force-renewal

docker-compose -f docker-compose.production.yml restart nginx
```

### **❌ Database Non Accessibile**
```bash
# Verifica PostgreSQL
docker-compose -f docker-compose.production.yml exec db psql -U domanda_user -l

# Reset database (⚠️ ATTENZIONE: Cancella tutti i dati!)
docker-compose -f docker-compose.production.yml down -v
docker-compose -f docker-compose.production.yml up -d db
sleep 30
docker-compose -f docker-compose.production.yml exec backend python manage.py migrate
```

### **❌ Errori Build Frontend**
```bash
# Rebuild frontend
docker-compose -f docker-compose.production.yml build --no-cache frontend
docker-compose -f docker-compose.production.yml up -d frontend
```

---

## 🔄 **AGGIORNAMENTI**

### **🆕 Deploy Nuova Versione**
```bash
# Nel VPS
cd DomandaeSoftware
git pull origin main

# Build e deploy
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Esegui migrazioni se necessario
docker-compose -f docker-compose.production.yml exec backend python manage.py migrate
```

### **📋 Checklist Pre-Deploy**
- ✅ Backup database
- ✅ Test in ambiente locale
- ✅ Verifica breaking changes
- ✅ Update requirements.txt se necessario

---

## 💰 **COSTI MENSILI TOTALI**

### **💶 Breakdown Webdock**
- **🖥️ VPS Epyc**: €4.30/mese
- **🌐 Dominio**: ~€1/mese (€12/anno)
- **📊 Totale**: ~€5.30/mese

### **📈 Scalabilità**
- **VPS Upgrade**: Possibile senza downtime
- **Traffic**: Fino a ~10,000 visite/mese
- **Storage**: 25GB (espandibile)
- **Bandwidth**: Unlimited

---

## 🎉 **RISULTATO FINALE**

Dopo il deployment avrai:

- ✅ **Frontend React** su https://tuodominio.com
- ✅ **API Django** su https://tuodominio.com/api/
- ✅ **Admin Panel** su https://tuodominio.com/admin/
- ✅ **SSL/HTTPS** automatico con Let's Encrypt
- ✅ **Database PostgreSQL** sicuro e performante
- ✅ **Backup automatici** configurati
- ✅ **Firewall** e sicurezza ottimizzati

**🚀 Il tuo progetto "SoftMatch" sarà completamente operativo e pronto per la produzione!** 
