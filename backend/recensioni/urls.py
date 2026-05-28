from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import RecensioneViewSet

router = SimpleRouter()
router.register(r'', RecensioneViewSet, basename='recensione')

urlpatterns = [
    path('', include(router.urls)),
] 