from django.urls import path
from .views import RegisterView, ProfileView, PasswordResetRequestView, PasswordResetConfirmView, RichiestaCancellazioneView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('richiesta-cancellazione/', RichiestaCancellazioneView.as_view(), name='richiesta_cancellazione'),
] 