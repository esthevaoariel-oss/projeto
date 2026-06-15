export interface Servico {
  id: string;
  nome: string;
  status: 'pendente' | 'concluido';
  dataAgendamento: string;
  dataConclusao?: string;
}
