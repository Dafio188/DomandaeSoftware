from django.contrib import admin
from .models import Testimonianza

@admin.register(Testimonianza)
class TestimonianzaAdmin(admin.ModelAdmin):
    list_display = ('autore', 'tipo_autore', 'testo_breve', 'attivo', 'ordine', 'data_creazione')
    list_filter = ('tipo_autore', 'attivo')
    search_fields = ('autore', 'testo')
    list_editable = ('attivo', 'ordine')
    ordering = ('ordine', '-data_creazione')
    
    def testo_breve(self, obj):
        return obj.testo[:100] + '...' if len(obj.testo) > 100 else obj.testo
    testo_breve.short_description = 'Testo' 