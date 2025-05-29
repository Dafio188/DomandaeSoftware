from rest_framework import serializers
from .models import Recensione
from progetti.models import Progetto

class RecensioneSerializer(serializers.ModelSerializer):
    autore_username = serializers.CharField(source='autore.username', read_only=True)
    destinatario_username = serializers.CharField(source='destinatario.username', read_only=True)
    
    class Meta:
        model = Recensione
        fields = ['id', 'progetto', 'voto', 'commento', 'data_recensione', 'autore_username', 'destinatario_username']
        read_only_fields = ['id', 'data_recensione', 'autore_username', 'destinatario_username']
    
    def create(self, validated_data):
        # L'autore è sempre l'utente autenticato
        validated_data['autore'] = self.context['request'].user
        
        # Il destinatario viene determinato dal progetto
        progetto = validated_data['progetto']
        user = self.context['request'].user
        
        # Se l'autore è il cliente, il destinatario è il fornitore (e viceversa)
        if user == progetto.cliente:
            validated_data['destinatario'] = progetto.fornitore
        elif user == progetto.fornitore:
            validated_data['destinatario'] = progetto.cliente
        else:
            raise serializers.ValidationError("Solo cliente e fornitore del progetto possono lasciare recensioni")
        
        return super().create(validated_data) 