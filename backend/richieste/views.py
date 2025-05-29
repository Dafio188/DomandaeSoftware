from rest_framework import viewsets, permissions
from .models import Richiesta
from .serializers import RichiestaSerializer

class RichiestaViewSet(viewsets.ModelViewSet):
    serializer_class = RichiestaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
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