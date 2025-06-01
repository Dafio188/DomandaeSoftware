from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q, Count, F, Sum
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from .models import (
    FAQCategory, FAQ, FAQComment, FAQCommentReply, 
    FAQHelpfulVote, FAQCommentLike
)
from .serializers import (
    FAQCategorySerializer, FAQSerializer, FAQListSerializer,
    FAQCommentSerializer, FAQCommentCreateSerializer,
    FAQCommentReplyCreateSerializer, FAQSearchSerializer,
    FAQStatsSerializer
)

User = get_user_model()

class FAQCategoryListView(generics.ListAPIView):
    """Lista delle categorie FAQ"""
    queryset = FAQCategory.objects.filter(is_active=True)
    serializer_class = FAQCategorySerializer
    permission_classes = [permissions.AllowAny]

class FAQListView(generics.ListAPIView):
    """Lista delle FAQ con filtri e ricerca"""
    serializer_class = FAQListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = FAQ.objects.filter(is_active=True).select_related('category')
        
        # Filtro per categoria
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category__slug=category)
        
        # Ricerca nel testo
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(question__icontains=search) | 
                Q(answer__icontains=search)
            )
        
        # Ordinamento
        sort_by = self.request.query_params.get('sort_by', 'order')
        if sort_by == 'views':
            queryset = queryset.order_by('-views_count')
        elif sort_by == 'helpful':
            queryset = queryset.order_by('-helpful_count')
        elif sort_by == 'recent':
            queryset = queryset.order_by('-created_at')
        else:
            queryset = queryset.order_by('category__order', 'order')
        
        return queryset

