import Navbar from '../components/navbar.jsx';
import Loading from '../components/loading.jsx';
import { useState, useEffect } from 'react';
import api from '../api/api';
import './Dashboard.css';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [veiculosCount, setVeiculosCount] = useState(0);
  const [estacionamentosCount, setEstacionamentosCount] = useState(0);
  const [entradasAtivasCount, setEntradasAtivasCount] = useState(0);

  let usuario = null;
  try {
    const dados = localStorage.getItem('usuario');
    if (dados) usuario = JSON.parse(dados);
  } catch (e) {
    console.error('Erro ao recuperar usuário:', e);
  }


  const fetchDados = async () => {
    setLoading(true);
    try {
      const [veiculosRes, estacsRes, acessosRes] = await Promise.all([
        api.get('/veiculos'),
        api.get('/estacionamentos'),
        api.get('/acessos'),
      ]);

      setVeiculosCount(veiculosRes.data.length);
      setEstacionamentosCount(estacsRes.data.length);
      const entradasAtivas = acessosRes.data.filter(a => !a.data_hora_saida);
      setEntradasAtivasCount(entradasAtivas.length);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDados();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Navbar />
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          Bem-vindo ao Sistema de Estacionamento<br />
          {usuario && (
            <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '18px' }}>
              Olá, {usuario.nome}!
            </p>
          )}
        </h2>
        <p className="dashboard-text">
          Utilize o menu acima para cadastrar usuários, registrar entradas/saídas ou consultar vagas.
        </p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Veículos</h3>
            <p className="dashboard-number">{veiculosCount}</p>
          </div>

          <div className="dashboard-card">
            <h3>Estacionamentos</h3>
            <p className="dashboard-number">{estacionamentosCount}</p>
          </div>

          <div className="dashboard-card">
            <h3>Entradas Ativas</h3>
            <p className="dashboard-number">{entradasAtivasCount}</p>
          </div>
        </div>
      </div>
    </>
  );
}
