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
      <div style={{ padding: '20px', marginTop: '60px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Status do Estacionamento</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {vagas.map(v => (
            <li
              key={v.id}
              style={{
                backgroundColor: 'white',
                padding: '15px 20px',
                borderRadius: '8px',
                marginBottom: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                fontWeight: '600',
                color: '#333',
              }}
            >
              Local: <span style={{ color: '#d32f2f' }}>{v.localidade}</span> — Vagas: {v.vagas_ocupadas}/{v.total_vagas}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
