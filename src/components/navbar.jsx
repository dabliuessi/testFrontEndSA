import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navStyle = {
    backgroundColor: '#fff',
    padding: '12px 20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  const linksContainer = {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
  };

  const linkStyle = {
    color: '#d32f2f',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
  };

  const linkHoverStyle = (e) => {
    e.target.style.backgroundColor = '#b71c1c';
    e.target.style.color = '#fff';
  };

  const linkLeaveStyle = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#d32f2f';
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '2px solid #d32f2f',
    color: '#d32f2f',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  };

  const buttonHover = (e) => {
    e.target.style.backgroundColor = '#b71c1c';
    e.target.style.color = '#fff';
    e.target.style.borderColor = '#b71c1c';
  };

  const buttonLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#d32f2f';
    e.target.style.borderColor = '#d32f2f';
  };

  return (
    <nav style={navStyle}>
      <div style={linksContainer}>
        <FontAwesomeIcon
          icon={faCar}
          size="lg"
          style={{ color: '#d32f2f', marginRight: '10px' }}
          title="Estacionamento"
        />
        {['dashboard', 'veiculos', 'vagas', 'entrada', 'saida'].map((path) => (
          <Link
            key={path}
            to={`/${path}`}
            style={linkStyle}
            onMouseEnter={linkHoverStyle}
            onMouseLeave={linkLeaveStyle}
          >
            {path.charAt(0).toUpperCase() +
              path.slice(1).replace(/entrada|saida/, (w) => `Registrar ${w.charAt(0).toUpperCase() + w.slice(1)}`)}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={buttonStyle}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        <FontAwesomeIcon
          icon={faDoorOpen}
          style={{ marginRight: '8px' }}
          title="Sair"
        />
        Logout
      </button>
    </nav>
  );
}
