from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('utenti.urls')),
    path('api/richieste/', include('richieste.urls')),
    path('api/offerte/', include('offerte.urls')),
    path('api/progetti/', include('progetti.urls')),
    path('api/transazioni/', include('transazioni.urls')),
    path('api/messaggi/', include('messaggi.urls')),
    path('api/recensioni/', include('recensioni.urls')),
    path('api/prodotti-pronti/', include('prodotti.urls')),
    path('api/testimonianze/', include('testimonianze.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 