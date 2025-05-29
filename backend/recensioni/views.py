from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework import serializers
from django.db import models
from .models import Recensione
from .serializers import RecensioneSerializer
from progetti.models import Progetto

class RecensioneViewSet(viewsets.ModelViewSet):
    serializer_class = RecensioneSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Mostra solo le recensioni relative ai progetti dell'utente"""
        user = self.request.user
        if user.is_staff:
            return Recensione.objects.all()
        
        # Mostra recensioni dove l'utente è autore o destinatario
        return Recensione.objects.filter(
            models.Q(autore=user) | models.Q(destinatario=user)
        ).select_related('autore', 'destinatario', 'progetto')
    
    def perform_create(self, serializer):
        """Validazioni aggiuntive prima della creazione"""
        progetto_id = serializer.validated_data['progetto'].id
        user = self.request.user
        
        # Verifica che il progetto sia completato
        progetto = Progetto.objects.get(id=progetto_id)
        if progetto.stato != 'completato':
            raise serializers.ValidationError({
                'detail': 'Puoi recensire solo progetti completati'
            })
        
        # Verifica che l'utente sia parte del progetto
        if user != progetto.cliente and user != progetto.fornitore:
            raise serializers.ValidationError({
                'detail': 'Puoi recensire solo i tuoi progetti'
            })
        
        # Verifica che non esista già una recensione dello stesso autore per questo progetto
        if Recensione.objects.filter(progetto=progetto, autore=user).exists():
            raise serializers.ValidationError({
                'detail': 'Hai già lasciato una recensione per questo progetto'
            })
        
        serializer.save() 