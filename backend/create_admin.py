#!/usr/bin/env python
import os
import sys
import django

# Aggiungi il path del backend
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django.setup()

from utenti.models import User

try:
    # Controlla se esiste già un admin
    if User.objects.filter(username='admin').exists():
        print("Utente admin già esistente")
    else:
        # Crea l'utente admin
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            ruolo='amministratore',
            is_staff=True,
            is_superuser=True
        )
        print(f"Utente admin creato con successo: {admin_user.username}")
        
    # Crea anche un utente cliente di test
    if User.objects.filter(username='cliente_test').exists():
        print("Utente cliente_test già esistente")
    else:
        cliente = User.objects.create_user(
            username='cliente_test',
            email='cliente@test.com', 
            password='cliente123',
            ruolo='cliente',
            first_name='Mario',
            last_name='Rossi'
        )
        print(f"Utente cliente creato: {cliente.username}")
        
    # Crea un fornitore di test
    if User.objects.filter(username='fornitore_test').exists():
        print("Utente fornitore_test già esistente")
    else:
        fornitore = User.objects.create_user(
            username='fornitore_test',
            email='fornitore@test.com',
            password='fornitore123', 
            ruolo='fornitore',
            first_name='Giovanni',
            last_name='Bianchi'
        )
        print(f"Utente fornitore creato: {fornitore.username}")
        
    print("\n=== UTENTI DI TEST CREATI ===")
    print("Admin: admin / admin123")
    print("Cliente: cliente_test / cliente123") 
    print("Fornitore: fornitore_test / fornitore123")
        
except Exception as e:
    print(f"Errore nella creazione utenti: {e}") 