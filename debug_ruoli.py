#!/usr/bin/env python3
"""
Debug ruoli utenti
"""
import requests

BASE_URL = "http://localhost:8001"

def debug_utenti():
    # Test con lello
    print("🔍 DEBUG UTENTE LELLO")
    response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "username": "lello",
        "password": "lello123"
    })
    
    if response.status_code == 200:
        token = response.json().get('access')
        headers = {"Authorization": f"Bearer {token}"}
        
        # Profilo utente
        profile = requests.get(f"{BASE_URL}/api/auth/profile/", headers=headers)
        if profile.status_code == 200:
            user_data = profile.json()
            print(f"   Username: {user_data.get('username')}")
            print(f"   Ruolo: {user_data.get('ruolo')}")
            print(f"   ID: {user_data.get('id')}")
        
        # Richieste che vede
        richieste = requests.get(f"{BASE_URL}/api/richieste/", headers=headers)
        if richieste.status_code == 200:
            req_data = richieste.json()
            print(f"   Richieste visibili: {len(req_data)}")
            for r in req_data:
                print(f"     - ID {r['id']}: {r['titolo']} (Cliente: {r.get('cliente', 'N/A')} - {r.get('cliente_username', 'N/A')})")
    
    print("\n🔍 DEBUG UTENTE FORNITORE_TEST")
    response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "username": "fornitore_test",
        "password": "fornitore123"
    })
    
    if response.status_code == 200:
        token = response.json().get('access')
        headers = {"Authorization": f"Bearer {token}"}
        
        # Profilo utente
        profile = requests.get(f"{BASE_URL}/api/auth/profile/", headers=headers)
        if profile.status_code == 200:
            user_data = profile.json()
            print(f"   Username: {user_data.get('username')}")
            print(f"   Ruolo: {user_data.get('ruolo')}")
            print(f"   ID: {user_data.get('id')}")

if __name__ == "__main__":
    debug_utenti() 