from django.contrib import admin
from .models import User, CreditoMovimento, CreditoRicarica

admin.site.register(User) 


@admin.register(CreditoMovimento)
class CreditoMovimentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'delta', 'reason', 'created_at')
    list_filter = ('reason', 'created_at')
    search_fields = ('user__username', 'user__email')
    ordering = ('-created_at',)


@admin.register(CreditoRicarica)
class CreditoRicaricaAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'crediti', 'prezzo', 'stato', 'created_at', 'confirmed_at', 'confirmed_by')
    list_filter = ('stato', 'created_at', 'confirmed_at')
    search_fields = ('user__username', 'user__email', 'causale')
    ordering = ('-created_at',)
