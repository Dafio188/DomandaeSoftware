from django.test import TestCase
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from utenti.models import User
from richieste.models import Richiesta
from offerte.models import Offerta
from progetti.models import Progetto
from transazioni.models import Transazione


class WorkflowGuardrailsTests(TestCase):
    def setUp(self):
        self.client_api = APIClient()

        self.cliente = User.objects.create_user(
            username='cliente_test',
            email='cliente_test@example.com',
            password='A-strong-pass_1234',
            ruolo='cliente',
        )
        self.fornitore = User.objects.create_user(
            username='fornitore_test',
            email='fornitore_test@example.com',
            password='A-strong-pass_1234',
            ruolo='fornitore',
        )
        self.staff = User.objects.create_user(
            username='staff_test',
            email='staff_test@example.com',
            password='A-strong-pass_1234',
            is_staff=True,
        )

    def test_register_ignores_ruolo_and_stato(self):
        payload = {
            'username': 'u_reg',
            'email': 'u_reg@example.com',
            'password': 'A-strong-pass_1234',
            'ruolo': 'amministratore',
            'stato': 'attivo',
        }
        res = self.client_api.post('/api/auth/register/', payload, format='json')
        self.assertEqual(res.status_code, 201)
        created = User.objects.get(username='u_reg')
        self.assertEqual(created.ruolo, 'cliente')
        self.assertEqual(created.stato, 'attivo')

    def test_messaggi_create_requires_project_membership(self):
        richiesta = Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Test',
            descrizione='Test',
            budget='100.00',
            tipo_software='altro',
            stato='in_lavorazione',
        )
        offerta = Offerta.objects.create(
            richiesta=richiesta,
            fornitore=self.fornitore,
            descrizione='Offerta',
            prezzo='100.00',
            stato='accettata',
        )
        progetto = Progetto.objects.create(
            richiesta=richiesta,
            offerta=offerta,
            cliente=self.cliente,
            fornitore=self.fornitore,
            stato='bozza',
        )

        estraneo = User.objects.create_user(
            username='estraneo_test',
            email='estraneo_test@example.com',
            password='A-strong-pass_1234',
            ruolo='cliente',
        )

        self.client_api.force_authenticate(user=estraneo)
        res = self.client_api.post('/api/messaggi/', {'progetto': progetto.id, 'testo': 'ciao'}, format='json')
        self.assertEqual(res.status_code, 400)

        self.client_api.force_authenticate(user=self.cliente)
        res2 = self.client_api.post('/api/messaggi/', {'progetto': progetto.id, 'testo': 'ciao'}, format='json')
        self.assertEqual(res2.status_code, 201)

    def test_transazione_created_once_and_only_after_payment_and_delivery(self):
        richiesta = Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Test',
            descrizione='Test',
            budget='100.00',
            tipo_software='altro',
            stato='in_lavorazione',
        )
        offerta = Offerta.objects.create(
            richiesta=richiesta,
            fornitore=self.fornitore,
            descrizione='Offerta',
            prezzo='100.00',
            stato='accettata',
        )
        progetto = Progetto.objects.create(
            richiesta=richiesta,
            offerta=offerta,
            cliente=self.cliente,
            fornitore=self.fornitore,
            stato='prima_release',
        )

        self.client_api.force_authenticate(user=self.fornitore)
        self.client_api.post(f'/api/progetti/{progetto.id}/spunta-fase/', {'fase': 'consegna_fornitore'}, format='json')

        self.client_api.force_authenticate(user=self.cliente)
        res = self.client_api.post(f'/api/progetti/{progetto.id}/spunta-fase/', {'fase': 'consegna_cliente'}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Transazione.objects.filter(progetto=progetto).count(), 0)

        self.client_api.post(f'/api/progetti/{progetto.id}/spunta-fase/', {'fase': 'pagamento_cliente'}, format='json')
        self.client_api.force_authenticate(user=self.staff)
        self.client_api.post(f'/api/progetti/{progetto.id}/spunta-fase/', {'fase': 'pagamento_admin'}, format='json')

        self.client_api.force_authenticate(user=self.cliente)
        res2 = self.client_api.post(f'/api/progetti/{progetto.id}/spunta-fase/', {'fase': 'consegna_cliente'}, format='json')
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(Transazione.objects.filter(progetto=progetto).count(), 1)

        res3 = self.client_api.post(f'/api/progetti/{progetto.id}/spunta-fase/', {'fase': 'consegna_cliente'}, format='json')
        self.assertEqual(res3.status_code, 200)
        self.assertEqual(Transazione.objects.filter(progetto=progetto).count(), 1)


class ProgettoPagamentoRicevutaUploadTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.cliente = User.objects.create_user(
            username='cliente_ricevuta',
            email='cliente_ricevuta@example.com',
            password='test12345',
            ruolo='cliente',
            stato='attivo',
        )
        self.fornitore = User.objects.create_user(
            username='fornitore_ricevuta',
            email='fornitore_ricevuta@example.com',
            password='test12345',
            ruolo='fornitore',
            stato='attivo',
        )
        self.richiesta = Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Test',
            descrizione='Test',
            budget='100.00',
            tipo_software='altro',
            stato='in_lavorazione',
        )
        self.offerta = Offerta.objects.create(
            richiesta=self.richiesta,
            fornitore=self.fornitore,
            descrizione='Offerta',
            prezzo='100.00',
            stato='accettata',
        )
        self.progetto = Progetto.objects.create(
            richiesta=self.richiesta,
            offerta=self.offerta,
            cliente=self.cliente,
            fornitore=self.fornitore,
            stato='bozza',
        )

    def test_cliente_upload_pagamento_ricevuta_and_fornitore_cannot_see(self):
        self.api.force_authenticate(user=self.cliente)
        f = SimpleUploadedFile('pagamento.png', b'\x89PNG\r\n\x1a\n', content_type='image/png')
        res = self.api.post(
            f'/api/progetti/{self.progetto.id}/pagamento-ricevuta/',
            {'file': f},
            format='multipart',
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get('pagamento_cliente_ricevuta'))

        self.api.force_authenticate(user=self.fornitore)
        res2 = self.api.get(f'/api/progetti/{self.progetto.id}/')
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(res2.data.get('pagamento_cliente_ricevuta'), '')


class ProgettoBonificoRicevutaUploadTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.cliente = User.objects.create_user(
            username='cliente_bonifico',
            email='cliente_bonifico@example.com',
            password='test12345',
            ruolo='cliente',
            stato='attivo',
        )
        self.fornitore = User.objects.create_user(
            username='fornitore_bonifico',
            email='fornitore_bonifico@example.com',
            password='test12345',
            ruolo='fornitore',
            stato='attivo',
        )
        self.admin = User.objects.create_user(
            username='admin_bonifico',
            email='admin_bonifico@example.com',
            password='test12345',
            is_staff=True,
            ruolo='amministratore',
            stato='attivo',
        )
        self.richiesta = Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Test',
            descrizione='Test',
            budget='100.00',
            tipo_software='altro',
            stato='in_lavorazione',
        )
        self.offerta = Offerta.objects.create(
            richiesta=self.richiesta,
            fornitore=self.fornitore,
            descrizione='Offerta',
            prezzo='100.00',
            stato='accettata',
        )
        self.progetto = Progetto.objects.create(
            richiesta=self.richiesta,
            offerta=self.offerta,
            cliente=self.cliente,
            fornitore=self.fornitore,
            stato='completato',
            consegna_cliente_ok=True,
            consegna_fornitore_ok=True,
            pagamento_cliente_ok=True,
            pagamento_admin_ok=True,
        )

    def test_admin_upload_bonifico_ricevuta_visible_to_fornitore_not_cliente(self):
        self.api.force_authenticate(user=self.admin)
        f = SimpleUploadedFile('bonifico.pdf', b'%PDF-1.4 test', content_type='application/pdf')
        res = self.api.post(
            f'/api/progetti/{self.progetto.id}/bonifico-ricevuta/',
            {'file': f},
            format='multipart',
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get('bonifico_fornitore_ricevuta'))

        self.api.force_authenticate(user=self.fornitore)
        res2 = self.api.get(f'/api/progetti/{self.progetto.id}/')
        self.assertEqual(res2.status_code, 200)
        self.assertTrue(res2.data.get('bonifico_fornitore_ricevuta'))

        self.api.force_authenticate(user=self.cliente)
        res3 = self.api.get(f'/api/progetti/{self.progetto.id}/')
        self.assertEqual(res3.status_code, 200)
        self.assertEqual(res3.data.get('bonifico_fornitore_ricevuta'), '')
