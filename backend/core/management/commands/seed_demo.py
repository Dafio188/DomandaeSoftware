from django.core.management.base import BaseCommand
from django.utils import timezone
from utenti.models import User
from richieste.models import Richiesta
from offerte.models import Offerta
from progetti.models import Progetto, StepPersonalizzato
from faq.models import FAQCategory, FAQ


class Command(BaseCommand):
    help = "Popola l'ambiente locale con utenti, richieste e preventivi di test"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Elimina i dati demo esistenti prima di ricrearli",
        )

    def handle(self, *args, **options):
        reset = options.get("reset", False)

        demo_usernames = [
            "demo_cliente1", "demo_cliente2", "demo_cliente3",
            "demo_fornitore1", "demo_fornitore2", "demo_fornitore3", "demo_fornitore4",
            "demo_admin",
            "demo_staff",
        ]
        if reset:
            Offerta.objects.filter(fornitore__username__in=demo_usernames).delete()
            Progetto.objects.filter(cliente__username__in=demo_usernames).delete()
            Richiesta.objects.filter(cliente__username__in=demo_usernames).delete()
            User.objects.filter(username__in=demo_usernames).delete()

        admin_user, created_admin = User.objects.get_or_create(
            username="demo_admin",
            defaults={
                "email": "demo_admin@softmatch.it",
                "is_staff": True,
                "is_superuser": True,
                "ruolo": "amministratore",
                "stato": "attivo",
            },
        )
        if created_admin:
            admin_user.set_password("password123")
            admin_user.save()

        staff_user, created_staff = User.objects.get_or_create(
            username="demo_staff",
            defaults={
                "email": "demo_staff@softmatch.it",
                "is_staff": True,
                "ruolo": "amministratore",
                "stato": "attivo",
            },
        )
        if created_staff:
            staff_user.set_password("password123")
            staff_user.save()

        # Crea clienti
        clienti = []
        for i in range(1, 4):
            u, created = User.objects.get_or_create(
                username=f"demo_cliente{i}",
                defaults={
                    "email": f"demo_cliente{i}@softmatch.it",
                    "ruolo": "cliente",
                    "stato": "attivo",
                },
            )
            if created:
                u.set_password("password123")
                u.save()
            clienti.append(u)

        # Crea fornitori
        fornitori = []
        for i in range(1, 5):
            u, created = User.objects.get_or_create(
                username=f"demo_fornitore{i}",
                defaults={
                    "email": f"demo_fornitore{i}@softmatch.it",
                    "ruolo": "fornitore",
                    "stato": "attivo",
                    "bio": "Sviluppatore freelance specializzato in soluzioni moderne.",
                    "competenze": "react, node, python, django",
                    "github": "https://github.com/example",
                    "crediti": 20,
                    "iban": "",
                    "iban_intestatario": "",
                },
            )
            if created:
                u.set_password("password123")
                u.save()
            if u.crediti == 0:
                u.crediti = 20
                u.save(update_fields=["crediti"])
            fornitori.append(u)

        # Richieste di test
        richieste_data = [
            {
                "cliente": clienti[0],
                "titolo": "CRM per agenzia immobiliare",
                "tipo_software": "web_app",
                "descrizione": "Gestione clienti, immobili, lead; integrazione email.",
                "budget": 5000,
                "stato": "aperta",
                "skill_tags": ["react", "django", "postgres"],
            },
            {
                "cliente": clienti[1],
                "titolo": "E-commerce moda",
                "tipo_software": "ecommerce",
                "descrizione": "Catalogo prodotti, carrello, pagamenti, pannello admin.",
                "budget": 8000,
                "stato": "aperta",
                "skill_tags": ["nextjs", "node", "stripe"],
            },
            {
                "cliente": clienti[2],
                "titolo": "App mobile prenotazioni",
                "tipo_software": "app_mobile",
                "descrizione": "Prenotazioni, notifiche push, profili utenti, calendario.",
                "budget": 12000,
                "stato": "aperta",
                "skill_tags": ["flutter", "firebase"],
            },
        ]

        richieste = []
        for data in richieste_data:
            r, _ = Richiesta.objects.get_or_create(
                cliente=data["cliente"],
                titolo=data["titolo"],
                defaults={
                    "tipo_software": data["tipo_software"],
                    "descrizione": data["descrizione"],
                    "budget": data["budget"],
                    "stato": data["stato"],
                    "skill_tags": data["skill_tags"],
                },
            )
            richieste.append(r)

        # Preventivi/offerte di test
        # Per ogni richiesta, crea 2-3 offerte da fornitori diversi
        prezzi = [
            [4800, 5200, 6000],
            [7500, 8000, 9500],
            [10000, 12000, 14000],
        ]
        for idx, richiesta in enumerate(richieste):
            for j, prezzo in enumerate(prezzi[idx]):
                f = fornitori[j % len(fornitori)]
                Offerta.objects.get_or_create(
                    richiesta=richiesta,
                    fornitore=f,
                    defaults={
                        "descrizione": f"Soluzione proposta da {f.username}: architettura modulare, test e deploy.",
                        "prezzo": prezzo,
                        "stato": "inviata",
                        "in_attesa_approvazione": True,
                    },
                )

        # Crea un progetto accettando la prima offerta della prima richiesta
        prima_richiesta = richieste[0]
        offerta_accettata = Offerta.objects.filter(richiesta=prima_richiesta).order_by("prezzo").first()
        if offerta_accettata:
            progetto, _ = Progetto.objects.get_or_create(
                richiesta=prima_richiesta,
                offerta=offerta_accettata,
                cliente=prima_richiesta.cliente,
                fornitore=offerta_accettata.fornitore,
                defaults={
                    "stato": "bozza",
                    "tipo_progetto": "richiesta_classica",
                },
            )
            # Step personalizzati di esempio
            StepPersonalizzato.objects.get_or_create(progetto=progetto, nome="Analisi", ordine=1)
            StepPersonalizzato.objects.get_or_create(progetto=progetto, nome="Sviluppo", ordine=2)
            StepPersonalizzato.objects.get_or_create(progetto=progetto, nome="Consegna", ordine=3)

        cat, _ = FAQCategory.objects.get_or_create(
            slug='crediti-ticket',
            defaults={
                'name': 'Crediti & Ticket',
                'description': 'Ticket per inviare offerte e ridurre lo spam',
                'icon': 'FaTicketAlt',
                'order': 50,
                'is_active': True,
            },
        )
        FAQ.objects.get_or_create(
            category=cat,
            question='Come acquista un fornitore i crediti per inviare offerte?',
            defaults={
                'answer': (
                    'I crediti sono ticket anti-spam usati dai fornitori per inviare offerte.\\n\\n'
                    '1) Vai su “Crediti” (menu dashboard)\\n'
                    '2) Seleziona un pacchetto\\n'
                    '3) La piattaforma genera una richiesta ricarica con causale univoca\\n'
                    '4) Esegui il bonifico verso l’IBAN SoftMatch usando quella causale\\n'
                    '5) Un admin conferma l’accredito e i crediti vengono caricati\\n\\n'
                    'Nota: i crediti non sostituiscono il pagamento del progetto.'
                ),
                'order': 1,
                'is_active': True,
                'created_by': admin_user,
            },
        )

        self.stdout.write(self.style.SUCCESS("Dati demo creati."))
        self.stdout.write("Admin demo:")
        self.stdout.write("  - demo_admin / password123")
        self.stdout.write("  - demo_staff / password123")
        self.stdout.write("Clienti demo:")
        for c in clienti:
            self.stdout.write(f"  - {c.username} / password123")
        self.stdout.write("Fornitori demo:")
        for f in fornitori:
            self.stdout.write(f"  - {f.username} / password123")
        self.stdout.write("Richieste create:")
        for r in richieste:
            self.stdout.write(f"  - {r.titolo} ({r.tipo_software}) - budget {r.budget}€")
