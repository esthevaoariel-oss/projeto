import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Moto } from '../types';
import './MotoCard.css';

interface MotoCardProps {
  moto: Moto;
  onEdit: (moto: Moto) => void;
  onDelete: (id: string) => void;
}

const MotoCard: React.FC<MotoCardProps> = ({ moto, onEdit, onDelete }) => {
  return (
    <div className="moto-card animate-fadeIn">
      <div className="moto-header">
        <div className="moto-title">
          <h3>{moto.modelo}</h3>
          <p>{moto.placa}</p>
        </div>
        <div className="moto-actions">
          <button className="action-btn" onClick={() => onEdit(moto)}>
            <Edit2 size={16} />
          </button>
          <button className="action-btn delete" onClick={() => onDelete(moto.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="moto-details">
        <div className="detail-item">
          <span className="detail-label">Marca:</span>
          <span className="detail-value">{moto.marca}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Ano:</span>
          <span className="detail-value">{moto.ano}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Proprietário:</span>
          <span className="detail-value">{moto.proprietario}</span>
        </div>
      </div>
      
      {moto.servicos && moto.servicos.length > 0 && (
        <div className="moto-services">
          <h4>Serviços Frequentes</h4>
          <div className="service-tags">
            {moto.servicos.map((servico, index) => (
              <span key={index} className="service-tag">{servico}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MotoCard;
