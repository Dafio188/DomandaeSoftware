from django.urls import path
from . import views

urlpatterns = [
    # Categorie FAQ
    path('categories/', views.FAQCategoryListView.as_view(), name='faq-categories'),
    
    # FAQ
    path('', views.FAQListView.as_view(), name='faq-list'),
    path('<int:pk>/', views.FAQDetailView.as_view(), name='faq-detail'),
    path('search/', views.faq_search, name='faq-search'),
    path('stats/', views.faq_stats, name='faq-stats'),
    
    # Voti utilità
    path('<int:faq_id>/vote-helpful/', views.vote_helpful, name='faq-vote-helpful'),
    
    # Commenti
    path('comments/', views.FAQCommentListCreateView.as_view(), name='faq-comments'),
    path('comments/<int:comment_id>/like/', views.like_comment, name='faq-comment-like'),
    path('comments/<int:comment_id>/reply/', views.reply_to_comment, name='faq-comment-reply'),
    path('comments/my/', views.my_comments, name='faq-my-comments'),
    path('comments/pending/', views.pending_comments, name='faq-pending-comments'),
    path('comments/<int:comment_id>/approve/', views.approve_comment, name='faq-approve-comment'),
] 