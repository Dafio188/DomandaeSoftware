from django.contrib import admin
from .models import Messaggio

class ProgettoTitoloListFilter(admin.SimpleListFilter):
    title = 'Titolo richiesta'
    parameter_name = 'progetto__richiesta__titolo'
    def lookups(self, request, queryset):
        titoli = set(qs.richiesta.titolo for qs in queryset.model._meta.get_field('progetto').related_model.objects.all())
        return [(t, t) for t in titoli]
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(progetto__richiesta__titolo=self.value())
        return queryset

class ClienteListFilter(admin.SimpleListFilter):
    title = 'Cliente'
    parameter_name = 'progetto__cliente'
    def lookups(self, request, queryset):
        clienti = set(qs.cliente for qs in queryset.model._meta.get_field('progetto').related_model.objects.all())
        return [(c.id, c.username) for c in clienti]
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(progetto__cliente__id=self.value())
        return queryset

class FornitoreListFilter(admin.SimpleListFilter):
    title = 'Fornitore'
    parameter_name = 'progetto__fornitore'
    def lookups(self, request, queryset):
        fornitori = set(qs.fornitore for qs in queryset.model._meta.get_field('progetto').related_model.objects.all())
        return [(f.id, f.username) for f in fornitori]
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(progetto__fornitore__id=self.value())
        return queryset

@admin.register(Messaggio)
class MessaggioAdmin(admin.ModelAdmin):
    list_display = ('id', 'progetto', 'mittente', 'testo', 'data_invio')
    list_filter = ('progetto', 'mittente', ProgettoTitoloListFilter, ClienteListFilter, FornitoreListFilter)
    search_fields = ('testo', 'mittente__username', 'progetto__id')

    def __str__(self):
        return f"Progetto {self.id} - {self.richiesta.titolo}" 