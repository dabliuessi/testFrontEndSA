import React from 'react';
import './ModalVeiculo.css';

export default function ModalVeiculo({ aberto, onFechar, onSalvar, veiculo, setVeiculo, loading }) {
  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar();
  };

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <h3 className="modal-titulo">Novo Veículo</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Modelo"
            value={veiculo.modelo}
            onChange={e => setVeiculo({ ...veiculo, modelo: e.target.value })}
            className="modal-input"
            required
          />
          <input
            type="text"
            placeholder="Placa"
            value={veiculo.placa}
            onChange={e => setVeiculo({ ...veiculo, placa: e.target.value })}
            className="modal-input"
            required
          />
          <input
            type="text"
            placeholder="Cor"
            value={veiculo.cor}
            onChange={e => setVeiculo({ ...veiculo, cor: e.target.value })}
            className="modal-input"
            required
          />
          <button type="submit" className="modal-btn-primary" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
          <button
            type="button"
            onClick={onFechar}
            className="modal-btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
