import requests
import json

BASE_URL = "http://localhost:8001"

def fix_progetto():
    # Login come admin per modificare il progetto
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "username": "admin",
        "password": "admin123"
    })
    
    if login_response.status_code != 200:
        print(f"❌ Login admin fallito: {login_response.status_code}")
        return
    
    token = login_response.json().get('access')
    headers = {"Authorization": f"Bearer {token}"}
    
    print("✅ Login admin riuscito!")
    
    # Ottieni l'ID degli utenti di test
    print("🔍 Cerco gli utenti di test...")
    
    # Prova a modificare il progetto 1 via API
    # (Purtroppo non abbiamo un endpoint per questo, quindi useremo curl)
    print("⚠️  Dobbiamo modificare il progetto manualmente nel database")
    print("\nUsa questo comando Django:")
    print()
    print("docker exec sito-backend-1 python manage.py shell")
    print()
    print("Poi esegui questo codice Python:")
    print("""
from progetti.models import Progetto
from utenti.models import User

# Trova gli utenti di test
fornitore_test = User.objects.get(username='fornitore_test')
cliente_test = User.objects.get(username='cliente_test')

# Modifica il progetto 1
progetto = Progetto.objects.get(id=1)
progetto.fornitore = fornitore_test
progetto.cliente = cliente_test
progetto.save()

print(f"✅ Progetto aggiornato: Cliente={progetto.cliente.username}, Fornitore={progetto.fornitore.username}")
""")

if __name__ == "__main__":
    fix_progetto() 