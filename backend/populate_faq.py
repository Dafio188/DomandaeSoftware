#!/usr/bin/env python
"""
Script per popolare il database con FAQ di esempio
Eseguire con: python populate_faq.py
"""

import os
import sys
import django
from django.utils.text import slugify

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from faq.models import FAQCategory, FAQ
from django.contrib.auth import get_user_model

User = get_user_model()

def create_faq_categories():
    """Crea le categorie FAQ"""
    categories_data = [
        {
            'name': 'Account e Registrazione',
            'slug': 'account',
            'description': 'Domande su registrazione, login e gestione account',
            'icon': 'FaUser',
            'order': 1
        },
        {
            'name': 'Gestione Progetti',
            'slug': 'progetti',
            'description': 'Come creare, gestire e completare progetti',
            'icon': 'FaLightbulb',
            'order': 2
        },
        {
            'name': 'Pagamenti e Sicurezza',
            'slug': 'pagamenti',
            'description': 'Informazioni su pagamenti, sicurezza e transazioni',
            'icon': 'FaShieldAlt',
            'order': 3
        },
        {
            'name': 'Sviluppatori',
            'slug': 'sviluppatori',
            'description': 'Domande specifiche per fornitori e sviluppatori',
            'icon': 'FaUserShield',
            'order': 4
        },
        {
            'name': 'Supporto',
            'slug': 'supporto',
            'description': 'Assistenza tecnica e supporto generale',
            'icon': 'FaComments',
            'order': 5
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = FAQCategory.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"✓ Creata categoria: {category.name}")
        else:
            print(f"- Categoria già esistente: {category.name}")
        created_categories.append(category)
    
    return created_categories

def create_faqs(categories):
    """Crea le FAQ per ogni categoria"""
    
    # Trova un utente admin per assegnare come creatore
    admin_user = User.objects.filter(is_staff=True).first()
    
    faqs_data = {
        'account': [
            {
                'question': 'Come posso registrarmi sulla piattaforma?',
                'answer': 'La registrazione è semplice e gratuita. Clicca su "Registrati" nella navbar, scegli se sei un Cliente o un Fornitore, compila il form con i tuoi dati e verifica la tua email. Per i Fornitori è richiesta una verifica aggiuntiva delle competenze.',
                'order': 1
            },
            {
                'question': 'Ho dimenticato la password, come posso recuperarla?',
                'answer': 'Nella pagina di login, clicca su "Password dimenticata?", inserisci la tua email e riceverai un link per reimpostare la password. Il link è valido per 24 ore.',
                'order': 2
            },
            {
                'question': 'Posso cambiare il mio tipo di account da Cliente a Fornitore?',
                'answer': 'Sì, puoi richiedere il cambio di tipologia account contattando il nostro supporto. Dovrai completare il processo di verifica per diventare Fornitore.',
                'order': 3
            },
            {
                'question': 'Come posso eliminare il mio account?',
                'answer': 'Puoi eliminare il tuo account dalle impostazioni del profilo o contattando il supporto. Nota che questa azione è irreversibile e tutti i tuoi dati verranno cancellati.',
                'order': 4
            }
        ],
        'progetti': [
            {
                'question': 'Come funziona il processo di creazione di un progetto?',
                'answer': 'Dopo aver effettuato l\'accesso come Cliente, vai su "Nuova Richiesta", descrivi dettagliatamente le tue esigenze, imposta il budget e i tempi. I Fornitori potranno inviare le loro offerte e tu potrai scegliere quella migliore.',
                'order': 1
            },
            {
                'question': 'Quanto tempo ci vuole per ricevere le prime offerte?',
                'answer': 'Solitamente ricevi le prime offerte entro 24-48 ore dalla pubblicazione della richiesta. I Fornitori più attivi rispondono spesso entro poche ore.',
                'order': 2
            },
            {
                'question': 'Posso modificare una richiesta dopo averla pubblicata?',
                'answer': 'Sì, puoi modificare la richiesta finché non hai accettato un\'offerta. Una volta iniziato il progetto, le modifiche devono essere concordate con il Fornitore.',
                'order': 3
            },
            {
                'question': 'Cosa succede se il progetto non viene completato nei tempi?',
                'answer': 'Puoi discutere con il Fornitore per una proroga. Se ci sono problemi, il nostro team di supporto interviene per mediare e trovare una soluzione equa.',
                'order': 4
            }
        ],
        'pagamenti': [
            {
                'question': 'I pagamenti sono sicuri?',
                'answer': 'Assolutamente sì! Utilizziamo sistemi di pagamento certificati e crittografia bancaria. I fondi vengono trattenuti in escrow fino al completamento soddisfacente del progetto.',
                'order': 1
            },
            {
                'question': 'Quando viene rilasciato il pagamento al Fornitore?',
                'answer': 'Il pagamento viene rilasciato automaticamente quando approvi il lavoro completato. I fondi sono già garantiti in escrow dal momento dell\'accettazione dell\'offerta.',
                'order': 2
            },
            {
                'question': 'Posso richiedere un rimborso?',
                'answer': 'Sì, se il Fornitore non rispetta gli accordi o il lavoro non è soddisfacente, puoi richiedere un rimborso. Il nostro team valuterà la situazione e medierà.',
                'order': 3
            },
            {
                'question': 'Quali metodi di pagamento accettate?',
                'answer': 'Accettiamo carte di credito/debito, PayPal, bonifici bancari e altri metodi di pagamento sicuri. Tutti i pagamenti sono protetti da crittografia SSL.',
                'order': 4
            }
        ],
        'sviluppatori': [
            {
                'question': 'Come vengono verificati gli sviluppatori?',
                'answer': 'Ogni Fornitore passa attraverso un rigoroso processo di verifica: controllo identità, test tecnici, valutazione portfolio e verifica referenze professionali.',
                'order': 1
            },
            {
                'question': 'Come posso aumentare le mie possibilità di successo?',
                'answer': 'Completa il tuo profilo, pubblica prodotti di qualità, rispondi rapidamente alle richieste, mantieni una comunicazione professionale e accumula recensioni positive.',
                'order': 2
            },
            {
                'question': 'Qual è la commissione della piattaforma?',
                'answer': 'La piattaforma trattiene una piccola commissione sui progetti completati. Le tariffe sono trasparenti e visibili nel tuo profilo Fornitore.',
                'order': 3
            },
            {
                'question': 'Posso lavorare con clienti al di fuori della piattaforma?',
                'answer': 'Ti incoraggiamo a utilizzare la piattaforma per tutti i progetti per garantire sicurezza e supporto. I contatti diretti sono permessi ma non coperti dalle nostre garanzie.',
                'order': 4
            }
        ],
        'supporto': [
            {
                'question': 'Cosa succede se ci sono problemi durante il progetto?',
                'answer': 'Il nostro team di supporto monitora attivamente tutti i progetti. In caso di problemi, interveniamo immediatamente per mediare e trovare una soluzione equa per entrambe le parti.',
                'order': 1
            },
            {
                'question': 'Come posso contattare il supporto?',
                'answer': 'Puoi contattarci tramite email, chat dal vivo (disponibile 9-18), WhatsApp o attraverso il sistema di messaggi interno della piattaforma.',
                'order': 2
            },
            {
                'question': 'Quanto tempo ci vuole per ricevere una risposta dal supporto?',
                'answer': 'Rispondiamo entro 24 ore nei giorni lavorativi. Per urgenze, utilizza la chat dal vivo o WhatsApp per una risposta immediata.',
                'order': 3
            },
            {
                'question': 'Il supporto è disponibile in altre lingue?',
                'answer': 'Attualmente supportiamo Italiano e Inglese. Stiamo lavorando per aggiungere altre lingue in base alle richieste degli utenti.',
                'order': 4
            }
        ]
    }
    
    # Crea le FAQ per ogni categoria
    for category in categories:
        if category.slug in faqs_data:
            category_faqs = faqs_data[category.slug]
            for faq_data in category_faqs:
                faq, created = FAQ.objects.get_or_create(
                    category=category,
                    question=faq_data['question'],
                    defaults={
                        'answer': faq_data['answer'],
                        'order': faq_data['order'],
                        'created_by': admin_user
                    }
                )
                if created:
                    print(f"  ✓ Creata FAQ: {faq.question[:50]}...")
                else:
                    print(f"  - FAQ già esistente: {faq.question[:50]}...")

def main():
    """Funzione principale"""
    print("🚀 Inizio popolamento database FAQ...")
    print()
    
    # Crea le categorie
    print("📁 Creazione categorie FAQ...")
    categories = create_faq_categories()
    print()
    
    # Crea le FAQ
    print("❓ Creazione FAQ...")
    create_faqs(categories)
    print()
    
    # Statistiche finali
    total_categories = FAQCategory.objects.count()
    total_faqs = FAQ.objects.count()
    
    print("✅ Popolamento completato!")
    print(f"📊 Statistiche:")
    print(f"   - Categorie: {total_categories}")
    print(f"   - FAQ: {total_faqs}")
    print()
    print("🌐 Ora puoi accedere alle FAQ tramite:")
    print("   - API: http://localhost:8000/api/faq/")
    print("   - Admin: http://localhost:8000/admin/faq/")

if __name__ == '__main__':
    main() 