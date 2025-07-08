import { useState, useEffect } from 'react';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import Navbar from '../components/navbar.jsx';

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarVagas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/estacionamentos');
      setVagas(res.data);
    } catch (err) {
      alert('Erro ao carregar vagas');
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Navbar />
      <div
        style={{
          padding: '20px',
          marginTop: '60px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f9f9f9',
          minHeight: '100vh',
          animation: 'fadeIn 0.5s ease forwards',
        }}
      >
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Status do Estacionamento</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {vagas.map((v) => (
            <li
              key={v.id}
              style={{
                backgroundColor: '#fff',
                padding: '15px 20px',
                borderRadius: '10px',
                marginBottom: '12px',
                boxShadow: '0 2px 7px rgba(0,0,0,0.1)',
                fontWeight: '600',
                color: '#333',
                fontSize: '14px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Local: <span style={{ color: '#d32f2f' }}>{v.localidade}</span> — Vagas:{' '}
              {v.vagas_ocupadas}/{v.total_vagas}
            </li>
          ))}
        </ul>
      </div>
      <style>{`
          @keyframes fadein {
            from {opacity: 0; transform: translateY(-10px);}
            to {opacity: 1; transform: translateY(0);}
          }
          @keyframes fadeout {
            to {opacity: 0; transform: translateY(-19px);}
          }
          @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
          }
        `}</style>
    </>
  );
}
