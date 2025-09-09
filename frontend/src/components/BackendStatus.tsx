import { useState, useEffect } from 'react';

interface HealthResponse {
  status: string;
  service: string;
}

export function BackendStatus() {
  const [status, setStatus] = useState<string>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/health')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: HealthResponse) => {
        if (data.status === 'ok') {
          setStatus('online');
        }
      })
      .catch(err => {
        setError(err.message);
        setStatus('error');
      });
  }, []);

  if (status === 'pending') {
    return <p>Verificando status do backend...</p>;
  }

  if (status === 'error') {
    return <p style={{ color: 'red' }}>Erro ao conectar com o backend: {error}</p>;
  }

  return <p style={{ color: 'green' }}>Backend está online!</p>;
}
