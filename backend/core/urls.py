from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/stats/home/', views.home_stats, name='home_stats'),
] 