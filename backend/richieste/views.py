from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Richiesta
from .serializers import RichiestaSerializer
import logging

logger = logging.getLogger(__name__)

class RichiestaViewSet(viewsets.ModelViewSet):
    serializer_class = RichiestaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        """Imposta automaticamente il cliente dalla richiesta autenticata"""
        serializer.save(cliente=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Override create per logging dettagliato"""
        try:
            logger.info(f"Tentativo di creazione richiesta con dati: {request.data}")
            logger.info(f"Utente autenticato: {request.user}")
            logger.info(f"Ruolo utente: {getattr(request.user, 'ruolo', 'Non definito')}")
            
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Errore di validazione: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            self.perform_create(serializer)
            logger.info(f"Richiesta creata con successo: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Errore imprevisto nella creazione richiesta: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_queryset(self):
        """
        Filtra le richieste in base al ruolo dell'utente:
        - PUBBLICO (non autenticato): vede richieste APERTE per homepage
        - Cliente: vede SOLO le sue richieste
        - Fornitore: vede SOLO le richieste aperte (fino ad accettazione)
        - Admin: vede tutto
        """
        user = self.request.user
        
        # PUBBLICO (homepage): può vedere richieste aperte per mostrare esempi
        if not user.is_authenticated:
            return Richiesta.objects.filter(stato='aperta')
        
        # Admin può vedere tutte le richieste
        if user.is_staff or getattr(user, 'ruolo', None) == 'amministratore':
            return Richiesta.objects.all()
        
        # Cliente vede SOLO le sue richieste
        if getattr(user, 'ruolo', None) == 'cliente':
            return Richiesta.objects.filter(cliente=user)
        
        # Fornitore vede SOLO le richieste APERTE (non ancora assegnate)
        if getattr(user, 'ruolo', None) == 'fornitore':
            return Richiesta.objects.filter(stato='aperta')
        
        # Default: richieste aperte (fallback sicuro)
        return Richiesta.objects.filter(stato='aperta') 