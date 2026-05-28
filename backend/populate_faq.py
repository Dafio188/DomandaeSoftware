#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script per popolare il database con FAQ di esempio - VERSIONE SICURA UNICODE
"""

import os
import sys
import django

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
        if not created:
            # Aggiorna i dati esistenti per correggere eventuali errori di encoding
            for key, value in cat_data.items():
                setattr(category, key, value)
            category.save()
            print(f"--- Aggiornata categoria: {category.name}")
        else:
            print(f"--- Creata categoria: {category.name}")
        created_categories.append(category)
    
    return created_categories

def create_faqs(categories):
    """Crea le FAQ per ogni categoria"""
    
    # Pulizia preventiva per eliminare definitivamente i vecchi record corrotti
    FAQ.objects.all().delete()
    print("--- DATABASE FAQ RIPULITO ---")
    
    # Trova un utente admin per assegnare come creatore
    admin_user = User.objects.filter(is_staff=True).first()
    
    # Sequenze di escape Unicode per massima compatibilita'
    faqs_data = {
        'account': [
            {
                'question': 'Come posso registrarmi sulla piattaforma?',
                'answer': 'La registrazione \u00e8 semplice e gratuita. Clicca su "Registrati" nella navbar, scegli se sei un Cliente o un Fornitore, compila il form con i tuoi dati e verifica la tua email. Per i Fornitori \u00e8 richiesta una verifica aggiuntiva delle competenze.',
                'order': 1
            },
            {
                'question': 'Ho dimenticato la password, come posso recuperarla?',
                'answer': 'Nella pagina di login, clicca su "Password dimenticata?", inserisci la tua email e riceverai un link per reimpostare la password. Il link \u00e8 valido per 24 ore.',
                'order': 2
            },
            {
                'question': 'Posso cambiare il mio tipo di account da Cliente a Fornitore?',
                'answer': 'S\u00ec, puoi richiedere il cambio di tipologia account contattando il nostro supporto. Dovrai completare il processo di verifica per diventare Fornitore.',
                'order': 3
            },
            {
                'question': 'Come posso eliminare il mio account?',
                'answer': 'Puoi eliminare il tuo account dalle impostazioni del profilo o contattando il supporto. Nota che questa azione \u00e8 irreversibile e tutti i tuoi dati verranno cancellati.',
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
                'answer': 'Solitamente ricevi le prime offerte entro 24-48 ore dalla pubblicazione della richiesta. I Fornitori pi\u00f9 attivi rispondono spesso entro poche ore.',
                'order': 2
            },
            {
                'question': 'Posso modificare una richiesta dopo averla pubblicata?',
                'answer': 'S\u00ec, puoi modificare la richiesta finch\u00e9 non hai accettato un\'offerta. Una volta iniziato il progetto, le modifiche devono essere concordate con il Fornitore.',
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
                'answer': 'Assolutamente s\u00ec! Utilizziamo sistemi di pagamento certificati e crittografia bancaria. I fondi vengono trattenuti in escrow fino al completamento soddisfacente del progetto.',
                'order': 1
            },
            {
                'question': 'Quando viene rilasciato il pagamento al Fornitore?',
                'answer': 'Il pagamento viene rilasciato automaticamente quando approvi il lavoro completato. I fondi sono gi\u00e0 garantiti in escrow dal momento dell\'accettazione dell\'offerta.',
                'order': 2
            },
            {
                'question': 'Posso richiedere un rimborso?',
                'answer': 'S\u00ec, se il Fornitore non rispetta gli accordi o il lavoro non \u00e8 soddisfacente, puoi richiedere un rimborso. Il nostro team valuter\u00e0 la situazione e medier\u00e0.',
                'order': 3
            },
            {
                'question': 'Quali metodi di pagamento accettate?',
                'answer': 'Accettiamo carte di credito/debito, PayPal, bonifici bancari e altri metodi di pagamento sicuri. Tutti i pagamenti sono protetti da crittografia SSL.',
                'order': 4
            },
            {
                'question': 'Come viene garantita la sicurezza dei miei dati?',
                'answer': 'Usiamo i pi\u00f9 alti standard di sicurezza web: la piattaforma \u00e8 protetta da protocolli HSTS, Content Security Policy (CSP) per prevenire attacchi malevoli e crittografia AES-256 per i dati sensibili. Effettuiamo backup orari del database per prevenire qualsiasi perdita di dati.',
                'order': 5
            }
        ],
        'sviluppatori': [
            {
                'question': 'Come vengono verificati gli sviluppatori?',
                'answer': 'Ogni Fornitore passa attraverso un rigoroso processo di verifica: controllo identit\u00e0, test tecnici, valutazione portfolio e verifica referenze professionali.',
                'order': 1
            },
            {
                'question': 'Come posso aumentare le mie possibilit\u00e0 di successo?',
                'answer': 'Completa il tuo profilo, pubblica prodotti di qualit\u00e0, rispondi rapidamente alle richieste, mantieni una comunicazione professionale e accumula recensioni positive.',
                'order': 2
            },
            {
                'question': 'Qual \u00e8 la commissione della piattaforma?',
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
                'question': 'Il supporto \u00e8 disponibile in altre lingue?',
                'answer': 'Attualmente supportiamo Italiano e Inglese. Stiamo lavorando per aggiungere altre lingue in base alle richieste degli utenti.',
                'order': 4
            },
            {
                'question': 'Posso usare SoftMatch come un\'applicazione sul mio cellulare?',
                'answer': 'S\u00ec! SoftMatch \u00e8 una Progressive Web App (PWA). Puoi "installarla" sulla home del tuo smartphone direttamente dal browser (cliccando "Aggiungi a Home"). Questo ti permetter\u00e0 di accedere alla piattaforma con un tocco, senza barra del browser e con prestazioni velocissime.',
                'order': 5
            }
        ]
    }
    
    # Crea le FAQ per ogni categoria
    for category in categories:
        if category.slug in faqs_data:
            category_faqs = faqs_data[category.slug]
            for faq_data in category_faqs:
                FAQ.objects.create(
                    category=category,
                    question=faq_data['question'],
                    answer=faq_data['answer'],
                    order=faq_data['order'],
                    created_by=admin_user
                )
                print(f"--- OK: Creata FAQ: {faq_data['question'][:50]}...")

def main():
    """Funzione principale"""
    print("--- INIZIO POPOLAMENTO FAQ ---")
    
    # Crea le categorie
    print("--- Elaborazione Categorie ---")
    categories = create_faq_categories()
    
    # Crea le FAQ
    print("--- Elaborazione Domande ---")
    create_faqs(categories)
    
    # Statistiche finali
    total_categories = FAQCategory.objects.count()
    total_faqs = FAQ.objects.count()
    
    print("--- OPERAZIONE COMPLETATA ---")
    print(f"Statistiche finali: {total_categories} categorie, {total_faqs} FAQ.")

if __name__ == '__main__':
    main()
