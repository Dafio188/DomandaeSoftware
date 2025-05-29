#!/usr/bin/env python3
"""
Script per riassegnare il progetto 2 agli utenti di test
"""

import os
import sys
import django

# Setup Django
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from progetti.models import Progetto
from utenti.models import User

def fix_progetto():
    try:
        # Trova gli utenti di test
        fornitore_test = User.objects.get(username='fornitore_test')
        cliente_test = User.objects.get(username='cliente_test')
        
        print(f"✅ Trovato fornitore_test: {fornitore_test.id}")
        print(f"✅ Trovato cliente_test: {cliente_test.id}")
        
        # Trova il primo progetto disponibile
        progetti = Progetto.objects.all().order_by('id')
        if not progetti:
            print("❌ Nessun progetto trovato nel database")
            return
            
        progetto = progetti.first()
        print(f"📋 Progetto attuale ID {progetto.id}: Cliente={progetto.cliente.username}, Fornitore={progetto.fornitore.username}")
        
        progetto.fornitore = fornitore_test
        progetto.cliente = cliente_test
        progetto.save()
        
        print(f"✅ Progetto {progetto.id} aggiornato: Cliente={progetto.cliente.username}, Fornitore={progetto.fornitore.username}")
        print("🎉 Ora entrambi gli utenti possono accedere al progetto e chattare!")
        
    except User.DoesNotExist as e:
        print(f"❌ Utente non trovato: {e}")
    except Exception as e:
        print(f"❌ Errore: {e}")

if __name__ == "__main__":
    fix_progetto() 