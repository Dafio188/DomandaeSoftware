// Utility per calcolare gli importi di pagamento
export const calcolaImporti = (offertaPrezzo) => {
  if (!offertaPrezzo || offertaPrezzo <= 0) {
    return {
      prezzo: 0,
      importoCliente: '0.00',
      importoFornitore: '0.00'
    };
  }

  const prezzo = parseFloat(offertaPrezzo);
  const importoCliente = (prezzo * 1.05).toFixed(2); // +5% commissione
  const importoFornitore = (prezzo * 0.95).toFixed(2); // -5% commissione

  console.log('💰 CALCOLI IMPORTI:', {
    prezzo_originale: offertaPrezzo,
    prezzo_numerico: prezzo,
    importo_cliente: importoCliente,
    importo_fornitore: importoFornitore
  });

  return {
    prezzo,
    importoCliente,
    importoFornitore
  };
}; 