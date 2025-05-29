from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdottoProntoViewSet

router = DefaultRouter()
router.register(r'', ProdottoProntoViewSet, basename='prodottopronto')

urlpatterns = [
    path('', include(router.urls)),
]
