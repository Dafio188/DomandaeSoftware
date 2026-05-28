from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import TestimonianzaViewSet

router = SimpleRouter()
router.register(r'', TestimonianzaViewSet, basename='testimonianza')

urlpatterns = [
    path('', include(router.urls)),
] 