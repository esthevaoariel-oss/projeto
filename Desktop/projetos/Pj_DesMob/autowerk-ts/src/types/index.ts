export interface User {
  id: number;
  username: string;
  password: string;
  phone: string;
  whatsapp: string;
}

export interface Moto {
  id: number;
  userId: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  proprietario: string;
  servicos: Servico[];
}

export interface Servico {
  id: number;
  nome: string;
  status: 'pendente' | 'concluido';
  dataAgendamento: string;
  dataConclusao: string | null;
}

export interface Funcionario {
  id: number;
  userId: number;
  nome: string;
  cargo: string;
  telefone: string;
  especialidades: string[];
  outrasEspec: string;
}

export interface Appointment {
  id: number;
  userId: number;
  date: string;
  motoId: number;
  servicos: string[];
  descricao: string;
  status: 'pendente' | 'concluido';
  completedDate: string | null;
}