class FAQDetailView(generics.RetrieveAPIView):
    """Dettaglio di una FAQ con commenti"""
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrementa il contatore delle visualizzazioni
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class FAQCommentListCreateView(generics.ListCreateAPIView):
    """Lista e creazione commenti FAQ"""
    serializer_class = FAQCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        faq_id = self.request.query_params.get('faq_id')
        queryset = FAQComment.objects.filter(status='approved')
        
        if faq_id:
            queryset = queryset.filter(faq_id=faq_id)
        
        return queryset.select_related('user', 'admin_reply__admin').order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FAQCommentCreateSerializer
        return FAQCommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_helpful(request, faq_id):
    """Vota una FAQ come utile"""
    try:
        faq = FAQ.objects.get(id=faq_id, is_active=True)
    except FAQ.DoesNotExist:
        return Response(
            {'error': 'FAQ non trovata'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Controlla se l'utente ha già votato
    vote, created = FAQHelpfulVote.objects.get_or_create(
        user=request.user,
        faq=faq
    )
    
    if created:
        faq.increment_helpful()
        return Response({
            'message': 'Voto registrato',
            'helpful_count': faq.helpful_count
        })
    else:
        return Response(
            {'error': 'Hai già votato questa FAQ'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
    """Metti like a un commento"""
    try:
        comment = FAQComment.objects.get(id=comment_id, status='approved')
    except FAQComment.DoesNotExist:
        return Response(
            {'error': 'Commento non trovato'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Non puoi mettere like al tuo stesso commento
    if comment.user == request.user:
        return Response(
            {'error': 'Non puoi mettere like al tuo commento'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    like, created = FAQCommentLike.objects.get_or_create(
        user=request.user,
        comment=comment
    )
    
    if created:
        comment.likes_count = F('likes_count') + 1
        comment.save(update_fields=['likes_count'])
        comment.refresh_from_db()
        return Response({
            'message': 'Like aggiunto',
            'likes_count': comment.likes_count
        })
    else:
        # Rimuovi il like se già presente
        like.delete()
        comment.likes_count = F('likes_count') - 1
        comment.save(update_fields=['likes_count'])
        comment.refresh_from_db()
        return Response({
            'message': 'Like rimosso',
            'likes_count': comment.likes_count
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reply_to_comment(request, comment_id):
    """Risposta admin a un commento (solo per staff)"""
    if not request.user.is_staff:
        return Response(
            {'error': 'Permessi insufficienti'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        comment = FAQComment.objects.get(id=comment_id)
    except FAQComment.DoesNotExist:
        return Response(
            {'error': 'Commento non trovato'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Controlla se esiste già una risposta
    if hasattr(comment, 'admin_reply'):
        return Response(
            {'error': 'Risposta già presente'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = FAQCommentReplyCreateSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        serializer.save(comment=comment, admin=request.user)
        # Approva automaticamente il commento quando viene risposto
        comment.status = 'approved'
        comment.save(update_fields=['status'])
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def faq_search(request):
    """Ricerca avanzata nelle FAQ"""
    serializer = FAQSearchSerializer(data=request.query_params)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    query = data.get('query', '')
    category = data.get('category', '')
    sort_by = data.get('sort_by', 'relevance')
    
    queryset = FAQ.objects.filter(is_active=True)
    
    # Filtro per categoria
    if category and category != 'all':
        queryset = queryset.filter(category__slug=category)
    
    # Ricerca testuale
    if query:
        queryset = queryset.filter(
            Q(question__icontains=query) | 
            Q(answer__icontains=query)
        )
    
    # Ordinamento
    if sort_by == 'views':
        queryset = queryset.order_by('-views_count')
    elif sort_by == 'helpful':
        queryset = queryset.order_by('-helpful_count')
    elif sort_by == 'recent':
        queryset = queryset.order_by('-created_at')
    else:  # relevance
        if query:
            # Ordina per rilevanza (prima le domande che contengono la query)
            queryset = queryset.extra(
                select={
                    'relevance': "CASE WHEN question ILIKE %s THEN 1 ELSE 2 END"
                },
                select_params=[f'%{query}%']
            ).order_by('relevance', '-helpful_count')
        else:
            queryset = queryset.order_by('category__order', 'order')
    
    serializer = FAQListSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def faq_stats(request):
    """Statistiche delle FAQ"""
    # Statistiche generali
    total_faqs = FAQ.objects.filter(is_active=True).count()
    total_categories = FAQCategory.objects.filter(is_active=True).count()
    total_comments = FAQComment.objects.filter(status='approved').count()
    total_views = FAQ.objects.filter(is_active=True).aggregate(
        total=Sum('views_count')
    )['total'] or 0
    
    # FAQ più visualizzata
    most_viewed_faq = FAQ.objects.filter(is_active=True).order_by('-views_count').first()
    
    # FAQ più utile
    most_helpful_faq = FAQ.objects.filter(is_active=True).order_by('-helpful_count').first()
    
    # Commenti recenti
    recent_comments = FAQComment.objects.filter(
        status='approved',
        created_at__gte=timezone.now() - timedelta(days=7)
    ).order_by('-created_at')[:5]
    
    stats_data = {
        'total_faqs': total_faqs,
        'total_categories': total_categories,
        'total_comments': total_comments,
        'total_views': total_views,
        'most_viewed_faq': most_viewed_faq,
        'most_helpful_faq': most_helpful_faq,
        'recent_comments': recent_comments
    }
    
    serializer = FAQStatsSerializer(stats_data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_comments(request):
    """Commenti dell'utente corrente"""
    comments = FAQComment.objects.filter(user=request.user).order_by('-created_at')
    serializer = FAQCommentSerializer(comments, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_comments(request):
    """Commenti in attesa di approvazione (solo per staff)"""
    if not request.user.is_staff:
        return Response(
            {'error': 'Permessi insufficienti'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    comments = FAQComment.objects.filter(status='pending').order_by('-created_at')
    serializer = FAQCommentSerializer(comments, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_comment(request, comment_id):
    """Approva un commento (solo per staff)"""
    if not request.user.is_staff:
        return Response(
            {'error': 'Permessi insufficienti'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        comment = FAQComment.objects.get(id=comment_id)
        comment.status = 'approved'
        comment.save(update_fields=['status'])
        
        return Response({'message': 'Commento approvato'})
    except FAQComment.DoesNotExist:
        return Response(
            {'error': 'Commento non trovato'}, 
            status=status.HTTP_404_NOT_FOUND
        )
