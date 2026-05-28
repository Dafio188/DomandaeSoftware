from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import RichiestaViewSet

router = SimpleRouter()
router.register(r'', RichiestaViewSet, basename='richiesta')

urlpatterns = [
    path('', include(router.urls)),
] 