#!/usr/bin/env python3
"""
Script per completare il progetto ID 2 per testare le recensioni
"""
import requests

BASE_URL = "http://localhost:8001"

def login_admin():
    response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "username": "admin", 
        "password": "admin123"
    })
    return response.json().get('access') if response.status_code == 200 else None

def completa_progetto_2():
    print("🔧 Completamento manuale progetto ID 2...")
    
    token = login_admin()
    if not token:
        print("❌ Login admin fallito")
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # Ottieni stato attuale
    prog_response = requests.get(f"{BASE_URL}/api/progetti/2/", headers=headers)
    if prog_response.status_code != 200:
        print("❌ Progetto 2 non trovato")
        return
        
    progetto = prog_response.json()
    print(f"📋 Stato attuale: {progetto.get('stato')}")
    
    # Spunta tutte le fasi necessarie per completare il progetto
    fasi = [
        'bozza_fornitore_ok',
        'bozza_cliente_ok', 
        'pagamento_cliente_ok',
        'pagamento_admin_ok',
        'consegna_fornitore_ok',
        'consegna_cliente_ok',
        'bonifico_fornitore_ok'
    ]
    
    for fase in fasi:
        if not progetto.get(fase, False):
            print(f"🔄 Spuntando fase: {fase}")
            response = requests.post(f"{BASE_URL}/api/progetti/2/spunta-fase/", 
                                   {"fase": fase}, headers=headers)
            if response.status_code == 200:
                print(f"   ✅ {fase} completata")
            else:
                print(f"   ❌ Errore {fase}: {response.text}")
        else:
            print(f"   ✅ {fase} già completata")
    
    # Verifica stato finale
    prog_final = requests.get(f"{BASE_URL}/api/progetti/2/", headers=headers).json()
    print(f"\n📋 Stato finale: {prog_final.get('stato')}")
    print(f"🎯 Può essere archiviato: {prog_final.get('puo_essere_archiviato', False)}")

if __name__ == "__main__":
    completa_progetto_2() 