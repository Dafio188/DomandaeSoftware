from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
from django.db.models import Q
from django.db import transaction
from .models import Offerta
from .serializers import OffertaSerializer
from progetti.models import Progetto
from progetti.serializers import ProgettoSerializer
import logging
from core.audit import write_audit_event
from utenti.models import User, CreditoMovimento

logger = logging.getLogger(__name__)

class OffertaViewSet(viewsets.ModelViewSet):
    serializer_class = OffertaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _assert_can_modify(self, request, offerta: Offerta):
        user = request.user
        if not user.is_authenticated:
            raise PermissionDenied("Autenticazione richiesta.")
        if user.is_staff or user.is_superuser:
            return
        if offerta.fornitore_id != user.id:
            raise PermissionDenied("Non sei autorizzato a modificare questa offerta.")
        if offerta.stato != 'inviata':
            raise PermissionDenied("Non è possibile modificare un'offerta già processata.")
    
    def get_queryset(self):
        """
        Filtra le offerte in base ai parametri di query e alle autorizzazioni
        """
        user = self.request.user
        queryset = Offerta.objects.select_related('richiesta', 'fornitore')
        
        # Admin può vedere tutte le offerte
        if user.is_staff or user.is_superuser:
            # Filtri per admin
            fornitore_id = self.request.query_params.get('fornitore', None)
            cliente_id = self.request.query_params.get('cliente', None)
            
            if fornitore_id is not None:
                queryset = queryset.filter(fornitore=fornitore_id)
            if cliente_id is not None:
                queryset = queryset.filter(richiesta__cliente=cliente_id)
            order = self.request.query_params.get('order')
            if order == 'prezzo_asc':
                queryset = queryset.order_by('prezzo')
            elif order == 'prezzo_desc':
                queryset = queryset.order_by('-prezzo')
            return queryset
        
        # Utenti normali - filtri in base al ruolo
        if not user.is_authenticated:
            return Offerta.objects.none()
            
        # Filtro per fornitore (parametro GET)
        fornitore_id = self.request.query_params.get('fornitore', None)
        if fornitore_id is not None:
            # Solo il fornitore stesso può vedere le sue offerte
            if str(user.id) == str(fornitore_id):
                queryset = queryset.filter(fornitore=user)
                order = self.request.query_params.get('order')
                if order == 'prezzo_asc':
                    queryset = queryset.order_by('prezzo')
                elif order == 'prezzo_desc':
                    queryset = queryset.order_by('-prezzo')
                return queryset
            return Offerta.objects.none()
        
        # Filtro per cliente (parametro GET)
        cliente_id = self.request.query_params.get('cliente', None)
        if cliente_id is not None:
            # Solo il cliente stesso può vedere le offerte per le sue richieste
            if str(user.id) == str(cliente_id):
                queryset = queryset.filter(richiesta__cliente=user)
                order = self.request.query_params.get('order')
                if order == 'prezzo_asc':
                    queryset = queryset.order_by('prezzo')
                elif order == 'prezzo_desc':
                    queryset = queryset.order_by('-prezzo')
                return queryset
            return Offerta.objects.none()
        
        # Senza parametri - mostra solo le offerte relative all'utente
        if getattr(user, 'ruolo', None) == 'fornitore':
            # Fornitore vede solo le sue offerte
            queryset = queryset.filter(fornitore=user)
            order = self.request.query_params.get('order')
            if order == 'prezzo_asc':
                queryset = queryset.order_by('prezzo')
            elif order == 'prezzo_desc':
                queryset = queryset.order_by('-prezzo')
            return queryset
        elif getattr(user, 'ruolo', None) == 'cliente':
            # Cliente vede solo le offerte per le sue richieste
            queryset = queryset.filter(richiesta__cliente=user)
            order = self.request.query_params.get('order')
            if order == 'prezzo_asc':
                queryset = queryset.order_by('prezzo')
            elif order == 'prezzo_desc':
                queryset = queryset.order_by('-prezzo')
            return queryset
        
        # Default: nessuna offerta visibile
        return Offerta.objects.none()

    def list(self, request, *args, **kwargs):
        order = request.query_params.get('order')
        if order == 'quality':
            qs = self.get_queryset()
            items = list(qs)
            def score(o):
                try:
                    s = OffertaSerializer(o).data.get('quality_score') or 0
                    return int(s)
                except Exception:
                    return 0
            items.sort(key=score, reverse=True)
            serializer = self.get_serializer(items, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            raise PermissionDenied("Autenticazione richiesta.")

        is_staff = user.is_staff or user.is_superuser
        if not is_staff and getattr(user, 'ruolo', None) != 'fornitore':
            raise PermissionDenied("Solo i fornitori possono inviare offerte.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        richiesta = serializer.validated_data['richiesta']

        if richiesta.stato != 'aperta':
            return Response({'detail': 'La richiesta non è più aperta.'}, status=status.HTTP_400_BAD_REQUEST)

        if not is_staff:
            max_offerte = getattr(settings, 'SOFTMATCH_MAX_OFFERTE_PER_RICHIESTA', 10)
            if Offerta.objects.filter(richiesta=richiesta).count() >= max_offerte:
                return Response({'detail': 'Limite massimo di offerte raggiunto per questa richiesta.'}, status=status.HTTP_400_BAD_REQUEST)
            if Offerta.objects.filter(richiesta=richiesta, fornitore=user).exists():
                return Response({'detail': 'Hai già inviato un’offerta per questa richiesta.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            locked_user = User.objects.select_for_update().get(pk=user.pk)
            if not is_staff:
                cost = getattr(settings, 'SOFTMATCH_OFFERTA_CREDIT_COST', 1)
                if locked_user.crediti < cost:
                    return Response({'detail': 'Crediti insufficienti per inviare un’offerta.'}, status=status.HTTP_400_BAD_REQUEST)
                locked_user.crediti = locked_user.crediti - cost
                locked_user.save(update_fields=['crediti'])
                CreditoMovimento.objects.create(
                    user=locked_user,
                    delta=-cost,
                    reason='offerta.create',
                    meta={'richiesta_id': richiesta.id},
                )
                
                # Notifica al fornitore (detrazione crediti)
                from core.models import Notifica
                Notifica.objects.create(
                    user=locked_user,
                    titolo='Crediti Utilizzati 🎫',
                    messaggio=f'Hai utilizzato {cost} crediti per inviare l\'offerta per "{richiesta.titolo}".',
                    tipo='info'
                )

            offerta = serializer.save(fornitore=locked_user)

            # Notifica al cliente
            from core.models import Notifica
            Notifica.objects.create(
                user=richiesta.cliente,
                titolo='Nuova Offerta Ricevuta! 📩',
                messaggio=f'Il fornitore {locked_user.username} ha inviato una proposta per la tua richiesta "{richiesta.titolo}".',
                link=f'/dashboard-cliente', # O un link specifico se esiste
                tipo='success'
            )

        write_audit_event(
            action='offerta.created',
            request=request,
            actor=user,
            target_model='offerte.Offerta',
            target_id=offerta.id,
            meta={'richiesta_id': offerta.richiesta_id, 'prezzo': str(offerta.prezzo)},
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
            stato='bozza',
            tipo_progetto='richiesta_classica',
        )

        # Notifica al fornitore
        from core.models import Notifica
        Notifica.objects.create(
            user=offerta.fornitore,
            titolo='Offerta Accettata! 🎉',
            messaggio=f'Complimenti! Il cliente {user.username} ha accettato la tua proposta per "{offerta.richiesta.titolo}".',
            link=f'/progetto/{progetto.id}',
            tipo='success'
        )

        write_audit_event(
            action='offerta.accepted',
            request=request,
            actor=user,
            target_model='offerte.Offerta',
            target_id=offerta.id,
            progetto=progetto,
            meta={'richiesta_id': offerta.richiesta_id, 'prezzo': str(offerta.prezzo)},
        )
        write_audit_event(
            action='progetto.created',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
            meta={'tipo_progetto': progetto.tipo_progetto},
        )
        return Response(ProgettoSerializer(progetto).data, status=status.HTTP_201_CREATED) 

    def update(self, request, *args, **kwargs):
        offerta = self.get_object()
        self._assert_can_modify(request, offerta)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        offerta = self.get_object()
        self._assert_can_modify(request, offerta)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        offerta = self.get_object()
        self._assert_can_modify(request, offerta)
        return super().destroy(request, *args, **kwargs)
