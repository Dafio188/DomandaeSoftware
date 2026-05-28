from django.conf import settings
from django.db import models


class AuditEvent(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='audit_events',
    )
    action = models.CharField(max_length=120)
    target_model = models.CharField(max_length=120, blank=True, default='')
    target_id = models.CharField(max_length=64, blank=True, default='')
    progetto = models.ForeignKey(
        'progetti.Progetto',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='audit_events',
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True, default='')
    meta = models.JSONField(blank=True, default=dict)

    class Meta:
        ordering = ('-created_at',)
        indexes = [
            models.Index(fields=['action', 'created_at']),
            models.Index(fields=['target_model', 'target_id']),
            models.Index(fields=['progetto', 'created_at']),
        ]

    def __str__(self):
        return f"{self.created_at.isoformat()} {self.action}"


class Notifica(models.Model):
    TIPO_CHOICES = [
        ('info', 'Informazione'),
        ('success', 'Successo'),
        ('warning', 'Attenzione'),
        ('danger', 'Errore'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifiche'
    )
    titolo = models.CharField(max_length=200)
    messaggio = models.TextField()
    letta = models.BooleanField(default=False)
    data_creazione = models.DateTimeField(auto_now_add=True)
    link = models.CharField(max_length=255, blank=True, default='')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='info')

    class Meta:
        verbose_name = 'Notifica'
        verbose_name_plural = 'Notifiche'
        ordering = ('-data_creazione',)

    def __str__(self):
        return f"Notifica per {self.user.username}: {self.titolo}"

