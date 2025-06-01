#!/usr/bin/env python
"""
Script di inizializzazione automatica del database
Popola il database con dati di base se è vuoto
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from utenti.models import User
from faq.models import FAQCategory, FAQ

def init_database():
    """Inizializza il database con dati di base se è vuoto"""
    print("🔧 Controllo inizializzazione database...")
    
    # Controlla se il database è vuoto
    user_count = User.objects.count()
    faq_count = FAQ.objects.count()
    
    print(f"📊 Utenti esistenti: {user_count}")
    print(f"📊 FAQ esistenti: {faq_count}")
    
    if user_count == 0:
        print("👥 Creazione utenti di base...")
        create_users()
    else:
        print("✅ Utenti già presenti")
    
    if faq_count == 0:
        print("❓ Popolamento FAQ...")
        populate_faq()
    else:
        print("✅ FAQ già presenti")
    
    print("🎉 Inizializzazione database completata!")

def create_users():
    """Crea gli utenti di base"""
    try:
        # Superuser admin
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@domanda.com',
                password='admin123',
                first_name='Admin',
                last_name='Sistema'
            )
            print(f"✅ Creato admin: admin / admin123")
        
        # Superadmin
        if not User.objects.filter(username='superadmin').exists():
            superadmin = User.objects.create_superuser(
                username='superadmin',
                email='superadmin@domanda.com',
                password='Pass.word12345',
                first_name='Super',
                last_name='Admin'
            )
            print(f"✅ Creato superadmin: superadmin / Pass.word12345")
        
        # Clienti di test
        for i in range(1, 3):
            username = f'cliente{i}'
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username,
                    email=f'{username}@test.com',
                    password='cliente123',
                    first_name=f'Cliente{i}',
                    last_name='Test',
                    ruolo='cliente'
                )
                print(f"✅ Creato {username}: {username} / cliente123")
        
        # Fornitori di test
        for i in range(1, 3):
            username = f'fornitore{i}'
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username,
                    email=f'{username}@test.com',
                    password='fornitore123',
                    first_name=f'Fornitore{i}',
                    last_name='Test',
                    ruolo='fornitore'
                )
                print(f"✅ Creato {username}: {username} / fornitore123")
                
    except Exception as e:
        print(f"❌ Errore creazione utenti: {e}")

def populate_faq():
    """Popola le FAQ di base"""
    try:
        # Esegui lo script di popolamento FAQ esistente
        exec(open('populate_faq.py').read())
        print("✅ FAQ popolate con successo")
    except Exception as e:
        print(f"❌ Errore popolamento FAQ: {e}")

if __name__ == '__main__':
    init_database() 