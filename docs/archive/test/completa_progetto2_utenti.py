#!/usr/bin/env python3
"""
Script per completare il progetto ID 2 con gli utenti corretti
"""
import requests

BASE_URL = "http://localhost:8001"

def login_utente(username, password):
    response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "username": username, 
        "password": password
    })
    return response.json().get('access') if response.status_code == 200 else None

def spunta_fase_utente(progetto_id, fase, username, password):
    token = login_utente(username, password)
    if not token:
        print(f"❌ Login {username} fallito")
        return False
        
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/progetti/{progetto_id}/spunta-fase/", 
                           {"fase": fase}, headers=headers)
    
    if response.status_code == 200:
        print(f"   ✅ {fase} completata da {username}")
        return True
    else:
        print(f"   ❌ Errore {fase} da {username}: {response.text}")
        return False

def completa_progetto_2():
    print("🔧 Completamento progetto ID 2 con utenti appropriati...")
    
    # Fasi da completare
    print("\n🏗️ Completamento fasi cliente (cliente_test)...")
    spunta_fase_utente(2, "bozza_cliente_ok", "cliente_test", "cliente123")
    spunta_fase_utente(2, "pagamento_cliente_ok", "cliente_test", "cliente123")
    spunta_fase_utente(2, "consegna_cliente_ok", "cliente_test", "cliente123")
    
    print("\n🔨 Completamento fasi fornitore (fornitore_test)...")
    spunta_fase_utente(2, "bozza_fornitore_ok", "fornitore_test", "fornitore123")
    spunta_fase_utente(2, "consegna_fornitore_ok", "fornitore_test", "fornitore123") 
    spunta_fase_utente(2, "bonifico_fornitore_ok", "fornitore_test", "fornitore123")
    
    print("\n👨‍💼 Completamento fasi admin...")
    admin_token = login_utente("admin", "admin123")
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/api/progetti/2/spunta-fase/", 
                               {"fase": "pagamento_admin_ok"}, headers=headers)
        if response.status_code == 200:
            print(f"   ✅ pagamento_admin_ok completata da admin")
        else:
            print(f"   ❌ Errore admin: {response.text}")
    
    # Verifica stato finale
    print("\n📋 Verifica stato finale...")
    if admin_token:
        prog_final = requests.get(f"{BASE_URL}/api/progetti/2/", headers=headers).json()
        print(f"📊 Stato finale: {prog_final.get('stato')}")
        print(f"🎯 Può essere archiviato: {prog_final.get('puo_essere_archiviato', False)}")
        
        print(f"\n🔍 Spunte completamento:")
        for campo in ['bozza_fornitore_ok', 'bozza_cliente_ok', 'pagamento_cliente_ok', 
                      'pagamento_admin_ok', 'consegna_fornitore_ok', 'consegna_cliente_ok', 
                      'bonifico_fornitore_ok']:
            status = "✅" if prog_final.get(campo, False) else "❌"
            print(f"   {status} {campo}: {prog_final.get(campo, False)}")

if __name__ == "__main__":
    completa_progetto_2() 