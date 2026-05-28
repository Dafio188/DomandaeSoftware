from django.contrib import admin

from .models import AuditEvent, Notifica


@admin.register(AuditEvent)
class AuditEventAdmin(admin.ModelAdmin):
    list_display = (
        'created_at',
        'action',
        'actor',
        'progetto',
        'target_model',
        'target_id',
        'ip_address',
    )
    list_filter = ('action', 'created_at')
    search_fields = ('actor__username', 'action', 'target_model', 'target_id', 'progetto__id', 'ip_address')
    ordering = ('-created_at',)


@admin.register(Notifica)
class NotificaAdmin(admin.ModelAdmin):
    list_display = ('user', 'titolo', 'tipo', 'letta', 'data_creazione')
    list_filter = ('letta', 'tipo', 'data_creazione')
    search_fields = ('user__username', 'titolo', 'messaggio')
    ordering = ('-data_creazione',)
