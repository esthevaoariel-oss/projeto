export interface Appointment {
  id: string;
  date: string;
  motoId: string;
  servicos: string[]; // Names or IDs of servicos
  descricao: string;
  status: 'pendente' | 'concluido';
  completedDate?: string;
}
