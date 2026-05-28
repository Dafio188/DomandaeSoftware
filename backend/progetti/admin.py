from django.contrib import admin
from .models import Progetto

@admin.register(Progetto)
class ProgettoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'stato',
        'tipo_progetto',
        'archiviato',
        'richiesta',
        'cliente',
        'fornitore',
        'pagamento_cliente_ok',
        'pagamento_admin_ok',
        'consegna_fornitore_ok',
        'consegna_cliente_ok',
        'bonifico_fornitore_ok',
    )
    list_filter = ('stato', 'tipo_progetto', 'archiviato')
    search_fields = (
        'id',
        'richiesta__titolo',
        'cliente__username',
        'fornitore__username',
    )
    ordering = ('-data_inizio',)
    actions = ('conferma_pagamento_admin', 'imposta_in_contestazione', 'annulla_progetto')

    @admin.action(description='Conferma pagamento (admin)')
    def conferma_pagamento_admin(self, request, queryset):
        queryset.update(pagamento_admin_ok=True, stato='pagamento')

    @admin.action(description='Imposta in contestazione')
    def imposta_in_contestazione(self, request, queryset):
        queryset.update(stato='in_contestazione')

    @admin.action(description='Annulla progetto')
    def annulla_progetto(self, request, queryset):
        queryset.update(stato='annullato')
