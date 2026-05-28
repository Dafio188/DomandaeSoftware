from rest_framework import viewsets, permissions
from .models import Progetto, StepPersonalizzato
from .serializers import ProgettoSerializer, StepPersonalizzatoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from transazioni.models import Transazione
from django.conf import settings
from django.utils import timezone
from django.db import models, transaction
from core.audit import write_audit_event

class ProgettoViewSet(viewsets.ModelViewSet):
    serializer_class = ProgettoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _assert_staff_write(self, request):
        user = request.user
        if not user.is_authenticated:
            raise PermissionDenied("Autenticazione richiesta.")
        if not (user.is_staff or user.is_superuser):
            raise PermissionDenied("Operazione riservata all'amministrazione.")

    def get_queryset(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return Progetto.objects.none()
            
        # Admin può vedere tutti i progetti per supervisione
        if user.is_staff or user.is_superuser:
            return Progetto.objects.select_related('cliente', 'fornitore', 'richiesta', 'offerta').prefetch_related('transazioni', 'step_personalizzati')
            
        # Mostra solo i progetti dove l'utente è cliente o fornitore
        base = Progetto.objects.select_related('cliente', 'fornitore', 'richiesta', 'offerta').prefetch_related('transazioni', 'step_personalizzati')
        progetti_cliente = base.filter(cliente=user)
        progetti_fornitore = base.filter(fornitore=user)
        progetti_totali = progetti_cliente | progetti_fornitore
        return progetti_totali.distinct()

    @action(detail=True, methods=['post'], url_path='pagamento-ricevuta', parser_classes=[MultiPartParser, FormParser])
    def upload_pagamento_ricevuta(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Autenticazione richiesta.'}, status=status.HTTP_401_UNAUTHORIZED)
        if not (user.is_staff or user.is_superuser or user == progetto.cliente):
            return Response({'detail': 'Non autorizzato.'}, status=status.HTTP_403_FORBIDDEN)

        f = request.FILES.get('file') or request.FILES.get('ricevuta')
        if not f:
            return Response({'detail': 'File mancante.'}, status=status.HTTP_400_BAD_REQUEST)

        name = (getattr(f, 'name', '') or '').lower()
        allowed = ('.pdf', '.png', '.jpg', '.jpeg')
        if name and not any(name.endswith(ext) for ext in allowed):
            return Response({'detail': 'Formato non supportato. Usa PDF/JPG/PNG.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            locked = Progetto.objects.select_for_update().get(pk=progetto.pk)
            locked.pagamento_cliente_ricevuta = f
            locked.save(update_fields=['pagamento_cliente_ricevuta'])

        write_audit_event(
            action='progetto.pagamento.ricevuta.uploaded',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
            meta={'filename': getattr(f, 'name', '')[:140]},
        )

        serializer = self.get_serializer(Progetto.objects.get(pk=progetto.pk))
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='bonifico-ricevuta', parser_classes=[MultiPartParser, FormParser])
    def upload_bonifico_ricevuta(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Autenticazione richiesta.'}, status=status.HTTP_401_UNAUTHORIZED)
        if not (user.is_staff or user.is_superuser):
            return Response({'detail': 'Solo amministratori possono caricare la ricevuta bonifico.'}, status=status.HTTP_403_FORBIDDEN)

        f = request.FILES.get('file') or request.FILES.get('ricevuta')
        if not f:
            return Response({'detail': 'File mancante.'}, status=status.HTTP_400_BAD_REQUEST)

        name = (getattr(f, 'name', '') or '').lower()
        allowed = ('.pdf', '.png', '.jpg', '.jpeg')
        if name and not any(name.endswith(ext) for ext in allowed):
            return Response({'detail': 'Formato non supportato. Usa PDF/JPG/PNG.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            locked = Progetto.objects.select_for_update().get(pk=progetto.pk)
            locked.bonifico_fornitore_ricevuta = f
            locked.save(update_fields=['bonifico_fornitore_ricevuta'])

        write_audit_event(
            action='progetto.bonifico.ricevuta.uploaded',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
            meta={'filename': getattr(f, 'name', '')[:140]},
        )

        serializer = self.get_serializer(Progetto.objects.get(pk=progetto.pk))
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='archivia')
    def archivia_progetto(self, request, pk=None):
        """Archivia un progetto completato"""
        progetto = self.get_object()
        user = request.user
        
        # Verifica autorizzazioni: solo cliente, fornitore o admin
        if not (user == progetto.cliente or user == progetto.fornitore or user.is_staff or user.is_superuser):
            return Response({
                'detail': 'Non sei autorizzato ad archiviare questo progetto.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verifica che il progetto possa essere archiviato
        if not progetto.puo_essere_archiviato:
            return Response({
                'detail': 'Il progetto non può essere archiviato. Deve essere completato in tutte le sue fasi.',
                'requisiti': {
                    'stato_completato': progetto.stato == 'completato',
                    'consegna_fornitore_ok': progetto.consegna_fornitore_ok,
                    'consegna_cliente_ok': progetto.consegna_cliente_ok,
                    'non_gia_archiviato': not progetto.archiviato
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Archivia il progetto
        progetto.archiviato = True
        progetto.data_archiviazione = timezone.now()
        progetto.archiviato_da = user
        progetto.save()

        write_audit_event(
            action='progetto.archived',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
        )
        
        return Response({
            'detail': f'Progetto #{progetto.id} archiviato con successo da {user.username}.',
            'data_archiviazione': progetto.data_archiviazione,
            'archiviato_da': user.username
        })

    @action(detail=True, methods=['post'], url_path='desarchivia')
    def desarchivia_progetto(self, request, pk=None):
        """Desarchivia un progetto (solo admin o chi lo ha archiviato)"""
        progetto = self.get_object()
        user = request.user
        
        if not progetto.archiviato:
            return Response({
                'detail': 'Il progetto non è archiviato.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Solo admin o chi ha archiviato può desarchiviare
        if not (user.is_staff or user.is_superuser or user == progetto.archiviato_da):
            return Response({
                'detail': 'Solo gli amministratori o chi ha archiviato il progetto possono desarchiviarlo.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Desarchivia il progetto
        progetto.archiviato = False
        progetto.data_archiviazione = None
        progetto.archiviato_da = None
        progetto.save()

        write_audit_event(
            action='progetto.unarchived',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
        )
        
        return Response({
            'detail': f'Progetto #{progetto.id} rimesso in attivo da {user.username}.'
        })

    @action(detail=True, methods=['post'], url_path='apri-contestazione')
    def apri_contestazione(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if not (user == progetto.cliente or user == progetto.fornitore):
            return Response({'detail': 'Solo cliente o fornitore possono aprire una contestazione.'}, status=status.HTTP_403_FORBIDDEN)
        if progetto.stato in ['annullato']:
            return Response({'detail': 'Impossibile aprire contestazione su progetto annullato.'}, status=status.HTTP_400_BAD_REQUEST)
        motivo = (request.data.get('motivo') or '').strip()
        if not motivo:
            return Response({'detail': 'Motivo contestazione obbligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            locked = Progetto.objects.select_for_update().get(pk=progetto.pk)
            locked.stato = 'in_contestazione'
            locked.contestazione_motivo = motivo
            locked.contestazione_aperta_da = user
            locked.contestazione_risolta = False
            locked.contestazione_risoluzione_note = ''
            locked.save(update_fields=['stato', 'contestazione_motivo', 'contestazione_aperta_da', 'contestazione_risolta', 'contestazione_risoluzione_note'])

        write_audit_event(
            action='progetto.contestazione.aperta',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
            meta={'motivo': motivo[:300]},
        )
        serializer = self.get_serializer(Progetto.objects.get(pk=progetto.pk))
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='risolvi-contestazione')
    def risolvi_contestazione(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if not (user.is_staff or user.is_superuser):
            return Response({'detail': 'Solo amministratori possono risolvere contestazioni.'}, status=status.HTTP_403_FORBIDDEN)
        if progetto.stato != 'in_contestazione':
            return Response({'detail': 'Il progetto non è in contestazione.'}, status=status.HTTP_400_BAD_REQUEST)
        note = (request.data.get('note') or '').strip()

        with transaction.atomic():
            locked = Progetto.objects.select_for_update().get(pk=progetto.pk)
            locked.contestazione_risolta = True
            locked.contestazione_risoluzione_note = note
            locked.stato = 'prima_release' if not locked.consegna_cliente_ok else 'pagamento' if not (locked.pagamento_cliente_ok and locked.pagamento_admin_ok) else 'completato'
            locked.save(update_fields=['contestazione_risolta', 'contestazione_risoluzione_note', 'stato'])

        write_audit_event(
            action='progetto.contestazione.risolta',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
            meta={'note': note[:300]},
        )
        serializer = self.get_serializer(Progetto.objects.get(pk=progetto.pk))
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='archiviati')
    def progetti_archiviati(self, request):
        """Lista dei progetti archiviati per l'utente corrente"""
        user = request.user
        
        if user.is_staff or user.is_superuser:
            progetti = Progetto.objects.filter(archiviato=True)
        else:
            progetti = Progetto.objects.filter(
                archiviato=True
            ).filter(
                models.Q(cliente=user) | models.Q(fornitore=user)
            )
        
        serializer = self.get_serializer(progetti, many=True)
        return Response({
            'count': progetti.count(),
            'results': serializer.data
        })

    @action(detail=True, methods=['post'], url_path='spunta-step')
    def spunta_step(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        step_id = request.data.get('step_id')
        ruolo = request.data.get('ruolo')  # 'cliente' o 'fornitore'
        try:
            step = StepPersonalizzato.objects.get(id=step_id, progetto=progetto)
        except StepPersonalizzato.DoesNotExist:
            return Response({'detail': 'Step non trovato.'}, status=status.HTTP_404_NOT_FOUND)
        now = timezone.now()
        if ruolo == 'fornitore' and user == progetto.fornitore:
            step.completato_fornitore = True
            step.data_fornitore = now
        elif ruolo == 'cliente' and user == progetto.cliente:
            step.completato_cliente = True
            step.data_cliente = now
        else:
            return Response({'detail': 'Non autorizzato.'}, status=status.HTTP_403_FORBIDDEN)
        step.save()
        # Se entrambi hanno spuntato, si può avanzare lo stato se è l'ultimo step
        tutti_completati = all(s.completato_fornitore and s.completato_cliente for s in progetto.step_personalizzati.all())
        if tutti_completati and progetto.stato not in ['pagamento', 'completato']:
            progetto.stato = 'pagamento'
            progetto.save()
        write_audit_event(
            action='progetto.step_checked',
            request=request,
            actor=user,
            target_model='progetti.StepPersonalizzato',
            target_id=step.id,
            progetto=progetto,
            meta={'ruolo': ruolo, 'stato_progetto': progetto.stato},
        )
        return Response({'detail': 'Spunta aggiornata.'})

    @action(detail=True, methods=['post'], url_path='spunta-fase')
    def spunta_fase(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        fase = request.data.get('fase')  # es: 'bozza_fornitore', 'bozza_cliente', 'pagamento_admin', ecc.
        
        # Mapping delle fasi ai nomi dei campi nel modello
        fase_mapping = {
            'bozza_fornitore': 'bozza_fornitore_ok',
            'bozza_cliente': 'bozza_cliente_ok',
            'pagamento_cliente': 'pagamento_cliente_ok',
            'pagamento_admin': 'pagamento_admin_ok',
            'consegna_fornitore': 'consegna_fornitore_ok',
            'consegna_cliente': 'consegna_cliente_ok',
            'bonifico_admin': 'bonifico_admin_ok',
            'bonifico_fornitore': 'bonifico_fornitore_ok',
        }
        
        if fase in fase_mapping:
            campo_fase = fase_mapping[fase]
        elif fase in fase_mapping.values():
            campo_fase = fase
        else:
            return Response({'detail': 'Fase non valida.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica autorizzazioni specifiche per ogni fase
        if campo_fase in ['bozza_fornitore_ok', 'consegna_fornitore_ok', 'bonifico_fornitore_ok'] and user != progetto.fornitore:
            return Response({'detail': 'Solo il fornitore può spuntare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
        
        if campo_fase in ['bozza_cliente_ok', 'pagamento_cliente_ok', 'consegna_cliente_ok'] and user != progetto.cliente:
            return Response({'detail': 'Solo il cliente può spuntare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
            
        if campo_fase in ['pagamento_admin_ok'] and not (user.is_staff or user.is_superuser):
            return Response({'detail': 'Solo gli amministratori possono confermare i pagamenti.'}, status=status.HTTP_403_FORBIDDEN)

        if campo_fase in ['bonifico_admin_ok'] and not (user.is_staff or user.is_superuser):
            return Response({'detail': 'Solo gli amministratori possono confermare i bonifici.'}, status=status.HTTP_403_FORBIDDEN)

        if campo_fase == 'bonifico_admin_ok':
            if not getattr(progetto, 'bonifico_fornitore_ricevuta', None):
                return Response({'detail': 'Carica prima la ricevuta del bonifico al fornitore.'}, status=status.HTTP_400_BAD_REQUEST)
            
        response_payload = {'detail': 'Fase aggiornata con successo.'}
        response_status = status.HTTP_200_OK
        created_transazione = False
        transazione_id = None
        stato_finale = progetto.stato

        with transaction.atomic():
            progetto_locked = Progetto.objects.select_for_update().get(pk=progetto.pk)
            setattr(progetto_locked, campo_fase, True)
            progetto_locked.save(update_fields=[campo_fase])

            if progetto_locked.bozza_fornitore_ok and progetto_locked.bozza_cliente_ok and progetto_locked.stato == 'bozza':
                progetto_locked.stato = 'prima_release'
                progetto_locked.save(update_fields=['stato'])

            if progetto_locked.pagamento_cliente_ok and progetto_locked.pagamento_admin_ok and progetto_locked.stato in ['prima_release', 'pagamento']:
                progetto_locked.stato = 'pagamento'
                progetto_locked.save(update_fields=['stato'])

            if progetto_locked.consegna_fornitore_ok and progetto_locked.consegna_cliente_ok:
                if not progetto_locked.pagamento_cliente_ok or not progetto_locked.pagamento_admin_ok:
                    if progetto_locked.stato != 'pagamento':
                        progetto_locked.stato = 'pagamento'
                        progetto_locked.save(update_fields=['stato'])
                    response_payload = {'detail': 'Consegna completata. In attesa conferma pagamento.'}
                else:
                    if progetto_locked.offerta_id is None:
                        response_payload = {'detail': 'Offerta non presente: impossibile calcolare la transazione.'}
                        response_status = status.HTTP_400_BAD_REQUEST
                    else:
                        importo = float(progetto_locked.offerta.prezzo)
                        fee_rate = getattr(settings, 'SOFTMATCH_PLATFORM_FEE_RATE', 0.05)
                        fee_mode = getattr(settings, 'SOFTMATCH_PLATFORM_FEE_MODE', 'cliente')
                        fee = round(importo * fee_rate, 2)

                        if fee_mode == 'fornitore':
                            importo_cliente = round(importo, 2)
                            importo_fornitore = round(importo - fee, 2)
                            commissione_cliente = 0.0
                            commissione_fornitore = fee
                        elif fee_mode == 'split':
                            half = round(fee / 2, 2)
                            importo_cliente = round(importo + half, 2)
                            importo_fornitore = round(importo - half, 2)
                            commissione_cliente = half
                            commissione_fornitore = half
                        else:
                            importo_cliente = round(importo + fee, 2)
                            importo_fornitore = round(importo, 2)
                            commissione_cliente = fee
                            commissione_fornitore = 0.0

                        transazione, created_transazione = Transazione.objects.get_or_create(
                            progetto=progetto_locked,
                            defaults={
                                'importo_totale': importo_cliente,
                                'commissione_cliente': commissione_cliente,
                                'commissione_fornitore': commissione_fornitore,
                                'importo_fornitore': importo_fornitore,
                                'stato': 'in_attesa',
                            },
                        )
                        transazione_id = transazione.id

                        if progetto_locked.stato != 'completato':
                            progetto_locked.stato = 'completato'
                            progetto_locked.save(update_fields=['stato'])

            if progetto_locked.bonifico_fornitore_ok and progetto_locked.stato == 'completato':
                Transazione.objects.filter(progetto=progetto_locked, stato='in_attesa').update(stato='completata')

            stato_finale = progetto_locked.stato

        write_audit_event(
            action='progetto.phase_checked',
            request=request,
            actor=user,
            target_model='progetti.Progetto',
            target_id=progetto.id,
            progetto=progetto,
            meta={'fase': fase, 'campo_fase': campo_fase, 'stato_finale': stato_finale},
        )
        if created_transazione:
            write_audit_event(
                action='transazione.created',
                request=request,
                actor=user,
                target_model='transazioni.Transazione',
                target_id=transazione_id,
                progetto=progetto,
            )

        return Response(response_payload, status=response_status)

    @action(detail=True, methods=['post'], url_path='aggiungi-step')
    def aggiungi_step(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if user != progetto.cliente:
            return Response({'detail': 'Solo il cliente può aggiungere step.'}, status=status.HTTP_403_FORBIDDEN)
        nome = request.data.get('nome')
        ordine = request.data.get('ordine', progetto.step_personalizzati.count() + 1)
        step = StepPersonalizzato.objects.create(progetto=progetto, nome=nome, ordine=ordine)
        write_audit_event(
            action='progetto.step_added',
            request=request,
            actor=user,
            target_model='progetti.StepPersonalizzato',
            target_id=step.id,
            progetto=progetto,
            meta={'nome': step.nome, 'ordine': step.ordine},
        )
        return Response(StepPersonalizzatoSerializer(step).data)

    @action(detail=True, methods=['post'], url_path='avanza')
    def avanza_step(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if user != progetto.cliente and user != progetto.fornitore:
            return Response({'detail': 'Non autorizzato.'}, status=status.HTTP_403_FORBIDDEN)
        if progetto.stato == 'bozza' and user == progetto.fornitore:
            progetto.stato = 'prima_release'
            progetto.save()
            write_audit_event(
                action='progetto.state_advanced',
                request=request,
                actor=user,
                target_model='progetti.Progetto',
                target_id=progetto.id,
                progetto=progetto,
                meta={'stato': 'prima_release'},
            )
            return Response({'detail': 'Progetto avanzato a Prima release. Il cliente deve ora pagare.'})
        if progetto.stato == 'prima_release' and user == progetto.cliente:
            progetto.pagamento_cliente_ok = True
            progetto.stato = 'pagamento'
            progetto.save(update_fields=['pagamento_cliente_ok', 'stato'])
            write_audit_event(
                action='progetto.payment_marked_by_cliente',
                request=request,
                actor=user,
                target_model='progetti.Progetto',
                target_id=progetto.id,
                progetto=progetto,
            )
            return Response({'detail': 'Pagamento cliente registrato. In attesa conferma amministratore.'})
        return Response({'detail': 'Avanzamento non consentito in questo stato o da questo utente.'}, status=status.HTTP_400_BAD_REQUEST) 

    def update(self, request, *args, **kwargs):
        self._assert_staff_write(request)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        self._assert_staff_write(request)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self._assert_staff_write(request)
        return super().destroy(request, *args, **kwargs)
