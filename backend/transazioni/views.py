from rest_framework import viewsets, permissions
from .models import Transazione
from .serializers import TransazioneSerializer

class TransazioneViewSet(viewsets.ModelViewSet):
    queryset = Transazione.objects.all()
    serializer_class = TransazioneSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 