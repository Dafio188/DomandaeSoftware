from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ProgettoViewSet

router = SimpleRouter()
router.register(r'', ProgettoViewSet, basename='progetto')

urlpatterns = [
    path('', include(router.urls)),
] 