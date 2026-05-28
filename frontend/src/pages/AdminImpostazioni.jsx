function AdminImpostazioni() {
  return (
    <div className="container-fluid">
      <h2 className="mb-2">Impostazioni</h2>
      <div className="text-muted mb-4">
        Config di piattaforma (fee, ticket, limiti, email).
      </div>
      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="border rounded-4 p-3">
                <div className="fw-bold">Fee piattaforma</div>
                <div className="text-muted small">SOFTMATCH_PLATFORM_FEE_RATE / MODE</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded-4 p-3">
                <div className="fw-bold">Ticket offerte</div>
                <div className="text-muted small">SOFTMATCH_OFFERTA_CREDIT_COST</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded-4 p-3">
                <div className="fw-bold">Limiti anti-spam</div>
                <div className="text-muted small">SOFTMATCH_MAX_OFFERTE_PER_RICHIESTA</div>
              </div>
            </div>
          </div>
          <div className="alert alert-warning border-0 rounded-4 mt-4 mb-0">
            La UI di modifica impostazioni verrà resa operativa dopo aver deciso quali parametri devono essere gestibili da pannello e quali solo via env.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminImpostazioni;

