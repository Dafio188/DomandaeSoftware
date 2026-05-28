from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import MessaggioViewSet

router = SimpleRouter()
router.register(r'', MessaggioViewSet, basename='messaggio')

urlpatterns = [
    path('', include(router.urls)),
] 