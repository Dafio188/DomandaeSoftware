import requests

BASE_URL = "http://localhost:8001"

# Login admin
admin_response = requests.post(f"{BASE_URL}/api/auth/login/", {
    "username": "admin",
    "password": "admin123"
})

if admin_response.status_code == 200:
    admin_token = admin_response.json().get('access')
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Controlla richiesta ID 3
    richiesta_response = requests.get(f"{BASE_URL}/api/richieste/3/", headers=admin_headers)
    if richiesta_response.status_code == 200:
        richiesta = richiesta_response.json()
        print("📋 RICHIESTA ID 3:")
        print(f"   Titolo: {richiesta.get('titolo')}")
        print(f"   Cliente ID: {richiesta.get('cliente')}")
        print(f"   Cliente Username: {richiesta.get('cliente_username')}")
        print(f"   Stato: {richiesta.get('stato')}")
        print(f"   Budget: {richiesta.get('budget')}€")
    else:
        print(f"❌ Errore richiesta: {richiesta_response.status_code}")
    
    # Controlla anche tutte le richieste per vedere chi è il cliente_test
    print("\n📋 TUTTE LE RICHIESTE:")
    richieste_response = requests.get(f"{BASE_URL}/api/richieste/", headers=admin_headers)
    if richieste_response.status_code == 200:
        richieste = richieste_response.json()
        for r in richieste:
            print(f"   ID {r.get('id')}: '{r.get('titolo')}' - Cliente: {r.get('cliente_username')} (ID: {r.get('cliente')})")
else:
    print(f"❌ Login admin fallito: {admin_response.status_code}") 