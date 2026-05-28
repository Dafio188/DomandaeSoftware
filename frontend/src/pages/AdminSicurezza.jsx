function AdminSicurezza() {
  return (
    <div className="container-fluid">
      <h2 className="mb-2">Sicurezza</h2>
      <div className="text-muted mb-4">
        Sezione dedicata a audit, policy anti-scavalco e controlli operativi.
      </div>
      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-4">
          <div className="alert alert-info border-0 rounded-4 mb-0">
            In questa build: mascheramento contatti attivo su richieste/offerte e nella chat prima del pagamento.
            La vista audit avanzata verrà collegata come prossimo step.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSicurezza;

