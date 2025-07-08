import { useState, useEffect } from 'react';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import Navbar from '../components/navbar.jsx';

export default function RegistroEntrada() {
  const [veiculos, setVeiculos] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [idVeiculo, setIdVeiculo] = useState('');
  const [idEstacionamento, setIdEstacionamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);

  const adicionarNotificacao = (msg, tipo = 'sucesso') => {
    const id = Date.now();
    setNotificacoes((old) => [...old, { id, msg, tipo }]);
    setTimeout(() => {
      setNotificacoes((old) => old.filter((n) => n.id !== id));
    }, 3500);
  };

  const buscarVeiculos = async () => {
    try {
      const res = await api.get('/veiculos');
      setVeiculos(res.data);
    } catch {
      adicionarNotificacao('Erro ao buscar veículos', 'erro');
    }
  };

  const buscarEstacionamentos = async () => {
    try {
      const res = await api.get('/estacionamentos');
      setEstacionamentos(res.data);
    } catch {
      adicionarNotificacao('Erro ao buscar estacionamentos', 'erro');
    }
  };

  const registrarEntrada = async () => {
    if (!idVeiculo || !idEstacionamento) {
      adicionarNotificacao('Selecione um veículo e um estacionamento', 'erro');
      return;
    }

    setLoading(true);
    try {
      await api.post('/acessos/entrada', {
        id_veiculo: idVeiculo,
        id_estacionamento: idEstacionamento,
      });
      adicionarNotificacao('Entrada registrada!');
      setIdVeiculo('');
      setIdEstacionamento('');
    } catch {
      adicionarNotificacao('Erro ao registrar entrada', 'erro');
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([buscarVeiculos(), buscarEstacionamentos()]).finally(() => setLoading(false));
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
        }}
      >
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Registrar Entrada</h2>

        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
            Veículo
          </label>
          <select
            value={idVeiculo}
            onChange={(e) => setIdVeiculo(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value="">Selecione um veículo</option>
            {veiculos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.modelo} - {v.placa}
              </option>
            ))}
          </select>

          <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
            Estacionamento
          </label>
          <select
            value={idEstacionamento}
            onChange={(e) => setIdEstacionamento(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value="">Selecione um estacionamento</option>
            {estacionamentos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.localidade}
              </option>
            ))}
          </select>

          <button
            onClick={registrarEntrada}
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
            }}
          >
            Registrar Entrada
          </button>
        </div>
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
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeout {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}
