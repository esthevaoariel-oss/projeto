import React from 'react';
import { LogOut, Wrench, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import './Header.css';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header animate-fadeIn">
      <div className="header-logo">
        <Wrench className="icon" size={28} />
        <span>MotoGest <span style={{ color: 'var(--primary)' }}>Pro</span></span>
      </div>
      
      {user && (
        <div className="header-actions">
          <div className="user-info">
            <UserIcon size={20} />
            <span>Olá, <span className="user-name">{user.username}</span></span>
          </div>
          <button onClick={onLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
