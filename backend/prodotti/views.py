from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from .models import ProdottoPronto
from .serializers import ProdottoProntoSerializer
from progetti.models import Progetto
from richieste.models import Richiesta
from offerte.models import Offerta
from progetti.serializers import ProgettoSerializer
import logging
from django.conf import settings
from core.audit import write_audit_event

logger = logging.getLogger(__name__)

class ProdottoProntoViewSet(viewsets.ModelViewSet):
    queryset = ProdottoPronto.objects.all().order_by('-data_pubblicazione')
    serializer_class = ProdottoProntoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _assert_can_modify(self, request, prodotto: ProdottoPronto):
        user = request.user
        if not user.is_authenticated:
            raise PermissionDenied("Autenticazione richiesta.")
        if user.is_staff or user.is_superuser:
            return
        if getattr(user, 'ruolo', None) != 'fornitore':
            raise PermissionDenied("Solo i fornitori possono modificare i prodotti.")
        if prodotto.fornitore_id != user.id:
            raise PermissionDenied("Non sei autorizzato a modificare questo prodotto.")

    def perform_create(self, serializer):
        serializer.save(fornitore=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            logger.info(
                "Create prodotto: user_id=%s ruolo=%s keys=%s",
                getattr(request.user, 'id', None),
                getattr(request.user, 'ruolo', None),
                list(request.data.keys()),
            )
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Errore di validazione: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Errore imprevisto create prodotto")
            if settings.DEBUG:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"detail": "Errore interno del server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        return ProdottoPronto.objects.all().order_by('-data_pubblicazione')

    def update(self, request, *args, **kwargs):
        prodotto = self.get_object()
        self._assert_can_modify(request, prodotto)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        prodotto = self.get_object()
        self._assert_can_modify(request, prodotto)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        prodotto = self.get_object()
        self._assert_can_modify(request, prodotto)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='acquista')
    def acquista_prodotto(self, request, pk=None):
        """
        Endpoint per l'acquisto di un prodotto da parte di un cliente.
        Crea automaticamente un progetto inverso (fornitore → cliente).
        """
        try:
            # Verifica che l'utente sia un cliente
            if request.user.ruolo != 'cliente':
                return Response(
                    {'detail': 'Solo i clienti possono acquistare prodotti.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            # Ottieni il prodotto
            prodotto = self.get_object()
            
            # Verifica che il cliente non stia acquistando il proprio prodotto
            if prodotto.fornitore == request.user:
                return Response(
                    {'detail': 'Non puoi acquistare i tuoi stessi prodotti.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Crea una richiesta fittizia per il prodotto acquistato
            richiesta = Richiesta.objects.create(
                cliente=request.user,
                titolo=f"🛒 Acquisto: {prodotto.titolo}",
                descrizione=f"PRODOTTO ACQUISTATO\n"
                           f"━━━━━━━━━━━━━━━━━━━━━\n"
                           f"🎯 Prodotto: {prodotto.titolo}\n"
                           f"👨‍💻 Fornitore: {prodotto.fornitore.username}\n"
                           f"💰 Prezzo: €{prodotto.prezzo}\n\n"
                           f"📋 Descrizione originale:\n{prodotto.descrizione}\n\n"
                           f"📦 Questo è un progetto di consegna prodotto già sviluppato.",
                budget=float(prodotto.prezzo),
                tipo_software='altro',  # Default per prodotti acquistati
                stato='in_lavorazione',  # Direttamente in lavorazione
                immagine=prodotto.immagine,
                is_prodotto_acquistato=True,
            )

            # Crea il progetto inverso direttamente (senza offerta)
            # Temporaneamente creo una offerta fittizia per mantenere compatibilità
            offerta_fittizia = Offerta.objects.create(
                richiesta=richiesta,
                fornitore=prodotto.fornitore,
                descrizione=f"Vendita prodotto: {prodotto.titolo}",
                prezzo=float(prodotto.prezzo),
                stato='accettata'
            )

            progetto = Progetto.objects.create(
                richiesta=richiesta,
                offerta=offerta_fittizia,
                cliente=request.user,
                fornitore=prodotto.fornitore,
                stato='bozza',
                bozza_fornitore_ok=True,  # Il prodotto è già pronto
                tipo_progetto='prodotto_acquistato',
            )

            logger.info(f"Progetto creato per acquisto prodotto: {progetto.id}")

            write_audit_event(
                action='prodotto.purchased',
                request=request,
                actor=request.user,
                target_model='prodotti.ProdottoPronto',
                target_id=prodotto.id,
                progetto=progetto,
                meta={'prezzo': str(prodotto.prezzo)},
            )
            write_audit_event(
                action='progetto.created',
                request=request,
                actor=request.user,
                target_model='progetti.Progetto',
                target_id=progetto.id,
                progetto=progetto,
                meta={'tipo_progetto': progetto.tipo_progetto},
            )

            return Response({
                'success': True,
                'message': f'🎉 Prodotto "{prodotto.titolo}" acquistato con successo!',
                'progetto_id': progetto.id,
                'progetto': ProgettoSerializer(progetto).data,
                'richiesta_id': richiesta.id,
                'redirect_url': f'/progetto/{progetto.id}',
                'prodotto': ProdottoProntoSerializer(prodotto).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Errore nell'acquisto prodotto")
            return Response(
                {'success': False, 'detail': 'Errore durante l\'acquisto'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
