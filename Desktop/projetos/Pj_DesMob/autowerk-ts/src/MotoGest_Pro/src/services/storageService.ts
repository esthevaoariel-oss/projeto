import type { User, UserData, ServiceRecord } from '../types';

export interface IStorageService {
  getUsers(): User[];
  saveUser(user: User): void;
  getCurrentUser(): User | null;
  login(user: User): void;
  logout(): void;
  getUserData(): UserData;
  saveUserData(data: UserData): void;
  seedAdmin(): void;
  // Histórico e Relatórios
  addServiceRecord(record: ServiceRecord): void;
  getServiceRecordsByDay(date: string): ServiceRecord[];
  getServiceRecordsByWeek(date: string): ServiceRecord[];
  getServiceRecordsByMonth(year: number, month: number): ServiceRecord[];
}

const USERS_KEY = '@MotoGest:users';
const CURRENT_USER_KEY = '@MotoGest:currentUser';
const DATA_PREFIX = '@MotoGest:data:';

export class LocalStorageService implements IStorageService {
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  login(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getUserData(): UserData {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { motos: [], funcionarios: [], appointments: [], serviceRecords: [] };

    const data = localStorage.getItem(`${DATA_PREFIX}${currentUser.id}`);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        serviceRecords: parsed.serviceRecords || []
      };
    }

    return { motos: [], funcionarios: [], appointments: [], serviceRecords: [] };
  }

  saveUserData(data: UserData): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    localStorage.setItem(`${DATA_PREFIX}${currentUser.id}`, JSON.stringify(data));
  }

  seedAdmin(): void {
    const users = this.getUsers();
    if (!users.find(u => u.username === 'admin')) {
      const admin: User = {
        id: 'admin_123',
        username: 'admin',
        password: '123',
        oficina: 'MotoGest Pro Oficina',
        phone: '11999999999',
        whatsapp: '11999999999'
      };
      this.saveUser(admin);

      const seedData: UserData = {
        motos: [
          {
            id: 'm1',
            placa: 'ABC-1234',
            modelo: 'CB 500F',
            marca: 'Honda',
            ano: 2021,
            proprietario: 'João Silva',
            servicos: ['Troca de Óleo', 'Revisão Geral']
          },
          {
            id: 'm2',
            placa: 'XYZ-9876',
            modelo: 'MT-07',
            marca: 'Yamaha',
            ano: 2023,
            proprietario: 'Maria Souza',
            servicos: []
          }
        ],
        funcionarios: [
          {
            id: 'f1',
            nome: 'Carlos Mecânico',
            cargo: 'Mecânico Chefe',
            telefone: '11988888888',
            especialidades: ['Motor', 'Elétrica']
          }
        ],
        appointments: [
          {
            id: 'a1',
            date: new Date().toISOString().split('T')[0],
            motoId: 'm1',
            servicos: ['Troca de Óleo'],
            descricao: 'Cliente pediu urgência',
            status: 'pendente'
          }
        ],
        serviceRecords: [
          {
            id: 'sr1',
            motoId: 'm1',
            placa: 'ABC-1234',
            modelo: 'CB 500F',
            marca: 'Honda',
            proprietario: 'João Silva',
            servicos: ['Troca de Óleo'],
            dataInicio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dataConclusao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'concluido',
            custo: 150
          },
          {
            id: 'sr2',
            motoId: 'm2',
            placa: 'XYZ-9876',
            modelo: 'MT-07',
            marca: 'Yamaha',
            proprietario: 'Maria Souza',
            servicos: ['Revisão Geral', 'Troca de Pneu'],
            dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dataConclusao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'concluido',
            custo: 450
          },
          {
            id: 'sr3',
            motoId: 'm1',
            placa: 'ABC-1234',
            modelo: 'CB 500F',
            marca: 'Honda',
            proprietario: 'João Silva',
            servicos: ['Limpeza de Corrente'],
            dataInicio: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dataConclusao: new Date().toISOString().split('T')[0],
            status: 'concluido',
            custo: 80
          }
        ]
      };

      localStorage.setItem(`${DATA_PREFIX}${admin.id}`, JSON.stringify(seedData));
    }
  }

  // Histórico e Relatórios
  addServiceRecord(record: ServiceRecord): void {
    const data = this.getUserData();
    data.serviceRecords.push(record);
    this.saveUserData(data);
  }

  getServiceRecordsByDay(date: string): ServiceRecord[] {
    const data = this.getUserData();
    return data.serviceRecords.filter(record => record.dataConclusao.startsWith(date));
  }

  getServiceRecordsByWeek(date: string): ServiceRecord[] {
    const targetDate = new Date(date);
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - targetDate.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const data = this.getUserData();
    return data.serviceRecords.filter(record => {
      const recordDate = new Date(record.dataConclusao);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
  }

  getServiceRecordsByMonth(year: number, month: number): ServiceRecord[] {
    const data = this.getUserData();
    return data.serviceRecords.filter(record => {
      const recordDate = new Date(record.dataConclusao);
      return recordDate.getFullYear() === year && recordDate.getMonth() === month - 1;
    });
  }
}
