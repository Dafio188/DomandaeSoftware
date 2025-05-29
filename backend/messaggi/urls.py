from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessaggioViewSet

router = DefaultRouter()
router.register(r'', MessaggioViewSet, basename='messaggio')

urlpatterns = [
    path('', include(router.urls)),
] 