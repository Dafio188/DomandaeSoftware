from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import OffertaViewSet

router = SimpleRouter()
router.register(r'', OffertaViewSet, basename='offerta')

urlpatterns = [
    path('', include(router.urls)),
] 