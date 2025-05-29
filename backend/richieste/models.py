from django.db import models
from django.core.exceptions import ValidationError
from utenti.models import User
import os

def validate_image_size(image):
    """Valida che l'immagine non superi 5MB"""
    max_size = 5 * 1024 * 1024  # 5MB
    if image.size > max_size:
        raise ValidationError(f"L'immagine non può superare i 5MB. Dimensione attuale: {image.size/1024/1024:.1f}MB")

def richiesta_image_path(instance, filename):
    """Genera il percorso per il salvataggio dell'immagine"""
    ext = filename.split('.')[-1]
    return f'richieste/{instance.cliente.username}/{instance.id or "temp"}_{filename}'

class Richiesta(models.Model):
    STATO_CHOICES = [
        ('aperta', 'Aperta'),
        ('in_lavorazione', 'In lavorazione'),
        ('completata', 'Completata'),
        ('annullata', 'Annullata'),
    ]
    
    TIPO_SOFTWARE_CHOICES = [
        ('crm', 'CRM - Customer Relationship Management'),
        ('gestionale', 'Gestionale/ERP - Enterprise Resource Planning'),
        ('ecommerce', 'E-commerce - Negozio Online'),
        ('sito_web', 'Sito Web - Vetrina/Corporate'),
        ('app_mobile', 'App Mobile - iOS/Android'),
        ('web_app', 'Web Application - Applicazione Web'),
        ('software_desktop', 'Software Desktop - Applicazione Desktop'),
        ('api_servizi', 'API/Servizi Web - Integrazione Sistemi'),
        ('automazione', 'Automazione Processi - Workflow'),
        ('business_intelligence', 'Business Intelligence - Analisi Dati'),
        ('altro', 'Altro - Specifica nella descrizione'),
    ]
    
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='richieste')
    titolo = models.CharField(max_length=255)
    tipo_software = models.CharField(
        max_length=50, 
        choices=TIPO_SOFTWARE_CHOICES, 
        default='altro',
        help_text="Categoria del software richiesto"
    )
    descrizione = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    immagine = models.ImageField(
        upload_to=richiesta_image_path, 
        blank=True, 
        null=True, 
        validators=[validate_image_size],
        help_text="Immagine opzionale (max 5MB, formati: JPG, PNG, WEBP)"
    )
    data_pubblicazione = models.DateTimeField(auto_now_add=True)
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='aperta')
    
    # Flag per distinguere le richieste generate da acquisti di prodotti
    is_prodotto_acquistato = models.BooleanField(
        default=False, 
        help_text="Indica se questa richiesta è stata creata automaticamente da un acquisto di prodotto"
    )

    def __str__(self):
        return f"{self.titolo} ({self.cliente.username})"

    class Meta:
        verbose_name = 'Richiesta'
        verbose_name_plural = 'Richieste' 