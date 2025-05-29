import React from 'react';
import ReactDOM from 'react-dom/client';

// Componente minimale per test
function DebugApp() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
      <h1>🚀 React Funziona!</h1>
      <p>Se vedi questo messaggio, React si sta caricando correttamente.</p>
      <div style={{background: '#d4edda', padding: '10px', border: '1px solid #c3e6cb', borderRadius: '5px'}}>
        ✅ <strong>React Debug Mode Attivo</strong>
      </div>
      <p>Timestamp: {new Date().toLocaleString()}</p>
    </div>
  );
}

// Mount semplice senza context o router
try {
  console.log('🔧 Tentativo mount React...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<DebugApp />);
  console.log('✅ React montato con successo!');
} catch (error) {
  console.error('❌ Errore mount React:', error);
  // Fallback HTML puro
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>❌ Errore React</h1>
      <p>React non è riuscito a caricarsi. Errore:</p>
      <pre>${error.message}</pre>
    </div>
  `;
} 