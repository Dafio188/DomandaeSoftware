from django.db import models
from progetti.models import Progetto
from utenti.models import User

class Messaggio(models.Model):
    progetto = models.ForeignKey(Progetto, on_delete=models.CASCADE, related_name='messaggi')
    mittente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messaggi_inviati')
    testo = models.TextField()
    data_invio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Messaggio {self.id} da {self.mittente.username}"

    class Meta:
        verbose_name = 'Messaggio'
        verbose_name_plural = 'Messaggi' 