from django.test import TestCase
from rest_framework.test import APIClient

from utenti.models import User
from richieste.models import Richiesta


class RichiesteSkillTagsTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.cliente = User.objects.create_user(
            username='cliente_test_tags',
            email='cliente_test_tags@example.com',
            password='cliente123',
            ruolo='cliente',
            stato='attivo',
        )
        self.fornitore = User.objects.create_user(
            username='fornitore_test_tags',
            email='fornitore_test_tags@example.com',
            password='fornitore123',
            ruolo='fornitore',
            stato='attivo',
        )

    def test_create_richiesta_accepts_skill_tags_string_and_normalizes(self):
        self.api.force_authenticate(user=self.cliente)
        res = self.api.post(
            '/api/richieste/',
            {
                'titolo': 'Test tags',
                'tipo_software': 'web_app',
                'descrizione': 'Descrizione',
                'budget': 1000,
                'skill_tags': 'React,  Django , react,  ',
            },
            format='multipart',
        )
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('skill_tags'), ['react', 'django'])

        richiesta = Richiesta.objects.get(id=res.data['id'])
        self.assertEqual(richiesta.skill_tags, ['react', 'django'])
        self.assertIn('react', richiesta.skill_tags_search)
        self.assertIn('django', richiesta.skill_tags_search)

    def test_filter_richieste_by_tag(self):
        Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Test richiesta',
            tipo_software='web_app',
            descrizione='Descrizione',
            budget=1000,
            stato='aperta',
            skill_tags=['react', 'django'],
        )
        Richiesta.objects.create(
            cliente=self.cliente,
            titolo='Altro',
            tipo_software='web_app',
            descrizione='Descrizione',
            budget=1000,
            stato='aperta',
            skill_tags=['flutter'],
        )

        self.api.force_authenticate(user=self.fornitore)
        res = self.api.get('/api/richieste/?tag=react')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['skill_tags'], ['react', 'django'])

    def test_create_richiesta_masks_contact_info_in_descrizione(self):
        self.api.force_authenticate(user=self.cliente)
        res = self.api.post(
            '/api/richieste/',
            {
                'titolo': 'Test contatti',
                'tipo_software': 'web_app',
                'descrizione': 'Contattami su test@example.com oppure www.example.com',
                'budget': 1000,
            },
            format='multipart',
        )
        self.assertEqual(res.status_code, 201)
        self.assertNotIn('test@example.com', res.data['descrizione'])
        self.assertIn('[contatto nascosto]', res.data['descrizione'])
