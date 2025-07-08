import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import './Login.css';

export default function Register() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'aluno' });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  const exibirMensagem = (texto, tipo = 'erro') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      exibirMensagem('Usuário registrado com sucesso!', 'sucesso');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      exibirMensagem('Erro ao registrar usuário', 'erro');
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="login-background"></div>
      <div className="login-container">
        <h2 className="login-title">REGISTRAR NOVO USUÁRIO</h2>

        <input
          className="login-input"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          className="login-input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
        />
        <select
          className="login-input"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="visitante">Visitante</option>
          <option value="outro">Outro</option>
        </select>

        <button className="login-button" onClick={handleRegister}>REGISTRAR</button>

        {mensagem.texto && (
          <div className={`popup-msg ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <p className="login-register">
          Já tem conta? <a href="/">Entrar</a>
        </p>
      </div>
    </>
  );
}
