export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  especialidades: string[];
  outrasEspec?: string;
}
