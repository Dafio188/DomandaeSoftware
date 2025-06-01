from offerte.models import Offerta
from progetti.models import Progetto

# Prendi la prima offerta accettata
offerta = Offerta.objects.filter(stato='accettata').first()

if offerta:
    print(f"Creazione progetto per offerta ID {offerta.id}")
    print(f"Cliente: {offerta.richiesta.cliente.username}")
    print(f"Fornitore: {offerta.fornitore.username}")
    print(f"Richiesta: {offerta.richiesta.titolo}")
    
    # Crea il progetto
    progetto = Progetto.objects.create(
        richiesta=offerta.richiesta,
        offerta=offerta,
        cliente=offerta.richiesta.cliente,
        fornitore=offerta.fornitore,
        stato='in_corso'
    )
    
    print(f"✅ Progetto creato con ID: {progetto.id}")
else:
    print("❌ Nessuna offerta accettata trovata") 