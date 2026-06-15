import { Moto } from './moto';
import { Funcionario } from './funcionario';
import { Appointment } from './appointment';

export interface UserData {
  motos: Moto[];
  funcionarios: Funcionario[];
  appointments: Appointment[];
}
