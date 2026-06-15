import React, { useState } from 'react';
import { Phone, MessageCircle, LogIn, UserPlus } from 'lucide-react';
import { useStorage } from '../contexts/StorageContext';
import { User } from '../types';
import './ClienteScreen.css';

interface ClienteScreenProps {
  onLoginSuccess: (user: User) => void;
}

const ClienteScreen: React.FC<ClienteScreenProps> = ({ onLoginSuccess }) => {
  const storage = useStorage();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oficina, setOficina] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = storage.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      storage.login(user);
      onLoginSuccess(user);
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = storage.getUsers();
    if (users.find(u => u.username === username)) {
      setError('Nome de usuário já existe.');
      return;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      oficina,
      phone,
      whatsapp
    };
    
    storage.saveUser(newUser);
    storage.login(newUser);
    onLoginSuccess(newUser);
  };

  return (
    <div className="cliente-container">
      <div className="hero-section animate-slideUp">
        <h1>Gestão Profissional para sua Oficina</h1>
        <p>O sistema MotoGest Pro oferece controle total sobre agendamentos, motos, serviços e mecânicos em uma interface moderna e intuitiva.</p>
      </div>

      <div className="auth-container animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            <LogIn size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}/> Login
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            <UserPlus size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }}/> Cadastro
          </button>
        </div>

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Usuário</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Ex: admin"
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-primary">Entrar no Sistema</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nome da Oficina</label>
              <input 
                type="text" 
                value={oficina} 
                onChange={(e) => setOficina(e.target.value)} 
                required 
                placeholder="Ex: MotoGest Pro Oficina"
              />
            </div>
            <div className="form-group">
              <label>Usuário para Login</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Telefone (opcional)</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>WhatsApp (opcional)</label>
                <input 
                  type="text" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)} 
                />
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-primary">Criar Conta</button>
          </form>
        )}
      </div>

      <div className="contact-cards animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <div className="contact-card">
          <div className="contact-icon contact-whatsapp">
            <MessageCircle size={24} />
          </div>
          <div className="contact-info">
            <h4>Atendimento via WhatsApp</h4>
            <p>(11) 99999-9999</p>
          </div>
        </div>
        <div className="contact-card">
          <div className="contact-icon contact-phone">
            <Phone size={24} />
          </div>
          <div className="contact-info">
            <h4>Suporte Telefônico</h4>
            <p>(11) 4002-8922</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteScreen;
