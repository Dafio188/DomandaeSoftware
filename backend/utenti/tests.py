from django.test import TestCase
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from utenti.models import User, CreditoRicarica


class UserProfileUpdateTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.user = User.objects.create_user(
            username='utente_profile_test',
            email='utente_profile_test@example.com',
            password='test12345',
            ruolo='cliente',
            stato='attivo',
        )

    def test_patch_user_updates_profile_fields_and_ignores_ruolo(self):
        self.api.force_authenticate(user=self.user)
        res = self.api.patch(
            '/api/auth/user/',
            {'bio': 'bio test', 'telefono': '123', 'ruolo': 'amministratore'},
            format='json',
        )
        self.assertEqual(res.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'bio test')
        self.assertEqual(self.user.telefono, '123')
        self.assertEqual(self.user.ruolo, 'cliente')

    def test_patch_user_updates_iban_fields_for_fornitore(self):
        fornitore = User.objects.create_user(
            username='fornitore_profile_iban',
            email='fornitore_profile_iban@example.com',
            password='test12345',
            ruolo='fornitore',
            stato='attivo',
        )
        self.api.force_authenticate(user=fornitore)
        res = self.api.patch(
            '/api/auth/user/',
            {'iban': 'IT60X0542811101000000123456', 'iban_intestatario': 'Mario Rossi'},
            format='json',
        )
        self.assertEqual(res.status_code, 200)
        fornitore.refresh_from_db()
        self.assertEqual(fornitore.iban, 'IT60X0542811101000000123456')
        self.assertEqual(fornitore.iban_intestatario, 'Mario Rossi')

    def test_patch_notifiche_updates_newsletter(self):
        self.api.force_authenticate(user=self.user)
        res = self.api.patch('/api/auth/notifiche/', {'newsletter': True}, format='json')
        self.assertEqual(res.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.newsletter)


class CreditiRicevutaUploadTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.fornitore = User.objects.create_user(
            username='fornitore_crediti_upload',
            email='fornitore_crediti_upload@example.com',
            password='test12345',
            ruolo='fornitore',
            stato='attivo',
        )

    def test_upload_ricevuta_for_ricarica(self):
        r = CreditoRicarica.objects.create(
            user=self.fornitore,
            crediti=10,
            prezzo='19.90',
            stato='in_attesa',
            causale='SoftMatch Ricarica#1 - fornitore_crediti_upload',
        )
        self.api.force_authenticate(user=self.fornitore)
        f = SimpleUploadedFile('ricevuta.pdf', b'%PDF-1.4 test', content_type='application/pdf')
        res = self.api.post(
            f'/api/auth/crediti/ricariche/{r.id}/ricevuta/',
            {'file': f},
            format='multipart',
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get('ricevuta_url'))
