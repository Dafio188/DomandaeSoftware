from rest_framework import viewsets, permissions
from .models import Progetto, StepPersonalizzato
from .serializers import ProgettoSerializer, StepPersonalizzatoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from transazioni.models import Transazione
from django.utils import timezone
from django.db import models

class ProgettoViewSet(viewsets.ModelViewSet):
    serializer_class = ProgettoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        print(f"🔍 ProgettoViewSet - get_queryset chiamato")
        print(f"User: {user}")
        print(f"User authenticated: {user.is_authenticated}")
        print(f"User ID: {getattr(user, 'id', 'N/A')}")
        print(f"User username: {getattr(user, 'username', 'N/A')}")
        
        if not user.is_authenticated:
            print(f"❌ User non autenticato - restituisco queryset vuoto")
            return Progetto.objects.none()
            
        # Admin può vedere tutti i progetti per supervisione
        if user.is_staff or getattr(user, 'ruolo', None) == 'amministratore':
            print(f"✅ User è admin - restituisco tutti i progetti")
            all_projects = Progetto.objects.all()
            print(f"Progetti totali: {[p.id for p in all_projects]}")
            return all_projects
            
        # Mostra solo i progetti dove l'utente è cliente o fornitore
        progetti_cliente = Progetto.objects.filter(cliente=user)
        progetti_fornitore = Progetto.objects.filter(fornitore=user)
        progetti_totali = progetti_cliente | progetti_fornitore
        
        print(f"✅ User autenticato - filtro progetti")
        print(f"Progetti come cliente: {[p.id for p in progetti_cliente]}")
        print(f"Progetti come fornitore: {[p.id for p in progetti_fornitore]}")
        print(f"Progetti totali accessibili: {[p.id for p in progetti_totali]}")
        
        return progetti_totali

    @action(detail=True, methods=['post'], url_path='archivia')
    def archivia_progetto(self, request, pk=None):
        """Archivia un progetto completato"""
        progetto = self.get_object()
        user = request.user
        
        # Verifica autorizzazioni: solo cliente, fornitore o admin
        if not (user == progetto.cliente or user == progetto.fornitore or user.is_staff or user.ruolo == 'amministratore'):
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
        if not (user.is_staff or user.ruolo == 'amministratore' or user == progetto.archiviato_da):
            return Response({
                'detail': 'Solo gli amministratori o chi ha archiviato il progetto possono desarchiviarlo.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Desarchivia il progetto
        progetto.archiviato = False
        progetto.data_archiviazione = None
        progetto.archiviato_da = None
        progetto.save()
        
        return Response({
            'detail': f'Progetto #{progetto.id} rimesso in attivo da {user.username}.'
        })

    @action(detail=False, methods=['get'], url_path='archiviati')
    def progetti_archiviati(self, request):
        """Lista dei progetti archiviati per l'utente corrente"""
        user = request.user
        
        if user.is_staff or user.ruolo == 'amministratore':
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
            'bonifico_fornitore': 'bonifico_fornitore_ok',
        }
        
        # Se la fase è nel vecchio formato, la utilizziamo direttamente, altrimenti usiamo il mapping
        if fase in fase_mapping:
            campo_fase = fase_mapping[fase]
        elif hasattr(progetto, fase):
            campo_fase = fase
        else:
            return Response({'detail': 'Fase non valida.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica autorizzazioni specifiche per ogni fase
        if fase in ['bozza_fornitore', 'consegna_fornitore', 'bonifico_fornitore'] and user != progetto.fornitore:
            return Response({'detail': 'Solo il fornitore può spuntare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
        
        if fase in ['bozza_cliente', 'pagamento_cliente', 'consegna_cliente'] and user != progetto.cliente:
            return Response({'detail': 'Solo il cliente può spuntare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
            
        if fase in ['pagamento_admin'] and not (user.is_staff or getattr(user, 'ruolo', None) == 'amministratore'):
            return Response({'detail': 'Solo gli amministratori possono confermare i pagamenti.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Verifica autorizzazioni per le fasi nel vecchio formato
        if 'fornitore' in campo_fase and user != progetto.fornitore:
            return Response({'detail': 'Solo il fornitore può spuntare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
        if 'cliente' in campo_fase and user != progetto.cliente:
            return Response({'detail': 'Solo il cliente può spuntare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
        if 'admin' in campo_fase and not (user.is_staff or getattr(user, 'ruolo', None) == 'amministratore'):
            return Response({'detail': 'Solo gli amministratori possono approvare questa fase.'}, status=status.HTTP_403_FORBIDDEN)
            
        # Spunta la fase
        setattr(progetto, campo_fase, True)
        progetto.save()
        
        # Logica avanzamento stato automatico
        if progetto.bozza_fornitore_ok and progetto.bozza_cliente_ok and progetto.stato == 'bozza':
            progetto.stato = 'prima_release'
            progetto.save()
            
        if progetto.pagamento_cliente_ok and progetto.pagamento_admin_ok and progetto.stato in ['prima_release', 'pagamento']:
            progetto.stato = 'pagamento'
            progetto.save()
            
        if progetto.consegna_fornitore_ok and progetto.consegna_cliente_ok and progetto.stato in ['pagamento', 'prima_release']:
            # Crea la transazione quando il progetto è completato
            importo = float(progetto.offerta.prezzo)
            importo_cliente = round(importo * 1.05, 2)
            importo_fornitore = round(importo * 0.95, 2)
            
            transazione = Transazione.objects.create(
                progetto=progetto,
                importo_totale=importo_cliente,
                commissione_cliente=round(importo * 0.05, 2),
                commissione_fornitore=round(importo * 0.05, 2),
                importo_fornitore=importo_fornitore,
                stato='in_attesa'
            )
            
            progetto.stato = 'completato'
            progetto.save()
            
            # Segna la transazione come completata
            transazione.stato = 'completata'
            transazione.save()
            
        # Se il fornitore conferma la ricezione del bonifico, il progetto è definitivamente chiuso
        if progetto.bonifico_fornitore_ok and progetto.stato == 'completato':
            # Qui si potrebbe aggiungere logica aggiuntiva per la chiusura definitiva
            # Ad esempio, inviare email di conferma, aggiornare statistiche, ecc.
            pass
            
        return Response({'detail': 'Fase aggiornata con successo.'})

    @action(detail=True, methods=['post'], url_path='aggiungi-step')
    def aggiungi_step(self, request, pk=None):
        progetto = self.get_object()
        user = request.user
        if user != progetto.cliente:
            return Response({'detail': 'Solo il cliente può aggiungere step.'}, status=status.HTTP_403_FORBIDDEN)
        nome = request.data.get('nome')
        ordine = request.data.get('ordine', progetto.step_personalizzati.count() + 1)
        step = StepPersonalizzato.objects.create(progetto=progetto, nome=nome, ordine=ordine)
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
            return Response({'detail': 'Progetto avanzato a Prima release. Il cliente deve ora pagare.'})
        if progetto.stato == 'prima_release' and user == progetto.cliente:
            importo = float(progetto.offerta.prezzo)
            importo_cliente = round(importo * 1.05, 2)
            importo_fornitore = round(importo * 0.95, 2)
            transazione = Transazione.objects.create(
                progetto=progetto,
                importo_totale=importo_cliente,
                commissione_cliente=round(importo * 0.05, 2),
                commissione_fornitore=round(importo * 0.05, 2),
                importo_fornitore=importo_fornitore,
                stato='in_attesa'
            )
            progetto.stato = 'completato'
            progetto.save()
            transazione.stato = 'completata'
            transazione.save()
            return Response({
                'detail': f'Progetto completato. Il cliente ha pagato {importo_cliente}€. Il fornitore riceverà {importo_fornitore}€ (5% trattenuto).'
            })
        return Response({'detail': 'Avanzamento non consentito in questo stato o da questo utente.'}, status=status.HTTP_400_BAD_REQUEST) 