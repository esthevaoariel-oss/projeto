import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  Modal as RNModal,
  Linking
} from 'react-native';
import { Plus, Bike, Users, Calendar as CalendarIcon, Clock, Check, AlertTriangle, X, ChevronRight, ChevronDown } from 'lucide-react-native';
import { User, Moto, Funcionario, Appointment, Stats } from '../types';
import { useStorage } from '../contexts/StorageContext';
import StatsCards from '../components/StatsCards';
import MotoCard from '../components/MotoCard';
import FuncionarioCard from '../components/FuncionarioCard';
import Modal from '../components/Modal';
import Calendar from '../components/Calendar';

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(dateStr);
};

interface AdminScreenProps {
  user: User;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ user }) => {
  const storage = useStorage();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'moto' | 'funcionario' | 'appointment' | 'reports' | 'motoDetails' | 'motosList' | 'concluirServico' | 'dayView' | 'orcamentoPopup' | null>(null);
  const [editedDescriptions, setEditedDescriptions] = useState<{[key: string]: string}>({});

  // Budget Generator states
  const [expandedMotos, setExpandedMotos] = useState<{[key: string]: boolean}>({});
  const [selectedAppointmentForBudget, setSelectedAppointmentForBudget] = useState<Appointment | null>(null);
  const [activeBudgetServices, setActiveBudgetServices] = useState<string[]>([]);
  const [budgetPrices, setBudgetPrices] = useState<{[key: string]: string}>({});
  const [budgetPartsPrice, setBudgetPartsPrice] = useState('');

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{ 
    visible: boolean; 
    title: string; 
    message: string; 
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherService, setOtherService] = useState('');

  // Reports state
  const [reportStatus, setReportStatus] = useState<'concluidos' | 'pendentes'>('concluidos');
  const [reportPeriod, setReportPeriod] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [reportDate, setReportDate] = useState(() => getLocalDateString(new Date()));

  // Quick History state
  const [newHistoryDate, setNewHistoryDate] = useState(() => getLocalDateString(new Date()));
  const [newHistoryDesc, setNewHistoryDesc] = useState('');
  
  // Nested Flow state
  const [returnToAppointment, setReturnToAppointment] = useState(false);

  const PREDEFINED_SERVICES = ['Troca de Óleo', 'Revisão Geral', 'Freios', 'Pneus', 'Elétrica', 'Limpeza'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await storage.getUserData();
    setMotos(data.motos || []);
    setFuncionarios(data.funcionarios || []);
    setAppointments(data.appointments || []);
  };

  const saveData = async (newMotos: Moto[], newFuncs: Funcionario[], newApps: Appointment[]) => {
    await storage.saveUserData({ motos: newMotos, funcionarios: newFuncs, appointments: newApps });
    setMotos(newMotos);
    setFuncionarios(newFuncs);
    setAppointments(newApps);
  };

  const getStats = (): Stats => ({
    motos: motos.length,
    pendentes: appointments.filter(a => a.status === 'pendente').length,
    concluidos: appointments.filter(a => a.status === 'concluido').length,
    mecanicos: funcionarios.length
  });

  const getWeekRange = (dateStr: string) => {
    const date = parseLocalDate(dateStr);
    const day = date.getDay();
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - day);
    firstDay.setHours(0, 0, 0, 0);
    
    const lastDay = new Date(date);
    lastDay.setDate(date.getDate() + (6 - day));
    lastDay.setHours(23, 59, 59, 999);
    
    return { start: firstDay.getTime(), end: lastDay.getTime() };
  };

  const getFilteredReports = () => {
    return appointments.filter(app => {
      if (reportStatus === 'pendentes' && app.status !== 'pendente') return false;
      if (reportStatus === 'concluidos' && app.status !== 'concluido') return false;
      
      const dateToCheckStr = reportStatus === 'concluidos' && app.completedDate ? app.completedDate : app.date;
      const dateToCheckObj = parseLocalDate(dateToCheckStr);
      const normalizedDateStr = getLocalDateString(dateToCheckObj);
      
      if (reportPeriod === 'dia') {
        return normalizedDateStr === reportDate;
      } else if (reportPeriod === 'semana') {
        const { start, end } = getWeekRange(reportDate);
        const time = dateToCheckObj.getTime();
        return time >= start && time <= end;
      } else if (reportPeriod === 'mes') {
        return normalizedDateStr.substring(0, 7) === reportDate.substring(0, 7);
      }
      return false;
    });
  };

  const handleOpenModal = (type: 'moto' | 'funcionario' | 'appointment' | 'motoDetails' | 'motosList' | 'concluirServico', data: any = {}) => {
    setModalType(type);
    setFormData(data);
    setSelectedServices(data.servicos || []);
    setOtherService('');
    setEditedDescriptions({});
    setNewHistoryDesc(type === 'concluirServico' ? (data.descricao || '') : '');
    setNewHistoryDate(getLocalDateString(new Date()));
    setModalVisible(true);
  };

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleAddHistoryEntry = async () => {
    if (!newHistoryDesc.trim()) {
      Alert.alert('Erro', 'Preencha a descrição do que aconteceu/serviço realizado.');
      return;
    }
    
    const newApp: Appointment = {
      id: Date.now().toString(),
      motoId: formData.id,
      date: newHistoryDate,
      status: 'concluido',
      servicos: [],
      descricao: newHistoryDesc,
      completedDate: newHistoryDate,
    };
    
    const newApps = [...appointments, newApp];
    await saveData(motos, funcionarios, newApps);
    
    setNewHistoryDesc('');
  };

  const handleSave = async () => {
    if (modalType === 'moto') {
      if (!formData.modelo || !formData.placa) {
        Alert.alert('Erro', 'Preencha modelo e placa.');
        return;
      }
      const newMotoId = formData.id || Date.now().toString();
      const newMotos = formData.id 
        ? motos.map(m => m.id === formData.id ? formData : m)
        : [...motos, { ...formData, id: newMotoId, servicos: [] }];
        
      await saveData(newMotos, funcionarios, appointments);
      
      if (returnToAppointment) {
        setReturnToAppointment(false);
        setModalType('appointment');
        setFormData({ motoId: newMotoId, date: getLocalDateString(new Date()) });
        return;
      }
    } 
    else if (modalType === 'funcionario') {
      if (!formData.nome || !formData.cargo) {
        Alert.alert('Erro', 'Preencha nome e cargo.');
        return;
      }
      const newFuncs = formData.id 
        ? funcionarios.map(f => f.id === formData.id ? formData : f)
        : [...funcionarios, { ...formData, id: Date.now().toString(), especialidades: ['Geral'] }];
      await saveData(motos, newFuncs, appointments);
    }
    else if (modalType === 'appointment') {
      if (!formData.motoId || !formData.date) {
        Alert.alert('Erro', 'Selecione a moto e a data.');
        return;
      }
      
      const newApp: Appointment = {
        ...formData,
        id: formData.id || Date.now().toString(),
        status: formData.status || 'pendente',
        servicos: [],
        descricao: formData.descricao || ''
      };

      const newApps = formData.id
        ? appointments.map(a => a.id === formData.id ? newApp : a)
        : [...appointments, newApp];

      await saveData(motos, funcionarios, newApps);
    }
    else if (modalType === 'motoDetails') {
      const newApps = appointments.map(a => {
        if (editedDescriptions[a.id] !== undefined) {
          return { ...a, descricao: editedDescriptions[a.id] };
        }
        return a;
      });
      await saveData(motos, funcionarios, newApps);
    }
    setModalVisible(false);
  };

  const handleConcluirServicoComDescricao = async () => {
    if (!newHistoryDesc.trim()) {
      Alert.alert('Erro', 'Por favor, informe o que foi feito/serviço realizado antes de concluir.');
      return;
    }
    const newApps = appointments.map(a => 
      a.id === formData.id ? { 
        ...a, 
        status: 'concluido' as 'concluido', 
        descricao: newHistoryDesc,
        completedDate: getLocalDateString(new Date()) 
      } : a
    );
    await saveData(motos, funcionarios, newApps);
    setModalVisible(false);
  };

  const toggleMotoExpand = (motoId: string) => {
    setExpandedMotos(prev => ({
      ...prev,
      [motoId]: !prev[motoId]
    }));
  };

  const handleOpenBudgetPopup = (app: Appointment) => {
    setSelectedAppointmentForBudget(app);
    setActiveBudgetServices(app.servicos || []);
    const prices: {[key: string]: string} = {};
    if (app.precosServicos) {
      Object.keys(app.precosServicos).forEach(k => {
        prices[k] = String(app.precosServicos?.[k] || '');
      });
    }
    setBudgetPrices(prices);
    setBudgetPartsPrice(app.valorPecas !== undefined ? String(app.valorPecas) : '');
    
    setModalType('orcamentoPopup');
    setModalVisible(true);
  };

  const toggleBudgetService = (service: string) => {
    if (activeBudgetServices.includes(service)) {
      setActiveBudgetServices(activeBudgetServices.filter(s => s !== service));
      setBudgetPrices(prev => {
        const copy = { ...prev };
        delete copy[service];
        return copy;
      });
    } else {
      setActiveBudgetServices([...activeBudgetServices, service]);
    }
  };

  const handleBudgetPriceChange = (service: string, value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    setBudgetPrices(prev => ({
      ...prev,
      [service]: cleaned
    }));
  };

  const calculateBudgetTotal = () => {
    let total = 0;
    activeBudgetServices.forEach(s => {
      total += parseFloat(budgetPrices[s] || '0');
    });
    total += parseFloat(budgetPartsPrice || '0');
    return total;
  };

  const handleSaveBudget = async () => {
    if (!selectedAppointmentForBudget) return;
    
    const precosMap: {[key: string]: number} = {};
    activeBudgetServices.forEach(s => {
      precosMap[s] = parseFloat(budgetPrices[s] || '0');
    });
    
    const partsVal = parseFloat(budgetPartsPrice || '0');
    const totalVal = calculateBudgetTotal();
    
    const updatedApp: Appointment = {
      ...selectedAppointmentForBudget,
      servicos: activeBudgetServices,
      precosServicos: precosMap,
      valorPecas: partsVal,
      valorTotal: totalVal
    };
    
    const newApps = appointments.map(a => a.id === selectedAppointmentForBudget.id ? updatedApp : a);
    await saveData(motos, funcionarios, newApps);
    setModalVisible(false);
    Alert.alert('Sucesso', 'Orçamento salvo com sucesso!');
  };

  const shareBudgetOnWhatsApp = (app: Appointment) => {
    const moto = motos.find(m => m.id === app.motoId);
    if (!moto) return;
    
    let message = `*ORÇAMENTO - ${user.oficina.toUpperCase()}*\n\n`;
    message += `*Veículo:* ${moto.marca} ${moto.modelo}\n`;
    message += `*Placa:* ${moto.placa}\n`;
    message += `*Cliente:* ${moto.proprietario}\n`;
    message += `*Data:* ${app.completedDate || app.date}\n\n`;
    
    message += `*Serviços Realizados:*\n`;
    activeBudgetServices.forEach(s => {
      const price = parseFloat(budgetPrices[s] || '0');
      message += `- ${s}: R$ ${price.toFixed(2)}\n`;
    });
    
    const parts = parseFloat(budgetPartsPrice || '0');
    if (parts > 0) {
      message += `\n*Peças:* R$ ${parts.toFixed(2)}\n`;
    }
    
    message += `\n*VALOR TOTAL:* R$ ${calculateBudgetTotal().toFixed(2)}\n\n`;
    message += `Obrigado pela preferência!`;
    
    const encoded = encodeURIComponent(message);
    const url = `whatsapp://send?phone=55${user.phone || ''}&text=${encoded}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    });
  };

  const handleDeleteMoto = (id: string) => {
    setConfirmModal({
      visible: true,
      title: 'Excluir Moto',
      message: 'Tem certeza? Isso apagará todos os agendamentos desta moto permanentemente.',
      onConfirm: async () => {
        const newMotos = motos.filter(m => m.id !== id);
        const newApps = appointments.filter(a => a.motoId !== id);
        await saveData(newMotos, funcionarios, newApps);
        setConfirmModal(prev => ({ ...prev, visible: false }));
      }
    });
  };

  const handleDeleteFunc = (id: string) => {
    setConfirmModal({
      visible: true,
      title: 'Excluir Funcionário',
      message: 'Deseja realmente remover este mecânico da equipe?',
      onConfirm: async () => {
        const newFuncs = funcionarios.filter(f => f.id !== id);
        await saveData(motos, newFuncs, appointments);
        setConfirmModal(prev => ({ ...prev, visible: false }));
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.oficinaTitle}>{user.oficina}</Text>
        
        <StatsCards 
          stats={getStats()} 
          onCardPress={(label) => {
            if (label === 'Motos') {
              setModalType('motosList');
              setModalVisible(true);
            } else if (label === 'Concluídos') {
              setReportStatus('concluidos');
              setModalType('reports');
              setModalVisible(true);
            } else if (label === 'Pendentes') {
              setReportStatus('pendentes');
              setModalType('reports');
              setModalVisible(true);
            }
          }}
        />

        {/* AGENDAMENTOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <CalendarIcon color="#f97316" size={20} />
              <Text style={styles.sectionTitleText}>Agendamentos</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenModal('appointment', { date: getLocalDateString(new Date()) })}>
              <Plus color="#fff" size={16} />
              <Text style={styles.addBtnText}>Novo</Text>
            </TouchableOpacity>
          </View>
          <Calendar 
            appointments={appointments} 
            onDayPress={(date) => {
              const dayApps = appointments.filter(a => a.date === date);
              if (dayApps.length > 0) {
                handleOpenModal('dayView', { date });
              } else {
                handleOpenModal('appointment', { date });
              }
            }} 
          />
          
          <View style={styles.recentApps}>
             <Text style={styles.subTitle}>Serviços Pendentes</Text>
             {appointments.filter(a => a.status === 'pendente').map(app => {
               const moto = motos.find(m => m.id === app.motoId);
               return (
                 <TouchableOpacity key={app.id} style={styles.appCard} onPress={() => handleOpenModal('concluirServico', app)}>
                   <View style={styles.appInfo}>
                     <Text style={styles.appMoto}>{moto?.modelo || 'Moto'} - {moto?.placa}</Text>
                     <Text style={styles.appDate}>{app.date} • {app.descricao || 'Clique para ver/adicionar detalhes'}</Text>
                   </View>
                   <View style={styles.statusBtn}>
                     <Clock color="#f97316" size={20} />
                   </View>
                 </TouchableOpacity>
               );
             })}
          </View>
        </View>

        {/* ORÇAMENTOS DE SERVIÇOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Bike color="#f97316" size={20} />
              <Text style={styles.sectionTitleText}>Orçamentos de Serviços</Text>
            </View>
          </View>
          <View style={styles.orcamentoCard}>
            <Text style={{ color: '#94a3b8', fontSize: 13, marginBottom: 15 }}>
              Selecione um veículo para visualizar os serviços finalizados e definir os preços:
            </Text>
            {motos.map(moto => {
              return (
                <View key={moto.id} style={styles.motoOrcamentoContainer}>
                  <TouchableOpacity 
                    style={styles.motoOrcamentoHeader}
                    onPress={() => toggleMotoExpand(moto.id)}
                  >
                    <View>
                      <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{moto.modelo}</Text>
                      <Text style={{ color: '#64748b', fontSize: 12 }}>Placa: {moto.placa} • Proprietário: {moto.proprietario}</Text>
                    </View>
                    <ChevronRight 
                      color="#f97316" 
                      size={20} 
                      style={{ transform: [{ rotate: expandedMotos[moto.id] ? '90deg' : '0deg' }] }} 
                    />
                  </TouchableOpacity>
                  
                  {expandedMotos[moto.id] && (
                    <View style={styles.completedDaysList}>
                      {appointments
                        .filter(a => a.motoId === moto.id && a.status === 'concluido')
                        .map(app => (
                          <TouchableOpacity 
                            key={app.id} 
                            style={styles.completedDayItem}
                            onPress={() => handleOpenBudgetPopup(app)}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Check color="#10b981" size={16} />
                              <Text style={{ color: '#fff', fontSize: 14 }}>
                                Serviço Finalizado em: <Text style={{ fontWeight: 'bold', color: '#f97316' }}>{app.completedDate || app.date}</Text>
                              </Text>
                            </View>
                            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                              {app.descricao || 'Sem descrição detalhada'}
                            </Text>
                            {app.valorTotal !== undefined && (
                              <Text style={{ color: '#10b981', fontSize: 13, fontWeight: 'bold', marginTop: 4 }}>
                                Valor Total: R$ {app.valorTotal.toFixed(2)}
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      {appointments.filter(a => a.motoId === moto.id && a.status === 'concluido').length === 0 && (
                        <Text style={{ color: '#64748b', fontSize: 12, fontStyle: 'italic', paddingLeft: 10 }}>
                          Nenhum serviço finalizado para este veículo ainda.
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
            {motos.length === 0 && <Text style={styles.emptyText}>Nenhuma moto cadastrada.</Text>}
          </View>
        </View>

        {/* FROTA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Bike color="#f97316" size={20} />
              <Text style={styles.sectionTitleText}>Frota e Histórico</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenModal('moto')}>
              <Plus color="#fff" size={16} />
              <Text style={styles.addBtnText}>Adicionar Moto</Text>
            </TouchableOpacity>
          </View>
          {motos.map(moto => (
            <MotoCard 
              key={moto.id} 
              moto={moto} 
              onEdit={(m) => handleOpenModal('moto', m)} 
              onDelete={handleDeleteMoto} 
              onPressCard={(m) => handleOpenModal('motoDetails', m)}
            />
          ))}
          {motos.length === 0 && <Text style={styles.emptyText}>Nenhuma moto cadastrada.</Text>}
        </View>

        {/* EQUIPE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Users color="#f97316" size={20} />
              <Text style={styles.sectionTitleText}>Equipe</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenModal('funcionario')}>
              <Plus color="#fff" size={16} />
              <Text style={styles.addBtnText}>Mecânico</Text>
            </TouchableOpacity>
          </View>
          {funcionarios.map(func => (
            <FuncionarioCard key={func.id} funcionario={func} onDelete={handleDeleteFunc} />
          ))}
          {funcionarios.length === 0 && <Text style={styles.emptyText}>Nenhum mecânico cadastrado.</Text>}
        </View>
      </ScrollView>

      {/* MAIN DATA MODAL */}
      <Modal 
        visible={modalVisible} 
        title={
          modalType === 'moto' ? 'Dados da Moto' : 
          modalType === 'funcionario' ? 'Dados do Funcionário' : 
          modalType === 'reports' ? 'Relatório de Veículos' :
          modalType === 'motosList' ? 'Lista de Motos' :
          modalType === 'concluirServico' ? 'Finalizar Serviço' :
          modalType === 'motoDetails' ? `Histórico: ${formData.modelo} (${formData.placa})` :
          modalType === 'dayView' ? `Agenda do Dia` :
          modalType === 'orcamentoPopup' ? 'Definir Preços dos Serviços' :
          'Novo Agendamento'
        } 
        onClose={() => {
          setModalVisible(false);
          setReturnToAppointment(false);
        }} 
        onSave={(modalType === 'reports' || modalType === 'motosList' || modalType === 'orcamentoPopup') ? undefined : handleSave}
      >
        {modalType === 'reports' && (
          <View style={styles.modalForm}>
            {/* Status Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, reportStatus === 'concluidos' && styles.activeTab]} onPress={() => setReportStatus('concluidos')}>
                <Text style={[styles.tabText, reportStatus === 'concluidos' && styles.activeTabText]}>Concluídos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, reportStatus === 'pendentes' && styles.activeTab]} onPress={() => setReportStatus('pendentes')}>
                <Text style={[styles.tabText, reportStatus === 'pendentes' && styles.activeTabText]}>Pendentes</Text>
              </TouchableOpacity>
            </View>

            {/* Period Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, reportPeriod === 'dia' && styles.activeTab]} onPress={() => setReportPeriod('dia')}>
                <Text style={[styles.tabText, reportPeriod === 'dia' && styles.activeTabText]}>Dia</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, reportPeriod === 'semana' && styles.activeTab]} onPress={() => setReportPeriod('semana')}>
                <Text style={[styles.tabText, reportPeriod === 'semana' && styles.activeTabText]}>Semana</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, reportPeriod === 'mes' && styles.activeTab]} onPress={() => setReportPeriod('mes')}>
                <Text style={[styles.tabText, reportPeriod === 'mes' && styles.activeTabText]}>Mês</Text>
              </TouchableOpacity>
            </View>

            {/* Date Selection */}
            <Text style={styles.inputLabel}>
              {reportPeriod === 'dia' ? 'Escolha o Dia' : reportPeriod === 'semana' ? 'Escolha um dia da Semana' : 'Escolha um dia do Mês'}
            </Text>
            <Calendar appointments={[]} selectedDate={reportDate} onDayPress={setReportDate} />
            
            {/* Results */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.subTitle}>Total: {getFilteredReports().length} veículos</Text>
              <View style={{ maxHeight: 300 }}>
                <ScrollView nestedScrollEnabled>
                  {getFilteredReports().map(app => {
                    const moto = motos.find(m => m.id === app.motoId);
                    return (
                      <TouchableOpacity 
                        key={app.id} 
                        style={styles.appCard}
                        onPress={() => {
                          if (reportStatus === 'pendentes') {
                            handleOpenModal('concluirServico', app);
                          } else {
                            handleOpenModal('motoDetails', moto);
                          }
                        }}
                      >
                        <View style={styles.appInfo}>
                          <Text style={styles.appMoto}>{moto?.modelo || 'Moto'} - {moto?.placa}</Text>
                          <Text style={styles.appDate}>
                            Data: {reportStatus === 'concluidos' && app.completedDate ? app.completedDate.split('T')[0] : app.date} • {app.descricao || (reportStatus === 'pendentes' ? 'Clique para ver/adicionar detalhes' : 'Sem descrição')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {getFilteredReports().length === 0 && <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>}
                </ScrollView>
              </View>
            </View>
          </View>
        )}

        {modalType === 'appointment' && (
          <View style={styles.modalForm}>
            <Text style={styles.inputLabel}>1. Selecione a Moto</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5}}>
              <TouchableOpacity 
                onPress={() => {
                  setReturnToAppointment(true);
                  handleOpenModal('moto');
                }}
              >
                <Text style={{color: '#f97316', fontSize: 12, fontWeight: 'bold'}}>+ Cadastrar Nova Moto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.motoPicker}>
              {motos.map(m => (
                <TouchableOpacity key={m.id} style={[styles.motoOption, formData.motoId === m.id && styles.motoOptionActive]} onPress={() => setFormData({...formData, motoId: m.id})}>
                  <Text style={[styles.motoOptionText, formData.motoId === m.id && styles.motoOptionTextActive]}>{m.modelo} ({m.placa})</Text>
                  {formData.motoId === m.id && <Check color="#f97316" size={16} />}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.inputLabel}>2. Escolha a Data</Text>
            <Calendar appointments={[]} selectedDate={formData.date} onDayPress={(date) => setFormData({...formData, date})} />
          </View>
        )}

        {modalType === 'dayView' && (
          <View style={styles.modalForm}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
              <Text style={[styles.inputLabel, { marginTop: 0, marginBottom: 0 }]}>Serviços de {formData.date}</Text>
              <TouchableOpacity 
                style={[styles.addBtn, { paddingVertical: 6, paddingHorizontal: 10 }]}
                onPress={() => {
                  handleOpenModal('appointment', { date: formData.date });
                }}
              >
                <Plus color="#fff" size={14} />
                <Text style={styles.addBtnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ maxHeight: 400 }}>
              {appointments.filter(a => a.date === formData.date).map(app => {
                const moto = motos.find(m => m.id === app.motoId);
                return (
                  <TouchableOpacity 
                    key={app.id} 
                    style={styles.appCard}
                    onPress={() => {
                      if (app.status === 'pendente') {
                        handleOpenModal('concluirServico', app);
                      } else {
                        handleOpenModal('motoDetails', moto);
                      }
                    }}
                  >
                    <View style={styles.appInfo}>
                      <Text style={styles.appMoto}>{moto?.modelo || 'Veículo Excluído'} - {moto?.placa || '---'}</Text>
                      <Text style={[styles.appDate, { color: app.status === 'concluido' ? '#10b981' : '#f97316', fontWeight: 'bold' }]}>
                        {app.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </Text>
                      <Text style={styles.appDate}>{app.descricao || 'Sem descrição'}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {modalType === 'motosList' && (
          <View style={styles.modalForm}>
            {motos.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma moto cadastrada.</Text>
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                {motos.map(moto => (
                  <TouchableOpacity 
                    key={moto.id} 
                    style={styles.appCard}
                    onPress={() => handleOpenModal('motoDetails', moto)}
                  >
                    <View style={styles.appInfo}>
                      <Text style={styles.appMoto}>{moto.modelo}</Text>
                      <Text style={styles.appDate}>Placa: {moto.placa}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {modalType === 'concluirServico' && (
          <View style={styles.modalForm}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Text style={styles.inputLabel}>Agendado para: {formData.date}</Text>
              <Text style={{color: '#94a3b8', fontSize: 12, marginBottom: 10}}>Descreva o que foi feito na moto antes de concluir:</Text>
              <TextInput 
                style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]} 
                multiline
                placeholder="Serviço realizado, peças trocadas..." 
                placeholderTextColor="#64748b"
                value={newHistoryDesc}
                onChangeText={setNewHistoryDesc}
              />
              <TouchableOpacity style={[styles.submitBtn, { marginTop: 15 }]} onPress={handleConcluirServicoComDescricao}>
                <Text style={styles.submitBtnText}>Concluir Serviço</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {modalType === 'motoDetails' && (
          <View style={styles.modalForm}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Text style={[styles.inputLabel, { marginTop: 0 }]}>Novo Registro no Histórico</Text>
              <Text style={{color: '#94a3b8', fontSize: 12, marginBottom: 10}}>Escolha a data do serviço abaixo:</Text>
              <Calendar appointments={[]} selectedDate={newHistoryDate} onDayPress={setNewHistoryDate} />
              <TextInput 
                style={[styles.modalInput, { height: 60, textAlignVertical: 'top', marginTop: 10 }]} 
                multiline
                placeholder="Descreva o que foi feito..." 
                placeholderTextColor="#64748b"
                value={newHistoryDesc}
                onChangeText={setNewHistoryDesc}
              />
              <TouchableOpacity style={[styles.submitBtn, { marginTop: 15 }]} onPress={handleAddHistoryEntry}>
                <Text style={styles.submitBtnText}>Adicionar ao Histórico</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Agendamentos e Histórico Antigo</Text>
            {appointments.filter(a => a.motoId === formData.id).length === 0 ? (
              <Text style={styles.emptyText}>Nenhum agendamento para este veículo.</Text>
            ) : (
              appointments.filter(a => a.motoId === formData.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(app => (
                  <View key={app.id} style={[styles.appCard, { flexDirection: 'column', alignItems: 'stretch' }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Text style={styles.appMoto}>Data: {app.date}</Text>
                      <Text style={[styles.appDate, { color: app.status === 'concluido' ? '#10b981' : '#f97316', fontWeight: 'bold' }]}>
                        {app.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </Text>
                    </View>
                    
                    <Text style={[styles.inputLabel, { marginTop: 0, fontSize: 12, marginBottom: 5 }]}>O que aconteceu / Serviço realizado:</Text>
                    <TextInput 
                      style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]} 
                      multiline
                      placeholder="Descreva o problema ou serviço realizado..." 
                      placeholderTextColor="#64748b"
                      value={editedDescriptions[app.id] !== undefined ? editedDescriptions[app.id] : (app.descricao || '')}
                      onChangeText={(t) => setEditedDescriptions({...editedDescriptions, [app.id]: t})}
                    />
                  </View>
              ))
            )}
          </View>
        )}

        {modalType === 'moto' && (
          <View style={styles.modalForm}>
            <Text style={styles.inputLabel}>Modelo</Text>
            <TextInput style={styles.modalInput} value={formData.modelo} onChangeText={(t) => setFormData({...formData, modelo: t})} placeholder="Ex: Hornet 600" placeholderTextColor="#64748b" />
            <Text style={styles.inputLabel}>Placa</Text>
            <TextInput style={styles.modalInput} value={formData.placa} onChangeText={(t) => setFormData({...formData, placa: t})} placeholder="ABC-1234" placeholderTextColor="#64748b" />
            <Text style={styles.inputLabel}>Proprietário</Text>
            <TextInput style={styles.modalInput} value={formData.proprietario} onChangeText={(t) => setFormData({...formData, proprietario: t})} placeholder="Nome do cliente" placeholderTextColor="#64748b" />
            <Text style={styles.inputLabel}>Marca</Text>
            <TextInput style={styles.modalInput} value={formData.marca} onChangeText={(t) => setFormData({...formData, marca: t})} placeholder="Honda, Yamaha..." placeholderTextColor="#64748b" />
          </View>
        )}

        {modalType === 'funcionario' && (
          <View style={styles.modalForm}>
            <Text style={styles.inputLabel}>Nome do Mecânico</Text>
            <TextInput style={styles.modalInput} value={formData.nome} onChangeText={(t) => setFormData({...formData, nome: t})} placeholder="Ex: Carlos Silva" placeholderTextColor="#64748b" />
            <Text style={styles.inputLabel}>Cargo</Text>
            <TextInput style={styles.modalInput} value={formData.cargo} onChangeText={(t) => setFormData({...formData, cargo: t})} placeholder="Ex: Mecânico Chefe" placeholderTextColor="#64748b" />
            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput style={styles.modalInput} value={formData.telefone} onChangeText={(t) => setFormData({...formData, telefone: t})} placeholder="(11) 99999-9999" placeholderTextColor="#64748b" />
          </View>
        )}

        {modalType === 'orcamentoPopup' && selectedAppointmentForBudget && (
          <View style={styles.modalForm}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                {motos.find(m => m.id === selectedAppointmentForBudget.motoId)?.modelo} ({motos.find(m => m.id === selectedAppointmentForBudget.motoId)?.placa})
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                Serviço Finalizado em: {selectedAppointmentForBudget.completedDate || selectedAppointmentForBudget.date}
              </Text>
            </View>

            <Text style={styles.inputLabel}>1. Clique nos Serviços Realizados:</Text>
            <View style={styles.serviceGrid}>
              {PREDEFINED_SERVICES.map(service => {
                const isActive = activeBudgetServices.includes(service);
                return (
                  <TouchableOpacity 
                    key={service} 
                    style={[styles.serviceChip, isActive && styles.serviceChipActive]} 
                    onPress={() => toggleBudgetService(service)}
                  >
                    <Text style={[styles.serviceChipText, isActive && styles.serviceChipTextActive]}>
                      {service}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {activeBudgetServices.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.inputLabel}>2. Defina os Preços dos Serviços:</Text>
                {activeBudgetServices.map(service => (
                  <View key={service} style={styles.priceInputRow}>
                    <Text style={styles.priceInputLabel}>{service}</Text>
                    <View style={styles.priceInputContainer}>
                      <Text style={{ color: '#f97316', fontWeight: 'bold', marginRight: 5 }}>R$</Text>
                      <TextInput
                        style={styles.priceInput}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor="#64748b"
                        value={budgetPrices[service] || ''}
                        onChangeText={(val) => handleBudgetPriceChange(service, val)}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputLabel}>3. Outros Valores (Opcional):</Text>
              <View style={styles.priceInputRow}>
                <Text style={styles.priceInputLabel}>Valor das Peças</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={{ color: '#f97316', fontWeight: 'bold', marginRight: 5 }}>R$</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#64748b"
                    value={budgetPartsPrice}
                    onChangeText={setBudgetPartsPrice}
                  />
                </View>
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Valor Total do Orçamento:</Text>
              <Text style={{ color: '#10b981', fontSize: 20, fontWeight: 'bold' }}>
                R$ {calculateBudgetTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity style={[styles.submitBtn, { marginTop: 15 }]} onPress={handleSaveBudget}>
              <Text style={styles.submitBtnText}>Salvar Orçamento</Text>
            </TouchableOpacity>

            {selectedAppointmentForBudget.valorTotal !== undefined && (
              <TouchableOpacity 
                style={[styles.whatsappBtn, { marginTop: 10, backgroundColor: '#25D366' }]} 
                onPress={() => shareBudgetOnWhatsApp(selectedAppointmentForBudget)}
              >
                <Text style={styles.actionBtnText}>Enviar Orçamento por WhatsApp</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Modal>

      {/* CUSTOM CONFIRMATION MODAL */}
      <RNModal transparent visible={confirmModal.visible} animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContent}>
            <AlertTriangle color="#f97316" size={48} style={{ alignSelf: 'center', marginBottom: 15 }} />
            <Text style={styles.confirmTitle}>{confirmModal.title}</Text>
            <Text style={styles.confirmMessage}>{confirmModal.message}</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.confirmCancel} onPress={() => setConfirmModal(p => ({...p, visible: false}))}>
                <Text style={styles.confirmCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmModal.onConfirm}>
                <Text style={styles.confirmBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  oficinaTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitleText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f97316', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 5 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  subTitle: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold', marginVertical: 15 },
  recentApps: { marginTop: 20 },
  appCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  appInfo: { flex: 1 },
  appMoto: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  appDate: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  statusBtn: { padding: 5 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 10 },
  modalForm: { gap: 15 },
  inputLabel: { color: '#f97316', fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  modalInput: { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 12, padding: 12, color: '#fff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  motoPicker: { gap: 8 },
  motoOption: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  motoOptionActive: { borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)' },
  motoOptionText: { color: '#94a3b8', fontSize: 14 },
  motoOptionTextActive: { color: '#fff', fontWeight: 'bold' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  serviceChipActive: { backgroundColor: '#f97316', borderColor: '#f97316' },
  serviceChipText: { color: '#94a3b8', fontSize: 12 },
  serviceChipTextActive: { color: '#fff', fontWeight: 'bold' },
  tabs: { flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#f97316' },
  tabText: { color: '#94a3b8', fontWeight: '600' },
  activeTabText: { color: '#f97316' },
  // Confirmation Modal Styles
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  confirmContent: { backgroundColor: '#1e293b', borderRadius: 24, padding: 30, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  confirmTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  confirmMessage: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  confirmActions: { flexDirection: 'row', gap: 12 },
  confirmCancel: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#475569', alignItems: 'center' },
  confirmCancelText: { color: '#94a3b8', fontWeight: 'bold' },
  confirmBtn: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#f97316', padding: 12, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
  orcamentoCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  motoOrcamentoContainer: { backgroundColor: 'rgba(0, 0, 0, 0.15)', borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  motoOrcamentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  completedDaysList: { marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', paddingTop: 10, gap: 10 },
  completedDayItem: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  priceInputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  priceInputLabel: { color: '#94a3b8', fontSize: 14 },
  priceInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', width: 120 },
  priceInput: { color: '#fff', fontSize: 14, flex: 1, paddingVertical: 4 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
});

export default AdminScreen;
