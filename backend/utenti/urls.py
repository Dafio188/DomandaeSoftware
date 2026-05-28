from django.urls import path
from .views import RegisterView, ProfileView, PasswordResetRequestView, PasswordResetConfirmView, RichiestaCancellazioneView, LoginView, RefreshView, UserUpdateView, NotificheUpdateView, UsersAdminListView, UserAdminPatchView, UserAdminAddCreditiView, CreditPackagesView, CreditoRicaricaListCreateView, CreditoRicaricaAdminConfirmView, CreditoRicaricaUploadRicevutaView, GoogleLoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('user/', UserUpdateView.as_view(), name='user_update'),
    path('notifiche/', NotificheUpdateView.as_view(), name='notifiche_update'),
    path('crediti/pacchetti/', CreditPackagesView.as_view(), name='crediti_pacchetti'),
    path('crediti/ricariche/', CreditoRicaricaListCreateView.as_view(), name='crediti_ricariche'),
    path('crediti/ricariche/<int:ricarica_id>/conferma/', CreditoRicaricaAdminConfirmView.as_view(), name='crediti_ricariche_conferma'),
    path('crediti/ricariche/<int:ricarica_id>/ricevuta/', CreditoRicaricaUploadRicevutaView.as_view(), name='crediti_ricariche_ricevuta'),
    path('users/', UsersAdminListView.as_view(), name='admin_users_list'),
    path('users/<int:user_id>/', UserAdminPatchView.as_view(), name='admin_user_patch'),
    path('users/<int:user_id>/crediti/add/', UserAdminAddCreditiView.as_view(), name='admin_user_crediti_add'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', RefreshView.as_view(), name='token_refresh'),
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('richiesta-cancellazione/', RichiestaCancellazioneView.as_view(), name='richiesta_cancellazione'),
] 
