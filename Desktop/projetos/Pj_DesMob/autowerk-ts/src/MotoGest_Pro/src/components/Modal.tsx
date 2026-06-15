import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { ModalContent, Moto, Funcionario, Appointment } from '../types';
import './Modal.css';

interface ModalProps {
  content: ModalContent;
  onClose: () => void;
  onConcluirServico?: (appId: string) => void;
}

const Modal: React.FC<ModalProps> = ({ content, onClose, onConcluirServico }) => {
  const [formData, setFormData] = useState<any>({});
  const [servicoInput, setServicoInput] = useState('');

  useEffect(() => {
    if (content.type === 'appointment' && content.date) {
      setFormData({ date: content.date, status: 'pendente', servicos: [] });
    } else if (content.type === 'moto' && content.moto) {
      setFormData(content.moto);
    } else if (content.type === 'moto') {
      setFormData({ servicos: [] });
    } else if (content.type === 'funcionario') {
      setFormData({ especialidades: [] });
    } else if (content.type === 'servico' && content.appointment) {
      setFormData(content.appointment);
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddServico = () => {
    if (servicoInput.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        servicos: [...(prev.servicos || []), servicoInput.trim()]
      }));
      setServicoInput('');
    }
  };

  const handleRemoveServico = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      servicos: prev.servicos.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.onSave) {
      content.onSave(formData);
    }
    onClose();
  };

  if (!content.type) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{content.title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {content.type === 'appointment' && (
              <>
                <div className="form-group">
                  <label>Data</label>
                  <input type="date" name="date" value={formData.date || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Moto</label>
                  <select name="motoId" value={formData.motoId || ''} onChange={handleChange} required>
                    <option value="">Selecione uma moto</option>
                    {content.motos?.map(m => (
                      <option key={m.id} value={m.id}>{m.modelo} - {m.placa}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Serviços</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={servicoInput} 
                      onChange={(e) => setServicoInput(e.target.value)} 
                      placeholder="Adicionar serviço..." 
                    />
                    <button type="button" className="btn btn-outline" onClick={handleAddServico}>+</button>
                  </div>
                  {formData.servicos && formData.servicos.length > 0 && (
                    <div className="service-tags mt-2">
                      {formData.servicos.map((s: string, i: number) => (
                        <span key={i} className="service-tag">
                          {s} <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleRemoveServico(i)} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Descrição / Observações</label>
                  <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} rows={3} />
                </div>
              </>
            )}

            {content.type === 'moto' && (
              <>
                <div className="form-group">
                  <label>Placa</label>
                  <input type="text" name="placa" value={formData.placa || ''} onChange={handleChange} required placeholder="ABC-1234" />
                </div>
                <div className="form-group">
                  <label>Modelo</label>
                  <input type="text" name="modelo" value={formData.modelo || ''} onChange={handleChange} required placeholder="Ex: CB 500F" />
                </div>
                <div className="form-group">
                  <label>Marca</label>
                  <input type="text" name="marca" value={formData.marca || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Ano</label>
                  <input type="number" name="ano" value={formData.ano || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Proprietário</label>
                  <input type="text" name="proprietario" value={formData.proprietario || ''} onChange={handleChange} required />
                </div>
              </>
            )}

            {content.type === 'funcionario' && (
              <>
                <div className="form-group">
                  <label>Nome</label>
                  <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Cargo</label>
                  <input type="text" name="cargo" value={formData.cargo || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="text" name="telefone" value={formData.telefone || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Especialidade Principal</label>
                  <input 
                    type="text" 
                    name="outrasEspec" 
                    value={formData.outrasEspec || ''} 
                    onChange={handleChange} 
                    placeholder="Ex: Motor, Elétrica" 
                  />
                </div>
              </>
            )}

            {content.type === 'servico' && content.appointment && (
              <>
                <div className="form-group">
                  <p><strong>Data:</strong> {content.appointment.date}</p>
                  <p><strong>Status:</strong> <span className={`status-badge status-${content.appointment.status}`}>{content.appointment.status}</span></p>
                  <p><strong>Descrição:</strong> {content.appointment.descricao}</p>
                  <div>
                    <strong>Serviços:</strong>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                      {content.appointment.servicos.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            {content.type === 'servico' && content.appointment?.status === 'pendente' && onConcluirServico ? (
               <button type="button" className="btn btn-success" onClick={() => { onConcluirServico(content.appointment!.id); onClose(); }}>
                 <Check size={18} /> Concluir Serviço
               </button>
            ) : content.type !== 'servico' ? (
              <button type="submit" className="btn btn-primary">Salvar</button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
