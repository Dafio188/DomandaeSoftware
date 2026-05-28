from django.contrib import admin
from .models import Transazione

@admin.register(Transazione)
class TransazioneAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'progetto',
        'stato',
        'importo_totale',
        'commissione_cliente',
        'commissione_fornitore',
        'importo_fornitore',
        'data_transazione',
    )
    list_filter = ('stato', 'data_transazione')
    search_fields = ('id', 'progetto__id')
    ordering = ('-data_transazione',)
