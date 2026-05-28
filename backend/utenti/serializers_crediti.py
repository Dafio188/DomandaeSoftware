from rest_framework import serializers
from .models import CreditoRicarica


class CreditoRicaricaSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    confirmed_by_username = serializers.CharField(source='confirmed_by.username', read_only=True)
    ricevuta_url = serializers.SerializerMethodField()

    def get_ricevuta_url(self, obj):
        if not getattr(obj, 'ricevuta', None):
            return ''
        try:
            request = self.context.get('request')
            url = obj.ricevuta.url
            if request:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            return ''

    class Meta:
        model = CreditoRicarica
        fields = [
            'id',
            'user',
            'username',
            'crediti',
            'prezzo',
            'stato',
            'causale',
            'ricevuta_url',
            'created_at',
            'confirmed_at',
            'confirmed_by',
            'confirmed_by_username',
        ]
        read_only_fields = [
            'id',
            'user',
            'username',
            'stato',
            'causale',
            'created_at',
            'confirmed_at',
            'confirmed_by',
            'confirmed_by_username',
        ]
