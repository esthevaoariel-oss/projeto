import React from 'react';
import { Trash2 } from 'lucide-react';
import { Funcionario } from '../types';
import './FuncionarioCard.css';

interface FuncionarioCardProps {
  funcionario: Funcionario;
  onDelete: (id: string) => void;
}

const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ funcionario, onDelete }) => {
  const initials = funcionario.nome.substring(0, 2).toUpperCase();

  return (
    <div className="funcionario-card animate-fadeIn">
      <div className="funcionario-header">
        <div className="funcionario-title">
          <div className="funcionario-avatar">{initials}</div>
          <div className="funcionario-info">
            <h3>{funcionario.nome}</h3>
            <p>{funcionario.cargo}</p>
          </div>
        </div>
        <div className="funcionario-actions">
          <button className="action-btn delete" onClick={() => onDelete(funcionario.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="funcionario-details">
        <div className="detail-item">
          <span className="detail-label">Telefone:</span>
          <span className="detail-value">{funcionario.telefone}</span>
        </div>
      </div>
      
      <div className="especialidades">
        <h4>Especialidades</h4>
        <div className="especialidade-tags">
          {funcionario.especialidades.map((esp, index) => (
            <span key={index} className="espec-tag">{esp}</span>
          ))}
          {funcionario.outrasEspec && (
            <span className="espec-tag">{funcionario.outrasEspec}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuncionarioCard;
