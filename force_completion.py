import os
import sys
import django

# Setup Django
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from progetti.models import Progetto
from transazioni.models import Transazione

def forza_completamento():
    try:
        progetto = Progetto.objects.get(id=2)
        print(f"Progetto ID 2: {progetto}")
        print(f"   Cliente: {progetto.cliente.username}")
        print(f"   Fornitore: {progetto.fornitore.username}")
        print(f"   Stato attuale: {progetto.stato}")
        
        # Verifica che tutte le spunte siano complete
        spunte = {
            'bozza_fornitore_ok': progetto.bozza_fornitore_ok,
            'bozza_cliente_ok': progetto.bozza_cliente_ok,
            'pagamento_cliente_ok': progetto.pagamento_cliente_ok,
            'pagamento_admin_ok': progetto.pagamento_admin_ok,
            'consegna_fornitore_ok': progetto.consegna_fornitore_ok,
            'consegna_cliente_ok': progetto.consegna_cliente_ok,
            'bonifico_fornitore_ok': progetto.bonifico_fornitore_ok,
        }
        
        print("\nSpunte attuali:")
        for spunta, valore in spunte.items():
            status = "OK" if valore else "NO"
            print(f"   {status} {spunta}: {valore}")
        
        # Se tutte le spunte sono OK, forza lo stato a completato
        if all(spunte.values()):
            print("\nTutte le spunte sono complete - forzando stato a completato...")
            progetto.stato = 'completato'
            progetto.save()
            
            # Crea transazione se non esiste
            if not progetto.transazioni.exists():
                importo = float(progetto.offerta.prezzo) if progetto.offerta else 1000.0
                importo_cliente = round(importo * 1.05, 2)
                importo_fornitore = round(importo * 0.95, 2)
                
                transazione = Transazione.objects.create(
                    progetto=progetto,
                    importo_totale=importo_cliente,
                    commissione_cliente=round(importo * 0.05, 2),
                    commissione_fornitore=round(importo * 0.05, 2),
                    importo_fornitore=importo_fornitore,
                    stato='completata'
                )
                print(f"Transazione creata: {transazione}")
            
            print(f"Progetto aggiornato: {progetto.stato}")
            print(f"Puo essere archiviato: {progetto.puo_essere_archiviato}")
        else:
            print("Non tutte le spunte sono complete")
            
    except Progetto.DoesNotExist:
        print("Progetto 2 non trovato")
    except Exception as e:
        print(f"Errore: {e}")

if __name__ == "__main__":
    forza_completamento()
