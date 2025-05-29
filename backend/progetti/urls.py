from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgettoViewSet

router = DefaultRouter()
router.register(r'', ProgettoViewSet, basename='progetto')

urlpatterns = [
    path('', include(router.urls)),
] 