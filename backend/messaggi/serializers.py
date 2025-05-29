from rest_framework import serializers
from .models import Messaggio

class MessaggioSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    progetto = serializers.IntegerField()
    testo = serializers.CharField()
    data_invio = serializers.DateTimeField(read_only=True)
    mittente_username = serializers.CharField(read_only=True)
    mittente_ruolo = serializers.CharField(read_only=True)
    
    def create(self, validated_data):
        # Non includiamo mittente qui - viene gestito nella view
        return Messaggio.objects.create(
            progetto_id=validated_data['progetto'],
            testo=validated_data['testo'],
            mittente=self.context['request'].user
        )
    
    def to_representation(self, instance):
        # Per la serializzazione in output
        return {
            'id': instance.id,
            'progetto': instance.progetto.id,
            'testo': instance.testo,
            'data_invio': instance.data_invio,
            'mittente_username': instance.mittente.username,
            'mittente_ruolo': instance.mittente.ruolo,
        } 