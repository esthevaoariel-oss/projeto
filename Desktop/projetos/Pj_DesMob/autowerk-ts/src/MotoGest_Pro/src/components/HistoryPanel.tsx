import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Download } from 'lucide-react';
import { useStorage } from '../contexts/StorageContext';
import type { ServiceRecord } from '../types';
import './HistoryPanel.css';

type HistoryTab = 'day' | 'week' | 'month';

const HistoryPanel: React.FC = () => {
  const storage = useStorage();
  const [activeTab, setActiveTab] = useState<HistoryTab>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    loadRecords();
  }, [activeTab, selectedDate, selectedMonth, selectedYear]);

  const loadRecords = () => {
    let filteredRecords: ServiceRecord[] = [];

    if (activeTab === 'day') {
      filteredRecords = storage.getServiceRecordsByDay(selectedDate);
    } else if (activeTab === 'week') {
      filteredRecords = storage.getServiceRecordsByWeek(selectedDate);
    } else if (activeTab === 'month') {
      filteredRecords = storage.getServiceRecordsByMonth(selectedYear, selectedMonth);
    }

    setRecords(filteredRecords);
    setTotalCost(filteredRecords.reduce((sum, r) => sum + (r.custo || 0), 0));
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Placa', 'Modelo', 'Marca', 'Proprietário', 'Serviços', 'Data de Conclusão', 'Custo'];
    const rows = records.map(r => [
      r.id,
      r.placa,
      r.modelo,
      r.marca,
      r.proprietario,
      r.servicos.join('; '),
      r.dataConclusao,
      r.custo || 0
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `historico_${activeTab}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>📋 Histórico de Consertos</h2>
        <button className="btn btn-secondary" onClick={exportToCSV}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="history-tabs">
        <button
          className={`history-tab ${activeTab === 'day' ? 'active' : ''}`}
          onClick={() => setActiveTab('day')}
        >
          Hoje
        </button>
        <button
          className={`history-tab ${activeTab === 'week' ? 'active' : ''}`}
          onClick={() => setActiveTab('week')}
        >
          Esta Semana
        </button>
        <button
          className={`history-tab ${activeTab === 'month' ? 'active' : ''}`}
          onClick={() => setActiveTab('month')}
        >
          Este Mês
        </button>
      </div>

      <div className="history-filters">
        {activeTab === 'day' && (
          <div className="filter-group">
            <label>Data:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="filter-input"
            />
          </div>
        )}

        {activeTab === 'week' && (
          <div className="filter-group">
            <label>Semana de:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="filter-input"
            />
          </div>
        )}

        {activeTab === 'month' && (
          <div className="filter-group">
            <label>Mês:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="filter-input"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
            <label>Ano:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="filter-input"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-label">Total de Consertos</span>
            <span className="stat-value">{records.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={20} />
          <div>
            <span className="stat-label">Faturamento Total</span>
            <span className="stat-value">R$ {totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="history-table">
        {records.length === 0 ? (
          <div className="no-data">Nenhum registro encontrado para este período</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Proprietário</th>
                <th>Serviços</th>
                <th>Data de Conclusão</th>
                <th>Custo</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td className="cell-bold">{record.placa}</td>
                  <td>{record.modelo}</td>
                  <td>{record.proprietario}</td>
                  <td className="cell-services">{record.servicos.join(', ')}</td>
                  <td>{new Date(record.dataConclusao).toLocaleDateString('pt-BR')}</td>
                  <td className="cell-cost">R$ {(record.custo || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
