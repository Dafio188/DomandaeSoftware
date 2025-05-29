from rest_framework import serializers
from .models import Transazione

class TransazioneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transazione
        fields = '__all__' 