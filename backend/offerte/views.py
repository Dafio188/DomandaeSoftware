from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Offerta
from .serializers import OffertaSerializer
from progetti.models import Progetto
from progetti.serializers import ProgettoSerializer
import logging

logger = logging.getLogger(__name__)

class OffertaViewSet(viewsets.ModelViewSet):
    serializer_class = OffertaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """
        Filtra le offerte in base ai parametri di query e alle autorizzazioni
        """
        user = self.request.user
        queryset = Offerta.objects.all()
        
        print(f"🔍 DEBUG OFFERTE - User: {user} (ID: {user.id if user.is_authenticated else 'N/A'})")
        print(f"🔍 DEBUG OFFERTE - User ruolo: {getattr(user, 'ruolo', 'N/A')}")
        print(f"🔍 DEBUG OFFERTE - User is_staff: {user.is_staff if user.is_authenticated else 'N/A'}")
        print(f"🔍 DEBUG OFFERTE - Query params: {dict(self.request.query_params)}")
        
        # Admin può vedere tutte le offerte
        if user.is_staff or getattr(user, 'ruolo', None) == 'amministratore':
            print(f"🔍 DEBUG OFFERTE - Utente è ADMIN - vede tutto")
            # Filtri per admin
            fornitore_id = self.request.query_params.get('fornitore', None)
            cliente_id = self.request.query_params.get('cliente', None)
            
            if fornitore_id is not None:
                queryset = queryset.filter(fornitore=fornitore_id)
                print(f"🔍 DEBUG OFFERTE - Admin filtro fornitore: {fornitore_id}")
            if cliente_id is not None:
                queryset = queryset.filter(richiesta__cliente=cliente_id)
                print(f"🔍 DEBUG OFFERTE - Admin filtro cliente: {cliente_id}")
                
            result = queryset
            print(f"🔍 DEBUG OFFERTE - Admin risultato: {len(result)} offerte")
            return result
        
        # Utenti normali - filtri in base al ruolo
        if not user.is_authenticated:
            print(f"🔍 DEBUG OFFERTE - Utente non autenticato")
            return Offerta.objects.none()
            
        # Filtro per fornitore (parametro GET)
        fornitore_id = self.request.query_params.get('fornitore', None)
        if fornitore_id is not None:
            print(f"🔍 DEBUG OFFERTE - Parametro fornitore: {fornitore_id}")
            # Solo il fornitore stesso può vedere le sue offerte
            if str(user.id) == str(fornitore_id):
                result = queryset.filter(fornitore=user)
                print(f"🔍 DEBUG OFFERTE - Fornitore autorizzato, risultato: {len(result)} offerte")
                return result
            else:
                print(f"🔍 DEBUG OFFERTE - Fornitore NON autorizzato ({user.id} != {fornitore_id})")
                return Offerta.objects.none()
        
        # Filtro per cliente (parametro GET)
        cliente_id = self.request.query_params.get('cliente', None)
        if cliente_id is not None:
            print(f"🔍 DEBUG OFFERTE - Parametro cliente: {cliente_id}")
            # Solo il cliente stesso può vedere le offerte per le sue richieste
            if str(user.id) == str(cliente_id):
                result = queryset.filter(richiesta__cliente=user)
                print(f"🔍 DEBUG OFFERTE - Cliente autorizzato, risultato: {len(result)} offerte")
                return result
            else:
                print(f"🔍 DEBUG OFFERTE - Cliente NON autorizzato ({user.id} != {cliente_id})")
                return Offerta.objects.none()
        
        # Senza parametri - mostra solo le offerte relative all'utente
        print(f"🔍 DEBUG OFFERTE - Nessun parametro, controllo ruolo")
        if getattr(user, 'ruolo', None) == 'fornitore':
            # Fornitore vede solo le sue offerte
            result = queryset.filter(fornitore=user)
            print(f"🔍 DEBUG OFFERTE - Fornitore default, risultato: {len(result)} offerte")
            return result
        elif getattr(user, 'ruolo', None) == 'cliente':
            # Cliente vede solo le offerte per le sue richieste
            result = queryset.filter(richiesta__cliente=user)
            print(f"🔍 DEBUG OFFERTE - Cliente default, risultato: {len(result)} offerte")
            return result
        
        # Default: nessuna offerta visibile
        print(f"🔍 DEBUG OFFERTE - Default: nessuna offerta")
        return Offerta.objects.none()

    @action(detail=True, methods=['post'], url_path='accetta')
    def accetta_offerta(self, request, pk=None):
        offerta = self.get_object()
        user = request.user
        # Solo il cliente può assegnare il progetto
        if user != offerta.richiesta.cliente:
            return Response({'detail': 'Solo il cliente può assegnare il progetto.'}, status=status.HTTP_403_FORBIDDEN)
        if offerta.richiesta.stato != 'aperta':
            return Response({'detail': 'Richiesta già assegnata.'}, status=status.HTTP_400_BAD_REQUEST)
        # Aggiorna tutte le offerte della stessa richiesta
        offerte_collegate = Offerta.objects.filter(richiesta=offerta.richiesta)
        for o in offerte_collegate:
            if o.id == offerta.id:
                o.stato = 'accettata'
            else:
                o.stato = 'rifiutata'
            o.in_attesa_approvazione = False
            o.save()
        # Aggiorna stato richiesta
        offerta.richiesta.stato = 'in_lavorazione'
        offerta.richiesta.save()
        # Crea progetto
        progetto = Progetto.objects.create(
            richiesta=offerta.richiesta,
            offerta=offerta,
            cliente=offerta.richiesta.cliente,
            fornitore=offerta.fornitore,
            stato='in_corso'
        )
        return Response(ProgettoSerializer(progetto).data, status=status.HTTP_201_CREATED) 