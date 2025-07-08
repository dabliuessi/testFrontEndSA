import { useState, useEffect } from 'react';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import Navbar from '../components/navbar.jsx';

export default function RegistroEntrada() {
  const [veiculos, setVeiculos] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [idVeiculo, setIdVeiculo] = useState('');
  const [idEstacionamento, setIdEstacionamento] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
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
      setFiltroModelo('');
    } catch (error) {
      if (error.response?.status === 400) {
        const msgErro = error.response?.data?.error;
        if (msgErro === 'Estacionamento lotado') {
          adicionarNotificacao('Estacionamento lotado! Não é possível registrar nova entrada.', 'erro');
        } else if (msgErro === 'Veículo já está registrado no estacionamento') {
          adicionarNotificacao('Este veículo já está registrado. Saia antes de registrar novamente.', 'erro');
        } else {
          adicionarNotificacao('Erro ao registrar entrada', 'erro');
        }
      } else {
        adicionarNotificacao('Erro ao registrar entrada', 'erro');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([buscarVeiculos(), buscarEstacionamentos()]).finally(() => setLoading(false));
  }, []);

  const veiculosFiltrados = veiculos.filter((v) =>
    v.modelo.toLowerCase().includes(filtroModelo.toLowerCase()) ||
    v.placa.toLowerCase().includes(filtroModelo.toLowerCase())
  );

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
        <div style={{ maxWidth: '400px', margin: '0 auto'}}>
          <h3 style={{ color: '#d32f2f', marginBottom: '20px' }}>Registrar Entrada</h3>

          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Buscar veículo por modelo ou placa"
              value={filtroModelo}
              onChange={(e) => {
                setFiltroModelo(e.target.value);
              }}
              className="login-input"
              style={{ paddingLeft: '35px', width: '79%' }}
              disabled={loading}
            />
            <span
              style={{
                position: 'absolute',
                top: '40%',
                left: '10px',
                transform: 'translateY(-50%)',
                color: '#999',
                pointerEvents: 'none',
                fontSize: '16px',
              }}
            >
              🔍
            </span>
          </div>

          {filtroModelo && veiculosFiltrados.length > 0 && (
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '15px',
                overflowY: 'auto',
                maxHeight: '150px',
                width: '90%'
              }}
            >
              {veiculosFiltrados.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setIdVeiculo(v.id);
                    setFiltroModelo(`${v.modelo} - ${v.placa}`);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: v.id === idVeiculo ? '#f0f0f0' : '#fff',
                    fontWeight: v.id === idVeiculo ? 'bold' : 'normal',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = v.id === idVeiculo ? '#f0f0f0' : '#fff')
                  }
                >
                  {v.modelo} - {v.placa}
                </div>
              ))}
            </div>
          )}

          <select
            value={idEstacionamento}
            onChange={(e) => setIdEstacionamento(e.target.value)}
            className="login-input"
            disabled={loading}
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
            disabled={loading}
            className="login-button"
            style={{ width: '90%', marginTop: '10px' }}
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
