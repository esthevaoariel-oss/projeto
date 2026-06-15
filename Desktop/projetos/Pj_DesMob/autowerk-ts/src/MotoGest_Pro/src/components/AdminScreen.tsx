import React, { useState, useEffect } from 'react';
import { Plus, Users, Bike, Clock } from 'lucide-react';
import type { User, Moto, Funcionario, Appointment, Stats, ModalContent } from '../types';
import { useStorage } from '../contexts/StorageContext';
import StatsCards from './StatsCards';
import MotoCard from './MotoCard';
import FuncionarioCard from './FuncionarioCard';
import Calendar from './Calendar';
import Modal from './Modal';
import HistoryPanel from './HistoryPanel';
import './AdminScreen.css';

interface AdminScreenProps {
  user: User;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ user }) => {
  const storage = useStorage();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [activeTab, setActiveTab] = useState<'motos' | 'historico'>('motos');

  useEffect(() => {
    loadData();
  }, [user, storage]);

  const loadData = () => {
    const data = storage.getUserData();
    setMotos(data.motos);
    setFuncionarios(data.funcionarios);
    setAppointments(data.appointments);
  };

  const saveData = (newMotos: Moto[], newFuncs: Funcionario[], newApps: Appointment[]) => {
    const currentData = storage.getUserData();
    storage.saveUserData({ 
      motos: newMotos, 
      funcionarios: newFuncs, 
      appointments: newApps,
      serviceRecords: currentData.serviceRecords || []
    });
    setMotos(newMotos);
    setFuncionarios(newFuncs);
    setAppointments(newApps);
  };

  const getStats = (): Stats => {
    return {
      motos: motos.length,
      pendentes: appointments.filter(a => a.status === 'pendente').length,
      concluidos: appointments.filter(a => a.status === 'concluido').length,
      mecanicos: funcionarios.length
    };
  };

  // Handlers for Motos
  const handleSaveMoto = (motoData: any) => {
    let newMotos = [...motos];
    if (motoData.id) {
      newMotos = newMotos.map(m => m.id === motoData.id ? motoData : m);
    } else {
      newMotos.push({ ...motoData, id: Date.now().toString(), servicos: motoData.servicos || [] });
    }
    saveData(newMotos, funcionarios, appointments);
  };

  const handleDeleteMoto = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta moto? Todos os agendamentos relacionados também serão excluídos.')) {
      const newMotos = motos.filter(m => m.id !== id);
      const newApps = appointments.filter(a => a.motoId !== id);
      saveData(newMotos, funcionarios, newApps);
    }
  };

  // Handlers for Funcionários
  const handleSaveFuncionario = (funcData: any) => {
    let newFuncs = [...funcionarios];
    if (funcData.id) {
      newFuncs = newFuncs.map(f => f.id === funcData.id ? funcData : f);
    } else {
      newFuncs.push({ ...funcData, id: Date.now().toString(), especialidades: ['Geral'] }); // Simple default
    }
    saveData(motos, newFuncs, appointments);
  };

  const handleDeleteFuncionario = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      const newFuncs = funcionarios.filter(f => f.id !== id);
      saveData(motos, newFuncs, appointments);
    }
  };

  // Handlers for Appointments
  const handleDayClick = (date: string) => {
    if (motos.length === 0) {
      alert('Você precisa cadastrar pelo menos uma moto antes de criar um agendamento.');
      return;
    }
    setModalContent({
      type: 'appointment',
      title: `Novo Agendamento - ${date}`,
      date,
      motos,
      onSave: handleSaveAppointment
    });
  };

  const handleSaveAppointment = (appData: any) => {
    const newApp: Appointment = {
      ...appData,
      id: appData.id || Date.now().toString(),
      status: appData.status || 'pendente'
    };
    
    // Add new services to Moto frequent services
    if (newApp.servicos && newApp.servicos.length > 0) {
      const moto = motos.find(m => m.id === newApp.motoId);
      if (moto) {
        const uniqueServicos = Array.from(new Set([...(moto.servicos || []), ...newApp.servicos]));
        handleSaveMoto({ ...moto, servicos: uniqueServicos });
      }
    }

    const newApps = appData.id 
      ? appointments.map(a => a.id === appData.id ? newApp : a)
      : [...appointments, newApp];
      
    saveData(motos, funcionarios, newApps);
  };

  const handleConcluirServico = (appId: string) => {
    const newApps = appointments.map(app => {
      if (app.id === appId) {
        return { ...app, status: 'concluido' as 'concluido', completedDate: new Date().toISOString() };
      }
      return app;
    });
    saveData(motos, funcionarios, newApps);
  };

  const openAppModal = (app: Appointment) => {
    setModalContent({
      type: 'servico',
      title: `Detalhes do Serviço`,
      appointment: app,
    });
  };

  return (
    <div className="admin-container animate-fadeIn">
      <StatsCards stats={getStats()} />

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'motos' ? 'active' : ''}`}
          onClick={() => setActiveTab('motos')}
        >
          <Bike size={18} /> Gestão de Frota
        </button>
        <button
          className={`admin-tab ${activeTab === 'historico' ? 'active' : ''}`}
          onClick={() => setActiveTab('historico')}
        >
          <Clock size={18} /> Histórico de Consertos
        </button>
      </div>

      {activeTab === 'motos' ? (
        <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="section-header">
            <h2><Bike size={24} /> Frota de Motos</h2>
            <button className="btn btn-primary" onClick={() => setModalContent({ type: 'moto', title: 'Nova Moto', onSave: handleSaveMoto })}>
              <Plus size={18} /> Adicionar Moto
            </button>
          </div>
          
          {motos.length === 0 ? (
            <div className="empty-state">
              <Bike size={48} />
              <p>Nenhuma moto cadastrada. Comece adicionando uma nova moto para gerenciar os serviços.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {motos.map(moto => (
                <MotoCard 
                  key={moto.id} 
                  moto={moto} 
                  onEdit={(m) => setModalContent({ type: 'moto', title: 'Editar Moto', moto: m, onSave: handleSaveMoto })} 
                  onDelete={handleDeleteMoto} 
                />
              ))}
            </div>
          )}

          <div className="section-header">
            <h2><Users size={24} /> Equipe (Mecânicos)</h2>
            <button className="btn btn-primary" onClick={() => setModalContent({ type: 'funcionario', title: 'Novo Funcionário', onSave: handleSaveFuncionario })}>
              <Plus size={18} /> Adicionar Funcionário
            </button>
          </div>
          
          {funcionarios.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>Nenhum funcionário cadastrado.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {funcionarios.map(func => (
                <FuncionarioCard 
                  key={func.id} 
                  funcionario={func} 
                  onDelete={handleDeleteFuncionario} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-sidebar">
          <Calendar appointments={appointments} onDayClick={handleDayClick} />
          
          <div className="recent-appointments mt-4" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>Agendamentos Recentes</h3>
            <div className="appointment-list">
              {appointments.slice(-5).reverse().map(app => {
                const moto = motos.find(m => m.id === app.motoId);
                return (
                  <div key={app.id} className="appointment-item" onClick={() => openAppModal(app)}>
                    <div className="appointment-info">
                      <h4>{moto ? moto.modelo : 'Moto Removida'} - {moto?.placa}</h4>
                      <p>{app.date} • {app.servicos.length} serviços</p>
                    </div>
                    <span className={`status-badge status-${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                );
              })}
              {appointments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Nenhum agendamento.</p>}
            </div>
          </div>
        </div>
      </div>
      ) : (
        <HistoryPanel />
      )}

      {modalContent && (
        <Modal 
          content={modalContent} 
          onClose={() => setModalContent(null)} 
          onConcluirServico={handleConcluirServico}
        />
      )}
    </div>
  );
};

export default AdminScreen;
