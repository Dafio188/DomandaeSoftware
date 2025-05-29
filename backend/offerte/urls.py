from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OffertaViewSet

router = DefaultRouter()
router.register(r'', OffertaViewSet, basename='offerta')

urlpatterns = [
    path('', include(router.urls)),
] 