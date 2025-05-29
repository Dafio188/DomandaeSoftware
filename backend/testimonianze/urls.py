from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestimonianzaViewSet

router = DefaultRouter()
router.register(r'', TestimonianzaViewSet, basename='testimonianza')

urlpatterns = [
    path('', include(router.urls)),
] 