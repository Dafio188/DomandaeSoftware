from rest_framework import serializers
from .models import Messaggio
from progetti.models import Progetto
from core.content_safety import mask_contact_info

class MessaggioSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    progetto = serializers.IntegerField()
    testo = serializers.CharField()
    data_invio = serializers.DateTimeField(read_only=True)
    mittente_username = serializers.CharField(read_only=True)
    mittente_ruolo = serializers.CharField(read_only=True)
    
    def validate_progetto(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        try:
            progetto = Progetto.objects.get(pk=value)
        except Progetto.DoesNotExist:
            raise serializers.ValidationError("Progetto non trovato.")

        if user and (user.is_staff or user.is_superuser):
            self._progetto = progetto
            return value

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("Autenticazione richiesta.")

        if progetto.cliente_id != user.id and progetto.fornitore_id != user.id:
            raise serializers.ValidationError("Non sei autorizzato a scrivere messaggi su questo progetto.")

        self._progetto = progetto
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if user and (user.is_staff or user.is_superuser):
            return attrs

        progetto = getattr(self, '_progetto', None)
        testo = attrs.get('testo', '')
        if progetto and not getattr(progetto, 'pagamento_cliente_ok', False):
            attrs['testo'] = mask_contact_info(testo)
        return attrs

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
