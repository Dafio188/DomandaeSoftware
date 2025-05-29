from rest_framework import serializers
from .models import Offerta

class OffertaSerializer(serializers.ModelSerializer):
    fornitore_username = serializers.CharField(source='fornitore.username', read_only=True)
    cliente_username = serializers.CharField(source='richiesta.cliente.username', read_only=True)
    richiesta_titolo = serializers.CharField(source='richiesta.titolo', read_only=True)
    richiesta_cliente = serializers.IntegerField(source='richiesta.cliente.id', read_only=True)
    richiesta_stato = serializers.CharField(source='richiesta.stato', read_only=True)
    
    class Meta:
        model = Offerta
        fields = [
            'id', 'richiesta', 'fornitore', 'descrizione', 'prezzo', 
            'data_offerta', 'stato', 'in_attesa_approvazione',
            'fornitore_username', 'cliente_username', 'richiesta_titolo',
            'richiesta_cliente', 'richiesta_stato'
        ] 