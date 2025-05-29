#!/usr/bin/env python3
"""
Fix rapido per il problema di login
"""
import requests
import time

def fix_login():
    print("🔧 FIX RAPIDO LOGIN")
    print("=" * 25)
    
    base_url = "http://localhost:8001"
    
    # Creiamo utenti con nomi unici per evitare conflitti
    timestamp = int(time.time())
    
    utenti_nuovi = [
        {
            "username": f"cliente_{timestamp}",
            "email": f"cliente{timestamp}@test.com",
            "password": "admin123",
            "ruolo": "cliente"
        },
        {
            "username": f"fornitore_{timestamp}",
            "email": f"fornitore{timestamp}@test.com", 
            "password": "admin123",
            "ruolo": "fornitore"
        }
    ]
    
    utenti_creati = []
    
    for i, utente in enumerate(utenti_nuovi, 1):
        print(f"\n{i}️⃣ Creazione: {utente['username']}")
        
        try:
            # Registrazione
            reg_response = requests.post(
                f"{base_url}/api/auth/register/",
                json=utente,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if reg_response.status_code == 201:
                print(f"   ✅ Registrato con successo")
                
                # Test login immediato
                login_response = requests.post(
                    f"{base_url}/api/auth/login/",
                    json={"username": utente['username'], "password": utente['password']},
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if login_response.status_code == 200:
                    print(f"   ✅ Login verificato")
                    utenti_creati.append(utente)
                else:
                    print(f"   ❌ Login fallito: {login_response.status_code}")
            else:
                print(f"   ❌ Registrazione fallita: {reg_response.status_code}")
                print(f"       Errore: {reg_response.text}")
                
        except Exception as e:
            print(f"   ❌ Errore: {e}")
    
    # Test anche admin_test
    print(f"\n3️⃣ Test admin_test esistente...")
    try:
        admin_login = requests.post(
            f"{base_url}/api/auth/login/",
            json={"username": "admin_test", "password": "admin123"},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if admin_login.status_code == 200:
            print("   ✅ admin_test funziona ancora")
            utenti_creati.append({"username": "admin_test", "password": "admin123"})
        else:
            print(f"   ❌ admin_test non funziona più: {admin_login.status_code}")
    except Exception as e:
        print(f"   ❌ Errore test admin_test: {e}")
    
    print("\n" + "=" * 25)
    print("🎯 RISULTATO FIX:")
    
    if utenti_creati:
        print(f"✅ UTENTI DISPONIBILI ({len(utenti_creati)}):")
        for utente in utenti_creati:
            print(f"   👤 {utente['username']} / {utente['password']}")
        
        print("\n🌐 ACCESSO FRONTEND:")
        print("   URL: http://localhost:3000/login")
        print("   Usa uno degli utenti sopra")
        print("\n💡 RACCOMANDAZIONE:")
        print("   Usa admin_test se disponibile (è il più stabile)")
        
    else:
        print("❌ NESSUN UTENTE FUNZIONANTE")
        print("\n🚨 RIAVVIO NECESSARIO:")
        print("   I container potrebbero aver perso i dati")
        
    return len(utenti_creati) > 0

if __name__ == "__main__":
    successo = fix_login()
    if not successo:
        print("\n⚠️ Considera un riavvio completo dei container!") 