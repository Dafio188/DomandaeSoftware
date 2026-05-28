from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from progetti.models import Progetto
from .models import Messaggio
from .serializers import MessaggioSerializer
import logging

logger = logging.getLogger(__name__)

class MessaggioViewSet(viewsets.ModelViewSet):
    serializer_class = MessaggioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Messaggio.objects.none()
        
        # Admin può vedere tutti i messaggi per supervisione
        if user.is_staff or user.is_superuser:
            return Messaggio.objects.all()
            
        # Mostra solo i messaggi dei progetti dove l'utente è cliente o fornitore
        return Messaggio.objects.filter(
            progetto__cliente=user
        ) | Messaggio.objects.filter(
            progetto__fornitore=user
        )

    def perform_create(self, serializer):
        # Imposta il mittente come l'utente autenticato
        serializer.save() 
