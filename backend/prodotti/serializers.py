from rest_framework import serializers
from .models import ProdottoPronto

class ProdottoProntoSerializer(serializers.ModelSerializer):
    fornitore_username = serializers.CharField(source='fornitore.username', read_only=True)
    
    class Meta:
        model = ProdottoPronto
        fields = [
            'id',
            'titolo',
            'descrizione',
            'fornitore',
            'fornitore_username',
            'categoria',
            'prezzo',
            'link_demo',
            'immagine',
            'data_pubblicazione',
        ]
        extra_kwargs = {
            'fornitore': {'read_only': True},
            'data_pubblicazione': {'read_only': True},
        }
