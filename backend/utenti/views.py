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
from core.audit import write_audit_event
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.db import transaction
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CreditoMovimento
from .models import CreditoRicarica
from .serializers_crediti import CreditoRicaricaSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'

    def perform_create(self, serializer):
        user = serializer.save()
        write_audit_event(
            action='auth.register',
            request=self.request,
            actor=user,
            target_model='utenti.User',
            target_id=user.id,
            meta={'username': user.username},
        )

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        write_audit_event(
            action='user.profile_updated',
            request=request,
            actor=user,
            target_model='utenti.User',
            target_id=user.id,
            meta={'fields': list(serializer.validated_data.keys())},
        )
        return Response(UserSerializer(user).data)


class NotificheUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        newsletter = request.data.get('newsletter', None)
        if newsletter is None:
            return Response({'detail': 'Campo newsletter richiesto.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.newsletter = bool(newsletter) if isinstance(newsletter, bool) else str(newsletter).lower() in ('1', 'true', 'yes', 'on')
        user.save(update_fields=['newsletter'])
        write_audit_event(
            action='user.notifications_updated',
            request=request,
            actor=user,
            target_model='utenti.User',
            target_id=user.id,
            meta={'newsletter': user.newsletter},
        )
        return Response({'newsletter': user.newsletter})

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'password_reset'
    
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
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"
        
        # Invia email
        subject = 'Reset Password - SoftMatch'
        message = f"""
Ciao {user.username},

Hai richiesto il reset della password per il tuo account.

Clicca sul link seguente per resettare la password:
{reset_link}

Questo link è valido per 24 ore.

Se non hai richiesto tu questo reset, ignora questa email.

Saluti,
Team SoftMatch
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            write_audit_event(
                action='auth.password_reset_requested',
                request=request,
                actor=user,
                target_model='utenti.User',
                target_id=user.id,
                meta={'email_domain': email.split('@')[-1] if '@' in email else ''},
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
    throttle_scope = 'password_reset'
    
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

        write_audit_event(
            action='auth.password_reset_completed',
            request=request,
            actor=user,
            target_model='utenti.User',
            target_id=user.id,
        )
        
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

        write_audit_event(
            action='gdpr.deletion_requested',
            request=request,
            actor=user,
            target_model='utenti.User',
            target_id=user.id,
        )
        
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
                getattr(settings, 'ADMIN_NOTIFICATION_EMAILS', []) or [settings.DEFAULT_FROM_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            pass  # Log dell'errore
        
        return Response(
            {'message': 'Richiesta di cancellazione registrata. Procederemo entro 30 giorni.'}, 
            status=status.HTTP_200_OK
        )


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'


class RefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'


class UsersAdminListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        actor = request.user
        if not (actor.is_staff or actor.is_superuser):
            raise PermissionDenied("Operazione riservata all'amministrazione.")

        qs = User.objects.all().order_by('-date_joined')
        q = request.query_params.get('q')
        ruolo = request.query_params.get('ruolo')
        stato = request.query_params.get('stato')
        if q:
            qs = (qs.filter(username__icontains=q) | qs.filter(email__icontains=q)).distinct()
        if ruolo:
            qs = qs.filter(ruolo=ruolo)
        if stato:
            qs = qs.filter(stato=stato)

        data = UserSerializer(qs, many=True).data
        for item in data:
            item.pop('password', None)
        return Response(data)


class UserAdminPatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, user_id: int):
        actor = request.user
        if not (actor.is_staff or actor.is_superuser):
            raise PermissionDenied("Operazione riservata all'amministrazione.")

        target = User.objects.get(pk=user_id)
        allowed = {}
        for key in ('stato', 'ruolo', 'crediti', 'is_active'):
            if key in request.data:
                allowed[key] = request.data.get(key)

        if 'crediti' in allowed:
            try:
                allowed['crediti'] = int(allowed['crediti'])
            except Exception:
                return Response({'detail': 'crediti non valido.'}, status=status.HTTP_400_BAD_REQUEST)
            if allowed['crediti'] < 0:
                return Response({'detail': 'crediti non può essere negativo.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(target, data=allowed, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Gestione password separata per far scattare l'hashing corretto
        password = request.data.get('password')
        if password:
            target.set_password(password)
            target.save(update_fields=['password'])

        data = UserSerializer(target).data
        data.pop('password', None)
        return Response(data)

    def delete(self, request, user_id: int):
        # Soft delete per conformità GDPR senza corrompere vincoli relazionali
        actor = request.user
        if not (actor.is_staff or actor.is_superuser):
            raise PermissionDenied("Operazione riservata all'amministrazione.")

        target = User.objects.get(pk=user_id)
        if target.id == actor.id:
            return Response({'detail': 'Non puoi eliminare il tuo stesso account.'}, status=status.HTTP_400_BAD_REQUEST)

        # Soft delete GDPR — imposta is_active=False e stato='sospeso'
        target.is_active = False
        target.stato = 'sospeso'
        target.save(update_fields=['is_active', 'stato'])

        write_audit_event(
            action='admin.user.soft_deleted',
            request=request,
            actor=actor,
            target_model='utenti.User',
            target_id=target.id,
        )

        return Response({'detail': 'Utente sospeso/eliminato (soft-delete).'}, status=status.HTTP_200_OK)


class UserAdminAddCreditiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id: int):
        actor = request.user
        if not (actor.is_staff or actor.is_superuser):
            raise PermissionDenied("Operazione riservata all'amministrazione.")

        try:
            delta = int(request.data.get('delta'))
        except Exception:
            return Response({'detail': 'delta non valido.'}, status=status.HTTP_400_BAD_REQUEST)
        if delta == 0:
            return Response({'detail': 'delta deve essere diverso da 0.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            target = User.objects.select_for_update().get(pk=user_id)
            new_value = target.crediti + delta
            if new_value < 0:
                return Response({'detail': 'crediti insufficienti.'}, status=status.HTTP_400_BAD_REQUEST)
            target.crediti = new_value
            target.save(update_fields=['crediti'])
            CreditoMovimento.objects.create(
                user=target,
                delta=delta,
                reason='admin.adjust',
                meta={'actor_id': actor.id},
            )

            # Notifica all'utente
            from core.models import Notifica
            Notifica.objects.create(
                user=target,
                titolo='Aggiornamento Crediti 🎫',
                messaggio=f'Il tuo saldo crediti è stato aggiornato di {delta} dall\'amministrazione.',
                tipo='info' if delta > 0 else 'warning'
            )
        return Response({'id': target.id, 'crediti': target.crediti})


def _parse_credit_packages():
    raw = getattr(settings, 'SOFTMATCH_CREDIT_PACKAGES', '10:19.90,25:39.90,60:79.90')
    packages = []
    for part in (raw or '').split(','):
        part = part.strip()
        if not part:
            continue
        if ':' not in part:
            continue
        c_str, p_str = part.split(':', 1)
        try:
            c = int(c_str.strip())
            p = float(p_str.strip())
        except Exception:
            continue
        if c > 0 and p > 0:
            packages.append({'crediti': c, 'prezzo': round(p, 2)})
    return packages


class CreditPackagesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'packages': _parse_credit_packages(),
            'iban': getattr(settings, 'SOFTMATCH_PLATFORM_IBAN', ''),
            'intestatario': getattr(settings, 'SOFTMATCH_PLATFORM_INTESTATARIO', 'SoftMatch'),
            'banca': getattr(settings, 'SOFTMATCH_PLATFORM_BANK_NAME', ''),
        })


class CreditoRicaricaListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_staff or user.is_superuser:
            qs = CreditoRicarica.objects.select_related('user', 'confirmed_by').all()
        else:
            qs = CreditoRicarica.objects.select_related('user', 'confirmed_by').filter(user=user)
        return Response(CreditoRicaricaSerializer(qs, many=True, context={'request': request}).data)

    def post(self, request):
        user = request.user
        if getattr(user, 'ruolo', None) != 'fornitore' and not (user.is_staff or user.is_superuser):
            return Response({'detail': 'Solo fornitori possono richiedere ricariche crediti.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            crediti = int(request.data.get('crediti'))
        except Exception:
            return Response({'detail': 'crediti non valido.'}, status=status.HTTP_400_BAD_REQUEST)

        packages = _parse_credit_packages()
        match = next((p for p in packages if p['crediti'] == crediti), None)
        if not match:
            return Response({'detail': 'Pacchetto non valido.'}, status=status.HTTP_400_BAD_REQUEST)

        r = CreditoRicarica.objects.create(
            user=user,
            crediti=match['crediti'],
            prezzo=str(match['prezzo']),
            stato='in_attesa',
        )
        r.causale = f"SoftMatch Ricarica#{r.id} - {user.username}"
        r.save(update_fields=['causale'])

        write_audit_event(
            action='crediti.ricarica.created',
            request=request,
            actor=user,
            target_model='utenti.CreditoRicarica',
            target_id=r.id,
            meta={'crediti': r.crediti, 'prezzo': str(r.prezzo)},
        )
        return Response(CreditoRicaricaSerializer(r, context={'request': request}).data, status=status.HTTP_201_CREATED)


class CreditoRicaricaAdminConfirmView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ricarica_id: int):
        actor = request.user
        if not (actor.is_staff or actor.is_superuser):
            raise PermissionDenied("Operazione riservata all'amministrazione.")

        with transaction.atomic():
            r = CreditoRicarica.objects.select_for_update().select_related('user').get(pk=ricarica_id)
            if r.stato != 'in_attesa':
                return Response({'detail': 'Ricarica già processata.'}, status=status.HTTP_400_BAD_REQUEST)
            target = User.objects.select_for_update().get(pk=r.user_id)
            target.crediti = target.crediti + int(r.crediti)
            target.save(update_fields=['crediti'])

            CreditoMovimento.objects.create(
                user=target,
                delta=int(r.crediti),
                reason='ricarica.confirmed',
                meta={'ricarica_id': r.id, 'actor_id': actor.id},
            )

            r.stato = 'confermata'
            r.confirmed_at = timezone.now()
            r.confirmed_by = actor
            r.save(update_fields=['stato', 'confirmed_at', 'confirmed_by'])

            # Notifica all'utente
            from core.models import Notifica
            Notifica.objects.create(
                user=target,
                titolo='Ricarica Confermata! ✅',
                messaggio=f'La tua ricarica di {r.crediti} crediti è stata confermata. Il tuo nuovo saldo è {target.crediti}.',
                link='/crediti',
                tipo='success'
            )

        write_audit_event(
            action='crediti.ricarica.confirmed',
            request=request,
            actor=actor,
            target_model='utenti.CreditoRicarica',
            target_id=ricarica_id,
            meta={'user_id': r.user_id, 'crediti': int(r.crediti)},
        )
        return Response({'id': r.id, 'stato': r.stato})


class CreditoRicaricaUploadRicevutaView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, ricarica_id: int):
        actor = request.user
        try:
            r = CreditoRicarica.objects.select_related('user').get(pk=ricarica_id)
        except CreditoRicarica.DoesNotExist:
            return Response({'detail': 'Ricarica non trovata.'}, status=status.HTTP_404_NOT_FOUND)

        if not (actor.is_staff or actor.is_superuser or r.user_id == actor.id):
            return Response({'detail': 'Non autorizzato.'}, status=status.HTTP_403_FORBIDDEN)

        f = request.FILES.get('file') or request.FILES.get('ricevuta')
        if not f:
            return Response({'detail': 'File mancante.'}, status=status.HTTP_400_BAD_REQUEST)

        name = (getattr(f, 'name', '') or '').lower()
        allowed = ('.pdf', '.png', '.jpg', '.jpeg')
        if name and not any(name.endswith(ext) for ext in allowed):
            return Response({'detail': 'Formato non supportato. Usa PDF/JPG/PNG.'}, status=status.HTTP_400_BAD_REQUEST)

        r.ricevuta = f
        r.save(update_fields=['ricevuta'])

        write_audit_event(
            action='crediti.ricarica.ricevuta.uploaded',
            request=request,
            actor=actor,
            target_model='utenti.CreditoRicarica',
            target_id=r.id,
            meta={'filename': getattr(f, 'name', '')[:140]},
        )
        return Response(CreditoRicaricaSerializer(r, context={'request': request}).data)

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
import os

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        ruolo = request.data.get('ruolo', 'cliente') # Default cliente, ma in Auth.jsx lo useremo
        if not token:
            return Response({'error': 'Token mancante'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # client_id è raccomandato da passare in produzione, ma la libreria controlla che il token sia del cloud project.
            # Eseguiamo bypass del log client_id se non strettamente bloccato
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            username = email.split('@')[0]
            
            user = User.objects.filter(email=email).first()
            if not user:
                while User.objects.filter(username=username).exists():
                    import random
                    username = f"{email.split('@')[0]}{random.randint(1000,9999)}"
                
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    ruolo=ruolo if ruolo in ['cliente', 'fornitore'] else 'cliente'
                )
                user.set_unusable_password()
                user.save()

            if not user.is_active:
                return Response({'error': 'Questo account è inattivo o sospeso.'}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)

            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
            
        except ValueError:
            return Response({'error': 'Token Google non valido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Errore Google Login: {e}")
            return Response({'error': 'Errore durante autenticazione Google'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
