from rest_framework import serializers
from .models import Richiesta
from core.content_safety import mask_contact_info


class SkillTagsField(serializers.Field):
    def to_internal_value(self, data):
        if data is None or data == '':
            return []
        if isinstance(data, list):
            raw = data
        elif isinstance(data, str):
            raw = [p for p in data.replace(';', ',').split(',')]
        else:
            raise serializers.ValidationError('Formato skill_tags non valido.')

        tags = []
        for item in raw:
            if not isinstance(item, str):
                continue
            v = item.strip().lower()
            if not v:
                continue
            if len(v) > 30:
                raise serializers.ValidationError('Ogni tag deve essere lungo massimo 30 caratteri.')
            tags.append(v)

        tags = list(dict.fromkeys(tags))[:10]
        return tags

    def to_representation(self, value):
        return value or []

class RichiestaPublicSerializer(serializers.ModelSerializer):
    skill_tags = SkillTagsField(required=False)
    class Meta:
        model = Richiesta
        fields = [
            'id',
            'titolo',
            'tipo_software',
            'descrizione',
            'budget',
            'immagine',
            'data_pubblicazione',
            'stato',
            'is_prodotto_acquistato',
            'skill_tags',
        ]

class RichiestaSerializer(serializers.ModelSerializer):
    cliente_username = serializers.CharField(source='cliente.username', read_only=True)
    skill_tags = SkillTagsField(required=False)

    def validate_descrizione(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if user and (user.is_staff or user.is_superuser):
            return value
        return mask_contact_info(value)
    
    class Meta:
        model = Richiesta
        fields = [
            'id', 'titolo', 'tipo_software', 'descrizione', 'budget', 
            'immagine', 'data_pubblicazione', 'stato', 'is_prodotto_acquistato',
            'cliente', 'cliente_username', 'skill_tags'
        ]
        read_only_fields = ['cliente', 'data_pubblicazione', 'stato'] 
