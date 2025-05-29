from rest_framework import serializers
from .models import Richiesta

class RichiestaSerializer(serializers.ModelSerializer):
    cliente_username = serializers.CharField(source='cliente.username', read_only=True)
    class Meta:
        model = Richiesta
        fields = '__all__' 