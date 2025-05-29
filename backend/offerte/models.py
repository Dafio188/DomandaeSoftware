from django.db import models
from utenti.models import User

class Offerta(models.Model):
    STATO_CHOICES = [
        ('inviata', 'Inviata'),
        ('accettata', 'Accettata'),
        ('rifiutata', 'Rifiutata'),
        ('annullata', 'Annullata'),
    ]
    richiesta = models.ForeignKey('richieste.Richiesta', on_delete=models.CASCADE, related_name='offerte')
    fornitore = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offerte')
    descrizione = models.TextField()
    prezzo = models.DecimalField(max_digits=10, decimal_places=2)
    data_offerta = models.DateTimeField(auto_now_add=True)
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='inviata')
    in_attesa_approvazione = models.BooleanField(default=False)

    def __str__(self):
        return f"Offerta di {self.fornitore.username} per {self.richiesta.titolo}"

    class Meta:
        verbose_name = 'Offerta'
        verbose_name_plural = 'Offerte' 