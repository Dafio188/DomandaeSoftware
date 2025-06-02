from rest_framework import serializers
from .models import Richiesta

class RichiestaSerializer(serializers.ModelSerializer):
    cliente_username = serializers.CharField(source='cliente.username', read_only=True)
    
    class Meta:
        model = Richiesta
        fields = [
            'id', 'titolo', 'tipo_software', 'descrizione', 'budget', 
            'immagine', 'data_pubblicazione', 'stato', 'is_prodotto_acquistato',
            'cliente', 'cliente_username'
        ]
        read_only_fields = ['cliente', 'data_pubblicazione', 'stato'] 