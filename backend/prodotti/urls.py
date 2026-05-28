from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ProdottoProntoViewSet

router = SimpleRouter()
router.register(r'', ProdottoProntoViewSet, basename='prodottopronto')

urlpatterns = [
    path('', include(router.urls)),
]
