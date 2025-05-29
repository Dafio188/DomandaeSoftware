from django.db import models
from progetti.models import Progetto
from utenti.models import User

class Recensione(models.Model):
    progetto = models.ForeignKey(Progetto, on_delete=models.CASCADE, related_name='recensioni')
    autore = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recensioni_autore')
    destinatario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recensioni_destinatario')
    voto = models.IntegerField()
    commento = models.TextField(blank=True)
    data_recensione = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recensione {self.id} - {self.voto} stelle"

    class Meta:
        verbose_name = 'Recensione'
        verbose_name_plural = 'Recensioni' 