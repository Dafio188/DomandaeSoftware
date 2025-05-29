from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    RUOLO_CHOICES = [
        ('cliente', 'Cliente'),
        ('fornitore', 'Fornitore'),
        ('amministratore', 'Amministratore'),
    ]
    STATO_CHOICES = [
        ('attivo', 'Attivo'),
        ('sospeso', 'Sospeso'),
        ('cancellato', 'Cancellato'),
    ]
    ruolo = models.CharField(max_length=20, choices=RUOLO_CHOICES, default='cliente')
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='attivo')
    data_registrazione = models.DateTimeField(auto_now_add=True)
    
    # Campi per gestione cancellazione GDPR
    richiesta_cancellazione = models.BooleanField(default=False)
    data_richiesta_cancellazione = models.DateTimeField(null=True, blank=True)
    data_cancellazione = models.DateTimeField(null=True, blank=True)
    dati_anonimizzati = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.ruolo})"
    
    def anonimizza_dati(self):
        """Anonimizza i dati personali dell'utente"""
        self.username = f"utente_cancellato_{self.id}"
        self.email = f"cancellato_{self.id}@privacy.local"
        self.first_name = "Nome Cancellato"
        self.last_name = "Cognome Cancellato"
        self.dati_anonimizzati = True
        self.stato = 'cancellato'
        self.save() 