export interface User {
  id: string;
  username: string;
  password?: string;
  oficina: string;
  phone?: string;
  whatsapp?: string;
}

export interface Servico {
  id: string;
  nome: string;
  status: 'pendente' | 'concluido';
  dataAgendamento: string;
  dataConclusao?: string;
}

export interface Moto {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  proprietario: string;
  servicos: string[];
}

export interface Appointment {
  id: string;
  date: string;
  motoId: string;
  servicos: string[];
  descricao: string;
  status: 'pendente' | 'concluido';
  completedDate?: string;
  valorPecas?: number;
  precosServicos?: { [servicoNome: string]: number };
  valorTotal?: number;
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  especialidades: string[];
  outrasEspec?: string;
}

export interface UserData {
  motos: Moto[];
  funcionarios: Funcionario[];
  appointments: Appointment[];
}

export interface Stats {
  motos: number;
  pendentes: number;
  concluidos: number;
  mecanicos: number;
}
