import React from 'react';
import { Bike, Clock, CheckCircle, Users } from 'lucide-react';
import { Stats } from '../types';
import './StatsCards.css';

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="stats-grid animate-slideUp">
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <Bike size={32} />
        </div>
        <div className="stat-info">
          <h3>Total de Motos</h3>
          <p>{stats.motos}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon icon-orange">
          <Clock size={32} />
        </div>
        <div className="stat-info">
          <h3>Serviços Pendentes</h3>
          <p>{stats.pendentes}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon icon-green">
          <CheckCircle size={32} />
        </div>
        <div className="stat-info">
          <h3>Serviços Concluídos</h3>
          <p>{stats.concluidos}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon icon-purple">
          <Users size={32} />
        </div>
        <div className="stat-info">
          <h3>Mecânicos</h3>
          <p>{stats.mecanicos}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
