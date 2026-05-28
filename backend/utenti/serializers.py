from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'ruolo',
            'stato',
            'data_registrazione',
            'telefono',
            'bio',
            'competenze',
            'linkedin',
            'github',
            'portfolio',
            'newsletter',
            'crediti',
            'iban',
            'iban_intestatario',
            'password',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'ruolo': {'read_only': True},
            'stato': {'read_only': True},
            'data_registrazione': {'read_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # Pop dei campi che non devono essere passati direttamente
        validated_data.pop('ruolo', None)
        validated_data.pop('stato', None)
        
        # Estrai il ruolo dai dati grezzi
        request = self.context.get('request')
        ruolo = request.data.get('ruolo', 'cliente') if request else 'cliente'
        
        # Usa il metodo nativo di Django che gestisce correttamente hashing e unicità
        try:
            user = User.objects.create_user(
                password=password, 
                ruolo=ruolo, 
                **validated_data
            )
            return user
        except Exception as e:
            # Se fallisce qui, restituiamo l'errore originale del DB
            raise serializers.ValidationError({"detail": str(e)}) 

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('ruolo', None)
        validated_data.pop('stato', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
