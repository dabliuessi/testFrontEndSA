import { useEffect, useState } from 'react';
import api from '../api/api';
import NavbarAdmin from '../components/NavbarAdmin';
import Loading from '../components/loading';

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(false);


  const [modalEstacionamentoAberto, setModalEstacionamentoAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [estacionamentoEditando, setEstacionamentoEditando] = useState(null);
  const [localidade, setLocalidade] = useState('');
  const [totalVagas, setTotalVagas] = useState('');

  const [modalExcluir, setModalExcluir] = useState({ aberto: false, estacionamentoId: null });

  const [notificacoes, setNotificacoes] = useState([]);

  const [aba, setAba] = useState('usuarios');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/usuarios').then(res => setUsuarios(res.data)),
      api.get('/admin/registros').then(res => setRegistros(res.data)),
      api.get('/admin/estacionamentos').then(res => setEstacionamentos(res.data)),
    ]).finally(() => setLoading(false));
  };

  const adicionarNotificacao = (msg, tipo = 'sucesso') => {
    const id = Date.now();
    setNotificacoes((prev) => [...prev, { id, msg, tipo }]);
    setTimeout(() => {
      setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  };

  const abrirModalCriar = () => {
    setModoEdicao(false);
    setEstacionamentoEditando(null);
    setLocalidade('');
    setTotalVagas('');
    setModalEstacionamentoAberto(true);
  };

  const abrirModalEditar = (est) => {
    setModoEdicao(true);
    setEstacionamentoEditando(est);
    setLocalidade(est.localidade);
    setTotalVagas(est.total_vagas);
    setModalEstacionamentoAberto(true);
  };

  const fecharModalEstacionamento = () => {
    setModalEstacionamentoAberto(false);
    setModoEdicao(false);
    setEstacionamentoEditando(null);
    setLocalidade('');
    setTotalVagas('');
  };

  const salvarEstacionamento = () => {
    if (!localidade || !totalVagas) {
      adicionarNotificacao('Preencha todos os campos', 'erro');
      return;
    }

    setLoading(true);

    if (modoEdicao) {
      api.put(`/admin/estacionamentos/${estacionamentoEditando.id}`, {
        localidade,
        total_vagas: Number(totalVagas),
      }).then(() => {
        adicionarNotificacao('Estacionamento atualizado com sucesso!');
        carregarDados();
        fecharModalEstacionamento();
      }).catch(() => {
        adicionarNotificacao('Erro ao atualizar estacionamento', 'erro');
      }).finally(() => setLoading(false));
    } else {
      api.post('/admin/estacionamentos', {
        localidade,
        total_vagas: Number(totalVagas),
      }).then(() => {
        adicionarNotificacao('Estacionamento criado com sucesso!');
        carregarDados();
        fecharModalEstacionamento();
      }).catch(() => {
        adicionarNotificacao('Erro ao criar estacionamento', 'erro');
      }).finally(() => setLoading(false));
    }
  };

  const abrirModalExcluir = (id) => {
    setModalExcluir({ aberto: true, estacionamentoId: id });
  };

  const cancelarExclusao = () => {
    setModalExcluir({ aberto: false, estacionamentoId: null });
  };

  const confirmarExclusao = () => {
    setLoading(true);
    api.delete(`/admin/estacionamentos/${modalExcluir.estacionamentoId}`)
      .then(() => {
        adicionarNotificacao('Estacionamento excluído com sucesso!');
        carregarDados();
      })
      .catch(() => {
        adicionarNotificacao('Erro ao excluir estacionamento', 'erro');
      })
      .finally(() => {
        setLoading(false);
        cancelarExclusao();
      });
  };

  return (
    <>
      {loading && <Loading />}
      <NavbarAdmin setAba={setAba} />

      <main
        style={{
          padding: 20,
          marginTop: 60,
          fontFamily: 'Arial, sans-serif',
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '#fafafa',
          transition: 'background-color 0.3s ease',
        }}
      >
        {aba === 'usuarios' && (
          <section style={{ animation: 'fadeIn 0.5s ease forwards' }}>
            <h2 style={{ color: '#d32f2f', marginBottom: 20 }}>
              Usuários e seus veículos
            </h2>
            {usuarios.map((usuario) => {
              const isSelected = usuarioSelecionado?.id === usuario.id;
              return (
                <div
                  key={usuario.id}
                  onClick={() =>
                    setUsuarioSelecionado(isSelected ? null : usuario)
                  }
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    boxShadow: '0 2px 7px rgba(0,0,0,0.1)',
                    userSelect: 'none',
                    color: '#d32f2f',
                    fontWeight: '700',
                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f9e6e6')
                      (e.currentTarget.style.transform = 'scale(1.02)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#fff')
                      (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <div style={{ fontSize: 18 }}>{usuario.nome}</div>
                  <div
                    style={{
                      fontWeight: '400',
                      fontSize: 14,
                      color: '#555',
                      marginBottom: 8,
                    }}
                  >
                    {usuario.email}
                  </div>

                  <div
                    style={{
                      maxHeight: isSelected ? 200 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.5s ease, padding 0.5s ease',
                      color: '#000',
                      fontWeight: 'normal',
                      fontSize: 14,
                      padding: isSelected ? '10px 20px' : '0 20px',
                    }}
                  >
                    <ul style={{ margin: 0 }}>
                      {usuario.Veiculos?.length > 0 ? (
                        usuario.Veiculos.map((v) => (
                          <li key={v.id} style={{ marginBottom: 6 }}>
                            <strong>Placa:</strong> {v.placa} | <strong>Modelo:</strong> {v.modelo}
                          </li>
                        ))
                      ) : (
                        <li style={{ fontStyle: 'italic', color: '#999' }}>
                          Nenhum veículo cadastrado
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {aba === 'registros' && (
          <section style={{ animation: 'fadeIn 0.5s ease forwards' }}>
            <h2 style={{ color: '#d32f2f', marginBottom: 20 }}>
              Registros de Entrada/Saída
            </h2>
            {registros.length === 0 && <p>Nenhum registro encontrado.</p>}
            {registros.map((reg) => (
              <div
                key={reg.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 10,
                  boxShadow: '0 2px 7px rgba(0,0,0,0.1)',
                  fontSize: 14,
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.02)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                <div>
                  <strong>Placa:</strong> {reg.veiculo?.placa || '---'}
                </div>
                <div style={{ color: 'green' }}>
                  <strong>Entrada:</strong>{' '}
                  {reg.data_hora_entrada
                    ? new Date(reg.data_hora_entrada).toLocaleString()
                    : '---'}
                </div>
                <div style={{ color: 'red' }}>
                  <strong>Saída:</strong>{' '}
                  {reg.data_hora_saida
                    ? new Date(reg.data_hora_saida).toLocaleString()
                    : '---'}
                </div>
                <div>
                  <strong>Estacionamento:</strong>{' '}
                  {reg.estacionamento?.localidade || '---'}
                </div>
              </div>
            ))}
          </section>
        )}

        {aba === 'estacionamentos' && (
          <section style={{ animation: 'fadeIn 0.5s ease forwards' }}>
            <h2 style={{ color: '#d32f2f', marginBottom: 15 }}>
              Estacionamentos
            </h2>

            <button
              onClick={abrirModalCriar}
              style={{
                marginBottom: 15,
                padding: '10px 20px',
                backgroundColor: '#d32f2f',
                color: 'white',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#b71c1c')
                  (e.currentTarget.style.transform = 'scale(1.02)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#d32f2f')
                  (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              Adicionar Estacionamento
            </button>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {estacionamentos.map((est) => (
                <li
                  key={est.id}
                  style={{
                    backgroundColor: '#fff',
                    padding: '12px 18px',
                    marginBottom: 8,
                    borderRadius: 10,
                    boxShadow: '0 2px 7px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: '600',
                    fontSize: 15,
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.02)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <span>
                    {est.localidade} — {est.vagas_ocupadas}/{est.total_vagas}{' '}
                    vagas ocupadas
                  </span>

                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => abrirModalEditar(est)}
                      className="login-button"
                      style={{
                        width: 'auto',
                        padding: '8px 19px',
                        backgroundColor: '#d32f2f',
                      }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => abrirModalExcluir(est.id)}
                      className="login-button"
                      style={{
                        width: 'auto',
                        padding: '8px 19px',
                        backgroundColor: '#555',
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {modalEstacionamentoAberto && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              animation: 'fadeIn 0.5s ease forwards',
              transition: 'transform 0.3s ease',
            }}
            onClick={fecharModalEstacionamento}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 30,
                width: '90%',
                maxWidth: 400,
                boxShadow: '0 0 20px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
              }}
            >
              <h3>{modoEdicao ? 'Editar Estacionamento' : 'Adicionar Estacionamento'}</h3>

              <input
                type="text"
                placeholder="Localidade"
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
                className="login-input"
              />

              <input
                type="number"
                placeholder="Total de vagas"
                value={totalVagas}
                onChange={(e) => setTotalVagas(e.target.value)}
                className="login-input"
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 5,
                }}
              >
                <button
                  onClick={fecharModalEstacionamento}
                  className="login-button"
                  style={{ width: '100px', backgroundColor: '#aaa' }}
                >
                  Cancelar
                </button>

                <button
                  onClick={salvarEstacionamento}
                  className="login-button"
                  style={{ width: '100px' }}
                >
                  {modoEdicao ? 'Atualizar' : 'Salvar'}
                </button>
              </div>

            </div>
          </div>
        )}

        {modalExcluir.aberto && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              animation: 'fadeIn 0.5s ease forwards',
              transition: 'transform 0.3s ease',
            }}
            onClick={cancelarExclusao}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 30,
                width: '90%',
                maxWidth: 400,
                boxShadow: '0 0 20px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                textAlign: 'center',
              }}
            >
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este estacionamento?</p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 15,
                }}
              >
                <button
                  onClick={cancelarExclusao}
                  className="login-button"
                  style={{ width: 'auto', backgroundColor: '#aaa' }}
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmarExclusao}
                  className="login-button"
                  style={{ width: 'auto' }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            zIndex: 11000,
            maxWidth: 320,
          }}
        >
          {notificacoes.map(({ id, msg, tipo }) => (
            <div
              key={id}
              style={{
                backgroundColor: tipo === 'erro' ? '#b71c1c' : '#4caf50',
                color: 'white',
                padding: '12px 20px',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontWeight: 'bold',
                userSelect: 'none',
                animation: 'fadein 0.3s, fadeout 0.5s 3s forwards',
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
      </main>
    </>
  );
}
