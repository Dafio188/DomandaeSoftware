#!/usr/bin/env python

# Script per verificare e creare progetti di test

print("=== Verifica Database ===")
print("1. Verifica offerte accettate")
print("2. Verifica progetti esistenti") 
print("3. Crea progetto se necessario")

# Questo script è pronto per essere eseguito in Django shell
DJANGO_SCRIPT = '''
from offerte.models import Offerta
from progetti.models import Progetto

print("=== OFFERTE ACCETTATE ===")
offerte_accettate = Offerta.objects.filter(stato='accettata')
for o in offerte_accettate:
    print(f"Offerta ID {o.id}: {o.fornitore.username} -> {o.richiesta.cliente.username}")
    print(f"  Richiesta: {o.richiesta.titolo}")
    print(f"  Prezzo: {o.prezzo}€")

print("\\n=== PROGETTI ESISTENTI ===")
progetti = Progetto.objects.all()
for p in progetti:
    print(f"Progetto ID {p.id}: {p.cliente.username} <-> {p.fornitore.username}")

print(f"\\nTotale offerte accettate: {offerte_accettate.count()}")
print(f"Totale progetti: {progetti.count()}")

# Se ci sono offerte accettate ma nessun progetto, c'è un problema
if offerte_accettate.count() > 0 and progetti.count() == 0:
    print("\\n🚨 PROBLEMA: Ci sono offerte accettate ma nessun progetto!")
    print("Creo manualmente un progetto per la prima offerta accettata...")
    
    prima_offerta = offerte_accettate.first()
    if prima_offerta:
        progetto = Progetto.objects.create(
            richiesta=prima_offerta.richiesta,
            offerta=prima_offerta,
            cliente=prima_offerta.richiesta.cliente,
            fornitore=prima_offerta.fornitore,
            stato='in_corso'
        )
        print(f"✅ Progetto creato con ID: {progetto.id}")
'''

print("\\nScript Django da eseguire:")
print(DJANGO_SCRIPT)

import requests
import json

BASE_URL = "http://localhost:8001"

def check_database():
    # Login come admin per vedere tutto
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "username": "admin",
        "password": "admin123"
    })
    
    if login_response.status_code != 200:
        print(f"❌ Login admin fallito: {login_response.status_code}")
        return
    
    token = login_response.json().get('access')
    headers = {"Authorization": f"Bearer {token}"}
    
    # Controlla tutti i progetti
    print("🔍 Controllo tutti i progetti (come admin)...")
    progetti_response = requests.get(f"{BASE_URL}/api/progetti/", headers=headers)
    print(f"Status: {progetti_response.status_code}")
    
    if progetti_response.status_code == 200:
        progetti = progetti_response.json()
        if progetti:
            print(f"📋 Trovati {len(progetti)} progetti:")
            for p in progetti:
                print(f"  - ID: {p.get('id')}, Cliente: {p.get('cliente_username')}, Fornitore: {p.get('fornitore_username')}, Stato: {p.get('stato')}")
        else:
            print("❌ Nessun progetto trovato nel database")
    
    # Controlla tutte le richieste
    print("\n🔍 Controllo tutte le richieste...")
    richieste_response = requests.get(f"{BASE_URL}/api/richieste/", headers=headers)
    print(f"Status: {richieste_response.status_code}")
    
    if richieste_response.status_code == 200:
        richieste = richieste_response.json()
        if richieste:
            print(f"📋 Trovate {len(richieste)} richieste:")
            for r in richieste:
                print(f"  - ID: {r.get('id')}, Titolo: {r.get('titolo')[:50]}..., Cliente: {r.get('cliente_username')}, Stato: {r.get('stato')}")
        else:
            print("❌ Nessuna richiesta trovata nel database")
    
    # Controlla tutte le offerte
    print("\n🔍 Controllo tutte le offerte...")
    offerte_response = requests.get(f"{BASE_URL}/api/offerte/", headers=headers)
    print(f"Status: {offerte_response.status_code}")
    
    if offerte_response.status_code == 200:
        offerte = offerte_response.json()
        if offerte:
            print(f"📋 Trovate {len(offerte)} offerte:")
            for o in offerte:
                print(f"  - ID: {o.get('id')}, Richiesta: {o.get('richiesta_titolo')}, Fornitore: {o.get('fornitore_username')}, Prezzo: {o.get('prezzo')}€")
        else:
            print("❌ Nessuna offerta trovata nel database")

if __name__ == "__main__":
    check_database() 