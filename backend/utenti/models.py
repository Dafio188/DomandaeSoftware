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

    telefono = models.CharField(max_length=30, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    competenze = models.CharField(max_length=300, blank=True, default='')
    linkedin = models.URLField(blank=True, default='')
    github = models.URLField(blank=True, default='')
    portfolio = models.URLField(blank=True, default='')
    newsletter = models.BooleanField(default=False)
    crediti = models.IntegerField(default=0)
    iban = models.CharField(max_length=34, blank=True, default='')
    iban_intestatario = models.CharField(max_length=120, blank=True, default='')


class CreditoMovimento(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crediti_movimenti')
    delta = models.IntegerField()
    reason = models.CharField(max_length=80)
    meta = models.JSONField(blank=True, default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Movimento Crediti'
        verbose_name_plural = 'Movimenti Crediti'
        ordering = ['-created_at']


class CreditoRicarica(models.Model):
    STATO_CHOICES = [
        ('in_attesa', 'In attesa'),
        ('confermata', 'Confermata'),
        ('annullata', 'Annullata'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crediti_ricariche')
    crediti = models.PositiveIntegerField()
    prezzo = models.DecimalField(max_digits=10, decimal_places=2)
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='in_attesa')
    causale = models.CharField(max_length=140, blank=True, default='')
    ricevuta = models.FileField(upload_to='crediti/ricariche/%Y/%m/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    confirmed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='crediti_ricariche_confermate')

    class Meta:
        verbose_name = 'Ricarica Crediti'
        verbose_name_plural = 'Ricariche Crediti'
        ordering = ['-created_at']

    def __str__(self):
        return f"Ricarica {self.id} - {self.user.username} ({self.crediti} crediti)"
