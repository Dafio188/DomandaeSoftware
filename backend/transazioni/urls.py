from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import TransazioneViewSet

router = SimpleRouter()
router.register(r'', TransazioneViewSet, basename='transazione')

urlpatterns = [
    path('', include(router.urls)),
] 