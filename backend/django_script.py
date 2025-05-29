from offerte.models import Offerta
from progetti.models import Progetto

print("=== OFFERTE ACCETTATE ===")
offerte_accettate = Offerta.objects.filter(stato='accettata')
for o in offerte_accettate:
    print(f"Offerta ID {o.id}: {o.fornitore.username} -> {o.richiesta.cliente.username}")
    print(f"  Richiesta: {o.richiesta.titolo}")
    print(f"  Prezzo: {o.prezzo}€")

print("\n=== PROGETTI ESISTENTI ===")
progetti = Progetto.objects.all()
for p in progetti:
    print(f"Progetto ID {p.id}: {p.cliente.username} <-> {p.fornitore.username}")

print(f"\nTotale offerte accettate: {offerte_accettate.count()}")
print(f"Totale progetti: {progetti.count()}")

# Se ci sono offerte accettate ma nessun progetto, c'è un problema
if offerte_accettate.count() > 0 and progetti.count() == 0:
    print("\n🚨 PROBLEMA: Ci sono offerte accettate ma nessun progetto!")
    print("Creo manualmente un progetto per la prima offerta accettata...")
    
    prima_offerta = offerte_accettate.first()
    if prima_offerta:
        progetto = Progetto.objects.create(
            richiesta=prima_offerta.richiesta,
            offerta=prima_offerta,
            cliente=prima_offerta.richiesta.cliente,
            fornitore=prima_offerta.fornitore,
            stato='in_corso'
        )
        print(f"✅ Progetto creato con ID: {progetto.id}")
        print(f"   Cliente: {progetto.cliente.username}")
        print(f"   Fornitore: {progetto.fornitore.username}")
        print(f"   Stato: {progetto.stato}")
    else:
        print("❌ Nessuna offerta accettata trovata")
else:
    print("\n✅ Tutto sembra in ordine!")
    
print("\n=== FINE VERIFICA ===") 