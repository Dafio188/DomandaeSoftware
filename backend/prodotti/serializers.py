from rest_framework import serializers
from .models import ProdottoPronto

class ProdottoProntoSerializer(serializers.ModelSerializer):
    fornitore_username = serializers.CharField(source='fornitore.username', read_only=True)
    fornitore_email = serializers.CharField(source='fornitore.email', read_only=True)
    
    class Meta:
        model = ProdottoPronto
        fields = '__all__'
        extra_kwargs = {
            'fornitore': {'required': False},  # Non richiesto in input
            'data_pubblicazione': {'read_only': True}  # Generato automaticamente
        }
