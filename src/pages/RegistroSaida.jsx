import { useState, useEffect } from 'react';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import Navbar from '../components/navbar.jsx';

const UNSPLASH_ACCESS_KEY = '6fEvO6MfvN_3ZjZiADOPCJ8hu4MAMqhnBGwkboqyoDE';

export default function RegistroSaida() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagens, setImagens] = useState({});
  const [notificacoes, setNotificacoes] = useState([]);

  const adicionarNotificacao = (msg, tipo = 'sucesso') => {
    const id = Date.now();
    setNotificacoes((prev) => [...prev, { id, msg, tipo }]);
    setTimeout(() => {
      setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  };

  const buscarEntradas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/acessos');
      const abertos = res.data.filter(r => !r.data_hora_saida);
      setRegistros(abertos);
    } catch {
      adicionarNotificacao('Erro ao buscar entradas', 'erro');
    }
    setLoading(false);
  };

  const registrarSaida = async (id) => {
    setLoading(true);
    try {
      await api.put(`/acessos/saida/${id}/`);
      adicionarNotificacao('Saída registrada com sucesso!');
      buscarEntradas();
    } catch {
      adicionarNotificacao('Erro ao registrar saída', 'erro');
    }
    setLoading(false);
  };

  const fetchImagemUnsplash = async (modelo) => {
    try {
      const resposta = await fetch(
        `https://api.unsplash.com/search/photos?query=${modelo} car&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
      );
      const data = await resposta.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.small;
      }
      return null;
    } catch {
      return null;
    }
  };

  const buscarImagens = async (registros) => {
    const novoMapa = {};
    for (const r of registros) {
      const modelo = r.veiculo?.modelo?.toLowerCase();
      if (modelo && !novoMapa[modelo]) {
        const urlImg = await fetchImagemUnsplash(modelo);
        novoMapa[modelo] = urlImg || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Grey_car_icon.svg/320px-Grey_car_icon.svg.png';
      }
    }
    setImagens(novoMapa);
  };

  useEffect(() => {
    buscarEntradas();
  }, []);

  useEffect(() => {
    if (registros.length > 0) {
      buscarImagens(registros);
    }
  }, [registros]);

  return (
    <>
      {loading && <Loading />}
      <Navbar />
      <div style={{
        padding: '20px',
        marginTop: '60px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Registrar Saída</h2>

        {registros.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>Nenhuma entrada ativa encontrada.</p>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'flex-start',
          }}>
            {registros.map(r => {
              const modelo = r.veiculo?.modelo?.toLowerCase();
              const urlImg = imagens[modelo] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Grey_car_icon.svg/320px-Grey_car_icon.svg.png';

              return (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    width: '300px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={urlImg}
                    alt={modelo}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '12px',
                    }}
                  />
                  <p style={{ margin: '0 0 8px 0', color: '#333', fontWeight: 'bold' }}>
                    {r.veiculo?.modelo} — {r.veiculo?.placa}
                  </p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
                    Entrada: {new Date(r.data_hora_entrada).toLocaleString()}
                  </p>
                  <button
                    onClick={() => registrarSaida(r.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b71c1c')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#d32f2f')}
                  >
                    Registrar Saída
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {notificacoes.map(({ id, msg, tipo }) => (
          <div
            key={id}
            style={{
              backgroundColor: tipo === 'erro' ? '#b71c1c' : '#4caf50',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              fontWeight: 'bold',
              userSelect: 'none',
              animation: 'fadein 0.3s, fadeout 0.5s 3s forwards',
              maxWidth: '320px',
            }}
          >
            {msg}
          </div>
        ))}
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
