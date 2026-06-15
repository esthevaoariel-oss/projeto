import { Servico } from './servico';

export interface Moto {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  proprietario: string;
  servicos: string[]; // IDs of servicos
}
