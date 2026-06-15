export interface ServiceRecord {
  id: string;
  motoId: string;
  placa: string;
  modelo: string;
  marca: string;
  proprietario: string;
  servicos: string[];
  dataInicio: string;
  dataConclusao: string;
  status: 'concluido' | 'cancelado';
  custo?: number;
  observacoes?: string;
}
