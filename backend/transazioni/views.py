from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count
from .models import Transazione
from .serializers import TransazioneSerializer
from django.db import models

class TransazioneViewSet(viewsets.ModelViewSet):
    serializer_class = TransazioneSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Transazione.objects.none()

        if user.is_staff or user.is_superuser:
            return Transazione.objects.all()

        return Transazione.objects.filter(
            models.Q(progetto__cliente=user) | models.Q(progetto__fornitore=user)
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser], url_path='contabilita')
    def contabilita(self, request):
        qs = Transazione.objects.all()
        agg = qs.aggregate(
            transazioni=Count('id'),
            importo_totale=Sum('importo_totale'),
            importo_fornitore=Sum('importo_fornitore'),
            commissione_cliente=Sum('commissione_cliente'),
            commissione_fornitore=Sum('commissione_fornitore'),
        )
        by_state = qs.values('stato').annotate(
            count=Count('id'),
            importo_totale=Sum('importo_totale'),
            importo_fornitore=Sum('importo_fornitore'),
            commissione_cliente=Sum('commissione_cliente'),
            commissione_fornitore=Sum('commissione_fornitore'),
        ).order_by('stato')

        def n(x):
            return float(x) if x is not None else 0.0

        payload = {
            'totali': {
                'transazioni': int(agg.get('transazioni') or 0),
                'importo_totale': n(agg.get('importo_totale')),
                'importo_fornitore': n(agg.get('importo_fornitore')),
                'commissione_cliente': n(agg.get('commissione_cliente')),
                'commissione_fornitore': n(agg.get('commissione_fornitore')),
                'commissione_totale': n(agg.get('commissione_cliente')) + n(agg.get('commissione_fornitore')),
            },
            'per_stato': [
                {
                    'stato': row['stato'],
                    'count': int(row['count'] or 0),
                    'importo_totale': n(row['importo_totale']),
                    'importo_fornitore': n(row['importo_fornitore']),
                    'commissione_totale': n(row['commissione_cliente']) + n(row['commissione_fornitore']),
                }
                for row in by_state
            ],
        }
        return Response(payload)
