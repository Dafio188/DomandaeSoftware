from django.db import models
from django.core.exceptions import ValidationError
from utenti.models import User

def validate_image_size(image):
    """Valida che l'immagine non superi 5MB"""
    max_size = 5 * 1024 * 1024  # 5MB
    if image.size > max_size:
        raise ValidationError(f"L'immagine non può superare i 5MB. Dimensione attuale: {image.size/1024/1024:.1f}MB")

def prodotto_image_path(instance, filename):
    """Genera il percorso per il salvataggio dell'immagine"""
    ext = filename.split('.')[-1]
    return f'prodotti_pronti/{instance.fornitore.username}/{instance.id or "temp"}_{filename}'

class ProdottoPronto(models.Model):
    CATEGORIA_CHOICES = [
        ('template', 'Template/Temi'),
        ('plugin', 'Plugin/Estensioni'),
        ('script', 'Script/Codici'),
        ('software', 'Software Completi'),
        ('app', 'App Mobile'),
        ('servizio', 'Servizi/Consulenze')
    ]
    
    titolo = models.CharField(max_length=200)
    descrizione = models.TextField()
    fornitore = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prodotti_pronti')
    categoria = models.CharField(
        max_length=50,
        choices=CATEGORIA_CHOICES,
        default='software',
        help_text="Categoria del prodotto"
    )
    prezzo = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00,
        help_text="Prezzo di vendita del prodotto"
    )
    link_demo = models.URLField(blank=True, help_text="URL alla versione demo del prodotto")
    immagine = models.ImageField(
        upload_to=prodotto_image_path, 
        blank=True, 
        null=True,
        validators=[validate_image_size],
        help_text="Immagine del prodotto (max 5MB, formati: JPG, PNG, WEBP)"
    )
    data_pubblicazione = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titolo

    class Meta:
        verbose_name = 'Prodotto Pronto'
        verbose_name_plural = 'Prodotti Pronti'
        ordering = ['-data_pubblicazione']
