export * from './servico';
export * from './moto';
export * from './appointment';
export * from './funcionario';
export * from './user';
export * from './userData';

export interface Stats {
  motos: number;
  pendentes: number;
  concluidos: number;
  mecanicos: number;
}

export interface ModalContent {
  type: 'appointment' | 'moto' | 'funcionario' | 'servico' | null;
  title?: string;
  date?: string;
  motos?: import('./moto').Moto[];
  servicos?: string[];
  moto?: import('./moto').Moto;
  funcionario?: import('./funcionario').Funcionario;
  appointment?: import('./appointment').Appointment;
  onSave?: (data: any) => void;
}
