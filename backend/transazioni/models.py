from django.db import models
from progetti.models import Progetto

class Transazione(models.Model):
    STATO_CHOICES = [
        ('in_attesa', 'In attesa'),
        ('completata', 'Completata'),
        ('rimborsata', 'Rimborsata'),
    ]
    progetto = models.ForeignKey(Progetto, on_delete=models.CASCADE, related_name='transazioni')
    importo_totale = models.DecimalField(max_digits=10, decimal_places=2)
    commissione_cliente = models.DecimalField(max_digits=10, decimal_places=2)
    commissione_fornitore = models.DecimalField(max_digits=10, decimal_places=2)
    importo_fornitore = models.DecimalField(max_digits=10, decimal_places=2)
    data_transazione = models.DateTimeField(auto_now_add=True)
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='in_attesa')

    def __str__(self):
        return f"Transazione {self.id} - Progetto {self.progetto.id}"

    class Meta:
        verbose_name = 'Transazione'
        verbose_name_plural = 'Transazioni'

class Messaggio(models.Model):
    # ... campi ...
    class Meta:
        verbose_name = 'Messaggio'
        verbose_name_plural = 'Messaggi' 