export default function Loading() {
  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={overlayStyle}>
        <div style={boxStyle}>
          <div style={spinnerStyle}></div>
          <p style={textStyle}>Carregando...</p>
        </div>
      </div>
    </>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
};

const boxStyle = {
  background: '#fff',
  padding: '30px 50px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 0 15px rgba(0,0,0,0.25)',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #d32f2f',
  borderTop: '4px solid transparent',
  borderRadius: '50%',
  margin: '0 auto 15px',
  animation: 'spin 1s linear infinite'
};

const textStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333'
};
