from rest_framework import serializers
from .models import Notifica

class NotificaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifica
        fields = ['id', 'user', 'titolo', 'messaggio', 'letta', 'data_creazione', 'link', 'tipo']
        read_only_fields = ['id', 'user', 'data_creazione']
