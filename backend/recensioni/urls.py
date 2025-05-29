from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecensioneViewSet

router = DefaultRouter()
router.register(r'', RecensioneViewSet, basename='recensione')

urlpatterns = [
    path('', include(router.urls)),
] 