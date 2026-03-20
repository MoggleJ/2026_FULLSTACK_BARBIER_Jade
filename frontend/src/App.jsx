import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch(() => setApiStatus({ status: 'error', message: 'Impossible de joindre l\'API' }));
  }, []);

  return (
    <div className="app">
      <h1>MJQbe WEB</h1>
      <p>Sprint 1 — Test de communication Frontend ↔ API</p>
      {apiStatus ? (
        <div className={`status ${apiStatus.status}`}>
          <strong>API :</strong> {apiStatus.message}
          {apiStatus.db && <span> | DB : {apiStatus.db}</span>}
        </div>
      ) : (
        <div className="status loading">Connexion à l'API...</div>
      )}
    </div>
  );
}

export default App;
