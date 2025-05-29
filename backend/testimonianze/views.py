from rest_framework import viewsets, permissions
from .models import Testimonianza
from .serializers import TestimonianzaSerializer
import logging

logger = logging.getLogger(__name__)

class TestimonianzaViewSet(viewsets.ModelViewSet):
    """
    API endpoint per gestire le testimonianze/ringraziamenti.
    - GET: tutti possono vedere le testimonianze attive
    - POST/PUT/DELETE: solo staff e admin possono modificare
    """
    queryset = Testimonianza.objects.all()
    serializer_class = TestimonianzaSerializer
    
    def get_permissions(self):
        """
        - Per le operazioni di lettura (list, retrieve), permetti accesso a tutti
        - Per le operazioni di scrittura (create, update, delete), solo admin/staff
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Gli utenti non-admin vedono solo le testimonianze attive.
        Gli admin vedono tutte le testimonianze.
        """
        if self.request.user.is_staff:
            qs = Testimonianza.objects.all()
            logger.info(f"Admin: Testimonianze visibili: {qs.count()}")
            return qs
        
        qs = Testimonianza.objects.filter(attivo=True)
        logger.info(f"Utente normale: Testimonianze attive visibili: {qs.count()}")
        return qs
        
    def list(self, request, *args, **kwargs):
        logger.info(f"Richiesta list testimonianze da: {request.user} (autenticato: {request.user.is_authenticated})")
        response = super().list(request, *args, **kwargs)
        logger.info(f"Risposta: {len(response.data)} testimonianze")
        return response 