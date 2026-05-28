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
  const feeRate = 0.05;
  const feeMode = 'cliente';
  const fee = prezzo * feeRate;

  let importoCliente = prezzo;
  let importoFornitore = prezzo;
  if (feeMode === 'fornitore') {
    importoFornitore = prezzo - fee;
  } else if (feeMode === 'split') {
    importoCliente = prezzo + fee / 2;
    importoFornitore = prezzo - fee / 2;
  } else {
    importoCliente = prezzo + fee;
  }

  console.log('💰 CALCOLI IMPORTI:', {
    prezzo_originale: offertaPrezzo,
    prezzo_numerico: prezzo,
    importo_cliente: importoCliente.toFixed(2),
    importo_fornitore: importoFornitore.toFixed(2)
  });

  return {
    prezzo,
    importoCliente: importoCliente.toFixed(2),
    importoFornitore: importoFornitore.toFixed(2)
  };
}; 
