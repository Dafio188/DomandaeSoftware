from rest_framework import serializers
from .models import Testimonianza

class TestimonianzaSerializer(serializers.ModelSerializer):
    tipo_autore_display = serializers.CharField(source='get_tipo_autore_display', read_only=True)
    
    class Meta:
        model = Testimonianza
        fields = ['id', 'testo', 'autore', 'tipo_autore', 'tipo_autore_display', 'attivo', 'data_creazione', 'ordine']
        extra_kwargs = {
            'data_creazione': {'read_only': True}
        } 