from django.db import models
from utenti.models import User

class StepPersonalizzato(models.Model):
    progetto = models.ForeignKey('Progetto', on_delete=models.CASCADE, related_name='step_personalizzati')
    nome = models.CharField(max_length=100)
    ordine = models.PositiveIntegerField(default=0)
    completato_fornitore = models.BooleanField(default=False)
    completato_cliente = models.BooleanField(default=False)
    data_fornitore = models.DateTimeField(null=True, blank=True)
    data_cliente = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['ordine']

    def __str__(self):
        return f"{self.nome} (Progetto {self.progetto.id})"

class Progetto(models.Model):
    STATO_CHOICES = [
        ('bozza', 'Bozza'),
        ('prima_release', 'Prima release'),
        ('pagamento', 'Pagamento'),
        ('completato', 'Completato'),
        ('in_contestazione', 'In contestazione'),
        ('annullato', 'Annullato'),
    ]
    richiesta = models.ForeignKey('richieste.Richiesta', on_delete=models.CASCADE, related_name='progetti')
    offerta = models.ForeignKey('offerte.Offerta', on_delete=models.CASCADE, related_name='progetti', null=True, blank=True)
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progetti_cliente')
    fornitore = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progetti_fornitore')
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='bozza')
    data_inizio = models.DateTimeField(auto_now_add=True)
    data_fine = models.DateTimeField(null=True, blank=True)
    
    # Gestione archiviazione
    archiviato = models.BooleanField(default=False, help_text="Indica se il progetto è stato archiviato")
    data_archiviazione = models.DateTimeField(null=True, blank=True, help_text="Data e ora di archiviazione del progetto")
    archiviato_da = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='progetti_archiviati', help_text="Utente che ha archiviato il progetto")
    
    # Spunte avanzamento principali
    bozza_fornitore_ok = models.BooleanField(default=False)
    bozza_cliente_ok = models.BooleanField(default=False)
    pagamento_cliente_ok = models.BooleanField(default=False)
    pagamento_admin_ok = models.BooleanField(default=False)
    consegna_fornitore_ok = models.BooleanField(default=False)
    consegna_cliente_ok = models.BooleanField(default=False)
    bonifico_fornitore_ok = models.BooleanField(default=False, help_text="Conferma ricezione bonifico da parte del fornitore")

    # Tipo di progetto per distinguere quelli da prodotti acquistati
    tipo_progetto = models.CharField(
        max_length=50, 
        choices=[
            ('richiesta_classica', 'Da richiesta classica'),
            ('prodotto_acquistato', 'Da prodotto acquistato')
        ],
        default='richiesta_classica',
        help_text="Indica l'origine del progetto"
    )

    def __str__(self):
        stato_display = "🗃️ " if self.archiviato else ""
        return f"{stato_display}Progetto {self.id} - {self.richiesta.titolo}"

    @property
    def puo_essere_archiviato(self):
        """Determina se il progetto può essere archiviato"""
        return (
            self.stato == 'completato' and 
            self.consegna_fornitore_ok and 
            self.consegna_cliente_ok and 
            self.bonifico_fornitore_ok and 
            not self.archiviato
        )

    class Meta:
        verbose_name = 'Progetto'
        verbose_name_plural = 'Progetti' 