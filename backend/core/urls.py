from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/stats/home/', views.home_stats, name='home_stats'),
    path('api/stats/dashboard/', views.dashboard_metrics, name='dashboard_metrics'),
    
    # Notifiche
    path('api/notifiche/', views.NotificaViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/notifiche/<int:pk>/', views.NotificaViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('api/notifiche/segna-tutte-lette/', views.NotificaViewSet.as_view({'post': 'segna_tutte_lette'})),
    path('api/notifiche/<int:pk>/segna-letta/', views.NotificaViewSet.as_view({'post': 'segna_letta'})),
    
    path('api/', views.api_root, name='api_root'),
    path('api/audit/', views.audit_events, name='audit_events'),
    path('api/pagamenti/config/', views.pagamenti_config, name='pagamenti_config'),
]
