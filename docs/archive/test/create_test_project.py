import requests
import json

# URL di base del backend
BASE_URL = "http://localhost:8001/api"

print("=== Verifica progetti esistenti ===")
progetti_response = requests.get(f"{BASE_URL}/progetti/")
print(f"Progetti: {progetti_response.text}")

print("\n=== Verifica offerte accettate ===")
offerte_response = requests.get(f"{BASE_URL}/offerte/")
offerte_data = offerte_response.json()

offerte_accettate = [o for o in offerte_data if o['stato'] == 'accettata']
print(f"Offerte accettate: {len(offerte_accettate)}")

for offerta in offerte_accettate:
    print(f"- Offerta ID {offerta['id']}: {offerta['fornitore_username']} -> {offerta['cliente_username']}")
    print(f"  Prezzo: {offerta['prezzo']}€")
    print(f"  Stato: {offerta['stato']}")

print("\n=== Verifica richieste ===")
richieste_response = requests.get(f"{BASE_URL}/richieste/")
richieste_data = richieste_response.json()

for richiesta in richieste_data:
    print(f"- Richiesta ID {richiesta['id']}: {richiesta['titolo']}")
    print(f"  Cliente: {richiesta['cliente_username']}")
    print(f"  Stato: {richiesta['stato']}")

print("\n=== Script completato ===") 