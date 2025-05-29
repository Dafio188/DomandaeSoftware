from rest_framework import generics, permissions, status
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.conf import settings
import secrets
import string
from django.utils import timezone

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email è richiesta'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Per sicurezza, non rivelare se l'email esiste o no
            return Response(
                {'message': 'Se l\'email esiste nel sistema, riceverai le istruzioni per il reset'}, 
                status=status.HTTP_200_OK
            )
        
        # Genera token di reset
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Crea il link di reset
        reset_link = f"http://127.0.0.1:3000/reset-password/{uid}/{token}/"
        
        # Invia email
        subject = 'Reset Password - Gestionale Software'
        message = f"""
Ciao {user.username},

Hai richiesto il reset della password per il tuo account.

Clicca sul link seguente per resettare la password:
{reset_link}

Questo link è valido per 24 ore.

Se non hai richiesto tu questo reset, ignora questa email.

Saluti,
Team Gestionale Software
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response(
                {'message': 'Email di reset inviata con successo'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'Errore nell\'invio email'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([uid, token, new_password]):
            return Response(
                {'error': 'Tutti i campi sono richiesti'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Decodifica l'UID
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Link di reset non valido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verifica il token
        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'Token scaduto o non valido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Valida la nuova password
        if len(new_password) < 8:
            return Response(
                {'error': 'La password deve essere di almeno 8 caratteri'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Aggiorna la password
        user.set_password(new_password)
        user.save()
        
        return Response(
            {'message': 'Password aggiornata con successo'}, 
            status=status.HTTP_200_OK
        )

class RichiestaCancellazioneView(APIView):
    """Endpoint per richiedere la cancellazione dati (GDPR)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if user.richiesta_cancellazione:
            return Response(
                {'error': 'Richiesta di cancellazione già presentata'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Marca la richiesta di cancellazione
        user.richiesta_cancellazione = True
        user.data_richiesta_cancellazione = timezone.now()
        user.save()
        
        # Invia notifica agli admin (implementare)
        subject = f'Richiesta Cancellazione Dati - {user.username}'
        message = f"""
Un utente ha richiesto la cancellazione dei propri dati:

Username: {user.username}
Email: {user.email}
Ruolo: {user.get_ruolo_display()}
Data richiesta: {timezone.now()}

Procedere con la cancellazione entro 30 giorni come previsto dal GDPR.
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                ['admin@tuodominio.com'],  # Email admin
                fail_silently=False,
            )
        except Exception as e:
            pass  # Log dell'errore
        
        return Response(
            {'message': 'Richiesta di cancellazione registrata. Procederemo entro 30 giorni.'}, 
            status=status.HTTP_200_OK
        ) 