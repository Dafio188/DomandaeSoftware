from django.db import models

class Testimonianza(models.Model):
    TIPO_SCELTE = [
        ('cliente', 'Cliente'),
        ('fornitore', 'Fornitore'),
        ('azienda', 'Azienda'),
        ('startup', 'Startup'),
        ('altro', 'Altro'),
    ]
    
    testo = models.TextField(help_text="Testo della testimonianza o ringraziamento")
    autore = models.CharField(max_length=100, help_text="Nome o pseudonimo dell'autore")
    tipo_autore = models.CharField(max_length=20, choices=TIPO_SCELTE, default='cliente')
    attivo = models.BooleanField(default=True, help_text="Se la testimonianza è visibile sulla home page")
    data_creazione = models.DateTimeField(auto_now_add=True)
    ordine = models.IntegerField(default=0, help_text="Ordine di visualizzazione (i numeri più bassi appaiono prima)")
    
    class Meta:
        verbose_name = "Testimonianza"
        verbose_name_plural = "Testimonianze"
        ordering = ['ordine', '-data_creazione']
    
    def __str__(self):
        return f"{self.autore} ({self.get_tipo_autore_display()}): {self.testo[:50]}..." 