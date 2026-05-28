import os
import django
import time
from django.db import connections
from django.db.utils import OperationalError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

def wait_for_db():
    print("⏳ Attesa del database in corso...")
    max_retries = 30
    retry_interval = 2
    for i in range(max_retries):
        try:
            # Tenta di stabilire una connessione
            connections['default'].ensure_connection()
            print("✅ Database pronto!")
            return True
        except OperationalError as e:
            if i < max_retries - 1:
                print(f"🔄 Database non ancora disponibile (tentativo {i+1}/{max_retries}). Riprovo in {retry_interval}s...")
                time.sleep(retry_interval)
            else:
                print(f"❌ Errore critico: Impossibile connettersi al database dopo {max_retries} tentativi.")
                raise e
    return False

def super_reset():
    print("🚀 Inizio procedura di Super Reset Amministrativo...")
    
    # Inizializza Django prima di provare a connettersi
    django.setup()
    
    # Aspetta il DB prima di procedere
    wait_for_db()
    
    from utenti.models import User
    
    # 1. Reset Admin principale
    admin_username = 'admin'
    admin_pass = 'SoftMach2026'
    
    # Pulizia preventiva per evitare conflitti di unicità
    User.objects.filter(username=admin_username).delete()
    
    user = User.objects.create_superuser(
        username=admin_username,
        email='info@softmatch.it',
        password=admin_pass
    )
    user.ruolo = 'amministratore'
    user.stato = 'attivo'
    user.save()
    
    print(f"✅ Superuser '{admin_username}' creato/resettato con successo.")
    print(f"🔑 Password impostata: {admin_pass}")

if __name__ == '__main__':
    super_reset()
