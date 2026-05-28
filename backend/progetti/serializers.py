from rest_framework import serializers
from .models import Progetto, StepPersonalizzato

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
    pagamento_cliente_ricevuta = serializers.SerializerMethodField()
    bonifico_fornitore_ricevuta = serializers.SerializerMethodField()
    fornitore_iban = serializers.SerializerMethodField()
    fornitore_iban_intestatario = serializers.SerializerMethodField()
    importo_atteso_cliente = serializers.SerializerMethodField()
    importo_atteso_fornitore = serializers.SerializerMethodField()
    margine_piattaforma_atteso = serializers.SerializerMethodField()
    transazione_summary = serializers.SerializerMethodField()
    
    # Campi leggibili per l'archiviazione
    archiviato_da_username = serializers.CharField(source='archiviato_da.username', read_only=True)
    cliente_username = serializers.CharField(source='cliente.username', read_only=True)
    fornitore_username = serializers.CharField(source='fornitore.username', read_only=True)
    puo_essere_archiviato = serializers.ReadOnlyField()
    
    def get_offerta_prezzo(self, obj):
        try:
            if obj.offerta:
                return float(obj.offerta.prezzo)
            return None
        except AttributeError:
            return None

    def _fee_context(self):
        from django.conf import settings
        fee_rate = getattr(settings, 'SOFTMATCH_PLATFORM_FEE_RATE', 0.05)
        fee_mode = getattr(settings, 'SOFTMATCH_PLATFORM_FEE_MODE', 'cliente')
        return fee_rate, fee_mode

    def _compute_amounts(self, obj):
        price = self.get_offerta_prezzo(obj)
        if price is None:
            return None, None, None
        fee_rate, fee_mode = self._fee_context()
        fee = round(float(price) * float(fee_rate), 2)
        if fee_mode == 'fornitore':
            return round(float(price), 2), round(float(price) - fee, 2), fee
        if fee_mode == 'split':
            half = round(fee / 2, 2)
            return round(float(price) + half, 2), round(float(price) - half, 2), fee
        return round(float(price) + fee, 2), round(float(price), 2), fee

    def get_importo_atteso_cliente(self, obj):
        a, _, _ = self._compute_amounts(obj)
        return a

    def get_importo_atteso_fornitore(self, obj):
        _, b, _ = self._compute_amounts(obj)
        return b

    def get_margine_piattaforma_atteso(self, obj):
        _, _, m = self._compute_amounts(obj)
        return m

    def _is_staff(self):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        return bool(user and (user.is_staff or user.is_superuser))

    def get_fornitore_iban(self, obj):
        if not self._is_staff():
            return ''
        try:
            return getattr(obj.fornitore, 'iban', '') or ''
        except Exception:
            return ''

    def get_fornitore_iban_intestatario(self, obj):
        if not self._is_staff():
            return ''
        try:
            return getattr(obj.fornitore, 'iban_intestatario', '') or ''
        except Exception:
            return ''

    def get_transazione_summary(self, obj):
        if not self._is_staff():
            return None
        try:
            t = obj.transazioni.order_by('-data_transazione').first()
            if not t:
                return None
            return {
                'id': t.id,
                'stato': t.stato,
                'importo_totale': float(t.importo_totale),
                'importo_fornitore': float(t.importo_fornitore),
                'commissione_totale': float(t.commissione_cliente) + float(t.commissione_fornitore),
                'data_transazione': t.data_transazione.isoformat(),
            }
        except Exception:
            return None

    def get_pagamento_cliente_ricevuta(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if not user or not user.is_authenticated:
            return ''
        if user.is_staff or user.is_superuser or user.id == getattr(obj, 'cliente_id', None):
            f = getattr(obj, 'pagamento_cliente_ricevuta', None)
            if not f:
                return ''
            try:
                url = f.url
                if request:
                    return request.build_absolute_uri(url)
                return url
            except Exception:
                return ''
        return ''

    def get_bonifico_fornitore_ricevuta(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if not user or not user.is_authenticated:
            return ''
        if user.is_staff or user.is_superuser or user.id == getattr(obj, 'fornitore_id', None):
            f = getattr(obj, 'bonifico_fornitore_ricevuta', None)
            if not f:
                return ''
            try:
                url = f.url
                if request:
                    return request.build_absolute_uri(url)
                return url
            except Exception:
                return ''
        return ''
    
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
