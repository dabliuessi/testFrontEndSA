import { useEffect, useState } from 'react';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import Navbar from '../components/navbar.jsx';

const UNSPLASH_KEY = '6fEvO6MfvN_3ZjZiADOPCJ8hu4MAMqhnBGwkboqyoDE';

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novoVeiculo, setNovoVeiculo] = useState({ modelo: '', placa: '', cor: '' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const traduzirCor = (cor) => {
    const cores = {
      preto: 'black',
      branco: 'white',
      vermelho: 'red',
      azul: 'blue',
      prata: 'silver',
      cinza: 'gray',
      verde: 'green',
      amarelo: 'yellow',
    };
    return cores[cor.toLowerCase()] || cor;
  };

  const fetchImagemUnsplash = async (modelo, cor) => {
    const query = `${modelo} ${traduzirCor(cor)} car`;
    try {
      const resposta = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}&per_page=1`
      );
      const data = await resposta.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.small;
      }
    } catch (err) {
      console.error('Erro ao buscar imagem no Unsplash:', err);
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Grey_car_icon.svg';
  };

  const fetchVeiculos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/veiculos');
      setVeiculos(res.data);
    } catch (err) {
      setMensagem({ texto: 'Erro ao buscar veículos', tipo: 'erro' });
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imagem = await fetchImagemUnsplash(novoVeiculo.modelo, novoVeiculo.cor);
      await api.post('/veiculos', {
        ...novoVeiculo,
        imagem,
      });
      setNovoVeiculo({ modelo: '', placa: '', cor: '' });
      setMostrarModal(false);
      setMensagem({ texto: 'Veículo adicionado com sucesso!', tipo: 'sucesso' });
      fetchVeiculos();
    } catch {
      setMensagem({ texto: 'Erro ao adicionar veículo', tipo: 'erro' });
    }
    setLoading(false);
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/veiculos/${idParaExcluir}`);
      setMensagem({ texto: 'Veículo excluído com sucesso!', tipo: 'sucesso' });
      setIdParaExcluir(null);
      fetchVeiculos();
    } catch {
      setMensagem({ texto: 'Erro ao excluir veículo', tipo: 'erro' });
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  return (
    <>
      {loading && <Loading />}
      <Navbar />

      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '20px', marginTop: '70px' }}>Seus Veículos</h2>

        <button
          onClick={() => setMostrarModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontWeight: 'bold',
          }}
        >
          Adicionar Veículo
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {veiculos.map((v) => (
            <div
              key={v.id}
              style={{
                width: '280px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '10px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <img
                src={v.imagem || 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Grey_car_icon.svg'}
                alt={v.modelo}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              />
              <strong>{v.modelo}</strong>
              <p>{v.placa.toUpperCase()}</p>
              <p style={{ color: '#555' }}>{v.cor}</p>

              <button
                onClick={() => setIdParaExcluir(v.id)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#b71c1c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: '#d32f2f' }}>Novo Veículo</h3>
            <form onSubmit={handleAdd}>
              <input
                placeholder="Modelo"
                value={novoVeiculo.modelo}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
                required
                style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                placeholder="Placa"
                value={novoVeiculo.placa}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })}
                required
                style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                placeholder="Cor"
                value={novoVeiculo.cor}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, cor: e.target.value })}
                required
                style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                style={{
                  marginTop: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#d32f2f',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {idParaExcluir && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              maxWidth: '300px',
            }}
          >
            <p style={{ marginBottom: '20px' }}>Tem certeza que deseja excluir este veículo?</p>
            <button
              onClick={handleExcluir}
              style={{
                padding: '10px 20px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                marginRight: '10px',
              }}
            >
              Confirmar
            </button>
            <button
              onClick={() => setIdParaExcluir(null)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mensagem && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: mensagem.tipo === 'sucesso' ? '#4caf50' : '#d32f2f',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 9999,
          }}
        >
          {mensagem.texto}
        </div>
      )}
    </>
  );
}
