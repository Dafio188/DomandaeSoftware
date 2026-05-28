from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from utenti.models import User
from richieste.models import Richiesta
from offerte.models import Offerta


class OfferteGuardrailsTests(TestCase):
    def setUp(self):
        self.client_api = APIClient()
        self.cliente = User.objects.create_user(
            username='cliente_test_offerte',
            email='cliente_test_offerte@example.com',
            password='cliente123',
            ruolo='cliente',
            stato='attivo',
        )
        self.fornitore = User.objects.create_user(
            username='fornitore_test_offerte',
            email='fornitore_test_offerte@example.com',
            password='fornitore123',
            ruolo='fornitore',
            stato='attivo',
            crediti=10,
        )

        self.richiesta = Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Test richiesta',
            tipo_software='web_app',
            descrizione='Descrizione',
            budget=1000,
            stato='aperta',
        )

    @override_settings(SOFTMATCH_MAX_OFFERTE_PER_RICHIESTA=1)
    def test_limite_offerte_per_richiesta(self):
        self.client_api.force_authenticate(user=self.fornitore)
        res1 = self.client_api.post(
            '/api/offerte/',
            {'richiesta': self.richiesta.id, 'descrizione': 'Prima', 'prezzo': '100.00'},
            format='json',
        )
        self.assertEqual(res1.status_code, 201)

        altro_fornitore = User.objects.create_user(
            username='fornitore_test_offerte_2',
            email='fornitore_test_offerte_2@example.com',
            password='fornitore123',
            ruolo='fornitore',
            stato='attivo',
            crediti=10,
        )
        self.client_api.force_authenticate(user=altro_fornitore)
        res2 = self.client_api.post(
            '/api/offerte/',
            {'richiesta': self.richiesta.id, 'descrizione': 'Seconda', 'prezzo': '120.00'},
            format='json',
        )
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(Offerta.objects.filter(richiesta=self.richiesta).count(), 1)

    def test_un_solo_preventivo_per_fornitore(self):
        self.client_api.force_authenticate(user=self.fornitore)
        res1 = self.client_api.post(
            '/api/offerte/',
            {'richiesta': self.richiesta.id, 'descrizione': 'Prima', 'prezzo': '100.00'},
            format='json',
        )
        self.assertEqual(res1.status_code, 201)

        res2 = self.client_api.post(
            '/api/offerte/',
            {'richiesta': self.richiesta.id, 'descrizione': 'Seconda', 'prezzo': '120.00'},
            format='json',
        )
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(Offerta.objects.filter(richiesta=self.richiesta, fornitore=self.fornitore).count(), 1)

    def test_create_offerta_masks_contact_info_in_descrizione(self):
        self.client_api.force_authenticate(user=self.fornitore)
        res = self.client_api.post(
            '/api/offerte/',
            {'richiesta': self.richiesta.id, 'descrizione': 'Scrivimi a test@example.com', 'prezzo': '100.00'},
            format='json',
        )
        self.assertEqual(res.status_code, 201)
        self.assertNotIn('test@example.com', res.data['descrizione'])
        self.assertIn('[contatto nascosto]', res.data['descrizione'])
