from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RichiestaViewSet

router = DefaultRouter()
router.register(r'', RichiestaViewSet, basename='richiesta')

urlpatterns = [
    path('', include(router.urls)),
] 