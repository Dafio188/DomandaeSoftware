#!/usr/bin/env python3
"""
Script per ricreare gli utenti di test
"""
import requests
import json

def ricrea_utenti():
    print("👥 RICREAZIONE UTENTI DI TEST")
    print("=" * 35)
    
    base_url = "http://localhost:8001"
    
    # Utenti da ricreare
    utenti = [
        {
            "username": "cliente_test",
            "email": "cliente@test.com", 
            "password": "admin123",
            "ruolo": "cliente",
            "descrizione": "Cliente di test per verifiche"
        },
        {
            "username": "fornitore_test",
            "email": "fornitore@test.com",
            "password": "admin123", 
            "ruolo": "fornitore",
            "descrizione": "Fornitore di test per verifiche"
        },
        {
            "username": "admin_test",
            "email": "admin@test.com",
            "password": "admin123",
            "ruolo": "cliente",
            "descrizione": "Admin di test"
        }
    ]
    
    for i, utente in enumerate(utenti, 1):
        print(f"\n{i}️⃣ Creazione utente: {utente['username']}")
        
        try:
            response = requests.post(
                f"{base_url}/api/auth/register/",
                json=utente,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 201:
                print(f"   ✅ {utente['username']} creato con successo")
                
                # Test login immediato
                login_data = {
                    "username": utente['username'],
                    "password": utente['password']
                }
                
                login_response = requests.post(
                    f"{base_url}/api/auth/login/",
                    json=login_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if login_response.status_code == 200:
                    print(f"   ✅ Login {utente['username']} verificato")
                else:
                    print(f"   ⚠️  Login {utente['username']} fallito: {login_response.status_code}")
                    
            elif response.status_code == 400:
                # L'utente potrebbe già esistere
                response_data = response.json()
                if 'username' in response_data and 'already exists' in str(response_data):
                    print(f"   ℹ️  {utente['username']} già esiste")
                    
                    # Test login per vedere se funziona
                    login_data = {
                        "username": utente['username'],
                        "password": utente['password']
                    }
                    
                    login_response = requests.post(
                        f"{base_url}/api/auth/login/",
                        json=login_data,
                        headers={'Content-Type': 'application/json'},
                        timeout=10
                    )
                    
                    if login_response.status_code == 200:
                        print(f"   ✅ Login {utente['username']} funziona")
                    else:
                        print(f"   ❌ Login {utente['username']} non funziona")
                else:
                    print(f"   ❌ Errore creazione: {response.text}")
            else:
                print(f"   ❌ Errore {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Errore connessione: {e}")
    
    print("\n" + "=" * 35)
    print("🎯 RICREAZIONE COMPLETATA")
    print("\n📋 CREDENZIALI UTENTI:")
    print("   👤 cliente_test  / admin123")
    print("   🏢 fornitore_test / admin123") 
    print("   👑 admin_test    / admin123")
    print("\n🌐 ACCESSO:")
    print("   Frontend: http://localhost:3000")
    print("   Login: Usa le credenziali sopra")

if __name__ == "__main__":
    ricrea_utenti() 