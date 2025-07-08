import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loading from '../components/loading.jsx';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const exibirMensagem = (texto, tipo = 'erro') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      exibirMensagem('Login realizado com sucesso!', 'sucesso');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      exibirMensagem('E-mail / Matrícula ou senha inválidos', 'erro');
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="login-container">
        <h2 className="login-title">SISTEMA DE CONTROLE<br />DE ACESSO</h2>

        <input
          className="login-input"
          type="text"
          placeholder="E-mail / Matrícula"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>ENTRAR</button>

        {mensagem.texto && (
          <div className={`popup-msg ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <p className="login-register">
          Não tem conta? <a href="/registro">Cadastre-se</a>
        </p>
      </div>
    </>
  );
}
