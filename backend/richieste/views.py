from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Richiesta
from .serializers import RichiestaSerializer, RichiestaPublicSerializer
import logging
from django.conf import settings
from django.db.models import Q

logger = logging.getLogger(__name__)

class RichiestaViewSet(viewsets.ModelViewSet):
    serializer_class = RichiestaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _assert_can_modify(self, request, richiesta: Richiesta):
        user = request.user
        if not user.is_authenticated:
            raise PermissionDenied("Autenticazione richiesta.")
        if user.is_staff or user.is_superuser:
            return
        if richiesta.cliente_id != user.id:
            raise PermissionDenied("Non sei autorizzato a modificare questa richiesta.")
        if richiesta.stato != 'aperta':
            raise PermissionDenied("Non è possibile modificare una richiesta già in lavorazione o chiusa.")

    def get_serializer_class(self):
        user = self.request.user
        if self.action in ['list', 'retrieve']:
            if not user.is_authenticated or getattr(user, 'ruolo', None) == 'fornitore':
                return RichiestaPublicSerializer
        return RichiestaSerializer
    
    def perform_create(self, serializer):
        """Imposta automaticamente il cliente dalla richiesta autenticata"""
        serializer.save(cliente=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Override create per logging dettagliato"""
        try:
            logger.info(
                "Tentativo creazione richiesta: user_id=%s ruolo=%s keys=%s",
                getattr(request.user, 'id', None),
                getattr(request.user, 'ruolo', None),
                list(request.data.keys()),
            )
            
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Errore di validazione: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            self.perform_create(serializer)
            logger.info(f"Richiesta creata con successo: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Errore imprevisto nella creazione richiesta")
            if settings.DEBUG:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"detail": "Errore interno del server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_queryset(self):
        """
        Filtra le richieste in base al ruolo dell'utente:
        - PUBBLICO (non autenticato): vede richieste APERTE per homepage
        - Cliente: vede SOLO le sue richieste
        - Fornitore: vede SOLO le richieste aperte (fino ad accettazione)
        - Admin: vede tutto
        """
        user = self.request.user
        tag = self.request.query_params.get('tag') or ''
        tags = self.request.query_params.get('tags') or ''
        search = self.request.query_params.get('search') or ''
        
        # PUBBLICO (homepage): può vedere richieste aperte per mostrare esempi
        if not user.is_authenticated:
            qs = Richiesta.objects.filter(stato='aperta')
            if search:
                qs = qs.filter(
                    Q(titolo__icontains=search)
                    | Q(descrizione__icontains=search)
                    | Q(skill_tags_search__icontains=search)
                )
            if tag:
                qs = qs.filter(skill_tags_search__icontains=tag.strip().lower())
            if tags:
                parts = [p.strip().lower() for p in tags.split(',') if p.strip()]
                for p in parts[:10]:
                    qs = qs.filter(skill_tags_search__icontains=p)
            return qs
        
        # Admin può vedere tutte le richieste
        if user.is_staff or user.is_superuser:
            qs = Richiesta.objects.all()
            if search:
                qs = qs.filter(
                    Q(titolo__icontains=search)
                    | Q(descrizione__icontains=search)
                    | Q(skill_tags_search__icontains=search)
                )
            if tag:
                qs = qs.filter(skill_tags_search__icontains=tag.strip().lower())
            if tags:
                parts = [p.strip().lower() for p in tags.split(',') if p.strip()]
                for p in parts[:10]:
                    qs = qs.filter(skill_tags_search__icontains=p)
            return qs
        
        # Cliente vede SOLO le sue richieste
        if getattr(user, 'ruolo', None) == 'cliente':
            qs = Richiesta.objects.filter(cliente=user)
            if search:
                qs = qs.filter(
                    Q(titolo__icontains=search)
                    | Q(descrizione__icontains=search)
                    | Q(skill_tags_search__icontains=search)
                )
            if tag:
                qs = qs.filter(skill_tags_search__icontains=tag.strip().lower())
            if tags:
                parts = [p.strip().lower() for p in tags.split(',') if p.strip()]
                for p in parts[:10]:
                    qs = qs.filter(skill_tags_search__icontains=p)
            return qs
        
        # Fornitore vede SOLO le richieste APERTE (non ancora assegnate)
        if getattr(user, 'ruolo', None) == 'fornitore':
            qs = Richiesta.objects.filter(stato='aperta')
            if search:
                qs = qs.filter(
                    Q(titolo__icontains=search)
                    | Q(descrizione__icontains=search)
                    | Q(skill_tags_search__icontains=search)
                )
            if tag:
                qs = qs.filter(skill_tags_search__icontains=tag.strip().lower())
            if tags:
                parts = [p.strip().lower() for p in tags.split(',') if p.strip()]
                for p in parts[:10]:
                    qs = qs.filter(skill_tags_search__icontains=p)
            return qs
        
        # Default: richieste aperte (fallback sicuro)
        qs = Richiesta.objects.filter(stato='aperta')
        if search:
            qs = qs.filter(
                Q(titolo__icontains=search)
                | Q(descrizione__icontains=search)
                | Q(skill_tags_search__icontains=search)
            )
        if tag:
            qs = qs.filter(skill_tags_search__icontains=tag.strip().lower())
        if tags:
            parts = [p.strip().lower() for p in tags.split(',') if p.strip()]
            for p in parts[:10]:
                qs = qs.filter(skill_tags_search__icontains=p)
        return qs

    def update(self, request, *args, **kwargs):
        richiesta = self.get_object()
        self._assert_can_modify(request, richiesta)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        richiesta = self.get_object()
        self._assert_can_modify(request, richiesta)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        richiesta = self.get_object()
        self._assert_can_modify(request, richiesta)
        return super().destroy(request, *args, **kwargs)
