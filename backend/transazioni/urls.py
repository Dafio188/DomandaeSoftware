from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransazioneViewSet

router = DefaultRouter()
router.register(r'', TransazioneViewSet, basename='transazione')

urlpatterns = [
    path('', include(router.urls)),
] 