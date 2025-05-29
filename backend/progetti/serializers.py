from rest_framework import serializers
from .models import Progetto, StepPersonalizzato
import logging

logger = logging.getLogger(__name__)

class StepPersonalizzatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepPersonalizzato
        fields = ['id', 'nome', 'ordine', 'completato_fornitore', 'completato_cliente', 'data_fornitore', 'data_cliente']

class ProgettoSerializer(serializers.ModelSerializer):
    richiesta_titolo = serializers.CharField(source='richiesta.titolo', read_only=True)
    richiesta_tipo_software = serializers.CharField(source='richiesta.tipo_software', read_only=True)
    step_personalizzati = StepPersonalizzatoSerializer(many=True, read_only=True)
    
    # Campi dell'offerta per i calcoli di pagamento - CON GESTIONE ERRORI
    offerta_prezzo = serializers.SerializerMethodField()
    offerta_descrizione = serializers.SerializerMethodField()
    offerta_fornitore_username = serializers.SerializerMethodField()
    
    # Campi leggibili per l'archiviazione
    archiviato_da_username = serializers.CharField(source='archiviato_da.username', read_only=True)
    cliente_username = serializers.CharField(source='cliente.username', read_only=True)
    fornitore_username = serializers.CharField(source='fornitore.username', read_only=True)
    puo_essere_archiviato = serializers.ReadOnlyField()
    
    def get_offerta_prezzo(self, obj):
        """Gestisce il caso in cui l'offerta non esiste"""
        try:
            logger.info(f"🔍 DEBUG Progetto {obj.id}: Offerta esiste: {obj.offerta is not None}")
            if obj.offerta:
                logger.info(f"💰 DEBUG Progetto {obj.id}: Prezzo offerta: {obj.offerta.prezzo}")
                return float(obj.offerta.prezzo)
            else:
                logger.warning(f"⚠️ DEBUG Progetto {obj.id}: Nessuna offerta collegata!")
                return None
        except AttributeError as e:
            logger.error(f"❌ DEBUG Progetto {obj.id}: Errore AttributeError: {e}")
            return None
        except Exception as e:
            logger.error(f"❌ DEBUG Progetto {obj.id}: Errore generico: {e}")
            return None
    
    def get_offerta_descrizione(self, obj):
        """Gestisce il caso in cui l'offerta non esiste"""
        try:
            return obj.offerta.descrizione if obj.offerta else None
        except AttributeError:
            return None
    
    def get_offerta_fornitore_username(self, obj):
        """Gestisce il caso in cui l'offerta non esiste"""
        try:
            return obj.offerta.fornitore.username if obj.offerta else None
        except AttributeError:
            return None
    
    class Meta:
        model = Progetto
        fields = '__all__'
        extra_fields = [
            'richiesta_titolo',
            'richiesta_tipo_software', 
            'step_personalizzati',
            'offerta_prezzo',
            'offerta_descrizione',
            'offerta_fornitore_username',
            'archiviato_da_username',
            'cliente_username',
            'fornitore_username',
            'puo_essere_archiviato'
        ] 