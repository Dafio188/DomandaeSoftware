from rest_framework import serializers
from .models import Offerta
from utenti.models import User
from core.content_safety import mask_contact_info

class OffertaSerializer(serializers.ModelSerializer):
    fornitore_username = serializers.CharField(source='fornitore.username', read_only=True)
    cliente_username = serializers.CharField(source='richiesta.cliente.username', read_only=True)
    richiesta_titolo = serializers.CharField(source='richiesta.titolo', read_only=True)
    richiesta_cliente = serializers.IntegerField(source='richiesta.cliente.id', read_only=True)
    richiesta_stato = serializers.CharField(source='richiesta.stato', read_only=True)
    quality_score = serializers.SerializerMethodField()
    
    class Meta:
        model = Offerta
        fields = [
            'id', 'richiesta', 'fornitore', 'descrizione', 'prezzo', 
            'data_offerta', 'stato', 'in_attesa_approvazione',
            'fornitore_username', 'cliente_username', 'richiesta_titolo',
            'richiesta_cliente', 'richiesta_stato', 'quality_score'
        ]
        extra_kwargs = {
            'fornitore': {'read_only': True},
            'stato': {'read_only': True},
            'in_attesa_approvazione': {'read_only': True},
            'data_offerta': {'read_only': True},
        }

    def validate_descrizione(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if user and (user.is_staff or user.is_superuser):
            return value
        return mask_contact_info(value)

    def get_quality_score(self, obj):
        score = 0
        u: User = obj.fornitore
        # Profilo: presenza di campi chiave
        for field in ('bio', 'competenze', 'portfolio', 'github', 'linkedin'):
            val = getattr(u, field, '')
            if isinstance(val, str) and val.strip():
                score += 2
        # Tag match: overlap tra richiesta.skill_tags e fornitore.competenze
        richiesta_tags = obj.richiesta.skill_tags or []
        comp = (u.competenze or '')
        comp_tags = [t.strip().lower() for t in comp.replace(';', ',').split(',') if t.strip()]
        overlap = len(set([t.lower() for t in richiesta_tags]) & set(comp_tags))
        score += overlap * 2
        if overlap >= 2:
            score += 2
        # Normalizza a massimo 20
        return min(score, 20)
